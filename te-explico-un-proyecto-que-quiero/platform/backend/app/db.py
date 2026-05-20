from collections.abc import Generator

from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from .config import get_settings


settings = get_settings()
if settings.database_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
else:
    connect_args = {"connect_timeout": 10}
engine = create_engine(settings.database_url, future=True, pool_pre_ping=True, pool_timeout=10, connect_args=connect_args)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)


class Base(DeclarativeBase):
    pass


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def ensure_runtime_schema() -> None:
    """Small compatibility layer for local DBs created before migrations exist."""
    with engine.begin() as connection:
        if engine.dialect.name == "postgresql":
            connection.execute(text("SET LOCAL lock_timeout = '5s'"))
            connection.execute(text("SET LOCAL statement_timeout = '10s'"))
        inspector = inspect(connection)
        table_names = inspector.get_table_names()
        if "clinics" not in table_names:
            return

        existing = {column["name"] for column in inspector.get_columns("clinics")}
        clinic_columns = {
            "billing_name": "VARCHAR(180)",
            "billing_email": "VARCHAR(255)",
            "tax_id": "VARCHAR(80)",
            "billing_address": "TEXT",
            "invoice_prefix": "VARCHAR(20) DEFAULT 'KL'",
            "invoice_logo_url": "TEXT",
            "subscription_plan": "VARCHAR(40) DEFAULT 'trial'",
            "subscription_status": "VARCHAR(40) DEFAULT 'trialing'",
            "stripe_customer_id": "VARCHAR(120)",
            "stripe_subscription_id": "VARCHAR(120)",
            "stripe_price_id": "VARCHAR(120)",
            "trial_ends_at": "TIMESTAMP",
            "current_period_end": "TIMESTAMP",
        }
        if engine.dialect.name == "postgresql":
            connection.execute(text("ALTER TYPE userrole ADD VALUE IF NOT EXISTS 'superadmin'"))
            connection.execute(text("ALTER TABLE users ALTER COLUMN clinic_id DROP NOT NULL"))
            if "audit_logs" in table_names:
                connection.execute(text("ALTER TABLE audit_logs ALTER COLUMN clinic_id DROP NOT NULL"))
        for name, ddl in clinic_columns.items():
            if name not in existing:
                connection.execute(text(f"ALTER TABLE clinics ADD COLUMN {name} {ddl}"))

        if "audit_logs" in table_names:
            audit_existing = {column["name"] for column in inspector.get_columns("audit_logs")}
            audit_columns = {
                "result": "VARCHAR(30) DEFAULT 'success'",
                "origin": "VARCHAR(80)",
                "ip_address": "VARCHAR(80)",
                "user_agent": "TEXT",
            }
            for name, ddl in audit_columns.items():
                if name not in audit_existing:
                    connection.execute(text(f"ALTER TABLE audit_logs ADD COLUMN {name} {ddl}"))
