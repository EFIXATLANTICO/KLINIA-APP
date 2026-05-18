import hashlib
import hmac
import json
from datetime import UTC, datetime, timedelta
from pathlib import Path
from urllib.parse import urlencode

import httpx
from fastapi import Depends, FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from .config import get_settings
from .db import Base, engine, ensure_runtime_schema, get_db
from .deps import current_subscribed_user, current_user, require_roles, require_subscribed_roles
from .models import Appointment, AuditLog, Clinic, Patient, Practitioner, Room, Service, User, UserRole
from .schemas import (
    AppointmentCreate,
    AppointmentOut,
    AppointmentUpdate,
    AuditLogOut,
    BillingProfileUpdate,
    BillingSessionOut,
    BillingStatusOut,
    CheckoutSessionCreate,
    ClinicRegisterIn,
    LoginIn,
    MeOut,
    PatientCreate,
    PatientOut,
    PatientUpdate,
    PractitionerCreate,
    PractitionerOut,
    PractitionerUpdate,
    RoomCreate,
    RoomOut,
    RoomUpdate,
    ServiceCreate,
    ServiceOut,
    ServiceUpdate,
    UserCreate,
    UserOut,
    UserUpdate,
    PlanOut,
    TokenOut,
)
from .security import create_access_token, hash_password, verify_password


settings = get_settings()
frontend_dir = Path(settings.frontend_dir) if settings.frontend_dir else Path(__file__).resolve().parents[3] / "app"

app = FastAPI(title=settings.app_name)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup() -> None:
    Base.metadata.create_all(bind=engine)
    ensure_runtime_schema()


@app.get("/health")
def health() -> dict:
    return {"ok": True, "app": settings.app_name, "env": settings.app_env, "stripe_configured": settings.stripe_enabled}


def clinic_item_or_404(db: Session, model, item_id: str, clinic_id: str):
    item = db.scalar(select(model).where(model.id == item_id, model.clinic_id == clinic_id))
    if not item:
        raise HTTPException(status_code=404, detail=f"{model.__name__} not found")
    return item


def clinic_user_or_404(db: Session, user_id: str, clinic_id: str) -> User:
    user = db.scalar(select(User).where(User.id == user_id, User.clinic_id == clinic_id))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


def apply_update(item, payload) -> None:
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(item, field, value)


def audit_action(
    db: Session,
    user: User,
    action: str,
    resource_type: str,
    resource_id: str | None = None,
    metadata: dict | None = None,
) -> None:
    db.add(
        AuditLog(
            clinic_id=user.clinic_id,
            user_id=user.id,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            metadata_json=json.dumps(metadata or {}, ensure_ascii=True),
        )
    )


def professional_price_ids() -> list[str]:
    return [
        price_id
        for price_id in (
            settings.stripe_price_kliniaplan_monthly,
            settings.stripe_price_kliniaplan_annual,
            settings.stripe_price_kliniaplan,
            settings.stripe_price_starter,
            settings.stripe_price_pro,
            settings.stripe_price_business,
        )
        if price_id
    ]


def normalize_plan_id(plan_id: str) -> str:
    value = (plan_id or "trial").lower()
    if value in {"trial", "demo"}:
        return "trial"
    if value in {"kliniaplan_annual", "professional_annual", "profesional_anual", "annual", "anual"}:
        return "kliniaplan_annual"
    if value in {"kliniaplan_monthly", "professional_monthly", "profesional_mensual", "monthly", "mensual"}:
        return "kliniaplan"
    if value in {"kliniaplan", "professional", "profesional", "starter", "pro", "business"}:
        return "kliniaplan"
    return value


def saas_plans() -> list[dict]:
    monthly_price_id = settings.stripe_price_kliniaplan_monthly or settings.stripe_price_kliniaplan or next(iter(professional_price_ids()), None)
    annual_price_id = settings.stripe_price_kliniaplan_annual
    return [
        {"id": "trial", "name": "Demo gratuita", "price_eur": 0, "price_id": None, "interval": "month", "recommended": False},
        {"id": "kliniaplan", "name": "Profesional mensual", "price_eur": 50, "price_id": monthly_price_id, "interval": "month", "recommended": True},
        {"id": "kliniaplan_annual", "name": "Profesional anual", "price_eur": 500, "price_id": annual_price_id, "interval": "year", "recommended": False},
    ]


