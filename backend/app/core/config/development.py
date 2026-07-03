# backend/app/core/config/development.py
from app.core.config.base import NexaBaseSettings
from pydantic_settings import SettingsConfigDict


class NexaDevelopmentSettings(NexaBaseSettings):
    """Development configuration overrides."""
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    LOG_LEVEL: str = "DEBUG"

    model_config = SettingsConfigDict(
        env_file=".env.development",
        env_file_encoding="utf-8",
        extra="ignore"
    )
