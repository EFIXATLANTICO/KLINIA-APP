"""Preserve the Google deletion target after physical appointment deletion.

Revision ID: 20260909_1200
Revises: 20260907_1200
"""
from alembic import op
import sqlalchemy as sa

revision = "20260909_1200"
down_revision = "20260907_1200"
branch_labels = None
depends_on = None

TABLE = "appointment_google_sync"
NAMING = {"fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s"}
FK_NAME = "fk_appointment_google_sync_appointment_id_appointments"


def _replace_fk(*, nullable: bool, ondelete: str) -> None:
    bind = op.get_bind()
    matches = [
        fk for fk in sa.inspect(bind).get_foreign_keys(TABLE)
        if fk["constrained_columns"] == ["appointment_id"] and fk["referred_table"] == "appointments"
    ]
    if len(matches) != 1:
        raise RuntimeError("Unexpected appointment sync foreign key; refusing migration")
    if bind.dialect.name == "postgresql":
        op.execute("SET LOCAL lock_timeout = '5s'")
        op.execute("SET LOCAL statement_timeout = '30s'")
    with op.batch_alter_table(TABLE, naming_convention=NAMING) as batch:
        batch.drop_constraint(matches[0]["name"] or FK_NAME, type_="foreignkey")
        batch.alter_column("appointment_id", existing_type=sa.String(36), nullable=nullable)
        batch.create_foreign_key(FK_NAME, "appointments", ["appointment_id"], ["id"], ondelete=ondelete)


def upgrade() -> None:
    _replace_fk(nullable=True, ondelete="SET NULL")


def downgrade() -> None:
    # Never discard retained deletion targets to make a downgrade succeed.
    if op.get_bind().scalar(sa.text("SELECT count(*) FROM appointment_google_sync WHERE appointment_id IS NULL")):
        raise RuntimeError("Retained Google deletion targets exist; downgrade refused")
    _replace_fk(nullable=False, ondelete="CASCADE")