def plan_by_id(plan_id: str) -> dict:
    plan_id = normalize_plan_id(plan_id)
    plan = next((item for item in saas_plans() if item["id"] == plan_id), None)
    if not plan:
        raise HTTPException(status_code=400, detail="Unknown subscription plan")
    return plan


def frontend_url_with_query(**params: str) -> str:
    base = settings.frontend_url.rstrip("/") or "http://localhost:8001"
    return f"{base}/?{urlencode(params)}"


def stripe_post(path: str, data: dict[str, str]) -> dict:
    if not settings.stripe_secret_key:
        raise HTTPException(status_code=503, detail="Stripe is not configured")
    response = httpx.post(
        f"https://api.stripe.com/v1/{path.lstrip('/')}",
        data=data,
        auth=(settings.stripe_secret_key, ""),
        timeout=20,
    )
    if response.status_code >= 400:
        detail = response.json().get("error", {}).get("message", "Stripe request failed")
        raise HTTPException(status_code=502, detail=detail)
    return response.json()


def create_checkout_session(clinic: Clinic, plan_id: str) -> BillingSessionOut:
    plan = plan_by_id(plan_id)
    if plan_id == "trial":
        return BillingSessionOut(url=frontend_url_with_query(billing="trial", plan=plan_id), demo_mode=True)
    if not settings.stripe_secret_key or not plan.get("price_id"):
        return BillingSessionOut(url=frontend_url_with_query(billing="stripe-demo", plan=plan_id), demo_mode=True)

    data = {
        "mode": "subscription",
        "client_reference_id": clinic.id,
        "customer_email": clinic.billing_email or clinic.email,
        "line_items[0][price]": plan["price_id"],
        "line_items[0][quantity]": "1",
        "success_url": frontend_url_with_query(billing="success", session_id="{CHECKOUT_SESSION_ID}"),
        "cancel_url": frontend_url_with_query(billing="cancelled", plan=plan_id),
        "allow_promotion_codes": "true",
        "billing_address_collection": "required",
        "metadata[clinic_id]": clinic.id,
        "metadata[plan]": plan_id,
        "subscription_data[metadata][clinic_id]": clinic.id,
        "subscription_data[metadata][plan]": plan_id,
    }
    if clinic.trial_ends_at:
        trial_ends_at = clinic.trial_ends_at
        if trial_ends_at.tzinfo is None:
            trial_ends_at = trial_ends_at.replace(tzinfo=UTC)
        trial_days = max(0, (trial_ends_at - datetime.now(UTC)).days)
        if trial_days > 0:
            data["subscription_data[trial_period_days]"] = str(trial_days)
    session = stripe_post("checkout/sessions", data)
    return BillingSessionOut(url=session["url"], demo_mode=False)


def create_portal_session(clinic: Clinic) -> BillingSessionOut:
    if not settings.stripe_secret_key or not clinic.stripe_customer_id:
        return BillingSessionOut(url=frontend_url_with_query(billing="portal-demo"), demo_mode=True)
    session = stripe_post(
        "billing_portal/sessions",
        {"customer": clinic.stripe_customer_id, "return_url": settings.frontend_url.rstrip("/") or "http://localhost:8001"},
    )
    return BillingSessionOut(url=session["url"], demo_mode=False)


def billing_status_for_clinic(clinic: Clinic) -> BillingStatusOut:
    return BillingStatusOut(
        clinic_id=clinic.id,
        plan=normalize_plan_id(clinic.subscription_plan or "trial"),
        status=clinic.subscription_status or "trialing",
        stripe_configured=settings.stripe_enabled,
        stripe_customer_id=clinic.stripe_customer_id,
        stripe_subscription_id=clinic.stripe_subscription_id,
        current_period_end=clinic.current_period_end,
        trial_ends_at=clinic.trial_ends_at,
        billing_name=clinic.billing_name,
        billing_email=clinic.billing_email,
        tax_id=clinic.tax_id,
        billing_address=clinic.billing_address,
        invoice_prefix=clinic.invoice_prefix or "KL",
        invoice_logo_url=clinic.invoice_logo_url,
    )


