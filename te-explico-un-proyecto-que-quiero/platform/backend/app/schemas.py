from datetime import datetime

from pydantic import BaseModel, EmailStr, Field

from .models import AppointmentStatus, UserRole


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    clinic_id: str | None = None
    subscription_status: str | None = None
    checkout_url: str | None = None


class ClinicRegisterIn(BaseModel):
    clinic_name: str = Field(min_length=2, max_length=180)
    email: EmailStr
    password: str = Field(min_length=4)
    phone: str | None = None
    owner_name: str = Field(min_length=2, max_length=160)
    plan: str = "trial"
    billing_name: str | None = None
    billing_email: EmailStr | None = None
    tax_id: str | None = None
    billing_address: str | None = None


class LoginIn(BaseModel):
    email: EmailStr
    password: str
    clinic_id: str | None = None
    clinic_email: EmailStr | None = None


class ClinicOut(BaseModel):
    id: str
    name: str
    email: EmailStr
    phone: str | None = None
    billing_name: str | None = None
    billing_email: EmailStr | None = None
    tax_id: str | None = None
    billing_address: str | None = None
    invoice_prefix: str = "KL"
    invoice_logo_url: str | None = None
    subscription_plan: str = "trial"
    subscription_status: str = "trialing"
    current_period_end: datetime | None = None
    trial_ends_at: datetime | None = None

    model_config = {"from_attributes": True}


class UserOut(BaseModel):
    id: str
    clinic_id: str
    name: str
    email: EmailStr
    role: UserRole
    active: bool

    model_config = {"from_attributes": True}


class MeOut(BaseModel):
    user: UserOut
    clinic: ClinicOut


class UserCreate(BaseModel):
    name: str = Field(min_length=1, max_length=160)
    email: EmailStr
    password: str = Field(min_length=4)
    role: UserRole = UserRole.staff
    active: bool = True


class UserUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=160)
    email: EmailStr | None = None
    password: str | None = Field(default=None, min_length=4)
    role: UserRole | None = None
    active: bool | None = None


class AuditLogOut(BaseModel):
    id: str
    clinic_id: str
    user_id: str | None = None
    action: str
    resource_type: str
    resource_id: str | None = None
    metadata_json: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class PlanOut(BaseModel):
    id: str
    name: str
    price_eur: int
    interval: str = "month"
    price_id: str | None = None
    checkout_enabled: bool = False
    recommended: bool = False


class BillingStatusOut(BaseModel):
    clinic_id: str
    plan: str
    status: str
    stripe_configured: bool
    stripe_customer_id: str | None = None
    stripe_subscription_id: str | None = None
    current_period_end: datetime | None = None
    trial_ends_at: datetime | None = None
    billing_name: str | None = None
    billing_email: EmailStr | None = None
    tax_id: str | None = None
    billing_address: str | None = None
    invoice_prefix: str = "KL"
    invoice_logo_url: str | None = None


class BillingProfileUpdate(BaseModel):
    billing_name: str | None = None
    billing_email: EmailStr | None = None
    tax_id: str | None = None
    billing_address: str | None = None
    invoice_prefix: str | None = Field(default=None, max_length=20)
    invoice_logo_url: str | None = None


class CheckoutSessionCreate(BaseModel):
    plan: str = "kliniaplan"


class BillingSessionOut(BaseModel):
    url: str
    provider: str = "stripe"
    demo_mode: bool = False


class PatientBase(BaseModel):
    name: str = Field(min_length=1, max_length=180)
    phone: str | None = None
    email: EmailStr | None = None
    status: str = "Activo"
    alert: str | None = None


class PatientCreate(PatientBase):
    pass


class PatientUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=180)
    phone: str | None = None
    email: EmailStr | None = None
    status: str | None = None
    alert: str | None = None


class PatientOut(PatientBase):
    id: str

    model_config = {"from_attributes": True}


class PractitionerBase(BaseModel):
    name: str = Field(min_length=1, max_length=160)
    specialty: str | None = None
    color: str = "#168776"
    commission_rate: float = Field(default=0, ge=0)
    monthly_target_cents: int = 0
    availability_start: str = "08:00"
    availability_end: str = "14:00"
    availability_start_2: str | None = None
    availability_end_2: str | None = None
    active: bool = True


class PractitionerCreate(PractitionerBase):
    pass


class PractitionerUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=160)
    specialty: str | None = None
    color: str | None = None
    commission_rate: float | None = Field(default=None, ge=0)
    monthly_target_cents: int | None = None
    availability_start: str | None = None
    availability_end: str | None = None
    availability_start_2: str | None = None
    availability_end_2: str | None = None
    active: bool | None = None


class PractitionerOut(PractitionerBase):
    id: str

    model_config = {"from_attributes": True}


class RoomBase(BaseModel):
    name: str
    type: str | None = None
    active: bool = True


class RoomCreate(RoomBase):
    pass


class RoomUpdate(BaseModel):
    name: str | None = None
    type: str | None = None
    active: bool | None = None


class RoomOut(RoomBase):
    id: str

    model_config = {"from_attributes": True}


class ServiceBase(BaseModel):
    name: str
    description: str | None = None
    duration_minutes: int = 60
    price_cents: int = 0
    type: str = "individual"
    capacity: int = 1
    monthly_price_cents: int = 0
    drop_in_price_cents: int = 0
    commission_per_patient: int = 0
    active: bool = True


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    duration_minutes: int | None = None
    price_cents: int | None = None
    type: str | None = None
    capacity: int | None = None
    monthly_price_cents: int | None = None
    drop_in_price_cents: int | None = None
    commission_per_patient: int | None = None
    active: bool | None = None


class ServiceOut(ServiceBase):
    id: str

    model_config = {"from_attributes": True}


class AppointmentBase(BaseModel):
    patient_id: str
    practitioner_id: str
    room_id: str
    service_id: str
    date: str
    start: str
    end: str
    status: AppointmentStatus = AppointmentStatus.confirmed
    internal_notes: str | None = None


class AppointmentCreate(AppointmentBase):
    pass


class AppointmentUpdate(BaseModel):
    patient_id: str | None = None
    practitioner_id: str | None = None
    room_id: str | None = None
    service_id: str | None = None
    date: str | None = None
    start: str | None = None
    end: str | None = None
    status: AppointmentStatus | None = None
    internal_notes: str | None = None


class AppointmentOut(AppointmentBase):
    id: str

    model_config = {"from_attributes": True}
