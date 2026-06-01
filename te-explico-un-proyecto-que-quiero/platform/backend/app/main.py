import hashlib
import hmac
import json
import logging
import secrets
import threading
import time
from datetime import UTC, datetime, timedelta
from pathlib import Path
from urllib.parse import urlencode

import httpx
from fastapi import Depends, FastAPI, HTTPException, Query, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from .config import get_settings
from .db import Base, engine, ensure_runtime_schema, get_db
from .deps import current_subscribed_user, current_user, require_roles, require_subscribed_roles, require_superadmin
from .models import (
    Appointment,
    AppointmentStatus,
    AttendanceRecord,
    AuditLog,
    Clinic,
    ClinicDataBlob,
    DemoAccessSession,
    ManualBillingMovement,
    Patient,
    Practitioner,
    Room,
    Service,
    SupportTicket,
    User,
    UserRole,
)
from .schemas import (
    AccessRecoveryRequestIn,
    AccessRecoveryRequestOut,
    AppointmentCreate,
    AppointmentOut,
    AppointmentUpdate,
    AttendanceClockIn,
    AttendanceRecordOut,
    AuditLogOut,
    BillingProfileUpdate,
    BillingSessionOut,
    BillingStatusOut,
    CheckoutSessionCreate,
    ClinicDataBlobIn,
    ClinicDataBlobOut,
    ClinicOut,
    ClinicRegisterIn,
    ClinicSettingsUpdate,
    DemoAccessCreate,
    DemoAccessOut,
    LoginIn,
    ManualBillingMovementCreate,
    ManualBillingMovementOut,
    ManualBillingMovementUpdate,
    MeOut,
    PasswordChangeIn,
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
    SuperAdminAuditLogOut,
    SuperAdminAccessIssueOut,
    SuperAdminClinicDeleteIn,
    SuperAdminClinicOut,
    SuperAdminClinicUpdateIn,
    SuperAdminOverviewOut,
    SuperAdminPasswordResetOut,
    SuperAdminRepairAccessOut,
    SuperAdminSupportTicketCreateIn,
    SuperAdminSupportTicketOut,
    SuperAdminSupportTicketUpdateIn,
    SuperAdminPractitionerAccessOut,
    SuperAdminUserUpdateIn,
    SuperAdminUserOut,
    UserCreate,
    UserOut,
    UserUpdate,
    PlanOut,
    TokenOut,
)
from .security import create_access_token, hash_password, verify_login_password, verify_password


settings = get_settings()
frontend_dir = Path(settings.frontend_dir) if settings.frontend_dir else Path(__file__).resolve().parents[3] / "app"
logger = logging.getLogger(__name__)

app = FastAPI(title=settings.app_name)
app.state.backend_setup_status = "pending"
app.state.backend_setup_error = None
app.state.backend_setup_started_at = None
app.state.backend_setup_finished_at = None
app.state.backend_security_status = "unchecked"
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-Frame-Options", "DENY")
    response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.setdefault("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()")
    if settings.app_env == "production":
        response.headers.setdefault("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
    return response

MAX_PASSWORD_BYTES = 72
LOGIN_RATE_LIMIT_WINDOW_SECONDS = 10 * 60
LOGIN_RATE_LIMIT_MAX_ATTEMPTS = 8
login_attempts_lock = threading.Lock()
login_attempts: dict[str, list[float]] = {}


def setup_log(message: str, *args) -> None:
    logger.warning("Klinia backend setup: " + message, *args)


def run_setup_step(name: str, callback, errors: list[str]) -> None:
    app.state.backend_setup_status = f"running:{name}"
    started = datetime.now(UTC)
    setup_log("%s started", name)
    try:
        callback()
    except Exception as exc:
        logger.exception("Klinia backend setup step failed: %s", name)
        errors.append(f"{name}: {exc}")
    else:
        elapsed = (datetime.now(UTC) - started).total_seconds()
        setup_log("%s completed in %.2fs", name, elapsed)


def validate_production_security_config() -> None:
    app.state.backend_security_status = "ok"
    if settings.app_env != "production":
        return
    problems: list[str] = []
    if not settings.jwt_secret or settings.jwt_secret == "dev-change-this-before-production":
        problems.append("JWT_SECRET is missing or still using the development default")
    elif len(settings.jwt_secret) < 32:
        problems.append("JWT_SECRET should be at least 32 characters")
    if "*" in settings.cors_origin_list:
        problems.append("CORS_ORIGINS must not contain '*' in production")
    if settings.stripe_secret_key and not settings.stripe_webhook_secret:
        problems.append("STRIPE_WEBHOOK_SECRET is required when Stripe is enabled")
    if not settings.superadmin_email or not settings.superadmin_password:
        problems.append("SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD are required for production support")
    if problems:
        app.state.backend_security_status = "attention"
        for problem in problems:
            setup_log("security attention: %s", problem)
        raise RuntimeError("Production security configuration requires attention")


def run_backend_setup() -> None:
    errors: list[str] = []
    app.state.backend_setup_status = "running"
    app.state.backend_setup_error = None
    app.state.backend_setup_started_at = datetime.now(UTC).isoformat()
    app.state.backend_setup_finished_at = None
    setup_log("started env=%s", settings.app_env)
    try:
        run_setup_step("metadata", lambda: Base.metadata.create_all(bind=engine, checkfirst=True), errors)
        run_setup_step("runtime_schema", ensure_runtime_schema, errors)
        run_setup_step("security_config", validate_production_security_config, errors)
        run_setup_step("superadmin", ensure_initial_superadmin, errors)
    except Exception as exc:
        logger.exception("Klinia backend setup crashed unexpectedly")
        errors.append(f"unexpected: {exc}")
    finally:
        app.state.backend_setup_error = " | ".join(errors) if errors else None
        app.state.backend_setup_status = "degraded" if errors else "ready"
        app.state.backend_setup_finished_at = datetime.now(UTC).isoformat()
        if errors:
            setup_log("finished with errors: %s", app.state.backend_setup_error)
        else:
            setup_log("finished successfully")


@app.on_event("startup")
def startup() -> None:
    if settings.app_env == "production":
        threading.Thread(target=run_backend_setup, name="klinia-backend-setup", daemon=True).start()
        return
    run_backend_setup()


@app.get("/health")
def health() -> dict:
    return {
        "ok": True,
        "app": settings.app_name,
        "env": settings.app_env,
        "stripe_configured": settings.stripe_enabled,
        "backend_setup_status": app.state.backend_setup_status,
        "backend_setup_finished_at": app.state.backend_setup_finished_at,
        "security_status": app.state.backend_security_status,
    }


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


def link_user_to_practitioner(db: Session, clinic_id: str, target_user: User, practitioner_id: str | None) -> None:
    if not practitioner_id:
        raise HTTPException(status_code=400, detail="Practitioner users require practitioner_id")
    practitioner = clinic_item_or_404(db, Practitioner, practitioner_id, clinic_id)
    if practitioner.user_id and practitioner.user_id != target_user.id:
        raise HTTPException(status_code=409, detail="Practitioner already has a user")
    current_link = db.scalar(
        select(Practitioner).where(
            Practitioner.clinic_id == clinic_id,
            Practitioner.user_id == target_user.id,
            Practitioner.id != practitioner.id,
        )
    )
    if current_link:
        current_link.user_id = None
    practitioner.user_id = target_user.id


def unlink_practitioner_user(db: Session, clinic_id: str, target_user: User) -> None:
    current_link = db.scalar(select(Practitioner).where(Practitioner.clinic_id == clinic_id, Practitioner.user_id == target_user.id))
    if current_link:
        current_link.user_id = None


SENSITIVE_METADATA_KEYS = {"password", "password_hash", "token", "access_token", "secret", "stripe_secret_key", "stripe_webhook_secret"}


def safe_metadata(metadata: dict | None) -> dict:
    if not metadata:
        return {}
    safe: dict = {}
    for key, value in metadata.items():
        key_text = str(key)
        if key_text.lower() in SENSITIVE_METADATA_KEYS:
            continue
        safe[key_text] = value
    return safe


def parse_metadata_json(value: str | None) -> dict:
    if not value:
        return {}
    try:
        parsed = json.loads(value)
    except (TypeError, json.JSONDecodeError):
        return {}
    return parsed if isinstance(parsed, dict) else {}


def generate_temporary_password(length: int = 14) -> str:
    uppercase = "ABCDEFGHJKLMNPQRSTUVWXYZ"
    lowercase = "abcdefghijkmnopqrstuvwxyz"
    digits = "23456789"
    symbols = "!@#$%*"
    alphabet = uppercase + lowercase + digits + symbols
    chars = [
        secrets.choice(uppercase),
        secrets.choice(lowercase),
        secrets.choice(digits),
        secrets.choice(symbols),
    ]
    chars.extend(secrets.choice(alphabet) for _ in range(max(length, 8) - len(chars)))
    secrets.SystemRandom().shuffle(chars)
    return "".join(chars)


def validate_new_password(password: str | None) -> str:
    password = str(password or "").strip()
    if len(password) < 8:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Password must have at least 8 characters")
    if not any(char.isupper() for char in password):
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Password must include at least one uppercase letter")
    if not any(char.islower() for char in password):
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Password must include at least one lowercase letter")
    if not any(char.isdigit() or not char.isalnum() for char in password):
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Password must include at least one number or symbol")
    if len(password.encode("utf-8")) > MAX_PASSWORD_BYTES:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Password is too long")
    return password


def normalized_identifier(value: str | None) -> str:
    return str(value or "").strip().lower()


def looks_like_email(value: str) -> bool:
    return "@" in value and "." in value.rsplit("@", 1)[-1]


def clinic_by_identifier(db: Session, value: str | None) -> Clinic | None:
    identifier = normalized_identifier(value)
    if not identifier:
        return None
    return db.scalar(
        select(Clinic).where(
            (func.lower(Clinic.email) == identifier)
            | (func.lower(Clinic.name) == identifier)
        )
    )


def user_access_status(user: User, last_access_at: datetime | None = None, last_failed_login_at: datetime | None = None) -> str:
    if not user.active:
        return "blocked"
    if getattr(user, "force_password_change", False):
        return "temporary_password"
    if last_failed_login_at and (not last_access_at or last_failed_login_at > last_access_at):
        return "recent_failed_login"
    return "ok"


def normalized_working_days(days: list[str] | None) -> str:
    allowed = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
    if not days:
        return "mon,tue,wed,thu,fri"
    cleaned = [day for day in allowed if day in set(days)]
    return ",".join(cleaned or allowed[:5])


def validate_opening_range(start: str | None, end: str | None) -> tuple[str, str]:
    start_value = start or "09:00"
    end_value = end or "20:00"
    try:
        start_hour, start_minute = [int(part) for part in start_value.split(":", 1)]
        end_hour, end_minute = [int(part) for part in end_value.split(":", 1)]
    except (AttributeError, TypeError, ValueError):
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid opening hours")
    if not (0 <= start_hour <= 23 and 0 <= end_hour <= 23 and 0 <= start_minute <= 59 and 0 <= end_minute <= 59):
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid opening hours")
    start_minutes = start_hour * 60 + start_minute
    end_minutes = end_hour * 60 + end_minute
    if start_minutes >= end_minutes:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Opening start must be before opening end")
    return start_value, end_value


def time_to_minutes(value: str | None) -> int:
    try:
        hour, minute = [int(part) for part in str(value or "").split(":", 1)]
    except (TypeError, ValueError):
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid appointment time")
    if not (0 <= hour <= 23 and 0 <= minute <= 59):
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid appointment time")
    return hour * 60 + minute


def minutes_to_time(value: int) -> str:
    return f"{value // 60:02d}:{value % 60:02d}"


def appointment_end_from_service(start: str, service: Service) -> str:
    start_minutes = time_to_minutes(start)
    duration = max(1, int(service.duration_minutes or 60))
    end_minutes = start_minutes + duration
    if end_minutes >= 24 * 60:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Appointment cannot end after midnight")
    return minutes_to_time(end_minutes)


def intervals_overlap(first_start: str, first_end: str, second_start: str, second_end: str) -> bool:
    return time_to_minutes(first_start) < time_to_minutes(second_end) and time_to_minutes(second_start) < time_to_minutes(first_end)


def status_is_cancelled(value: AppointmentStatus | str | None) -> bool:
    return value == AppointmentStatus.cancelled or str(value or "") == AppointmentStatus.cancelled.value


def validate_appointment_schedule(
    db: Session,
    clinic_id: str,
    *,
    date: str,
    start: str,
    end: str,
    practitioner_id: str,
    room_id: str,
    patient_id: str,
    ignored_appointment_id: str | None = None,
) -> None:
    query = select(Appointment).where(
        Appointment.clinic_id == clinic_id,
        Appointment.date == date,
        Appointment.status != AppointmentStatus.cancelled,
    )
    if ignored_appointment_id:
        query = query.where(Appointment.id != ignored_appointment_id)
    for appointment in db.scalars(query):
        if not (
            appointment.practitioner_id == practitioner_id
            or appointment.room_id == room_id
            or appointment.patient_id == patient_id
        ):
            continue
        existing_end = appointment.end
        if not existing_end:
            existing_service = db.get(Service, appointment.service_id)
            existing_end = appointment_end_from_service(appointment.start, existing_service) if existing_service else minutes_to_time(time_to_minutes(appointment.start) + 60)
        if intervals_overlap(start, end, appointment.start, existing_end):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Appointment overlaps an existing appointment")


CLINIC_DATA_DEFAULTS = {
    "groups": "[]",
    "group-dropins": "[]",
    "group-completions": "[]",
    "group-session-overrides": "[]",
    "session-packs": "[]",
    "patient-packs": "[]",
    "consent-templates": "[]",
    "patient-consents": "[]",
    "reminder-actions": "[]",
    "reminder-settings": "{}",
    "availability-blocks": "[]",
    "permissions": "{}",
}
PRACTITIONER_WRITABLE_CLINIC_DATA_KEYS = {"group-completions", "group-dropins", "reminder-actions"}


def clinic_data_default(key: str) -> str:
    if key not in CLINIC_DATA_DEFAULTS:
        raise HTTPException(status_code=404, detail="Clinic data collection not supported")
    return CLINIC_DATA_DEFAULTS[key]


def validate_clinic_data_payload(key: str, data_json: str) -> str:
    clinic_data_default(key)
    value = data_json if data_json not in (None, "") else CLINIC_DATA_DEFAULTS[key]
    try:
        json.loads(value)
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=422, detail="Invalid clinic data JSON") from exc
    if len(value.encode("utf-8")) > 2_000_000:
        raise HTTPException(status_code=413, detail="Clinic data payload is too large")
    return value