def parse_stripe_signature(signature_header: str) -> tuple[str, list[str]]:
    values = {}
    for item in signature_header.split(","):
        key, _, value = item.partition("=")
        values.setdefault(key, []).append(value)
    timestamp = values.get("t", [""])[0]
    signatures = values.get("v1", [])
    return timestamp, signatures


def verify_stripe_webhook(payload: bytes, signature_header: str) -> None:
    if not settings.stripe_webhook_secret:
        raise HTTPException(status_code=503, detail="Stripe webhook secret is not configured")
    timestamp, signatures = parse_stripe_signature(signature_header)
    signed_payload = f"{timestamp}.{payload.decode('utf-8')}".encode("utf-8")
    expected = hmac.new(settings.stripe_webhook_secret.encode("utf-8"), signed_payload, hashlib.sha256).hexdigest()
    if not signatures or not any(hmac.compare_digest(expected, signature) for signature in signatures):
        raise HTTPException(status_code=400, detail="Invalid Stripe signature")


def timestamp_to_datetime(value) -> datetime | None:
    if not value:
        return None
    return datetime.fromtimestamp(int(value), UTC)


def datetime_is_future(value: datetime | None) -> bool:
    if not value:
        return False
    if value.tzinfo is None:
        value = value.replace(tzinfo=UTC)
    return value >= datetime.now(UTC)


def stripe_plan_for_price(price_id: str | None) -> str | None:
    if not price_id:
        return None
    if settings.stripe_price_kliniaplan_annual and price_id == settings.stripe_price_kliniaplan_annual:
        return "kliniaplan_annual"
    if price_id in professional_price_ids():
        return "kliniaplan"
    return None


def clinic_from_stripe_object(db: Session, stripe_object: dict) -> Clinic | None:
    metadata = stripe_object.get("metadata") or {}
    clinic_id = metadata.get("clinic_id") or stripe_object.get("client_reference_id")
    if clinic_id:
        clinic = db.get(Clinic, clinic_id)
        if clinic:
            return clinic

    customer_id = stripe_object.get("customer")
    if customer_id:
        clinic = db.scalar(select(Clinic).where(Clinic.stripe_customer_id == customer_id))
        if clinic:
            return clinic

    subscription_id = stripe_object.get("subscription") or stripe_object.get("id")
    if subscription_id:
        return db.scalar(select(Clinic).where(Clinic.stripe_subscription_id == subscription_id))
    return None


def apply_subscription_object(clinic: Clinic, stripe_object: dict) -> None:
    clinic.subscription_status = stripe_object.get("status") or clinic.subscription_status or "active"
    clinic.stripe_subscription_id = stripe_object.get("id") or clinic.stripe_subscription_id
    clinic.stripe_customer_id = stripe_object.get("customer") or clinic.stripe_customer_id
    clinic.current_period_end = timestamp_to_datetime(stripe_object.get("current_period_end"))
    price = (((stripe_object.get("items") or {}).get("data") or [{}])[0].get("price") or {})
    price_id = price.get("id")
    if price_id:
        clinic.stripe_price_id = price_id
        clinic.subscription_plan = stripe_plan_for_price(price_id) or clinic.subscription_plan or "kliniaplan"


def handle_stripe_event(db: Session, event: dict) -> None:
    event_type = event.get("type")
    stripe_object = (event.get("data") or {}).get("object") or {}
    clinic = clinic_from_stripe_object(db, stripe_object)
    if not clinic:
        return

    if event_type == "checkout.session.completed":
        clinic.stripe_customer_id = stripe_object.get("customer") or clinic.stripe_customer_id
        clinic.stripe_subscription_id = stripe_object.get("subscription") or clinic.stripe_subscription_id
        clinic.subscription_plan = normalize_plan_id((stripe_object.get("metadata") or {}).get("plan") or clinic.subscription_plan or "kliniaplan")
        clinic.subscription_status = "active"
    elif event_type in {"customer.subscription.created", "customer.subscription.updated"}:
        apply_subscription_object(clinic, stripe_object)
    elif event_type == "customer.subscription.deleted":
        clinic.subscription_status = "canceled"
        clinic.current_period_end = timestamp_to_datetime(stripe_object.get("current_period_end"))
    elif event_type == "invoice.payment_failed":
        clinic.subscription_status = "past_due"
    elif event_type == "invoice.paid" and clinic.subscription_status in {"past_due", "incomplete"}:
        clinic.subscription_status = "active"
    db.commit()


