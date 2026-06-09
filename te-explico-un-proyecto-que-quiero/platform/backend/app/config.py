from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Klinia"
    app_env: str = "local"
    database_url: str = "sqlite:///./klinia_local.db"
    jwt_secret: str = Field(default="dev-change-this-before-production")
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 480
    cors_origins: str = "http://localhost:8001,http://127.0.0.1:8001,http://127.0.0.1:8080"
    frontend_url: str = "http://127.0.0.1:8080/"
    frontend_dir: str | None = None
    stripe_secret_key: str | None = None
    stripe_webhook_secret: str | None = None
    stripe_price_kliniaplan_monthly: str | None = None
    stripe_price_kliniaplan_annual: str | None = None
    stripe_price_kliniaplan: str | None = None
    stripe_price_starter: str | None = None
    stripe_price_pro: str | None = None
    stripe_price_business: str | None = None
    superadmin_email: str | None = None
    superadmin_password: str | None = None
    superadmin_name: str = "Klinia Superadmin"
    google_client_id: str | None = None
    google_client_secret: str | None = None
    google_redirect_uri: str | None = None

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def stripe_enabled(self) -> bool:
        return bool(self.stripe_secret_key)

    @property
    def google_enabled(self) -> bool:
        return bool(self.google_client_id)


@lru_cache
def get_settings() -> Settings:
    return Settings()