def ensure_clinic_data_write_allowed(user: User, key: str) -> None:
    if user.role in {UserRole.owner, UserRole.staff, UserRole.support}:
        return
    if user.role == UserRole.practitioner and key in PRACTITIONER_WRITABLE_CLINIC_DATA_KEYS:
        return
    raise HTTPException(status_code=403, detail="Insufficient permissions for this clinic data collection")


def request_ip(request: Request | None) -> str | None:
    if not request:
        return None
    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    return request.client.host if request.client else None


def login_rate_limit_key(request: Request, identifier: str) -> str:
    return f"{request_ip(request) or 'unknown'}:{identifier}"


def prune_login_attempts(now: float) -> None:
    cutoff = now - LOGIN_RATE_LIMIT_WINDOW_SECONDS
    for key in list(login_attempts):
        attempts = [item for item in login_attempts[key] if item >= cutoff]
        if attempts:
            login_attempts[key] = attempts
        else:
            login_attempts.pop(key, None)


def login_is_rate_limited(request: Request, identifier: str) -> bool:
    now = time.monotonic()
    key = login_rate_limit_key(request, identifier)
    with login_attempts_lock:
        prune_login_attempts(now)
        return len(login_attempts.get(key, [])) >= LOGIN_RATE_LIMIT_MAX_ATTEMPTS


def record_login_failure(request: Request, identifier: str) -> None:
    now = time.monotonic()
    key = login_rate_limit_key(request, identifier)
    with login_attempts_lock:
        prune_login_attempts(now)
        login_attempts.setdefault(key, []).append(now)


def clear_login_failures(request: Request, identifier: str) -> None:
    key = login_rate_limit_key(request, identifier)
    with login_attempts_lock:
        login_attempts.pop(key, None)


def audit_action(
    db: Session,
    user: User | None,
    action: str,
    resource_type: str,
    resource_id: str | None = None,
    metadata: dict | None = None,
    *,
    clinic_id: str | None = None,
    result: str = "success",
    origin: str | None = None,
    request: Request | None = None,
) -> None:
    db.add(
        AuditLog(
            clinic_id=clinic_id if clinic_id is not None else (user.clinic_id if user else None),
            user_id=user.id if user else None,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            result=result,
            origin=origin or ("api" if request else None),
            ip_address=request_ip(request),
            user_agent=request.headers.get("user-agent") if request else None,
            metadata_json=json.dumps(safe_metadata(metadata), ensure_ascii=True),
        )
    )


def ensure_initial_superadmin() -> None:
    if not settings.superadmin_email or not settings.superadmin_password:
        setup_log("superadmin skipped because SUPERADMIN_EMAIL or SUPERADMIN_PASSWORD is missing")
        return
    email = settings.superadmin_email.lower().strip()
    superadmin_password = settings.superadmin_password.strip()
    if not superadmin_password:
        raise ValueError("SUPERADMIN_PASSWORD is empty after trimming whitespace")
    if len(superadmin_password) < 8:
        raise ValueError("SUPERADMIN_PASSWORD must have at least 8 characters")
    if len(superadmin_password.encode("utf-8")) > 72:
        raise ValueError("SUPERADMIN_PASSWORD exceeds bcrypt 72 byte limit")
    setup_log("superadmin bootstrap for %s", email)
    with Session(engine) as db:
        user = db.scalar(select(User).where(func.lower(User.email) == email, User.role == UserRole.superadmin))
        if user:
            user.name = settings.superadmin_name or user.name
            user.password_hash = hash_password(superadmin_password)
            user.active = True
            db.commit()
            setup_log("superadmin updated and password synchronized for %s", email)
            return
        user = User(
            clinic_id=None,
            name=settings.superadmin_name,
            email=email,
            password_hash=hash_password(superadmin_password),
            role=UserRole.superadmin,
            active=True,
        )
        db.add(user)
        db.flush()
        audit_action(db, user, "create-superadmin", "user", user.id, {"source": "startup-env"}, clinic_id=None, origin="system")
        db.commit()
        setup_log("superadmin created for %s", email)


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
    audit_action(
        db,
        None,
        "stripe-event",
        "subscription",
        clinic.stripe_subscription_id or stripe_object.get("subscription") or stripe_object.get("id"),
        {"event_type": event_type, "stripe_object_id": stripe_object.get("id")},
        clinic_id=clinic.id,
        origin="stripe",
    )
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
def register_clinic(payload: ClinicRegisterIn, request: Request, db: Session = Depends(get_db)) -> TokenOut:
    email = str(payload.email).lower()
    password = validate_new_password(payload.password)
    existing = db.scalar(
        select(Clinic).where(
            (func.lower(Clinic.email) == email)
            | ((func.lower(Clinic.tax_id) == payload.tax_id.strip().lower()) if payload.tax_id else (func.lower(Clinic.email) == email))
        )
    )
    if existing:
        owner = db.scalar(
            select(User).where(
                User.clinic_id == existing.id,
                func.lower(User.email) == email,
                User.role == UserRole.owner,
            )
        )
        if owner and verify_login_password(password, owner.password_hash):
            audit_action(
                db,
                owner,
                "register-clinic-recovered",
                "clinic",
                existing.id,
                {"reason": "idempotent-register-retry"},
                request=request,
            )
            db.commit()
            token = create_access_token(subject=owner.id, clinic_id=owner.clinic_id, role=owner.role.value)
            return TokenOut(
                access_token=token,
                clinic_id=existing.id,
                subscription_status=existing.subscription_status,
                checkout_url=None,
                force_password_change=owner.force_password_change,
            )
        raise HTTPException(status_code=409, detail="Clinic tax id or email already exists")

    plan = plan_by_id(payload.plan)
    trial_ends_at = datetime.now(UTC) + timedelta(days=30)
    opening_start, opening_end = validate_opening_range(payload.opening_start, payload.opening_end)
    clinic = Clinic(
        name=payload.clinic_name,
        email=email,
        phone=payload.phone,
        billing_name=payload.billing_name or payload.clinic_name,
        billing_email=str(payload.billing_email or payload.email).lower(),
        tax_id=payload.tax_id,
        billing_address=payload.billing_address,
        subscription_plan=plan["id"],
        subscription_status="trialing",
        stripe_price_id=plan.get("price_id"),
        trial_ends_at=trial_ends_at,
        working_days=normalized_working_days(payload.working_days),
        opening_start=opening_start,
        opening_end=opening_end,
    )
    db.add(clinic)
    db.flush()
    user = User(
        clinic_id=clinic.id,
        name=payload.owner_name,
        email=email,
        password_hash=hash_password(password),
        role=UserRole.owner,
        force_password_change=False,
    )
    db.add(user)
    db.flush()
    audit_action(db, user, "register-clinic", "clinic", clinic.id, {"plan": plan["id"]}, request=request)
    db.commit()
    db.refresh(user)
    token = create_access_token(subject=user.id, clinic_id=user.clinic_id, role=user.role.value)
    checkout_url = None
    if plan["id"] != "trial":
        try:
            session = create_checkout_session(clinic, plan["id"])
            checkout_url = session.url
            db.commit()
        except Exception as error:
            audit_action(
                db,
                user,
                "checkout-session-deferred",
                "clinic",
                clinic.id,
                {"plan": plan["id"], "reason": str(error)[:240]},
                result="warning",
                request=request,
            )
            db.commit()
    return TokenOut(access_token=token, clinic_id=clinic.id, subscription_status=clinic.subscription_status, checkout_url=checkout_url, force_password_change=False)