@app.get("/", include_in_schema=False)
def frontend() -> FileResponse:
    return FileResponse(frontend_dir / "index.html")


@app.get("/app.js", include_in_schema=False)
def frontend_app_js() -> FileResponse:
    return FileResponse(frontend_dir / "app.js")


@app.get("/styles.css", include_in_schema=False)
def frontend_styles() -> FileResponse:
    return FileResponse(frontend_dir / "styles.css")


@app.get("/assets/{asset_name}", include_in_schema=False)
def frontend_asset(asset_name: str) -> FileResponse:
    asset_path = (frontend_dir / "assets" / asset_name).resolve()
    if not str(asset_path).startswith(str(frontend_dir.resolve())) or not asset_path.is_file():
        raise HTTPException(status_code=404, detail="Not found")
    return FileResponse(asset_path)


@app.post("/auth/register-clinic", response_model=TokenOut, status_code=status.HTTP_201_CREATED)
def register_clinic(payload: ClinicRegisterIn, db: Session = Depends(get_db)) -> TokenOut:
    existing = db.scalar(
        select(Clinic).where(
            (Clinic.email == payload.email.lower())
            | (Clinic.name == payload.clinic_name)
            | ((Clinic.tax_id == payload.tax_id) if payload.tax_id else (Clinic.email == payload.email.lower()))
        )
    )
    if existing:
        raise HTTPException(status_code=409, detail="Clinic name, tax id or email already exists")

    plan = plan_by_id(payload.plan)
    trial_ends_at = datetime.now(UTC) + timedelta(days=30)
    clinic = Clinic(
        name=payload.clinic_name,
        email=payload.email.lower(),
        phone=payload.phone,
        billing_name=payload.billing_name or payload.clinic_name,
        billing_email=str(payload.billing_email or payload.email).lower(),
        tax_id=payload.tax_id,
        billing_address=payload.billing_address,
        subscription_plan=plan["id"],
        subscription_status="trialing",
        stripe_price_id=plan.get("price_id"),
        trial_ends_at=trial_ends_at,
    )
    db.add(clinic)
    db.flush()
    user = User(
        clinic_id=clinic.id,
        name=payload.owner_name,
        email=payload.email.lower(),
        password_hash=hash_password(payload.password),
        role=UserRole.owner,
    )
    db.add(user)
    db.flush()
    audit_action(db, user, "register-clinic", "clinic", clinic.id, {"plan": plan["id"]})
    db.commit()
    db.refresh(user)
    token = create_access_token(subject=user.id, clinic_id=user.clinic_id, role=user.role.value)
    checkout_url = None
    if plan["id"] != "trial":
        session = create_checkout_session(clinic, plan["id"])
        checkout_url = session.url
        db.commit()
    return TokenOut(access_token=token, clinic_id=clinic.id, subscription_status=clinic.subscription_status, checkout_url=checkout_url)


@app.post("/auth/login", response_model=TokenOut)
def login(payload: LoginIn, db: Session = Depends(get_db)) -> TokenOut:
    query = select(User).where(User.email == payload.email.lower(), User.active.is_(True))
    if payload.clinic_id:
        query = query.where(User.clinic_id == payload.clinic_id)
    elif payload.clinic_email:
        clinic = db.scalar(select(Clinic).where(Clinic.email == str(payload.clinic_email).lower()))
        if clinic:
            query = query.where(User.clinic_id == clinic.id)

    users = list(db.scalars(query))
    if len(users) > 1:
        raise HTTPException(status_code=409, detail="Clinic identifier required for this email")
    user = users[0] if users else None
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    token = create_access_token(subject=user.id, clinic_id=user.clinic_id, role=user.role.value)
    return TokenOut(access_token=token, clinic_id=user.clinic_id, subscription_status=user.clinic.subscription_status)


