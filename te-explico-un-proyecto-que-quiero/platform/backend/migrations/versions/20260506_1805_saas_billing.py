"""add saas billing fields to clinics

Revision ID: 20260506_1805
Revises:
Create Date: 2026-05-06
"""

from alembic import op
import sqlalchemy as sa


revision = "20260506_1805"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("clinics", sa.Column("billing_name", sa.String(length=180), nullable=True))
    op.add_column("clinics", sa.Column("billing_email", sa.String(length=255), nullable=True))
    op.add_column("clinics", sa.Column("tax_id", sa.String(length=80), nullable=True))
    op.add_column("clinics", sa.Column("billing_address", sa.Text(), nullable=True))
    op.add_column("clinics", sa.Column("invoice_prefix", sa.String(length=20), nullable=True, server_default="KL"))
    op.add_column("clinics", sa.Column("invoice_logo_url", sa.Text(), nullable=True))
    op.add_column("clinics", sa.Column("subscription_plan", sa.String(length=40), nullable=True, server_default="trial"))
    op.add_column("clinics", sa.Column("subscription_status", sa.String(length=40), nullable=True, server_default="trialing"))
    op.add_column("clinics", sa.Column("stripe_customer_id", sa.String(length=120), nullable=True))
    op.add_column("clinics", sa.Column("stripe_subscription_id", sa.String(length=120), nullable=True))
    op.add_column("clinics", sa.Column("stripe_price_id", sa.String(length=120), nullable=True))
    op.add_column("clinics", sa.Column("trial_ends_at", sa.DateTime(timezone=True), nullable=True))
    op.add_column("clinics", sa.Column("current_period_end", sa.DateTime(timezone=True), nullable=True))
    op.create_index("ix_clinics_stripe_customer_id", "clinics", ["stripe_customer_id"])
    op.create_index("ix_clinics_stripe_subscription_id", "clinics", ["stripe_subscription_id"])


def downgrade() -> None:
    op.drop_index("ix_clinics_stripe_subscription_id", table_name="clinics")
    op.drop_index("ix_clinics_stripe_customer_id", table_name="clinics")
    op.drop_column("clinics", "current_period_end")
    op.drop_column("clinics", "trial_ends_at")
    op.drop_column("clinics", "stripe_price_id")
    op.drop_column("clinics", "stripe_subscription_id")
    op.drop_column("clinics", "stripe_customer_id")
    op.drop_column("clinics", "subscription_status")
    op.drop_column("clinics", "subscription_plan")
    op.drop_column("clinics", "invoice_logo_url")
    op.drop_column("clinics", "invoice_prefix")
    op.drop_column("clinics", "billing_address")
    op.drop_column("clinics", "tax_id")
    op.drop_column("clinics", "billing_email")
    op.drop_column("clinics", "billing_name")
