# backend/app/core/config/staging.py
from app.core.config.base import NexaBaseSettings
from pydantic_settings import SettingsConfigDict


class NexaStagingSettings(NexaBaseSettings):
    """Staging configuration overrides."""
    ENVIRONMENT: str = "staging"
    DEBUG: bool = False
    LOG_LEVEL: str = "INFO"

    model_config = SettingsConfigDict(
        env_file=".env.staging",
        env_file_encoding="utf-8",
        extra="ignore"
    )