@app.get("/me", response_model=MeOut)
def me(user: User = Depends(current_user)) -> MeOut:
    return MeOut(user=user, clinic=user.clinic)


@app.get("/users", response_model=list[UserOut])
def list_users(user: User = Depends(require_roles(UserRole.owner)), db: Session = Depends(get_db)) -> list[User]:
    return list(db.scalars(select(User).where(User.clinic_id == user.clinic_id).order_by(User.name)))


@app.post("/users", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_user(payload: UserCreate, user: User = Depends(require_roles(UserRole.owner)), db: Session = Depends(get_db)) -> User:
    email = payload.email.lower()
    existing = db.scalar(select(User).where(User.clinic_id == user.clinic_id, User.email == email))
    if existing:
        raise HTTPException(status_code=409, detail="User email already exists in this clinic")
    next_user = User(
        clinic_id=user.clinic_id,
        name=payload.name,
        email=email,
        password_hash=hash_password(payload.password),
        role=payload.role,
        active=payload.active,
    )
    db.add(next_user)
    db.flush()
    audit_action(db, user, "create-user", "user", next_user.id, {"role": next_user.role.value})
    db.commit()
    db.refresh(next_user)
    return next_user


@app.patch("/users/{user_id}", response_model=UserOut)
def update_user(user_id: str, payload: UserUpdate, user: User = Depends(require_roles(UserRole.owner)), db: Session = Depends(get_db)) -> User:
    target = clinic_user_or_404(db, user_id, user.clinic_id)
    data = payload.model_dump(exclude_unset=True)
    if "email" in data and data["email"]:
        email = str(data["email"]).lower()
        existing = db.scalar(select(User).where(User.clinic_id == user.clinic_id, User.email == email, User.id != target.id))
        if existing:
            raise HTTPException(status_code=409, detail="User email already exists in this clinic")
        target.email = email
    if "password" in data and data["password"]:
        target.password_hash = hash_password(data["password"])
    if "name" in data:
        target.name = data["name"]
    if "role" in data and data["role"] is not None:
        if target.id == user.id and data["role"] != UserRole.owner:
            raise HTTPException(status_code=400, detail="Owner cannot demote their own account")
        target.role = data["role"]
    if "active" in data and data["active"] is not None:
        if target.id == user.id and data["active"] is False:
            raise HTTPException(status_code=400, detail="Owner cannot deactivate their own account")
        target.active = data["active"]
    audit_action(db, user, "update-user", "user", target.id, {"fields": sorted(data.keys())})
    db.commit()
    db.refresh(target)
    return target


@app.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def deactivate_user(user_id: str, user: User = Depends(require_roles(UserRole.owner)), db: Session = Depends(get_db)) -> None:
    target = clinic_user_or_404(db, user_id, user.clinic_id)
    if target.id == user.id:
        raise HTTPException(status_code=400, detail="Owner cannot deactivate their own account")
    target.active = False
    audit_action(db, user, "deactivate-user", "user", target.id)
    db.commit()


@app.get("/audit-log", response_model=list[AuditLogOut])
def list_audit_log(user: User = Depends(require_roles(UserRole.owner)), db: Session = Depends(get_db)) -> list[AuditLog]:
    return list(
        db.scalars(
            select(AuditLog)
            .where(AuditLog.clinic_id == user.clinic_id)
            .order_by(AuditLog.created_at.desc())
            .limit(200)
        )
    )


@app.get("/billing/plans", response_model=list[PlanOut])
def billing_plans() -> list[PlanOut]:
    return [
        PlanOut(
            **plan,
            checkout_enabled=plan["id"] == "trial" or bool(settings.stripe_secret_key and plan.get("price_id")),
        )
        for plan in saas_plans()
    ]


@app.get("/billing/status", response_model=BillingStatusOut)
def billing_status(user: User = Depends(current_user)) -> BillingStatusOut:
    return billing_status_for_clinic(user.clinic)


@app.patch("/billing/profile", response_model=BillingStatusOut)
def update_billing_profile(payload: BillingProfileUpdate, user: User = Depends(require_roles(UserRole.owner)), db: Session = Depends(get_db)) -> BillingStatusOut:
    apply_update(user.clinic, payload)
    audit_action(db, user, "update-billing-profile", "clinic", user.clinic_id, {"fields": sorted(payload.model_dump(exclude_unset=True).keys())})
    db.commit()
    db.refresh(user.clinic)
    return billing_status_for_clinic(user.clinic)


@app.post("/billing/checkout-session", response_model=BillingSessionOut)
def checkout_session(payload: CheckoutSessionCreate, user: User = Depends(require_roles(UserRole.owner)), db: Session = Depends(get_db)) -> BillingSessionOut:
    plan = plan_by_id(payload.plan)
    user.clinic.subscription_plan = plan["id"]
    user.clinic.subscription_status = "trialing" if datetime_is_future(user.clinic.trial_ends_at) else ("trialing" if plan["id"] == "trial" else "incomplete")
    user.clinic.stripe_price_id = plan.get("price_id") or user.clinic.stripe_price_id
    if not user.clinic.trial_ends_at:
        user.clinic.trial_ends_at = datetime.now(UTC) + timedelta(days=30)
    audit_action(db, user, "checkout-session", "clinic", user.clinic_id, {"plan": plan["id"]})
    db.commit()
    return create_checkout_session(user.clinic, plan["id"])


@app.post("/billing/portal-session", response_model=BillingSessionOut)
def portal_session(user: User = Depends(require_roles(UserRole.owner))) -> BillingSessionOut:
    return create_portal_session(user.clinic)


@app.post("/stripe/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)) -> dict:
    payload = await request.body()
    verify_stripe_webhook(payload, request.headers.get("stripe-signature", ""))
    try:
        event = json.loads(payload)
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=400, detail="Invalid JSON payload") from exc
    handle_stripe_event(db, event)
    return {"received": True}


@app.get("/patients", response_model=list[PatientOut])
def list_patients(user: User = Depends(current_subscribed_user), db: Session = Depends(get_db)) -> list[Patient]:
    return list(db.scalars(select(Patient).where(Patient.clinic_id == user.clinic_id).order_by(Patient.name)))


@app.post("/patients", response_model=PatientOut, status_code=status.HTTP_201_CREATED)
def create_patient(payload: PatientCreate, user: User = Depends(require_subscribed_roles(UserRole.owner, UserRole.staff)), db: Session = Depends(get_db)) -> Patient:
    patient = Patient(clinic_id=user.clinic_id, **payload.model_dump())
    db.add(patient)
    db.flush()
    audit_action(db, user, "create-patient", "patient", patient.id)
    db.commit()
    db.refresh(patient)
    return patient


@app.patch("/patients/{patient_id}", response_model=PatientOut)
def update_patient(patient_id: str, payload: PatientUpdate, user: User = Depends(require_subscribed_roles(UserRole.owner, UserRole.staff)), db: Session = Depends(get_db)) -> Patient:
    patient = clinic_item_or_404(db, Patient, patient_id, user.clinic_id)
    apply_update(patient, payload)
    audit_action(db, user, "update-patient", "patient", patient.id, {"fields": sorted(payload.model_dump(exclude_unset=True).keys())})
    db.commit()
    db.refresh(patient)
    return patient


@app.delete("/patients/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_patient(patient_id: str, user: User = Depends(require_subscribed_roles(UserRole.owner, UserRole.staff)), db: Session = Depends(get_db)) -> None:
    patient = clinic_item_or_404(db, Patient, patient_id, user.clinic_id)
    audit_action(db, user, "delete-patient", "patient", patient.id)
    db.delete(patient)
    db.commit()


@app.get("/practitioners", response_model=list[PractitionerOut])
def list_practitioners(user: User = Depends(current_subscribed_user), db: Session = Depends(get_db)) -> list[Practitioner]:
    return list(db.scalars(select(Practitioner).where(Practitioner.clinic_id == user.clinic_id).order_by(Practitioner.name)))


@app.post("/practitioners", response_model=PractitionerOut, status_code=status.HTTP_201_CREATED)
def create_practitioner(payload: PractitionerCreate, user: User = Depends(require_subscribed_roles(UserRole.owner)), db: Session = Depends(get_db)) -> Practitioner:
    practitioner = Practitioner(clinic_id=user.clinic_id, **payload.model_dump())
    db.add(practitioner)
    db.flush()
    audit_action(db, user, "create-practitioner", "practitioner", practitioner.id)
    db.commit()
    db.refresh(practitioner)
    return practitioner


@app.patch("/practitioners/{practitioner_id}", response_model=PractitionerOut)
def update_practitioner(practitioner_id: str, payload: PractitionerUpdate, user: User = Depends(require_subscribed_roles(UserRole.owner)), db: Session = Depends(get_db)) -> Practitioner:
    practitioner = clinic_item_or_404(db, Practitioner, practitioner_id, user.clinic_id)
    apply_update(practitioner, payload)
    audit_action(db, user, "update-practitioner", "practitioner", practitioner.id, {"fields": sorted(payload.model_dump(exclude_unset=True).keys())})
    db.commit()
    db.refresh(practitioner)
    return practitioner


@app.delete("/practitioners/{practitioner_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_practitioner(practitioner_id: str, user: User = Depends(require_subscribed_roles(UserRole.owner)), db: Session = Depends(get_db)) -> None:
    practitioner = clinic_item_or_404(db, Practitioner, practitioner_id, user.clinic_id)
    audit_action(db, user, "delete-practitioner", "practitioner", practitioner.id)
    db.delete(practitioner)
    db.commit()


@app.get("/rooms", response_model=list[RoomOut])
def list_rooms(user: User = Depends(current_subscribed_user), db: Session = Depends(get_db)) -> list[Room]:
    return list(db.scalars(select(Room).where(Room.clinic_id == user.clinic_id).order_by(Room.name)))


@app.post("/rooms", response_model=RoomOut, status_code=status.HTTP_201_CREATED)
def create_room(payload: RoomCreate, user: User = Depends(require_subscribed_roles(UserRole.owner)), db: Session = Depends(get_db)) -> Room:
    room = Room(clinic_id=user.clinic_id, **payload.model_dump())
    db.add(room)
    db.flush()
    audit_action(db, user, "create-room", "room", room.id)
    db.commit()
    db.refresh(room)
    return room


@app.patch("/rooms/{room_id}", response_model=RoomOut)
def update_room(room_id: str, payload: RoomUpdate, user: User = Depends(require_subscribed_roles(UserRole.owner)), db: Session = Depends(get_db)) -> Room:
    room = clinic_item_or_404(db, Room, room_id, user.clinic_id)
    apply_update(room, payload)
    audit_action(db, user, "update-room", "room", room.id, {"fields": sorted(payload.model_dump(exclude_unset=True).keys())})
    db.commit()
    db.refresh(room)
    return room


@app.delete("/rooms/{room_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_room(room_id: str, user: User = Depends(require_subscribed_roles(UserRole.owner)), db: Session = Depends(get_db)) -> None:
    room = clinic_item_or_404(db, Room, room_id, user.clinic_id)
    audit_action(db, user, "delete-room", "room", room.id)
    db.delete(room)
    db.commit()


@app.get("/services", response_model=list[ServiceOut])
def list_services(user: User = Depends(current_subscribed_user), db: Session = Depends(get_db)) -> list[Service]:
    return list(db.scalars(select(Service).where(Service.clinic_id == user.clinic_id).order_by(Service.name)))


@app.post("/services", response_model=ServiceOut, status_code=status.HTTP_201_CREATED)
def create_service(payload: ServiceCreate, user: User = Depends(require_subscribed_roles(UserRole.owner)), db: Session = Depends(get_db)) -> Service:
    service = Service(clinic_id=user.clinic_id, **payload.model_dump())
    db.add(service)
    db.flush()
    audit_action(db, user, "create-service", "service", service.id)
    db.commit()
    db.refresh(service)
    return service


@app.patch("/services/{service_id}", response_model=ServiceOut)
def update_service(service_id: str, payload: ServiceUpdate, user: User = Depends(require_subscribed_roles(UserRole.owner)), db: Session = Depends(get_db)) -> Service:
    service = clinic_item_or_404(db, Service, service_id, user.clinic_id)
    apply_update(service, payload)
    audit_action(db, user, "update-service", "service", service.id, {"fields": sorted(payload.model_dump(exclude_unset=True).keys())})
    db.commit()
    db.refresh(service)
    return service


@app.delete("/services/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_service(service_id: str, user: User = Depends(require_subscribed_roles(UserRole.owner)), db: Session = Depends(get_db)) -> None:
    service = clinic_item_or_404(db, Service, service_id, user.clinic_id)
    audit_action(db, user, "delete-service", "service", service.id)
    db.delete(service)
    db.commit()


@app.get("/appointments", response_model=list[AppointmentOut])
def list_appointments(user: User = Depends(current_subscribed_user), db: Session = Depends(get_db)) -> list[Appointment]:
    query = select(Appointment).where(Appointment.clinic_id == user.clinic_id).order_by(Appointment.date, Appointment.start)
    if user.role == UserRole.practitioner and user.practitioner:
        query = query.where(Appointment.practitioner_id == user.practitioner.id)
    return list(db.scalars(query))


@app.post("/appointments", response_model=AppointmentOut, status_code=status.HTTP_201_CREATED)
def create_appointment(payload: AppointmentCreate, user: User = Depends(require_subscribed_roles(UserRole.owner, UserRole.staff, UserRole.practitioner)), db: Session = Depends(get_db)) -> Appointment:
    for model, item_id in (
        (Patient, payload.patient_id),
        (Practitioner, payload.practitioner_id),
        (Room, payload.room_id),
        (Service, payload.service_id),
    ):
        exists = db.scalar(select(model).where(model.id == item_id, model.clinic_id == user.clinic_id))
        if not exists:
            raise HTTPException(status_code=404, detail=f"{model.__name__} not found")

    if user.role == UserRole.practitioner and user.practitioner and payload.practitioner_id != user.practitioner.id:
        raise HTTPException(status_code=403, detail="Practitioners can only create their own appointments")

    appointment = Appointment(clinic_id=user.clinic_id, **payload.model_dump())
    db.add(appointment)
    db.flush()
    audit_action(db, user, "create-appointment", "appointment", appointment.id)
    db.commit()
    db.refresh(appointment)
    return appointment


@app.patch("/appointments/{appointment_id}", response_model=AppointmentOut)
def update_appointment(appointment_id: str, payload: AppointmentUpdate, user: User = Depends(require_subscribed_roles(UserRole.owner, UserRole.staff, UserRole.practitioner)), db: Session = Depends(get_db)) -> Appointment:
    appointment = clinic_item_or_404(db, Appointment, appointment_id, user.clinic_id)
    if user.role == UserRole.practitioner and user.practitioner and appointment.practitioner_id != user.practitioner.id:
        raise HTTPException(status_code=403, detail="Practitioners can only edit their own appointments")

    data = payload.model_dump(exclude_unset=True)
    for model, key in (
        (Patient, "patient_id"),
        (Practitioner, "practitioner_id"),
        (Room, "room_id"),
        (Service, "service_id"),
    ):
        if key in data:
            clinic_item_or_404(db, model, data[key], user.clinic_id)

    if user.role == UserRole.practitioner and user.practitioner and data.get("practitioner_id", appointment.practitioner_id) != user.practitioner.id:
        raise HTTPException(status_code=403, detail="Practitioners can only assign their own appointments")

    apply_update(appointment, payload)
    audit_action(db, user, "update-appointment", "appointment", appointment.id, {"fields": sorted(data.keys())})
    db.commit()
    db.refresh(appointment)
    return appointment


@app.delete("/appointments/{appointment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_appointment(appointment_id: str, user: User = Depends(require_subscribed_roles(UserRole.owner, UserRole.staff, UserRole.practitioner)), db: Session = Depends(get_db)) -> None:
    appointment = clinic_item_or_404(db, Appointment, appointment_id, user.clinic_id)
    if user.role == UserRole.practitioner and user.practitioner and appointment.practitioner_id != user.practitioner.id:
        raise HTTPException(status_code=403, detail="Practitioners can only delete their own appointments")
    audit_action(db, user, "delete-appointment", "appointment", appointment.id)
    db.delete(appointment)
    db.commit()
