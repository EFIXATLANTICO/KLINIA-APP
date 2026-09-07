"""add Google Calendar connections and online booking

Revision ID: 20260907_1200
Revises: 20260506_1805
Create Date: 2026-09-07
"""

from alembic import op
import sqlalchemy as sa


revision = "20260907_1200"
down_revision = "20260506_1805"
branch_labels = None
depends_on = None


def _timestamps() -> list[sa.Column]:
    return [
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    ]


def upgrade() -> None:
    op.create_table(
        "google_calendar_connections",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("clinic_id", sa.String(length=36), nullable=False),
        sa.Column("user_id", sa.String(length=36), nullable=True),
        sa.Column("account_email", sa.String(length=255), nullable=True),
        sa.Column("calendar_id", sa.String(length=1024), server_default="primary", nullable=False),
        sa.Column("access_token_encrypted", sa.Text(), nullable=True),
        sa.Column("refresh_token_encrypted", sa.Text(), nullable=True),
        sa.Column("token_expires_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("granted_scopes", sa.Text(), server_default="", nullable=False),
        sa.Column("enabled", sa.Boolean(), server_default=sa.true(), nullable=False),
        sa.Column("block_busy_times", sa.Boolean(), server_default=sa.true(), nullable=False),
        sa.Column("push_klinia_appointments", sa.Boolean(), server_default=sa.false(), nullable=False),
        sa.Column("import_busy_as_unavailable", sa.Boolean(), server_default=sa.true(), nullable=False),
        sa.Column("auto_sync", sa.Boolean(), server_default=sa.true(), nullable=False),
        sa.Column("last_synced_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("last_error", sa.Text(), nullable=True),
        *_timestamps(),
        sa.ForeignKeyConstraint(["clinic_id"], ["clinics.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("clinic_id", name="uq_google_calendar_connection_clinic"),
    )
    op.create_index("ix_google_calendar_connections_clinic_id", "google_calendar_connections", ["clinic_id"])
    op.create_index("ix_google_calendar_connections_user_id", "google_calendar_connections", ["user_id"])

    op.create_table(
        "google_calendar_oauth_states",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("nonce_hash", sa.String(length=64), nullable=False),
        sa.Column("clinic_id", sa.String(length=36), nullable=False),
        sa.Column("user_id", sa.String(length=36), nullable=False),
        sa.Column("include_write", sa.Boolean(), server_default=sa.false(), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("used_at", sa.DateTime(timezone=True), nullable=True),
        *_timestamps(),
        sa.ForeignKeyConstraint(["clinic_id"], ["clinics.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("nonce_hash"),
    )
    op.create_index("ix_google_calendar_oauth_states_nonce_hash", "google_calendar_oauth_states", ["nonce_hash"])
    op.create_index("ix_google_calendar_oauth_states_clinic_id", "google_calendar_oauth_states", ["clinic_id"])
    op.create_index("ix_google_calendar_oauth_states_user_id", "google_calendar_oauth_states", ["user_id"])

    op.create_table(
        "online_booking_settings",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("clinic_id", sa.String(length=36), nullable=False),
        sa.Column("enabled", sa.Boolean(), server_default=sa.false(), nullable=False),
        sa.Column("slug", sa.String(length=180), nullable=False),
        sa.Column("min_notice_minutes", sa.Integer(), server_default="120", nullable=False),
        sa.Column("max_days_ahead", sa.Integer(), server_default="90", nullable=False),
        sa.Column("min_cancellation_minutes", sa.Integer(), server_default="1440", nullable=False),
        sa.Column("buffer_minutes", sa.Integer(), server_default="0", nullable=False),
        sa.Column("automatic_confirmation", sa.Boolean(), server_default=sa.true(), nullable=False),
        sa.Column("allow_professional_selection", sa.Boolean(), server_default=sa.true(), nullable=False),
        sa.Column("show_price", sa.Boolean(), server_default=sa.false(), nullable=False),
        sa.Column("show_duration", sa.Boolean(), server_default=sa.true(), nullable=False),
        *_timestamps(),
        sa.ForeignKeyConstraint(["clinic_id"], ["clinics.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("clinic_id", name="uq_online_booking_setting_clinic"),
        sa.UniqueConstraint("slug", name="uq_online_booking_setting_slug"),
    )
    op.create_index("ix_online_booking_settings_clinic_id", "online_booking_settings", ["clinic_id"])
    op.create_index("ix_online_booking_settings_slug", "online_booking_settings", ["slug"])

    op.create_table(
        "online_booking_services",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("clinic_id", sa.String(length=36), nullable=False),
        sa.Column("settings_id", sa.String(length=36), nullable=False),
        sa.Column("service_id", sa.String(length=36), nullable=False),
        *_timestamps(),
        sa.ForeignKeyConstraint(["clinic_id"], ["clinics.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["settings_id"], ["online_booking_settings.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["service_id"], ["services.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("clinic_id", "service_id", name="uq_online_booking_service_clinic_service"),
    )
    op.create_index("ix_online_booking_services_clinic_id", "online_booking_services", ["clinic_id"])
    op.create_index("ix_online_booking_services_settings_id", "online_booking_services", ["settings_id"])
    op.create_index("ix_online_booking_services_service_id", "online_booking_services", ["service_id"])

    op.create_table(
        "online_booking_practitioners",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("clinic_id", sa.String(length=36), nullable=False),
        sa.Column("settings_id", sa.String(length=36), nullable=False),
        sa.Column("practitioner_id", sa.String(length=36), nullable=False),
        *_timestamps(),
        sa.ForeignKeyConstraint(["clinic_id"], ["clinics.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["settings_id"], ["online_booking_settings.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["practitioner_id"], ["practitioners.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("clinic_id", "practitioner_id", name="uq_online_booking_practitioner_clinic_practitioner"),
    )
    op.create_index("ix_online_booking_practitioners_clinic_id", "online_booking_practitioners", ["clinic_id"])
    op.create_index("ix_online_booking_practitioners_settings_id", "online_booking_practitioners", ["settings_id"])
    op.create_index("ix_online_booking_practitioners_practitioner_id", "online_booking_practitioners", ["practitioner_id"])

    op.create_table(
        "online_bookings",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("clinic_id", sa.String(length=36), nullable=False),
        sa.Column("appointment_id", sa.String(length=36), nullable=False),
        sa.Column("patient_id", sa.String(length=36), nullable=False),
        sa.Column("booking_code", sa.String(length=40), nullable=False),
        sa.Column("idempotency_key", sa.String(length=120), nullable=True),
        sa.Column("source", sa.String(length=40), server_default="online_booking", nullable=False),
        sa.Column("status", sa.String(length=40), server_default="confirmed", nullable=False),
        *_timestamps(),
        sa.ForeignKeyConstraint(["appointment_id"], ["appointments.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["clinic_id"], ["clinics.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["patient_id"], ["patients.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("appointment_id", name="uq_online_booking_appointment"),
        sa.UniqueConstraint("booking_code"),
        sa.UniqueConstraint("clinic_id", "idempotency_key", name="uq_online_booking_clinic_idempotency"),
    )
    op.create_index("ix_online_bookings_clinic_id", "online_bookings", ["clinic_id"])
    op.create_index("ix_online_bookings_appointment_id", "online_bookings", ["appointment_id"])
    op.create_index("ix_online_bookings_patient_id", "online_bookings", ["patient_id"])
    op.create_index("ix_online_bookings_booking_code", "online_bookings", ["booking_code"])
    op.create_index("ix_online_bookings_idempotency_key", "online_bookings", ["idempotency_key"])

    op.create_table(
        "appointment_google_sync",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("clinic_id", sa.String(length=36), nullable=False),
        sa.Column("appointment_id", sa.String(length=36), nullable=False),
        sa.Column("google_event_id", sa.String(length=1024), nullable=True),
        sa.Column("calendar_id", sa.String(length=1024), nullable=True),
        sa.Column("sync_status", sa.String(length=30), server_default="pending", nullable=False),
        sa.Column("last_synced_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("sync_error", sa.Text(), nullable=True),
        sa.Column("booking_source", sa.String(length=40), nullable=True),
        *_timestamps(),
        sa.ForeignKeyConstraint(["appointment_id"], ["appointments.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["clinic_id"], ["clinics.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("appointment_id", name="uq_appointment_google_sync_appointment"),
    )
    op.create_index("ix_appointment_google_sync_clinic_id", "appointment_google_sync", ["clinic_id"])
    op.create_index("ix_appointment_google_sync_appointment_id", "appointment_google_sync", ["appointment_id"])
    op.create_index("ix_appointment_google_sync_sync_status", "appointment_google_sync", ["sync_status"])


def downgrade() -> None:
    op.drop_table("appointment_google_sync")
    op.drop_table("online_bookings")
    op.drop_table("online_booking_practitioners")
    op.drop_table("online_booking_services")
    op.drop_table("online_booking_settings")
    op.drop_table("google_calendar_oauth_states")
    op.drop_table("google_calendar_connections")
