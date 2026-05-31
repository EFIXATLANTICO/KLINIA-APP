import enum
import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, Float, ForeignKey, Integer, String, Text, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .db import Base


class UserRole(str, enum.Enum):
    superadmin = "superadmin"
    owner = "owner"
    staff = "staff"
    practitioner = "practitioner"
    support = "support"


class AppointmentStatus(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    completed = "completed"
    cancelled = "cancelled"
    no_show = "no_show"


def uuid_str() -> str:
    return str(uuid.uuid4())


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Clinic(TimestampMixin, Base):
    __tablename__ = "clinics"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    name: Mapped[str] = mapped_column(String(180), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    phone: Mapped[str | None] = mapped_column(String(40))
    timezone: Mapped[str] = mapped_column(String(80), default="Europe/Madrid")
    billing_name: Mapped[str | None] = mapped_column(String(180))
    billing_email: Mapped[str | None] = mapped_column(String(255))
    tax_id: Mapped[str | None] = mapped_column(String(80))
    billing_address: Mapped[str | None] = mapped_column(Text)
    invoice_prefix: Mapped[str] = mapped_column(String(20), default="KL")
    invoice_logo_url: Mapped[str | None] = mapped_column(Text)
    subscription_plan: Mapped[str] = mapped_column(String(40), default="trial")
    subscription_status: Mapped[str] = mapped_column(String(40), default="trialing")
    stripe_customer_id: Mapped[str | None] = mapped_column(String(120), index=True)
    stripe_subscription_id: Mapped[str | None] = mapped_column(String(120), index=True)
    stripe_price_id: Mapped[str | None] = mapped_column(String(120))
    trial_ends_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    current_period_end: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    working_days: Mapped[str] = mapped_column(String(40), default="mon,tue,wed,thu,fri")
    opening_start: Mapped[str] = mapped_column(String(5), default="09:00")
    opening_end: Mapped[str] = mapped_column(String(5), default="20:00")

    users: Mapped[list["User"]] = relationship(back_populates="clinic")


class User(TimestampMixin, Base):
    __tablename__ = "users"
    __table_args__ = (UniqueConstraint("clinic_id", "email", name="uq_users_clinic_email"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    clinic_id: Mapped[str | None] = mapped_column(ForeignKey("clinics.id", ondelete="CASCADE"), index=True, nullable=True)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), nullable=False)
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    force_password_change: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false")

    clinic: Mapped[Clinic | None] = relationship(back_populates="users")
    practitioner: Mapped["Practitioner | None"] = relationship(back_populates="user")

    @property
    def practitioner_id(self) -> str | None:
        return self.practitioner.id if self.practitioner else None


class Practitioner(TimestampMixin, Base):
    __tablename__ = "practitioners"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    clinic_id: Mapped[str] = mapped_column(ForeignKey("clinics.id", ondelete="CASCADE"), index=True)
    user_id: Mapped[str | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"))
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    specialty: Mapped[str | None] = mapped_column(String(180))
    color: Mapped[str] = mapped_column(String(20), default="#168776")
    commission_rate: Mapped[float] = mapped_column(Float, default=0)
    monthly_target_cents: Mapped[int] = mapped_column(Integer, default=0)
    availability_start: Mapped[str] = mapped_column(String(5), default="08:00")
    availability_end: Mapped[str] = mapped_column(String(5), default="14:00")
    availability_start_2: Mapped[str | None] = mapped_column(String(5))
    availability_end_2: Mapped[str | None] = mapped_column(String(5))
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    metadata_json: Mapped[str | None] = mapped_column(Text)

    user: Mapped[User | None] = relationship(back_populates="practitioner")


class Patient(TimestampMixin, Base):
    __tablename__ = "patients"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    clinic_id: Mapped[str] = mapped_column(ForeignKey("clinics.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(180), nullable=False)
    phone: Mapped[str | None] = mapped_column(String(40))
    email: Mapped[str | None] = mapped_column(String(255))
    status: Mapped[str] = mapped_column(String(60), default="Activo")
    alert: Mapped[str | None] = mapped_column(Text)
    metadata_json: Mapped[str | None] = mapped_column(Text)


class Room(TimestampMixin, Base):
    __tablename__ = "rooms"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    clinic_id: Mapped[str] = mapped_column(ForeignKey("clinics.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    type: Mapped[str | None] = mapped_column(String(120))
    active: Mapped[bool] = mapped_column(Boolean, default=True)


class Service(TimestampMixin, Base):
    __tablename__ = "services"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    clinic_id: Mapped[str] = mapped_column(ForeignKey("clinics.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    duration_minutes: Mapped[int] = mapped_column(Integer, default=60)
    price_cents: Mapped[int] = mapped_column(Integer, default=0)
    type: Mapped[str] = mapped_column(String(30), default="individual")
    capacity: Mapped[int] = mapped_column(Integer, default=1)
    monthly_price_cents: Mapped[int] = mapped_column(Integer, default=0)
    drop_in_price_cents: Mapped[int] = mapped_column(Integer, default=0)
    commission_per_patient: Mapped[int] = mapped_column(Integer, default=0)
    active: Mapped[bool] = mapped_column(Boolean, default=True)


class Appointment(TimestampMixin, Base):
    __tablename__ = "appointments"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    clinic_id: Mapped[str] = mapped_column(ForeignKey("clinics.id", ondelete="CASCADE"), index=True)
    patient_id: Mapped[str] = mapped_column(ForeignKey("patients.id"))
    practitioner_id: Mapped[str] = mapped_column(ForeignKey("practitioners.id"))
    room_id: Mapped[str] = mapped_column(ForeignKey("rooms.id"))
    service_id: Mapped[str] = mapped_column(ForeignKey("services.id"))
    date: Mapped[str] = mapped_column(String(10), index=True)
    start: Mapped[str] = mapped_column(String(5), index=True)
    end: Mapped[str] = mapped_column(String(5))
    status: Mapped[AppointmentStatus] = mapped_column(Enum(AppointmentStatus), default=AppointmentStatus.confirmed)
    internal_notes: Mapped[str | None] = mapped_column(Text)
    metadata_json: Mapped[str | None] = mapped_column(Text)


class ManualBillingMovement(TimestampMixin, Base):
    __tablename__ = "manual_billing_movements"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    clinic_id: Mapped[str] = mapped_column(ForeignKey("clinics.id", ondelete="CASCADE"), index=True)
    user_id: Mapped[str | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), index=True)
    type: Mapped[str] = mapped_column(String(20), nullable=False)
    date: Mapped[str] = mapped_column(String(10), index=True, nullable=False)
    amount_cents: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    concept: Mapped[str] = mapped_column(String(240), nullable=False)
    created_by_name: Mapped[str | None] = mapped_column(String(160))
    metadata_json: Mapped[str | None] = mapped_column(Text)


class AttendanceRecord(TimestampMixin, Base):
    __tablename__ = "attendance_records"
    __table_args__ = (UniqueConstraint("clinic_id", "practitioner_id", "date", name="uq_attendance_practitioner_date"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    clinic_id: Mapped[str] = mapped_column(ForeignKey("clinics.id", ondelete="CASCADE"), index=True)
    practitioner_id: Mapped[str] = mapped_column(ForeignKey("practitioners.id", ondelete="CASCADE"), index=True)
    user_id: Mapped[str | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), index=True)
    date: Mapped[str] = mapped_column(String(10), index=True, nullable=False)
    clock_in_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    clock_out_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    metadata_json: Mapped[str | None] = mapped_column(Text)


class DemoAccessSession(TimestampMixin, Base):
    __tablename__ = "demo_access_sessions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    client_id: Mapped[str] = mapped_column(String(80), unique=True, index=True, nullable=False)
    first_seen_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    last_started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    sessions_started: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    clinic_id: Mapped[str | None] = mapped_column(ForeignKey("clinics.id", ondelete="CASCADE"), index=True, nullable=True)
    user_id: Mapped[str | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), index=True)
    action: Mapped[str] = mapped_column(String(120), nullable=False)
    resource_type: Mapped[str] = mapped_column(String(80), nullable=False)
    resource_id: Mapped[str | None] = mapped_column(String(120))
    result: Mapped[str] = mapped_column(String(30), default="success", server_default="success", nullable=False)
    origin: Mapped[str | None] = mapped_column(String(80))
    ip_address: Mapped[str | None] = mapped_column(String(80))
    user_agent: Mapped[str | None] = mapped_column(Text)
    metadata_json: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), index=True)