@app.post("/auth/login", response_model=TokenOut)
def login(payload: LoginIn, request: Request, db: Session = Depends(get_db)) -> TokenOut:
    identifier = normalized_identifier(payload.email)
    if not identifier:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Login identifier is required")
    if login_is_rate_limited(request, identifier):
        audit_action(
            db,
            None,
            "login-throttled",
            "auth",
            metadata={"identifier": identifier, "reason": "too_many_attempts"},
            result="failure",
            request=request,
        )
        db.commit()
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Too many login attempts. Try again in a few minutes")

    if not payload.clinic_id and not payload.clinic_email and looks_like_email(identifier):
        superadmin = db.scalar(select(User).where(func.lower(User.email) == identifier, User.role == UserRole.superadmin, User.active.is_(True)))
        if superadmin and verify_login_password(payload.password, superadmin.password_hash):
            clear_login_failures(request, identifier)
            audit_action(db, superadmin, "login-success", "auth", superadmin.id, {"role": superadmin.role.value}, request=request)
            db.commit()
            token = create_access_token(subject=superadmin.id, clinic_id=None, role=superadmin.role.value)
            return TokenOut(access_token=token, clinic_id=None, subscription_status="active", force_password_change=False)

    if not looks_like_email(identifier):
        clinic = db.get(Clinic, payload.clinic_id) if payload.clinic_id else None
        clinic = clinic or clinic_by_identifier(db, payload.clinic_email) or clinic_by_identifier(db, identifier)
        if clinic:
            owner = db.scalar(
                select(User).where(
                    User.clinic_id == clinic.id,
                    User.role == UserRole.owner,
                    User.active.is_(True),
                )
            )
            if owner and verify_login_password(payload.password, owner.password_hash):
                clear_login_failures(request, identifier)
                audit_action(db, owner, "login-success", "auth", owner.id, {"role": owner.role.value, "identifier": "clinic"}, request=request)
                db.commit()
                token = create_access_token(subject=owner.id, clinic_id=owner.clinic_id, role=owner.role.value)
                return TokenOut(access_token=token, clinic_id=owner.clinic_id, subscription_status=clinic.subscription_status, force_password_change=owner.force_password_change)
            record_login_failure(request, identifier)
            audit_action(
                db,
                owner,
                "login-failed",
                "auth",
                metadata={"identifier": identifier, "reason": "invalid_clinic_credentials"},
                clinic_id=clinic.id,
                result="failure",
                request=request,
            )
            db.commit()
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    email = identifier
    query = select(User).where(func.lower(User.email) == email, User.active.is_(True))
    resolved_clinic_id = payload.clinic_id
    if payload.clinic_id:
        query = query.where(User.clinic_id == payload.clinic_id)
    elif payload.clinic_email:
        clinic = clinic_by_identifier(db, payload.clinic_email)
        if clinic:
            resolved_clinic_id = clinic.id
            query = query.where(User.clinic_id == clinic.id)
        else:
            query = query.where(User.clinic_id == "__missing_clinic__")

    users = list(db.scalars(query))
    if len(users) > 1:
        audit_action(
            db,
            None,
            "login-failed",
            "auth",
            metadata={"email": email, "reason": "clinic_identifier_required"},
            clinic_id=resolved_clinic_id,
            result="failure",
            request=request,
        )
        db.commit()
        raise HTTPException(status_code=409, detail="Clinic identifier required for this email")
    user = users[0] if users else None
    if not user or not verify_login_password(payload.password, user.password_hash):
        record_login_failure(request, identifier)
        audit_action(
            db,
            user,
            "login-failed",
            "auth",
            metadata={"email": email, "reason": "invalid_credentials"},
            clinic_id=resolved_clinic_id if resolved_clinic_id else (user.clinic_id if user else None),
            result="failure",
            request=request,
        )
        db.commit()
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    clear_login_failures(request, identifier)
    audit_action(db, user, "login-success", "auth", user.id, {"role": user.role.value}, request=request)
    db.commit()
    token = create_access_token(subject=user.id, clinic_id=user.clinic_id, role=user.role.value)
    subscription_status = "active" if user.role == UserRole.superadmin else (user.clinic.subscription_status if user.clinic else None)
    return TokenOut(access_token=token, clinic_id=user.clinic_id, subscription_status=subscription_status, force_password_change=user.force_password_change)


@app.get("/me", response_model=MeOut)
def me(user: User = Depends(current_user)) -> MeOut:
    return MeOut(user=user, clinic=user.clinic)


