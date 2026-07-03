# backend/app/core/config/base.py
from typing import Optional, Union, Any
from pydantic import Field, field_validator, ValidationInfo
from pydantic_settings import BaseSettings, SettingsConfigDict


class NexaBaseSettings(BaseSettings):
    """Base Configuration class loading variables from environment configs."""

    # ── SYSTEM CORE SETTINGS ──────────────────────────────────────
    ENVIRONMENT: str = Field(default="development")
    DEBUG: bool = Field(default=True)
    SECRET_KEY: str = Field(default="replace-with-a-secure-random-64-character-hex-string")
    API_V1_STR: str = Field(default="/api/v1")
    PROJECT_NAME: str = Field(default="NEXA AI Career Guidance Platform")

    # ── DATABASES & VECTOR STACKS ─────────────────────────────────
    MONGO_URL: str = Field(default="mongodb://localhost:27017/nexa_db")
    REDIS_URL: str = Field(default="redis://localhost:6379/0")
    QDRANT_URL: str = Field(default="http://localhost:6333")
    QDRANT_API_KEY: Optional[str] = Field(default=None)

    # ── CRYPTOGRAPHY & SESSIONS (JWT) ──────────────────────────────
    ACCESS_TOKEN_EXPIRE_SECONDS: int = Field(default=900)
    REFRESH_TOKEN_EXPIRE_SECONDS: int = Field(default=604800)
    JWT_PRIVATE_KEY_PATH: Optional[str] = Field(default=None)
    JWT_PUBLIC_KEY_PATH: Optional[str] = Field(default=None)

    # ── AI ENGINE INTEGRATIONS ────────────────────────────────────
    OPENAI_API_KEY: Optional[str] = Field(default=None)
    GEMINI_API_KEY: Optional[str] = Field(default=None)
    ANTHROPIC_API_KEY: Optional[str] = Field(default=None)
    COHERE_API_KEY: Optional[str] = Field(default=None)

    # ── THIRD-PARTY INTEGRATIONS ──────────────────────────────────
    SMTP_HOST: Optional[str] = Field(default=None)
    SMTP_PORT: Optional[int] = Field(default=None)
    SMTP_USER: Optional[str] = Field(default=None)
    SMTP_PASSWORD: Optional[str] = Field(default=None)
    SMTP_FROM_EMAIL: Optional[str] = Field(default=None)
    SMTP_FROM_NAME: Optional[str] = Field(default="NEXA AI Mentor")

    # OAuth Providers
    GOOGLE_CLIENT_ID: Optional[str] = Field(default=None)
    GOOGLE_CLIENT_SECRET: Optional[str] = Field(default=None)
    GITHUB_CLIENT_ID: Optional[str] = Field(default=None)
    GITHUB_CLIENT_SECRET: Optional[str] = Field(default=None)

    # Storage Settings
    STORAGE_PROVIDER: str = Field(default="local")
    STORAGE_LOCAL_DIR: str = Field(default="backend/uploads")
    S3_BUCKET_NAME: Optional[str] = Field(default=None)

    # ── CELERY TASK WORKERS ───────────────────────────────────────
    CELERY_BROKER_URL: str = Field(default="redis://localhost:6379/0")
    CELERY_RESULT_BACKEND: str = Field(default="redis://localhost:6379/0")

    # ── LOGGING ───────────────────────────────────────────────────
    LOG_LEVEL: str = Field(default="INFO")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )
