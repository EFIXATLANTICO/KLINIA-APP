from collections.abc import Generator

from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from .config import get_settings


settings = get_settings()
connect_args = {"check_same_thread": False} if settings.database_url.startswith("sqlite") else {}
engine = create_engine(settings.database_url, future=True, pool_pre_ping=True, connect_args=connect_args)
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
    inspector = inspect(engine)
    if "clinics" not in inspector.get_table_names():
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
    with engine.begin() as connection:
        for name, ddl in clinic_columns.items():
            if name not in existing:
                connection.execute(text(f"ALTER TABLE clinics ADD COLUMN {name} {ddl}"))