@app.post("/auth/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(request: Request, user: User = Depends(current_user), db: Session = Depends(get_db)) -> None:
    audit_action(db, user, "logout", "auth", user.id, {"role": user.role.value}, request=request)
    db.commit()


@app.post("/me/password", status_code=status.HTTP_204_NO_CONTENT)
def change_password(payload: PasswordChangeIn, request: Request, user: User = Depends(current_user), db: Session = Depends(get_db)) -> None:
    if not verify_password(payload.current_password, user.password_hash):
        audit_action(db, user, "change-password", "user", user.id, {"reason": "invalid_current_password"}, result="failure", request=request)
        db.commit()
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid current password")
    user.password_hash = hash_password(validate_new_password(payload.new_password))
    user.force_password_change = False
    audit_action(db, user, "change-password", "user", user.id, {"role": user.role.value}, request=request)
    db.commit()


@app.post("/auth/recovery-request", status_code=status.HTTP_202_ACCEPTED)
def recovery_request(payload: AccessRecoveryRequestIn, request: Request, db: Session = Depends(get_db)) -> dict:
    clinic = None
    if payload.clinic_email:
        clinic = db.scalar(select(Clinic).where(func.lower(Clinic.email) == str(payload.clinic_email).lower()))
    query = select(User).where(func.lower(User.email) == str(payload.email).lower())
    if clinic:
        query = query.where(User.clinic_id == clinic.id)
    user = db.scalar(query)
    audit_action(
        db,
        user,
        "access-recovery-request",
        "auth",
        user.id if user else None,
        {"email": str(payload.email).lower(), "clinic_email": str(payload.clinic_email).lower() if payload.clinic_email else None},
        clinic_id=clinic.id if clinic else (user.clinic_id if user else None),
        result="requested",
        request=request,
    )
    db.commit()
    return {"ok": True}


@app.get("/access-recovery-requests", response_model=list[AccessRecoveryRequestOut])
def list_access_recovery_requests(
    user: User = Depends(require_roles(UserRole.owner)),
    db: Session = Depends(get_db),
) -> list[AccessRecoveryRequestOut]:
    items = list(
        db.scalars(
            select(AuditLog)
            .where(AuditLog.clinic_id == user.clinic_id, AuditLog.action == "access-recovery-request")
            .order_by(AuditLog.created_at.desc())
            .limit(100)
        )
    )
    output: list[AccessRecoveryRequestOut] = []
    for item in items:
        metadata = parse_metadata_json(item.metadata_json)
        output.append(
            AccessRecoveryRequestOut(
                id=item.id,
                clinic_id=item.clinic_id,
                user_id=item.user_id,
                user_email=str(metadata.get("email") or ""),
                status=item.result or "requested",
                requested_at=item.created_at,
                resolved_at=None,
            )
        )
    return output


@app.get("/users", response_model=list[UserOut])
def list_users(user: User = Depends(require_roles(UserRole.owner)), db: Session = Depends(get_db)) -> list[User]:
    return list(db.scalars(select(User).where(User.clinic_id == user.clinic_id).order_by(User.name)))


@app.post("/users", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_user(payload: UserCreate, user: User = Depends(require_roles(UserRole.owner)), db: Session = Depends(get_db)) -> User:
    if payload.role in {UserRole.superadmin, UserRole.support}:
        raise HTTPException(status_code=403, detail="Administrative users cannot be created from a clinic")
    if payload.role == UserRole.practitioner and not payload.practitioner_id:
        raise HTTPException(status_code=400, detail="Practitioner users require practitioner_id")
    email = str(payload.email).lower()
    existing = db.scalar(select(User).where(User.clinic_id == user.clinic_id, func.lower(User.email) == email))
    if existing:
        raise HTTPException(status_code=409, detail="User email already exists in this clinic")
    password = validate_new_password(payload.password)
    next_user = User(
        clinic_id=user.clinic_id,
        name=payload.name,
        email=email,
        password_hash=hash_password(password),
        role=payload.role,
        active=payload.active,
        force_password_change=False,
    )
    db.add(next_user)
    db.flush()
    if next_user.role == UserRole.practitioner:
        link_user_to_practitioner(db, user.clinic_id, next_user, payload.practitioner_id)
    audit_action(db, user, "create-user", "user", next_user.id, {"role": next_user.role.value, "practitioner_id": payload.practitioner_id})
    db.commit()
    db.refresh(next_user)
    return next_user


@app.patch("/users/{user_id}", response_model=UserOut)
def update_user(user_id: str, payload: UserUpdate, user: User = Depends(require_roles(UserRole.owner)), db: Session = Depends(get_db)) -> User:
    target = clinic_user_or_404(db, user_id, user.clinic_id)
    data = payload.model_dump(exclude_unset=True)
    if "email" in data and data["email"]:
        email = str(data["email"]).lower()
        existing = db.scalar(select(User).where(User.clinic_id == user.clinic_id, func.lower(User.email) == email, User.id != target.id))
        if existing:
            raise HTTPException(status_code=409, detail="User email already exists in this clinic")
        target.email = email
    if "password" in data and data["password"]:
        password = validate_new_password(data["password"])
        target.password_hash = hash_password(password)
        target.force_password_change = False
    if "name" in data:
        target.name = data["name"]
    if "role" in data and data["role"] is not None:
        if data["role"] in {UserRole.superadmin, UserRole.support}:
            raise HTTPException(status_code=403, detail="Administrative roles cannot be assigned from a clinic")
        if target.id == user.id and data["role"] != UserRole.owner:
            raise HTTPException(status_code=400, detail="Owner cannot demote their own account")
        target.role = data["role"]
    if target.role == UserRole.practitioner:
        if "practitioner_id" in data or not target.practitioner:
            link_user_to_practitioner(db, user.clinic_id, target, data.get("practitioner_id"))
    else:
        unlink_practitioner_user(db, user.clinic_id, target)
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


@app.post("/users/{user_id}/reset-password", response_model=SuperAdminPasswordResetOut)
def owner_reset_user_password(
    user_id: str,
    request: Request,
    user: User = Depends(require_roles(UserRole.owner)),
    db: Session = Depends(get_db),
) -> SuperAdminPasswordResetOut:
    target = clinic_user_or_404(db, user_id, user.clinic_id)
    if target.id == user.id:
        raise HTTPException(status_code=400, detail="Use /me/password to change your own password")
    result = reset_clinic_user_password(db, target)
    audit_action(
        db,
        user,
        "owner-reset-user-password",
        "user",
        target.id,
        {"target_email": target.email},
        request=request,
    )
    db.commit()
    return result


@app.post("/access-recovery-requests/{request_id}/resolve", response_model=SuperAdminPasswordResetOut)
def resolve_access_recovery_request(
    request_id: str,
    request: Request,
    user: User = Depends(require_roles(UserRole.owner)),
    db: Session = Depends(get_db),
) -> SuperAdminPasswordResetOut:
    item = db.get(AuditLog, request_id)
    if not item or item.clinic_id != user.clinic_id or item.action != "access-recovery-request":
        raise HTTPException(status_code=404, detail="Recovery request not found")
    target = db.get(User, item.user_id) if item.user_id else None
    if not target or target.clinic_id != user.clinic_id or target.role == UserRole.superadmin:
        raise HTTPException(status_code=404, detail="Recovery request has no valid user")
    result = reset_clinic_user_password(db, target)
    item.result = "resolved"
    audit_action(
        db,
        user,
        "resolve-access-recovery-request",
        "auth",
        item.id,
        {"target_user_id": target.id, "target_email": target.email},
        request=request,
    )
    db.commit()
    return result


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


def superadmin_audit_out(db: Session, item: AuditLog) -> SuperAdminAuditLogOut:
    clinic = db.get(Clinic, item.clinic_id) if item.clinic_id else None
    actor = db.get(User, item.user_id) if item.user_id else None
    return SuperAdminAuditLogOut(
        id=item.id,
        clinic_id=item.clinic_id,
        user_id=item.user_id,
        action=item.action,
        resource_type=item.resource_type,
        resource_id=item.resource_id,
        result=item.result or "success",
        origin=item.origin,
        ip_address=item.ip_address,
        user_agent=item.user_agent,
        metadata_json=item.metadata_json,
        created_at=item.created_at,
        clinic_name=clinic.name if clinic else None,
        user_name=actor.name if actor else None,
        user_email=actor.email if actor else None,
    )


def superadmin_user_out(db: Session, item: User) -> SuperAdminUserOut:
    clinic = db.get(Clinic, item.clinic_id) if item.clinic_id else None
    last_access_at = db.scalar(select(func.max(AuditLog.created_at)).where(AuditLog.user_id == item.id, AuditLog.action == "login-success"))
    last_failed_login_at = db.scalar(select(func.max(AuditLog.created_at)).where(AuditLog.user_id == item.id, AuditLog.action == "login-failed"))
    return SuperAdminUserOut(
        id=item.id,
        clinic_id=item.clinic_id,
        clinic_name=clinic.name if clinic else None,
        name=item.name,
        email=item.email,
        role=item.role,
        active=item.active,
        force_password_change=item.force_password_change,
        created_at=item.created_at,
        last_access_at=last_access_at,
        last_failed_login_at=last_failed_login_at,
        access_status=user_access_status(item, last_access_at, last_failed_login_at),
    )


def support_ticket_out(db: Session, item: SupportTicket) -> SuperAdminSupportTicketOut:
    clinic = db.get(Clinic, item.clinic_id) if item.clinic_id else None
    target_user = db.get(User, item.user_id) if item.user_id else None
    history = []
    if item.history_json:
        try:
            parsed = json.loads(item.history_json)
            history = parsed if isinstance(parsed, list) else []
        except json.JSONDecodeError:
            history = []
    return SuperAdminSupportTicketOut(
        id=item.id,
        clinic_id=item.clinic_id,
        clinic_name=clinic.name if clinic else None,
        user_id=item.user_id,
        user_email=target_user.email if target_user else None,
        issue_key=item.issue_key,
        title=item.title,
        description=item.description,
        priority=item.priority,
        status=item.status,
        history=history,
        created_at=item.created_at,
        updated_at=item.updated_at,
    )


def collect_superadmin_access_issues(db: Session) -> list[SuperAdminAccessIssueOut]:
    since = datetime.now(UTC) - timedelta(hours=24)
    issues: list[SuperAdminAccessIssueOut] = []

    def add_issue(
        *,
        clinic: Clinic | None,
        issue_type: str,
        message: str,
        recommended_action: str,
        severity: str = "warning",
        user: User | None = None,
        practitioner: Practitioner | None = None,
        created_at: datetime | None = None,
    ) -> None:
        issues.append(
            SuperAdminAccessIssueOut(
                id=f"{clinic.id if clinic else 'platform'}:{user.id if user else practitioner.id if practitioner else 'clinic'}:{issue_type}",
                clinic_id=clinic.id if clinic else None,
                clinic_name=clinic.name if clinic else None,
                user_id=user.id if user else None,
                user_email=user.email if user else None,
                practitioner_id=practitioner.id if practitioner else None,
                severity=severity,
                issue_type=issue_type,
                message=message,
                recommended_action=recommended_action,
                created_at=created_at,
            )
        )

    clinics = list(db.scalars(select(Clinic).order_by(Clinic.created_at.desc())))
    for clinic in clinics:
        users = list(db.scalars(select(User).where(User.clinic_id == clinic.id).order_by(User.created_at.asc())))
        owners = [user for user in users if user.role == UserRole.owner]
        active_owners = [user for user in owners if user.active]
        if not users:
            add_issue(
                clinic=clinic,
                issue_type="no-users",
                severity="critical",
                message="La clinica no tiene ningun usuario backend vinculado.",
                recommended_action="Recrear acceso de direccion",
                created_at=clinic.created_at,
            )
        if not owners:
            add_issue(
                clinic=clinic,
                issue_type="no-owner",
                severity="critical",
                message="La clinica no tiene usuario de direccion.",
                recommended_action="Recrear acceso de direccion",
                created_at=clinic.created_at,
            )
        elif not active_owners:
            add_issue(
                clinic=clinic,
                issue_type="owner-inactive",
                severity="critical",
                message="La clinica tiene direccion creada, pero esta bloqueada o inactiva.",
                recommended_action="Activar direccion y generar clave temporal",
                user=owners[0],
                created_at=owners[0].updated_at,
            )
        for owner in owners:
            if owner.force_password_change:
                add_issue(
                    clinic=clinic,
                    issue_type="temporary-owner-password",
                    severity="info",
                    message="Direccion esta usando una clave temporal y debe cambiarla al entrar.",
                    recommended_action="Confirmar que la clave temporal se ha entregado por canal seguro",
                    user=owner,
                    created_at=owner.updated_at,
                )
        failed_count = db.scalar(
            select(func.count())
            .select_from(AuditLog)
            .where(AuditLog.clinic_id == clinic.id, AuditLog.action == "login-failed", AuditLog.created_at >= since)
        ) or 0
        if failed_count >= 3:
            last_failed_at = db.scalar(select(func.max(AuditLog.created_at)).where(AuditLog.clinic_id == clinic.id, AuditLog.action == "login-failed"))
            add_issue(
                clinic=clinic,
                issue_type="repeated-login-failures",
                severity="warning",
                message=f"{failed_count} intentos fallidos de acceso en las ultimas 24 horas.",
                recommended_action="Revisar usuario afectado y resetear clave si procede",
                created_at=last_failed_at,
            )
        practitioners_without_access = list(
            db.scalars(
                select(Practitioner).where(
                    Practitioner.clinic_id == clinic.id,
                    Practitioner.active.is_(True),
                    Practitioner.user_id.is_(None),
                )
            )
        )
        for practitioner in practitioners_without_access[:5]:
            add_issue(
                clinic=clinic,
                issue_type="practitioner-without-user",
                severity="info",
                message=f"El trabajador {practitioner.name} no tiene usuario backend vinculado.",
                recommended_action="Crear usuario desde Configuracion > Trabajadores o desde soporte",
                practitioner=practitioner,
                created_at=practitioner.created_at,
            )
    return issues


def repair_clinic_owner_access(db: Session, clinic: Clinic) -> SuperAdminRepairAccessOut:
    actions: list[str] = []
    owner = db.scalar(
        select(User)
        .where(User.clinic_id == clinic.id, User.role == UserRole.owner)
        .order_by(User.active.desc(), User.created_at.asc())
    )
    if owner:
        if not owner.active:
            owner.active = True
            actions.append("owner-reactivated")
    else:
        owner_email = normalized_identifier(clinic.email)
        if not owner_email:
            raise HTTPException(status_code=409, detail="Clinic has no email to create owner access")
        owner = User(
            clinic_id=clinic.id,
            name=clinic.billing_name or clinic.name or "Direccion",
            email=owner_email,
            password_hash=hash_password(generate_temporary_password()),
            role=UserRole.owner,
            active=True,
            force_password_change=True,
        )
        db.add(owner)
        db.flush()
        actions.append("owner-created")

    temporary_password = generate_temporary_password()
    owner.password_hash = hash_password(temporary_password)
    owner.force_password_change = True
    actions.append("temporary-password-generated")
    return SuperAdminRepairAccessOut(
        clinic_id=clinic.id,
        user_id=owner.id,
        user_email=owner.email,
        temporary_password=temporary_password,
        actions=actions,
        force_password_change=True,
    )


def reset_clinic_user_password(db: Session, target: User) -> SuperAdminPasswordResetOut:
    temporary_password = generate_temporary_password()
    target.password_hash = hash_password(temporary_password)
    target.force_password_change = True
    target.active = True
    return SuperAdminPasswordResetOut(user_id=target.id, temporary_password=temporary_password, force_password_change=True)


def create_practitioner_access(db: Session, practitioner: Practitioner) -> SuperAdminPractitionerAccessOut:
    actions: list[str] = []
    metadata = parse_metadata_json(practitioner.metadata_json)
    email = normalized_identifier(metadata.get("email") or metadata.get("accessEmail") or metadata.get("loginEmail"))
    if not email:
        raise HTTPException(status_code=409, detail="Practitioner has no email in metadata to create access")
    target = db.scalar(
        select(User).where(
            User.clinic_id == practitioner.clinic_id,
            func.lower(User.email) == email,
        )
    )
    if not target:
        target = User(
            clinic_id=practitioner.clinic_id,
            name=practitioner.name,
            email=email,
            password_hash=hash_password(generate_temporary_password()),
            role=UserRole.practitioner,
            active=True,
            force_password_change=True,
        )
        db.add(target)
        db.flush()
        actions.append("user-created")
    else:
        target.name = target.name or practitioner.name
        target.role = UserRole.practitioner
        target.active = True
        actions.append("user-reused")
    temporary_password = generate_temporary_password()
    target.password_hash = hash_password(temporary_password)
    target.force_password_change = True
    practitioner.user_id = target.id
    actions.append("practitioner-linked")
    actions.append("temporary-password-generated")
    return SuperAdminPractitionerAccessOut(
        practitioner_id=practitioner.id,
        user_id=target.id,
        user_email=target.email,
        temporary_password=temporary_password,
        actions=actions,
        force_password_change=True,
    )


@app.get("/superadmin/overview", response_model=SuperAdminOverviewOut)
def superadmin_overview(
    admin: User = Depends(require_superadmin),
    db: Session = Depends(get_db),
) -> SuperAdminOverviewOut:
    since = datetime.now(UTC) - timedelta(hours=24)
    return SuperAdminOverviewOut(
        total_clinics=db.scalar(select(func.count()).select_from(Clinic)) or 0,
        active_clinics=db.scalar(select(func.count()).select_from(Clinic).where(Clinic.subscription_status == "active")) or 0,
        trialing_clinics=db.scalar(select(func.count()).select_from(Clinic).where(Clinic.subscription_status.in_(["trial", "trialing"]))) or 0,
        past_due_clinics=db.scalar(select(func.count()).select_from(Clinic).where(Clinic.subscription_status.in_(["past_due", "incomplete", "canceled"]))) or 0,
        total_users=db.scalar(select(func.count()).select_from(User).where(User.role != UserRole.superadmin)) or 0,
        failed_logins_24h=db.scalar(select(func.count()).select_from(AuditLog).where(AuditLog.action == "login-failed", AuditLog.created_at >= since)) or 0,
        activity_24h=db.scalar(select(func.count()).select_from(AuditLog).where(AuditLog.created_at >= since)) or 0,
    )


@app.get("/superadmin/clinics", response_model=list[SuperAdminClinicOut])
def superadmin_clinics(
    admin: User = Depends(require_superadmin),
    db: Session = Depends(get_db),
) -> list[SuperAdminClinicOut]:
    clinics = list(db.scalars(select(Clinic).order_by(Clinic.created_at.desc())))
    audit_action(db, admin, "superadmin-list-clinics", "clinic", metadata={"count": len(clinics)}, clinic_id=None)
    db.commit()
    output: list[SuperAdminClinicOut] = []
    for clinic in clinics:
        users_count = db.scalar(select(func.count()).select_from(User).where(User.clinic_id == clinic.id)) or 0
        last_activity_at = db.scalar(select(func.max(AuditLog.created_at)).where(AuditLog.clinic_id == clinic.id))
        output.append(
            SuperAdminClinicOut(
                id=clinic.id,
                name=clinic.name,
                email=clinic.email,
                phone=clinic.phone,
                subscription_plan=clinic.subscription_plan,
                subscription_status=clinic.subscription_status,
                trial_ends_at=clinic.trial_ends_at,
                current_period_end=clinic.current_period_end,
                created_at=clinic.created_at,
                users_count=users_count,
                last_activity_at=last_activity_at,
            )
        )
    return output


@app.get("/superadmin/users", response_model=list[SuperAdminUserOut])
def superadmin_users(
    clinic_id: str | None = None,
    admin: User = Depends(require_superadmin),
    db: Session = Depends(get_db),
) -> list[SuperAdminUserOut]:
    query = select(User).where(User.role != UserRole.superadmin).order_by(User.created_at.desc())
    if clinic_id:
        query = query.where(User.clinic_id == clinic_id)
    users = list(db.scalars(query))
    audit_action(db, admin, "superadmin-list-users", "user", metadata={"clinic_id": clinic_id, "count": len(users)}, clinic_id=None)
    db.commit()
    return [superadmin_user_out(db, item) for item in users]


@app.get("/superadmin/clinics/{clinic_id}/users", response_model=list[SuperAdminUserOut])
def superadmin_clinic_users(
    clinic_id: str,
    admin: User = Depends(require_superadmin),
    db: Session = Depends(get_db),
) -> list[SuperAdminUserOut]:
    if not db.get(Clinic, clinic_id):
        raise HTTPException(status_code=404, detail="Clinic not found")
    return superadmin_users(clinic_id=clinic_id, admin=admin, db=db)


@app.patch("/superadmin/users/{user_id}", response_model=SuperAdminUserOut)
def superadmin_update_user(
    user_id: str,
    payload: SuperAdminUserUpdateIn,
    request: Request,
    admin: User = Depends(require_superadmin),
    db: Session = Depends(get_db),
) -> SuperAdminUserOut:
    target = db.get(User, user_id)
    if not target or target.role == UserRole.superadmin:
        raise HTTPException(status_code=404, detail="User not found")
    changes = payload.model_dump(exclude_unset=True)
    if payload.role is not None:
        if payload.role == UserRole.superadmin:
            raise HTTPException(status_code=400, detail="Cannot assign superadmin role here")
        if target.role == UserRole.practitioner and payload.role != UserRole.practitioner:
            unlink_practitioner_user(db, target.clinic_id, target)
        target.role = payload.role
    if payload.active is not None:
        target.active = payload.active
    audit_action(
        db,
        admin,
        "superadmin-update-user",
        "user",
        target.id,
        {"target_email": target.email, "fields": sorted(changes.keys())},
        clinic_id=target.clinic_id,
        request=request,
    )
    db.commit()
    db.refresh(target)
    return superadmin_user_out(db, target)


@app.post("/superadmin/users/{user_id}/reset-password", response_model=SuperAdminPasswordResetOut)
def superadmin_reset_user_password(
    user_id: str,
    request: Request,
    admin: User = Depends(require_superadmin),
    db: Session = Depends(get_db),
) -> SuperAdminPasswordResetOut:
    target = db.get(User, user_id)
    if not target or target.role == UserRole.superadmin:
        raise HTTPException(status_code=404, detail="User not found")
    temporary_password = generate_temporary_password()
    target.password_hash = hash_password(temporary_password)
    target.force_password_change = True
    target.active = True
    audit_action(
        db,
        admin,
        "superadmin-reset-password",
        "user",
        target.id,
        {"target_email": target.email, "reactivated": True},
        clinic_id=target.clinic_id,
        request=request,
    )
    db.commit()
    return SuperAdminPasswordResetOut(user_id=target.id, temporary_password=temporary_password, force_password_change=True)


@app.patch("/superadmin/clinics/{clinic_id}", response_model=SuperAdminClinicOut)
def superadmin_update_clinic(
    clinic_id: str,
    payload: SuperAdminClinicUpdateIn,
    request: Request,
    admin: User = Depends(require_superadmin),
    db: Session = Depends(get_db),
) -> SuperAdminClinicOut:
    clinic = db.get(Clinic, clinic_id)
    if not clinic:
        raise HTTPException(status_code=404, detail="Clinic not found")
    if payload.subscription_status is not None:
        clinic.subscription_status = payload.subscription_status
    audit_action(
        db,
        admin,
        "superadmin-update-clinic",
        "clinic",
        clinic.id,
        {"fields": sorted(payload.model_dump(exclude_unset=True).keys())},
        clinic_id=clinic.id,
        request=request,
    )
    db.commit()
    db.refresh(clinic)
    users_count = db.scalar(select(func.count()).select_from(User).where(User.clinic_id == clinic.id)) or 0
    last_activity_at = db.scalar(select(func.max(AuditLog.created_at)).where(AuditLog.clinic_id == clinic.id))
    return SuperAdminClinicOut(
        id=clinic.id,
        name=clinic.name,
        email=clinic.email,
        phone=clinic.phone,
        subscription_plan=clinic.subscription_plan,
        subscription_status=clinic.subscription_status,
        trial_ends_at=clinic.trial_ends_at,
        current_period_end=clinic.current_period_end,
        created_at=clinic.created_at,
        users_count=users_count,
        last_activity_at=last_activity_at,
    )


@app.post("/superadmin/clinics/{clinic_id}/archive-test", response_model=SuperAdminClinicOut)
def superadmin_archive_test_clinic(
    clinic_id: str,
    request: Request,
    admin: User = Depends(require_superadmin),
    db: Session = Depends(get_db),
) -> SuperAdminClinicOut:
    clinic = db.get(Clinic, clinic_id)
    if not clinic:
        raise HTTPException(status_code=404, detail="Clinic not found")
    patient_count = db.scalar(select(func.count()).select_from(Patient).where(Patient.clinic_id == clinic.id)) or 0
    appointment_count = db.scalar(select(func.count()).select_from(Appointment).where(Appointment.clinic_id == clinic.id)) or 0
    clinic.subscription_status = "archived"
    clinic.subscription_plan = clinic.subscription_plan or "trial"
    users = list(db.scalars(select(User).where(User.clinic_id == clinic.id)))
    for item in users:
        item.active = False
    audit_action(
        db,
        admin,
        "superadmin-archive-test-clinic",
        "clinic",
        clinic.id,
        {
            "clinic_name": clinic.name,
            "users_disabled": len(users),
            "patient_count": patient_count,
            "appointment_count": appointment_count,
            "safe_archive": True,
        },
        clinic_id=clinic.id,
        request=request,
    )
    db.commit()
    db.refresh(clinic)
    last_activity_at = db.scalar(select(func.max(AuditLog.created_at)).where(AuditLog.clinic_id == clinic.id))
    return SuperAdminClinicOut(
        id=clinic.id,
        name=clinic.name,
        email=clinic.email,
        phone=clinic.phone,
        subscription_plan=clinic.subscription_plan,
        subscription_status=clinic.subscription_status,
        trial_ends_at=clinic.trial_ends_at,
        current_period_end=clinic.current_period_end,
        created_at=clinic.created_at,
        users_count=len(users),
        last_activity_at=last_activity_at,
    )


@app.post("/superadmin/clinics/{clinic_id}/restore", response_model=SuperAdminClinicOut)
def superadmin_restore_archived_clinic(
    clinic_id: str,
    request: Request,
    admin: User = Depends(require_superadmin),
    db: Session = Depends(get_db),
) -> SuperAdminClinicOut:
    clinic = db.get(Clinic, clinic_id)
    if not clinic:
        raise HTTPException(status_code=404, detail="Clinic not found")
    if clinic.subscription_status != "archived":
        raise HTTPException(status_code=400, detail="Only archived clinics can be restored")
    clinic.subscription_status = "trialing"
    owners = list(db.scalars(select(User).where(User.clinic_id == clinic.id, User.role == UserRole.owner)))
    for owner in owners:
        owner.active = True
    audit_action(
        db,
        admin,
        "superadmin-restore-clinic",
        "clinic",
        clinic.id,
        {"clinic_name": clinic.name, "owners_reactivated": len(owners)},
        clinic_id=clinic.id,
        request=request,
    )
    db.commit()
    db.refresh(clinic)
    users_count = db.scalar(select(func.count()).select_from(User).where(User.clinic_id == clinic.id)) or 0
    last_activity_at = db.scalar(select(func.max(AuditLog.created_at)).where(AuditLog.clinic_id == clinic.id))
    return SuperAdminClinicOut(
        id=clinic.id,
        name=clinic.name,
        email=clinic.email,
        phone=clinic.phone,
        subscription_plan=clinic.subscription_plan,
        subscription_status=clinic.subscription_status,
        trial_ends_at=clinic.trial_ends_at,
        current_period_end=clinic.current_period_end,
        created_at=clinic.created_at,
        users_count=users_count,
        last_activity_at=last_activity_at,
    )


@app.post("/superadmin/clinics/{clinic_id}/delete-permanent", status_code=status.HTTP_204_NO_CONTENT)
def superadmin_delete_clinic_permanently(
    clinic_id: str,
    payload: SuperAdminClinicDeleteIn,
    request: Request,
    admin: User = Depends(require_superadmin),
    db: Session = Depends(get_db),
) -> None:
    clinic = db.get(Clinic, clinic_id)
    if not clinic:
        raise HTTPException(status_code=404, detail="Clinic not found")
    if payload.confirm_name.strip() != clinic.name:
        raise HTTPException(status_code=400, detail="Clinic name confirmation does not match")
    if payload.confirm_phrase.strip().upper() != "ELIMINAR":
        raise HTTPException(status_code=400, detail="Delete phrase confirmation does not match")
    counts = {
        "users": db.scalar(select(func.count()).select_from(User).where(User.clinic_id == clinic.id)) or 0,
        "patients": db.scalar(select(func.count()).select_from(Patient).where(Patient.clinic_id == clinic.id)) or 0,
        "appointments": db.scalar(select(func.count()).select_from(Appointment).where(Appointment.clinic_id == clinic.id)) or 0,
        "practitioners": db.scalar(select(func.count()).select_from(Practitioner).where(Practitioner.clinic_id == clinic.id)) or 0,
        "rooms": db.scalar(select(func.count()).select_from(Room).where(Room.clinic_id == clinic.id)) or 0,
        "services": db.scalar(select(func.count()).select_from(Service).where(Service.clinic_id == clinic.id)) or 0,
        "manual_billing_movements": db.scalar(select(func.count()).select_from(ManualBillingMovement).where(ManualBillingMovement.clinic_id == clinic.id)) or 0,
        "support_tickets": db.scalar(select(func.count()).select_from(SupportTicket).where(SupportTicket.clinic_id == clinic.id)) or 0,
    }
    audit_action(
        db,
        admin,
        "superadmin-delete-clinic-permanent",
        "clinic",
        clinic.id,
        {"clinic_name": clinic.name, "clinic_email": clinic.email, "deleted_counts": counts},
        clinic_id=None,
        request=request,
    )
    db.query(SupportTicket).filter(SupportTicket.clinic_id == clinic.id).delete(synchronize_session=False)
    db.delete(clinic)
    db.commit()


@app.post("/superadmin/clinics/{clinic_id}/impersonation-token", response_model=TokenOut)
def superadmin_impersonation_token(
    clinic_id: str,
    request: Request,
    admin: User = Depends(require_superadmin),
    db: Session = Depends(get_db),
) -> TokenOut:
    clinic = db.get(Clinic, clinic_id)
    if not clinic:
        raise HTTPException(status_code=404, detail="Clinic not found")
    target = db.scalar(
        select(User).where(
            User.clinic_id == clinic.id,
            User.role == UserRole.owner,
            User.active.is_(True),
        )
    ) or db.scalar(select(User).where(User.clinic_id == clinic.id, User.active.is_(True)))
    if not target:
        raise HTTPException(status_code=404, detail="No active user found for clinic")
    audit_action(
        db,
        admin,
        "superadmin-impersonate-clinic",
        "clinic",
        clinic.id,
        {"target_user_id": target.id, "target_role": target.role.value},
        clinic_id=clinic.id,
        request=request,
    )
    db.commit()
    token = create_access_token(
        subject=target.id,
        clinic_id=clinic.id,
        role=target.role.value,
        expires_minutes=30,
        extra_claims={"impersonated_by": admin.id, "impersonation": True},
    )
    return TokenOut(access_token=token, clinic_id=clinic.id, subscription_status=clinic.subscription_status, force_password_change=target.force_password_change)


@app.get("/superadmin/access-issues", response_model=list[SuperAdminAccessIssueOut])
def superadmin_access_issues(
    admin: User = Depends(require_superadmin),
    db: Session = Depends(get_db),
) -> list[SuperAdminAccessIssueOut]:
    issues = collect_superadmin_access_issues(db)
    audit_action(db, admin, "superadmin-view-access-issues", "support", metadata={"count": len(issues)}, clinic_id=None)
    db.commit()
    return issues


@app.get("/superadmin/support-tickets", response_model=list[SuperAdminSupportTicketOut])
def superadmin_support_tickets(
    clinic_id: str | None = None,
    status_filter: str | None = Query(default=None, alias="status"),
    admin: User = Depends(require_superadmin),
    db: Session = Depends(get_db),
) -> list[SuperAdminSupportTicketOut]:
    query = select(SupportTicket).order_by(SupportTicket.updated_at.desc(), SupportTicket.created_at.desc())
    if clinic_id:
        query = query.where(SupportTicket.clinic_id == clinic_id)
    if status_filter:
        query = query.where(SupportTicket.status == status_filter)
    tickets = list(db.scalars(query.limit(300)))
    audit_action(db, admin, "superadmin-list-support-tickets", "support-ticket", metadata={"clinic_id": clinic_id, "count": len(tickets)}, clinic_id=None)
    db.commit()
    return [support_ticket_out(db, ticket) for ticket in tickets]


@app.post("/superadmin/support-tickets", response_model=SuperAdminSupportTicketOut, status_code=status.HTTP_201_CREATED)
def superadmin_create_support_ticket(
    payload: SuperAdminSupportTicketCreateIn,
    request: Request,
    admin: User = Depends(require_superadmin),
    db: Session = Depends(get_db),
) -> SuperAdminSupportTicketOut:
    if payload.clinic_id and not db.get(Clinic, payload.clinic_id):
        raise HTTPException(status_code=404, detail="Clinic not found")
    if payload.user_id:
        target_user = db.get(User, payload.user_id)
        if not target_user:
            raise HTTPException(status_code=404, detail="User not found")
        if payload.clinic_id and target_user.clinic_id != payload.clinic_id:
            raise HTTPException(status_code=400, detail="User does not belong to clinic")
    history = [{
        "at": datetime.now(UTC).isoformat(),
        "by": admin.email,
        "action": "created",
        "note": payload.description or "",
    }]
    ticket = SupportTicket(
        clinic_id=payload.clinic_id,
        user_id=payload.user_id,
        created_by_id=admin.id,
        issue_key=payload.issue_key,
        title=payload.title.strip(),
        description=payload.description,
        priority=payload.priority or "medium",
        status=payload.status or "open",
        history_json=json.dumps(history),
    )
    db.add(ticket)
    db.flush()
    audit_action(
        db,
        admin,
        "superadmin-create-support-ticket",
        "support-ticket",
        ticket.id,
        {"clinic_id": ticket.clinic_id, "issue_key": ticket.issue_key, "status": ticket.status},
        clinic_id=ticket.clinic_id,
        request=request,
    )
    db.commit()
    db.refresh(ticket)
    return support_ticket_out(db, ticket)


@app.patch("/superadmin/support-tickets/{ticket_id}", response_model=SuperAdminSupportTicketOut)
def superadmin_update_support_ticket(
    ticket_id: str,
    payload: SuperAdminSupportTicketUpdateIn,
    request: Request,
    admin: User = Depends(require_superadmin),
    db: Session = Depends(get_db),
) -> SuperAdminSupportTicketOut:
    ticket = db.get(SupportTicket, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Support ticket not found")
    data = payload.model_dump(exclude_unset=True)
    old_status = ticket.status
    if payload.status is not None:
        ticket.status = payload.status
    if payload.priority is not None:
        ticket.priority = payload.priority
    history = []
    if ticket.history_json:
        try:
            parsed = json.loads(ticket.history_json)
            history = parsed if isinstance(parsed, list) else []
        except json.JSONDecodeError:
            history = []
    history.append({
        "at": datetime.now(UTC).isoformat(),
        "by": admin.email,
        "action": f"status:{old_status}->{ticket.status}" if payload.status is not None else "updated",
        "note": payload.note or "",
    })
    ticket.history_json = json.dumps(history[-50:])
    audit_action(
        db,
        admin,
        "superadmin-update-support-ticket",
        "support-ticket",
        ticket.id,
        {"fields": sorted(data.keys()), "status": ticket.status},
        clinic_id=ticket.clinic_id,
        request=request,
    )
    db.commit()
    db.refresh(ticket)
    return support_ticket_out(db, ticket)


@app.post("/superadmin/clinics/{clinic_id}/repair-access", response_model=SuperAdminRepairAccessOut)
def superadmin_repair_clinic_access(
    clinic_id: str,
    request: Request,
    admin: User = Depends(require_superadmin),
    db: Session = Depends(get_db),
) -> SuperAdminRepairAccessOut:
    clinic = db.get(Clinic, clinic_id)
    if not clinic:
        raise HTTPException(status_code=404, detail="Clinic not found")
    result = repair_clinic_owner_access(db, clinic)
    audit_action(
        db,
        admin,
        "superadmin-repair-access",
        "clinic",
        clinic.id,
        {"target_user_id": result.user_id, "actions": result.actions},
        clinic_id=clinic.id,
        request=request,
    )
    db.commit()
    return result


@app.post("/superadmin/practitioners/{practitioner_id}/create-access", response_model=SuperAdminPractitionerAccessOut)
def superadmin_create_practitioner_access(
    practitioner_id: str,
    request: Request,
    admin: User = Depends(require_superadmin),
    db: Session = Depends(get_db),
) -> SuperAdminPractitionerAccessOut:
    practitioner = db.get(Practitioner, practitioner_id)
    if not practitioner:
        raise HTTPException(status_code=404, detail="Practitioner not found")
    result = create_practitioner_access(db, practitioner)
    audit_action(
        db,
        admin,
        "superadmin-create-practitioner-access",
        "practitioner",
        practitioner.id,
        {"target_user_id": result.user_id, "target_email": result.user_email, "actions": result.actions},
        clinic_id=practitioner.clinic_id,
        request=request,
    )
    db.commit()
    return result


@app.get("/superadmin/audit-log", response_model=list[SuperAdminAuditLogOut])
def superadmin_audit_log(
    clinic_id: str | None = None,
    user_id: str | None = None,
    action: str | None = None,
    result: str | None = None,
    date_from: datetime | None = None,
    date_to: datetime | None = None,
    limit: int = Query(default=200, ge=1, le=500),
    admin: User = Depends(require_superadmin),
    db: Session = Depends(get_db),
) -> list[SuperAdminAuditLogOut]:
    query = select(AuditLog)
    filters: dict[str, str | None] = {}
    if clinic_id:
        query = query.where(AuditLog.clinic_id == clinic_id)
        filters["clinic_id"] = clinic_id
    if user_id:
        query = query.where(AuditLog.user_id == user_id)
        filters["user_id"] = user_id
    if action:
        query = query.where(AuditLog.action == action)
        filters["action"] = action
    if result:
        query = query.where(AuditLog.result == result)
        filters["result"] = result
    if date_from:
        query = query.where(AuditLog.created_at >= date_from)
        filters["date_from"] = date_from.isoformat()
    if date_to:
        query = query.where(AuditLog.created_at <= date_to)
        filters["date_to"] = date_to.isoformat()
    items = list(db.scalars(query.order_by(AuditLog.created_at.desc()).limit(limit)))
    audit_action(db, admin, "superadmin-view-audit", "audit-log", metadata={**filters, "limit": limit, "count": len(items)}, clinic_id=None)
    db.commit()
    return [superadmin_audit_out(db, item) for item in items]


@app.get("/superadmin/login-attempts", response_model=list[SuperAdminAuditLogOut])
def superadmin_login_attempts(
    clinic_id: str | None = None,
    user_id: str | None = None,
    result: str | None = None,
    date_from: datetime | None = None,
    date_to: datetime | None = None,
    limit: int = Query(default=200, ge=1, le=500),
    admin: User = Depends(require_superadmin),
    db: Session = Depends(get_db),
) -> list[SuperAdminAuditLogOut]:
    query = select(AuditLog).where(AuditLog.action.in_(["login-success", "login-failed"]))
    if clinic_id:
        query = query.where(AuditLog.clinic_id == clinic_id)
    if user_id:
        query = query.where(AuditLog.user_id == user_id)
    if result:
        query = query.where(AuditLog.result == result)
    if date_from:
        query = query.where(AuditLog.created_at >= date_from)
    if date_to:
        query = query.where(AuditLog.created_at <= date_to)
    items = list(db.scalars(query.order_by(AuditLog.created_at.desc()).limit(limit)))
    audit_action(db, admin, "superadmin-view-login-attempts", "audit-log", metadata={"count": len(items)}, clinic_id=None)
    db.commit()
    return [superadmin_audit_out(db, item) for item in items]


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


@app.patch("/clinic/settings", response_model=ClinicOut)
def update_clinic_settings(
    payload: ClinicSettingsUpdate,
    user: User = Depends(require_roles(UserRole.owner)),
    db: Session = Depends(get_db),
) -> Clinic:
    data = payload.model_dump(exclude_unset=True)
    if "name" in data and data["name"]:
        user.clinic.name = data["name"].strip()
        user.clinic.billing_name = user.clinic.billing_name or user.clinic.name
    if "email" in data and data["email"]:
        email = str(data["email"]).lower()
        existing = db.scalar(select(Clinic).where(func.lower(Clinic.email) == email, Clinic.id != user.clinic_id))
        if existing:
            raise HTTPException(status_code=409, detail="Clinic email already exists")
        user.clinic.email = email
        user.clinic.billing_email = user.clinic.billing_email or email
    if "phone" in data:
        user.clinic.phone = data["phone"]
    if "working_days" in data:
        user.clinic.working_days = normalized_working_days(data["working_days"])
    if "opening_start" in data or "opening_end" in data:
        opening_start, opening_end = validate_opening_range(
            data.get("opening_start") or user.clinic.opening_start,
            data.get("opening_end") or user.clinic.opening_end,
        )
        user.clinic.opening_start = opening_start
        user.clinic.opening_end = opening_end
    audit_action(db, user, "update-clinic-settings", "clinic", user.clinic_id, {"fields": sorted(data.keys())})
    db.commit()
    db.refresh(user.clinic)
    return user.clinic


@app.get("/clinic-data/{key}", response_model=ClinicDataBlobOut)
def get_clinic_data_blob(
    key: str,
    user: User = Depends(current_subscribed_user),
    db: Session = Depends(get_db),
) -> ClinicDataBlobOut:
    default_value = clinic_data_default(key)
    blob = db.scalar(select(ClinicDataBlob).where(ClinicDataBlob.clinic_id == user.clinic_id, ClinicDataBlob.key == key))
    if not blob:
        return ClinicDataBlobOut(key=key, data_json=default_value, updated_at=None)
    return ClinicDataBlobOut(key=blob.key, data_json=blob.data_json or default_value, updated_at=blob.updated_at)


@app.put("/clinic-data/{key}", response_model=ClinicDataBlobOut)
def put_clinic_data_blob(
    key: str,
    payload: ClinicDataBlobIn,
    request: Request,
    user: User = Depends(current_subscribed_user),
    db: Session = Depends(get_db),
) -> ClinicDataBlobOut:
    ensure_clinic_data_write_allowed(user, key)
    data_json = validate_clinic_data_payload(key, payload.data_json)
    blob = db.scalar(select(ClinicDataBlob).where(ClinicDataBlob.clinic_id == user.clinic_id, ClinicDataBlob.key == key))
    if not blob:
        blob = ClinicDataBlob(clinic_id=user.clinic_id, key=key, data_json=data_json)
        db.add(blob)
    else:
        blob.data_json = data_json
    db.flush()
    audit_action(db, user, "update-clinic-data", "clinic-data", key, {"key": key}, request=request)
    db.commit()
    db.refresh(blob)
    return ClinicDataBlobOut(key=blob.key, data_json=blob.data_json, updated_at=blob.updated_at)


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


@app.post("/demo/session", response_model=DemoAccessOut)
def start_demo_session(payload: DemoAccessCreate, request: Request, db: Session = Depends(get_db)) -> DemoAccessOut:
    now = datetime.now(UTC)
    client_id = (payload.client_id or "").strip()[:80] or secrets.token_urlsafe(24)
    item = db.scalar(select(DemoAccessSession).where(DemoAccessSession.client_id == client_id))
    max_sessions = 5
    window_start = now - timedelta(hours=24)
    if not item:
        item = DemoAccessSession(
            client_id=client_id,
            first_seen_at=now,
            last_started_at=now,
            expires_at=now + timedelta(minutes=45),
            sessions_started=1,
        )
        db.add(item)
    else:
        first_seen = item.first_seen_at.replace(tzinfo=UTC) if item.first_seen_at and item.first_seen_at.tzinfo is None else item.first_seen_at
        if not first_seen or first_seen < window_start:
            item.first_seen_at = now
            item.sessions_started = 0
        if item.sessions_started >= max_sessions:
            audit_action(db, None, "demo-access-blocked", "demo", item.id, {"client_id": client_id}, result="blocked", request=request)
            db.commit()
            raise HTTPException(status_code=429, detail="Demo limit reached for this browser today")
        item.sessions_started += 1
        item.last_started_at = now
        item.expires_at = now + timedelta(minutes=45)
    audit_action(db, None, "demo-session-start", "demo", item.id, {"client_id": client_id}, request=request)
    db.commit()
    db.refresh(item)
    return DemoAccessOut(
        client_id=item.client_id,
        expires_at=item.expires_at or (now + timedelta(minutes=45)),
        sessions_used=item.sessions_started,
        max_sessions_per_day=max_sessions,
    )


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
    existing = db.scalar(
        select(Practitioner).where(
            Practitioner.clinic_id == user.clinic_id,
            func.lower(Practitioner.name) == payload.name.strip().lower(),
        )
    )
    if existing:
        raise HTTPException(status_code=409, detail="Practitioner already exists in this clinic")
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
    if payload.name:
        existing = db.scalar(
            select(Practitioner).where(
                Practitioner.clinic_id == user.clinic_id,
                Practitioner.id != practitioner_id,
                func.lower(Practitioner.name) == payload.name.strip().lower(),
            )
        )
        if existing:
            raise HTTPException(status_code=409, detail="Practitioner already exists in this clinic")
    apply_update(practitioner, payload)
    audit_action(db, user, "update-practitioner", "practitioner", practitioner.id, {"fields": sorted(payload.model_dump(exclude_unset=True).keys())})
    db.commit()
    db.refresh(practitioner)
    return practitioner


@app.delete("/practitioners/{practitioner_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_practitioner(practitioner_id: str, user: User = Depends(require_subscribed_roles(UserRole.owner)), db: Session = Depends(get_db)) -> None:
    practitioner = clinic_item_or_404(db, Practitioner, practitioner_id, user.clinic_id)
    active_appointment_refs = db.scalar(
        select(func.count()).select_from(Appointment).where(
            Appointment.clinic_id == user.clinic_id,
            Appointment.practitioner_id == practitioner.id,
            Appointment.status != AppointmentStatus.cancelled,
        )
    ) or 0
    if active_appointment_refs:
        raise HTTPException(status_code=409, detail="Practitioner has active appointments")
    appointment_refs = db.scalar(
        select(func.count()).select_from(Appointment).where(
            Appointment.clinic_id == user.clinic_id,
            Appointment.practitioner_id == practitioner.id,
        )
    ) or 0
    if appointment_refs:
        practitioner.active = False
        audit_action(db, user, "archive-practitioner", "practitioner", practitioner.id, {"appointment_refs": appointment_refs})
        db.commit()
        return
    audit_action(db, user, "delete-practitioner", "practitioner", practitioner.id)
    db.delete(practitioner)
    db.commit()


@app.get("/attendance-records", response_model=list[AttendanceRecordOut])
def list_attendance_records(
    practitioner_id: str | None = None,
    user: User = Depends(current_subscribed_user),
    db: Session = Depends(get_db),
) -> list[AttendanceRecord]:
    query = select(AttendanceRecord).where(AttendanceRecord.clinic_id == user.clinic_id)
    if user.role == UserRole.practitioner:
        if not user.practitioner:
            return []
        query = query.where(AttendanceRecord.practitioner_id == user.practitioner.id)
    elif practitioner_id:
        clinic_item_or_404(db, Practitioner, practitioner_id, user.clinic_id)
        query = query.where(AttendanceRecord.practitioner_id == practitioner_id)
    return list(db.scalars(query.order_by(AttendanceRecord.date.desc(), AttendanceRecord.updated_at.desc()).limit(500)))


@app.post("/attendance-records/clock", response_model=AttendanceRecordOut)
def clock_attendance(
    payload: AttendanceClockIn,
    user: User = Depends(require_subscribed_roles(UserRole.owner, UserRole.staff, UserRole.practitioner)),
    db: Session = Depends(get_db),
) -> AttendanceRecord:
    practitioner = clinic_item_or_404(db, Practitioner, payload.practitioner_id, user.clinic_id)
    if user.role == UserRole.practitioner:
        if not user.practitioner or user.practitioner.id != practitioner.id:
            raise HTTPException(status_code=403, detail="Practitioners can only clock their own attendance")
    now = datetime.now(UTC)
    today = now.date().isoformat()
    record = db.scalar(
        select(AttendanceRecord).where(
            AttendanceRecord.clinic_id == user.clinic_id,
            AttendanceRecord.practitioner_id == practitioner.id,
            AttendanceRecord.date == today,
        )
    )
    if payload.action == "in":
        if record and record.clock_in_at and not record.clock_out_at:
            raise HTTPException(status_code=409, detail="Attendance is already open")
        if not record:
            record = AttendanceRecord(
                clinic_id=user.clinic_id,
                practitioner_id=practitioner.id,
                user_id=user.id,
                date=today,
            )
            db.add(record)
        record.clock_in_at = now
        record.clock_out_at = None
    else:
        if not record or not record.clock_in_at:
            raise HTTPException(status_code=409, detail="No open attendance to close")
        if record.clock_out_at:
            raise HTTPException(status_code=409, detail="Attendance is already closed")
        record.clock_out_at = now
    db.flush()
    audit_action(db, user, f"attendance-clock-{payload.action}", "attendance", record.id, {"practitioner_id": practitioner.id})
    db.commit()
    db.refresh(record)
    return record


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


@app.get("/manual-billing-movements", response_model=list[ManualBillingMovementOut])
def list_manual_billing_movements(
    user: User = Depends(current_subscribed_user),
    db: Session = Depends(get_db),
) -> list[ManualBillingMovement]:
    return list(
        db.scalars(
            select(ManualBillingMovement)
            .where(ManualBillingMovement.clinic_id == user.clinic_id)
            .order_by(ManualBillingMovement.date.desc(), ManualBillingMovement.created_at.desc())
            .limit(1000)
        )
    )


@app.post("/manual-billing-movements", response_model=ManualBillingMovementOut, status_code=status.HTTP_201_CREATED)
def create_manual_billing_movement(
    payload: ManualBillingMovementCreate,
    user: User = Depends(require_subscribed_roles(UserRole.owner, UserRole.staff)),
    db: Session = Depends(get_db),
) -> ManualBillingMovement:
    movement = ManualBillingMovement(
        clinic_id=user.clinic_id,
        user_id=user.id,
        type=payload.type,
        date=payload.date,
        amount_cents=payload.amount_cents,
        concept=payload.concept.strip(),
        created_by_name=payload.created_by_name or user.name,
        metadata_json=payload.metadata_json,
    )
    db.add(movement)
    db.flush()
    audit_action(db, user, "create-manual-billing-movement", "manual-billing-movement", movement.id, {"type": movement.type, "amount_cents": movement.amount_cents})
    db.commit()
    db.refresh(movement)
    return movement


@app.patch("/manual-billing-movements/{movement_id}", response_model=ManualBillingMovementOut)
def update_manual_billing_movement(
    movement_id: str,
    payload: ManualBillingMovementUpdate,
    user: User = Depends(require_subscribed_roles(UserRole.owner, UserRole.staff)),
    db: Session = Depends(get_db),
) -> ManualBillingMovement:
    movement = clinic_item_or_404(db, ManualBillingMovement, movement_id, user.clinic_id)
    data = payload.model_dump(exclude_unset=True)
    if "concept" in data and data["concept"]:
        data["concept"] = data["concept"].strip()
    for field, value in data.items():
        setattr(movement, field, value)
    audit_action(db, user, "update-manual-billing-movement", "manual-billing-movement", movement.id, {"fields": sorted(data.keys())})
    db.commit()
    db.refresh(movement)
    return movement


@app.delete("/manual-billing-movements/{movement_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_manual_billing_movement(
    movement_id: str,
    user: User = Depends(require_subscribed_roles(UserRole.owner)),
    db: Session = Depends(get_db),
) -> None:
    movement = clinic_item_or_404(db, ManualBillingMovement, movement_id, user.clinic_id)
    audit_action(db, user, "delete-manual-billing-movement", "manual-billing-movement", movement.id)
    db.delete(movement)
    db.commit()


@app.get("/appointments", response_model=list[AppointmentOut])
def list_appointments(user: User = Depends(current_subscribed_user), db: Session = Depends(get_db)) -> list[Appointment]:
    query = select(Appointment).where(Appointment.clinic_id == user.clinic_id).order_by(Appointment.date, Appointment.start)
    return list(db.scalars(query))


@app.post("/appointments", response_model=AppointmentOut, status_code=status.HTTP_201_CREATED)
def create_appointment(payload: AppointmentCreate, user: User = Depends(require_subscribed_roles(UserRole.owner, UserRole.staff, UserRole.practitioner)), db: Session = Depends(get_db)) -> Appointment:
    service: Service | None = None
    for model, item_id in (
        (Patient, payload.patient_id),
        (Practitioner, payload.practitioner_id),
        (Room, payload.room_id),
        (Service, payload.service_id),
    ):
        exists = db.scalar(select(model).where(model.id == item_id, model.clinic_id == user.clinic_id))
        if not exists:
            raise HTTPException(status_code=404, detail=f"{model.__name__} not found")
        if model is Service:
            service = exists

    if user.role == UserRole.practitioner:
        if not user.practitioner:
            raise HTTPException(status_code=403, detail="Practitioner user is not linked to a worker")
        if payload.practitioner_id != user.practitioner.id:
            raise HTTPException(status_code=403, detail="Practitioners can only create their own appointments")

    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    end = appointment_end_from_service(payload.start, service)
    validate_appointment_schedule(
        db,
        user.clinic_id,
        date=payload.date,
        start=payload.start,
        end=end,
        practitioner_id=payload.practitioner_id,
        room_id=payload.room_id,
        patient_id=payload.patient_id,
    )

    values = payload.model_dump()
    values["end"] = end
    appointment = Appointment(clinic_id=user.clinic_id, **values)
    db.add(appointment)
    db.flush()
    audit_action(db, user, "create-appointment", "appointment", appointment.id)
    db.commit()
    db.refresh(appointment)
    return appointment


@app.patch("/appointments/{appointment_id}", response_model=AppointmentOut)
def update_appointment(appointment_id: str, payload: AppointmentUpdate, user: User = Depends(require_subscribed_roles(UserRole.owner, UserRole.staff, UserRole.practitioner)), db: Session = Depends(get_db)) -> Appointment:
    appointment = clinic_item_or_404(db, Appointment, appointment_id, user.clinic_id)
    if user.role == UserRole.practitioner:
        if not user.practitioner:
            raise HTTPException(status_code=403, detail="Practitioner user is not linked to a worker")
        if appointment.practitioner_id != user.practitioner.id:
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

    if user.role == UserRole.practitioner and data.get("practitioner_id", appointment.practitioner_id) != user.practitioner.id:
        raise HTTPException(status_code=403, detail="Practitioners can only assign their own appointments")

    next_patient_id = data.get("patient_id", appointment.patient_id)
    next_practitioner_id = data.get("practitioner_id", appointment.practitioner_id)
    next_room_id = data.get("room_id", appointment.room_id)
    next_service_id = data.get("service_id", appointment.service_id)
    next_date = data.get("date", appointment.date)
    next_start = data.get("start", appointment.start)
    next_status = data.get("status", appointment.status)
    service = clinic_item_or_404(db, Service, next_service_id, user.clinic_id)
    data["end"] = appointment_end_from_service(next_start, service)
    if not status_is_cancelled(next_status):
        validate_appointment_schedule(
            db,
            user.clinic_id,
            date=next_date,
            start=next_start,
            end=data["end"],
            practitioner_id=next_practitioner_id,
            room_id=next_room_id,
            patient_id=next_patient_id,
            ignored_appointment_id=appointment.id,
        )

    previous_status = appointment.status
    for field, value in data.items():
        setattr(appointment, field, value)
    action = "cancel-appointment" if data.get("status") == AppointmentStatus.cancelled and previous_status != AppointmentStatus.cancelled else "update-appointment"
    audit_action(db, user, action, "appointment", appointment.id, {"fields": sorted(data.keys())})
    db.commit()
    db.refresh(appointment)
    return appointment


@app.delete("/appointments/{appointment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_appointment(appointment_id: str, user: User = Depends(require_subscribed_roles(UserRole.owner, UserRole.staff, UserRole.practitioner)), db: Session = Depends(get_db)) -> None:
    appointment = clinic_item_or_404(db, Appointment, appointment_id, user.clinic_id)
    if user.role == UserRole.practitioner:
        if not user.practitioner:
            raise HTTPException(status_code=403, detail="Practitioner user is not linked to a worker")
        if appointment.practitioner_id != user.practitioner.id:
            raise HTTPException(status_code=403, detail="Practitioners can only delete their own appointments")
    audit_action(db, user, "delete-appointment", "appointment", appointment.id)
    db.delete(appointment)
    db.commit()
