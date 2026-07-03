# backend/app/core/config/production.py
from app.core.config.base import NexaBaseSettings
from pydantic_settings import SettingsConfigDict


class NexaProductionSettings(NexaBaseSettings):
    """Production configuration overrides."""
    ENVIRONMENT: str = "production"
    DEBUG: bool = False
    LOG_LEVEL: str = "WARNING"

    model_config = SettingsConfigDict(
        env_file=".env.production",
        env_file_encoding="utf-8",
        extra="ignore"
    )
