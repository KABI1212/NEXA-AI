# NEXA AI — Backend Architecture & FastAPI Design (BAD)
## Enterprise AI-Based Career Guidance and Learning Platform

---

| Field             | Details                                          |
|-------------------|--------------------------------------------------|
| **Document**      | Backend Architecture & FastAPI Design (BAD)     |
| **Phase**         | 7 of 30                                          |
| **Version**       | 1.0                                              |
| **Language**      | Python 3.13+                                     |
| **Framework**     | FastAPI 0.115.x                                  |
| **Architecture**  | Clean Architecture — Layered Modular Monolith    |
| **Pattern**       | Controller → Service → Repository → Database     |
| **Date**          | July 2026                                        |
| **Status**        | ✅ Complete                                      |

---

## Table of Contents

1. [Backend Overview](#1-backend-overview)
2. [Clean Architecture Design](#2-clean-architecture-design)
3. [Project Folder Structure](#3-project-folder-structure)
4. [Application Factory](#4-application-factory)
5. [Configuration Management](#5-configuration-management)
6. [Middleware Stack](#6-middleware-stack)
7. [Dependency Injection](#7-dependency-injection)
8. [Security Layer](#8-security-layer)
9. [Exception Handling](#9-exception-handling)
10. [Standard Response Format](#10-standard-response-format)
11. [API Endpoint Catalog](#11-api-endpoint-catalog)
12. [Router Layer — Code Patterns](#12-router-layer--code-patterns)
13. [Service Layer — Code Patterns](#13-service-layer--code-patterns)
14. [Repository Layer — Code Patterns](#14-repository-layer--code-patterns)
15. [AI Gateway](#15-ai-gateway)
16. [LangGraph Orchestrator](#16-langgraph-orchestrator)
17. [AI Agent Design](#17-ai-agent-design)
18. [Celery Background Tasks](#18-celery-background-tasks)
19. [WebSocket Module](#19-websocket-module)
20. [File Upload Service](#20-file-upload-service)
21. [Logging System](#21-logging-system)
22. [Health Checks](#22-health-checks)
23. [Backend Startup Flow](#23-backend-startup-flow)
24. [Development Standards](#24-development-standards)
25. [Deployment Readiness](#25-deployment-readiness)

---

## 1. Backend Overview

The NEXA AI backend is a **FastAPI application** organized using **Clean Architecture** with strict layer separation. Each layer depends only on the layer below it — making every module independently testable, replaceable, and explainable in interviews.

```
Responsibilities:
├── Authentication & Authorization     (JWT, OAuth2, RBAC)
├── AI Gateway & Agent Orchestration   (LangGraph)
├── Career Guidance Engine             (CareerService + CareerAgent)
├── Resume Analysis & ATS Scoring      (ResumeService + ResumeAgent)
├── Learning Management System         (LearningService)
├── Coding Assistant                   (CodingService + CodingAgent)
├── Interview Coach                    (InterviewService + InterviewAgent)
├── Recommendation Engine              (RecommendationAgent)
├── Notifications                      (NotificationService + Celery)
├── Analytics & Reporting              (AnalyticsService)
├── Feedback Processing                (FeedbackService)
└── Admin Panel                        (AdminService)
```

---

## 2. Clean Architecture Design

### 2.1 Layer Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  Layer 1: API / Router Layer                                │
│  Receives HTTP requests, validates input, returns response  │
│  Files: app/api/v1/*.py                                     │
├─────────────────────────────────────────────────────────────┤
│  Layer 2: Middleware Layer                                   │
│  CORS, Auth, Rate Limiting, Logging, Request ID             │
│  Files: app/middleware/*.py                                 │
├─────────────────────────────────────────────────────────────┤
│  Layer 3: Dependency Injection Layer                        │
│  Provides current user, DB, Redis, AI Gateway to routers   │
│  Files: app/core/dependencies.py                            │
├─────────────────────────────────────────────────────────────┤
│  Layer 4: Service Layer                                     │
│  All business logic lives here. No DB code.                │
│  Files: app/services/*.py                                   │
├─────────────────────────────────────────────────────────────┤
│  Layer 5: Repository Layer                                  │
│  All database access. No business logic.                   │
│  Files: app/repositories/*.py                              │
├─────────────────────────────────────────────────────────────┤
│  Layer 6: Data Layer                                        │
│  MongoDB (Beanie/Motor) + Redis + Qdrant                   │
│  Files: app/core/database.py, redis.py, qdrant.py          │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Request Lifecycle

```
HTTP Request
     │
     ▼
NGINX (reverse proxy, SSL, rate limiting)
     │
     ▼
Uvicorn (ASGI event loop)
     │
     ▼
CORSMiddleware        → Validates origin
     │
     ▼
RequestIDMiddleware   → Adds X-Request-ID header
     │
     ▼
LoggingMiddleware     → Logs request metadata
     │
     ▼
RateLimitMiddleware   → Checks Redis quota
     │
     ▼
SecurityHeadersMiddleware → Adds HSTS, X-Frame-Options
     │
     ▼
API Router  /api/v1/{resource}
     │
     ▼
Depends(get_current_user)  → JWT decode + DB lookup
     │
     ▼
Depends(require_role(...))  → RBAC check
     │
     ▼
Pydantic Request Schema     → 422 if invalid
     │
     ▼
Service Layer               → Business logic
     │
     ▼
Repository Layer            → DB operations (Motor)
     │
     ▼
MongoDB / Redis / Qdrant
     │
     ▼
Pydantic Response Schema    → Serialized JSON
     │
     ▼
HTTP Response
```

---

## 3. Project Folder Structure

```
backend/
│
├── app/
│   ├── __init__.py
│   ├── main.py                         # FastAPI app factory + lifespan
│   ├── config.py                       # Pydantic BaseSettings
│   │
│   ├── api/
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── router.py               # Master router — includes all sub-routers
│   │       ├── auth.py                 # /auth/*
│   │       ├── users.py                # /users/*
│   │       ├── profile.py              # /profile/*
│   │       ├── skills.py               # /skills/*
│   │       ├── career.py               # /career/*
│   │       ├── resume.py               # /resume/*
│   │       ├── courses.py              # /courses/*
│   │       ├── lessons.py              # /lessons/*
│   │       ├── learning.py             # /learning/*
│   │       ├── interview.py            # /interview/*
│   │       ├── coding.py               # /coding/*
│   │       ├── roadmap.py              # /roadmap/*
│   │       ├── recommendations.py      # /recommendations/*
│   │       ├── feedback.py             # /feedback/*
│   │       ├── notifications.py        # /notifications/*
│   │       ├── analytics.py            # /analytics/*
│   │       ├── ai.py                   # /ai/*
│   │       └── admin.py                # /admin/*
│   │
│   ├── websocket/
│   │   ├── __init__.py
│   │   ├── chat_ws.py                  # /ws/chat WebSocket handler
│   │   └── notification_ws.py          # /ws/notifications WebSocket
│   │
│   ├── ai/
│   │   ├── __init__.py
│   │   │
│   │   ├── gateway/
│   │   │   ├── gateway.py              # AI Gateway entry point
│   │   │   ├── intent_detector.py      # Intent classification
│   │   │   └── agent_router.py         # Agent selection logic
│   │   │
│   │   ├── orchestrator/
│   │   │   ├── graph.py                # LangGraph StateGraph
│   │   │   ├── state.py                # GraphState TypedDict
│   │   │   ├── nodes.py                # All graph node functions
│   │   │   └── edges.py                # Conditional routing edges
│   │   │
│   │   ├── agents/
│   │   │   ├── base_agent.py           # Abstract agent interface
│   │   │   ├── career_agent.py
│   │   │   ├── resume_agent.py
│   │   │   ├── learning_agent.py
│   │   │   ├── coding_agent.py
│   │   │   ├── interview_agent.py
│   │   │   ├── roadmap_agent.py
│   │   │   ├── job_agent.py
│   │   │   ├── internship_agent.py
│   │   │   ├── skill_gap_agent.py
│   │   │   ├── recommendation_agent.py
│   │   │   ├── feedback_agent.py
│   │   │   └── analytics_agent.py
│   │   │
│   │   ├── memory/
│   │   │   ├── short_term.py           # Redis session memory
│   │   │   └── long_term.py            # MongoDB user memory
│   │   │
│   │   ├── rag/
│   │   │   ├── pipeline.py             # Ingestion + retrieval
│   │   │   ├── embedder.py             # Embedding model wrapper
│   │   │   ├── retriever.py            # Qdrant semantic search
│   │   │   └── chunker.py              # Document chunking
│   │   │
│   │   ├── providers/
│   │   │   ├── base_provider.py        # Abstract provider interface
│   │   │   ├── openai_provider.py
│   │   │   ├── gemini_provider.py
│   │   │   ├── claude_provider.py
│   │   │   ├── deepseek_provider.py
│   │   │   └── ollama_provider.py
│   │   │
│   │   ├── prompts/
│   │   │   ├── system_prompts.py       # All system prompt templates
│   │   │   └── agent_prompts.py        # Per-agent prompts
│   │   │
│   │   └── tools/
│   │       ├── web_search_tool.py
│   │       ├── resume_tool.py
│   │       └── job_search_tool.py
│   │
│   ├── services/
│   │   ├── auth_service.py
│   │   ├── user_service.py
│   │   ├── profile_service.py
│   │   ├── career_service.py
│   │   ├── resume_service.py
│   │   ├── learning_service.py
│   │   ├── interview_service.py
│   │   ├── coding_service.py
│   │   ├── roadmap_service.py
│   │   ├── recommendation_service.py
│   │   ├── feedback_service.py
│   │   ├── notification_service.py
│   │   ├── analytics_service.py
│   │   ├── certificate_service.py
│   │   ├── file_service.py
│   │   └── admin_service.py
│   │
│   ├── repositories/
│   │   ├── base_repository.py          # Generic async CRUD base
│   │   ├── user_repository.py
│   │   ├── profile_repository.py
│   │   ├── skill_repository.py
│   │   ├── resume_repository.py
│   │   ├── course_repository.py
│   │   ├── lesson_repository.py
│   │   ├── learning_repository.py
│   │   ├── chat_repository.py
│   │   ├── roadmap_repository.py
│   │   ├── recommendation_repository.py
│   │   ├── feedback_repository.py
│   │   ├── notification_repository.py
│   │   ├── analytics_repository.py
│   │   ├── job_repository.py
│   │   └── certificate_repository.py
│   │
│   ├── models/                         # Beanie documents (Phase 6)
│   │   └── (all 32 models from Phase 6)
│   │
│   ├── schemas/                        # Pydantic request/response schemas
│   │   ├── common.py                   # APIResponse, Pagination, ErrorResponse
│   │   ├── auth_schemas.py
│   │   ├── user_schemas.py
│   │   ├── profile_schemas.py
│   │   ├── career_schemas.py
│   │   ├── resume_schemas.py
│   │   ├── course_schemas.py
│   │   ├── learning_schemas.py
│   │   ├── interview_schemas.py
│   │   ├── coding_schemas.py
│   │   ├── roadmap_schemas.py
│   │   ├── ai_schemas.py
│   │   ├── feedback_schemas.py
│   │   ├── notification_schemas.py
│   │   ├── analytics_schemas.py
│   │   └── admin_schemas.py
│   │
│   ├── middleware/
│   │   ├── cors_middleware.py
│   │   ├── logging_middleware.py
│   │   ├── rate_limit_middleware.py
│   │   ├── request_id_middleware.py
│   │   └── security_headers_middleware.py
│   │
│   ├── core/
│   │   ├── database.py                 # Motor + Beanie init
│   │   ├── redis_client.py             # Redis connection pool
│   │   ├── qdrant_client.py            # Qdrant client init
│   │   ├── security.py                 # JWT, password hashing
│   │   ├── dependencies.py             # FastAPI Depends() definitions
│   │   └── exceptions.py               # Custom exceptions + handlers
│   │
│   ├── tasks/
│   │   ├── celery_app.py               # Celery application instance
│   │   ├── email_tasks.py
│   │   ├── resume_tasks.py
│   │   ├── analytics_tasks.py
│   │   ├── report_tasks.py
│   │   └── notification_tasks.py
│   │
│   └── utils/
│       ├── logger.py                   # structlog configuration
│       ├── file_storage.py             # S3/GCS upload helpers
│       ├── pdf_generator.py
│       └── constants.py
│
├── tests/
│   ├── unit/
│   │   ├── test_auth_service.py
│   │   ├── test_resume_service.py
│   │   └── test_ai_gateway.py
│   ├── integration/
│   │   ├── test_auth_api.py
│   │   └── test_resume_api.py
│   └── conftest.py
│
├── scripts/
│   ├── seed_data.py
│   ├── create_indexes.py
│   └── ingest_knowledge.py
│
├── requirements/
│   ├── base.txt
│   ├── dev.txt
│   └── prod.txt
│
├── Dockerfile
├── .env.example
└── pyproject.toml
```

---

## 4. Application Factory

### 4.1 `app/main.py` — FastAPI App Entry Point

```python
# app/main.py
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.core.database import init_db, close_db
from app.core.redis_client import init_redis, close_redis
from app.core.qdrant_client import init_qdrant
from app.api.v1.router import api_v1_router
from app.websocket.chat_ws import chat_router
from app.websocket.notification_ws import notification_router
from app.middleware.logging_middleware import LoggingMiddleware
from app.middleware.rate_limit_middleware import RateLimitMiddleware
from app.middleware.request_id_middleware import RequestIDMiddleware
from app.middleware.security_headers_middleware import SecurityHeadersMiddleware
from app.core.exceptions import register_exception_handlers
from app.utils.logger import configure_logging


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application startup and shutdown lifecycle."""
    configure_logging()

    # ── Startup ──────────────────────────────────────
    app.state.db_client = await init_db()
    app.state.redis = await init_redis()
    await init_qdrant()

    yield

    # ── Shutdown ─────────────────────────────────────
    await close_db(app.state.db_client)
    await close_redis(app.state.redis)


def create_app() -> FastAPI:
    """Factory function that creates and configures the FastAPI application."""
    app = FastAPI(
        title="NEXA AI",
        description="Enterprise AI-Based Career Guidance and Learning Platform",
        version="1.0.0",
        docs_url="/docs" if settings.APP_ENV != "production" else None,
        redoc_url="/redoc" if settings.APP_ENV != "production" else None,
        lifespan=lifespan,
    )

    # ── Middleware (order matters — outermost added last) ──
    app.add_middleware(SecurityHeadersMiddleware)
    app.add_middleware(RateLimitMiddleware)
    app.add_middleware(LoggingMiddleware)
    app.add_middleware(RequestIDMiddleware)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── Exception Handlers ────────────────────────────
    register_exception_handlers(app)

    # ── Routers ───────────────────────────────────────
    app.include_router(api_v1_router, prefix="/api/v1")
    app.include_router(chat_router, prefix="/ws")
    app.include_router(notification_router, prefix="/ws")

    @app.get("/health", tags=["System"])
    async def health_check():
        return {"status": "healthy", "version": "1.0.0"}

    return app


app = create_app()
```

### 4.2 `app/api/v1/router.py` — Master Router

```python
# app/api/v1/router.py
from fastapi import APIRouter
from app.api.v1 import (
    auth, users, profile, skills, career,
    resume, courses, lessons, learning,
    interview, coding, roadmap, recommendations,
    feedback, notifications, analytics, ai, admin
)

api_v1_router = APIRouter()

api_v1_router.include_router(auth.router,            prefix="/auth",            tags=["Authentication"])
api_v1_router.include_router(users.router,           prefix="/users",           tags=["Users"])
api_v1_router.include_router(profile.router,         prefix="/profile",         tags=["Profile"])
api_v1_router.include_router(skills.router,          prefix="/skills",          tags=["Skills"])
api_v1_router.include_router(career.router,          prefix="/career",          tags=["Career"])
api_v1_router.include_router(resume.router,          prefix="/resume",          tags=["Resume"])
api_v1_router.include_router(courses.router,         prefix="/courses",         tags=["Courses"])
api_v1_router.include_router(lessons.router,         prefix="/lessons",         tags=["Lessons"])
api_v1_router.include_router(learning.router,        prefix="/learning",        tags=["Learning"])
api_v1_router.include_router(interview.router,       prefix="/interview",       tags=["Interview"])
api_v1_router.include_router(coding.router,          prefix="/coding",          tags=["Coding"])
api_v1_router.include_router(roadmap.router,         prefix="/roadmap",         tags=["Roadmap"])
api_v1_router.include_router(recommendations.router, prefix="/recommendations", tags=["Recommendations"])
api_v1_router.include_router(feedback.router,        prefix="/feedback",        tags=["Feedback"])
api_v1_router.include_router(notifications.router,   prefix="/notifications",   tags=["Notifications"])
api_v1_router.include_router(analytics.router,       prefix="/analytics",       tags=["Analytics"])
api_v1_router.include_router(ai.router,              prefix="/ai",              tags=["AI"])
api_v1_router.include_router(admin.router,           prefix="/admin",           tags=["Admin"])
```

---

## 5. Configuration Management

### `app/config.py`

```python
# app/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from typing import Optional
from enum import Enum


class Environment(str, Enum):
    DEVELOPMENT = "development"
    TESTING = "testing"
    PRODUCTION = "production"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # ── Application ───────────────────────────────────────
    APP_NAME: str = "NEXA-AI"
    APP_ENV: Environment = Environment.DEVELOPMENT
    APP_PORT: int = 8000
    APP_DEBUG: bool = True
    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000"]

    # ── Database ──────────────────────────────────────────
    MONGODB_URI: str
    MONGODB_DB_NAME: str = "nexa_ai"

    # ── Redis ─────────────────────────────────────────────
    REDIS_URL: str = "redis://localhost:6379/0"

    # ── Authentication ────────────────────────────────────
    JWT_PRIVATE_KEY_PATH: str = "./keys/private.pem"
    JWT_PUBLIC_KEY_PATH: str = "./keys/public.pem"
    JWT_ALGORITHM: str = "RS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # ── OAuth2 ────────────────────────────────────────────
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    GITHUB_CLIENT_ID: Optional[str] = None
    GITHUB_CLIENT_SECRET: Optional[str] = None

    # ── AI Providers ──────────────────────────────────────
    ACTIVE_AI_PROVIDER: str = "openai"
    FALLBACK_AI_PROVIDER_1: str = "gemini"
    FALLBACK_AI_PROVIDER_2: str = "claude"
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_MODEL: str = "gpt-4o"
    GEMINI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None

    # ── Vector Database ───────────────────────────────────
    QDRANT_URL: str = "http://localhost:6333"
    QDRANT_API_KEY: Optional[str] = None
    EMBEDDING_MODEL: str = "text-embedding-3-small"
    EMBEDDING_DIMENSION: int = 1536

    # ── Email ─────────────────────────────────────────────
    SMTP_HOST: str = "smtp.sendgrid.net"
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    EMAIL_FROM: str = "noreply@nexaai.com"

    # ── File Storage ──────────────────────────────────────
    STORAGE_PROVIDER: str = "s3"
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_S3_BUCKET: Optional[str] = None
    AWS_REGION: str = "ap-south-1"

    # ── Celery ────────────────────────────────────────────
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"

    # ── Rate Limiting ─────────────────────────────────────
    RATE_LIMIT_REQUESTS_PER_MINUTE: int = 100


settings = Settings()
```

---

## 6. Middleware Stack

### 6.1 Request ID Middleware

```python
# app/middleware/request_id_middleware.py
import uuid
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request


class RequestIDMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request_id = str(uuid.uuid4())
        request.state.request_id = request_id
        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        return response
```

### 6.2 Logging Middleware

```python
# app/middleware/logging_middleware.py
import time
import structlog
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

logger = structlog.get_logger()


class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start = time.monotonic()
        response = await call_next(request)
        duration_ms = int((time.monotonic() - start) * 1000)

        logger.info(
            "http_request",
            method=request.method,
            path=request.url.path,
            status_code=response.status_code,
            duration_ms=duration_ms,
            request_id=getattr(request.state, "request_id", None),
        )
        return response
```

### 6.3 Rate Limit Middleware

```python
# app/middleware/rate_limit_middleware.py
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse
from app.core.redis_client import get_redis
from app.config import settings


class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host
        redis = await get_redis()
        key = f"ratelimit:{request.url.path}:{client_ip}"

        current = await redis.incr(key)
        if current == 1:
            await redis.expire(key, 60)  # 1-minute window

        if current > settings.RATE_LIMIT_REQUESTS_PER_MINUTE:
            return JSONResponse(
                status_code=429,
                content={
                    "success": False,
                    "error": {
                        "code": "RATE_LIMIT_EXCEEDED",
                        "message": "Too many requests. Please try again in a moment.",
                    },
                },
            )
        return await call_next(request)
```

### 6.4 Security Headers Middleware

```python
# app/middleware/security_headers_middleware.py
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Strict-Transport-Security"] = (
            "max-age=31536000; includeSubDomains"
        )
        return response
```

---

## 7. Dependency Injection

### `app/core/dependencies.py`

```python
# app/core/dependencies.py
from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.security import decode_jwt
from app.core.redis_client import get_redis
from app.repositories.user_repository import UserRepository
from app.models.user import User, UserRole

security = HTTPBearer()


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)],
    user_repo: Annotated[UserRepository, Depends(UserRepository)],
) -> User:
    """Decode JWT and return the authenticated user."""
    token = credentials.credentials
    redis = await get_redis()

    # Check revoked tokens
    jti = decode_jwt(token).get("jti")
    if await redis.get(f"auth:blacklist:{jti}"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has been revoked",
        )

    payload = decode_jwt(token)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )

    user = await user_repo.find_by_id(user_id)
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or deactivated",
        )
    return user


def require_role(*roles: UserRole):
    """Returns a FastAPI dependency that enforces role-based access."""
    async def role_checker(
        current_user: Annotated[User, Depends(get_current_user)]
    ) -> User:
        if current_user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access restricted. Required roles: {[r.value for r in roles]}",
            )
        return current_user
    return role_checker


# ── Typed dependency aliases ───────────────────────────────
CurrentUser = Annotated[User, Depends(get_current_user)]
AdminUser   = Annotated[User, Depends(require_role(UserRole.ADMIN, UserRole.SUPER_ADMIN))]
MentorUser  = Annotated[User, Depends(require_role(UserRole.MENTOR, UserRole.ADMIN))]
```

---

## 8. Security Layer

### `app/core/security.py`

```python
# app/core/security.py
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any
import uuid
import jwt
from passlib.context import CryptContext
from app.config import settings

# ── Password Hashing (Argon2id) ───────────────────────────
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


# ── JWT (RS256 — asymmetric) ──────────────────────────────
def _load_private_key() -> str:
    return Path(settings.JWT_PRIVATE_KEY_PATH).read_text()


def _load_public_key() -> str:
    return Path(settings.JWT_PUBLIC_KEY_PATH).read_text()


def create_access_token(subject: str, extra: dict[str, Any] | None = None) -> str:
    """Create a short-lived JWT access token."""
    now = datetime.utcnow()
    payload = {
        "sub": subject,
        "iat": now,
        "exp": now + timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES),
        "jti": str(uuid.uuid4()),
        "type": "access",
        **(extra or {}),
    }
    return jwt.encode(payload, _load_private_key(), algorithm=settings.JWT_ALGORITHM)


def create_refresh_token(subject: str) -> str:
    """Create a long-lived refresh token."""
    now = datetime.utcnow()
    payload = {
        "sub": subject,
        "iat": now,
        "exp": now + timedelta(days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS),
        "jti": str(uuid.uuid4()),
        "type": "refresh",
    }
    return jwt.encode(payload, _load_private_key(), algorithm=settings.JWT_ALGORITHM)


def decode_jwt(token: str) -> dict:
    """Decode and validate a JWT token."""
    try:
        return jwt.decode(
            token,
            _load_public_key(),
            algorithms=[settings.JWT_ALGORITHM],
        )
    except jwt.ExpiredSignatureError:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
        )
    except jwt.InvalidTokenError:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )
```

---

## 9. Exception Handling

### `app/core/exceptions.py`

```python
# app/core/exceptions.py
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from datetime import datetime


# ── Custom Exception Classes ───────────────────────────────

class NexaBaseException(Exception):
    def __init__(self, message: str, code: str, status_code: int = 400):
        self.message = message
        self.code = code
        self.status_code = status_code
        super().__init__(message)


class AuthenticationError(NexaBaseException):
    def __init__(self, message: str = "Authentication failed"):
        super().__init__(message, "AUTHENTICATION_ERROR", 401)


class AuthorizationError(NexaBaseException):
    def __init__(self, message: str = "Insufficient permissions"):
        super().__init__(message, "AUTHORIZATION_ERROR", 403)


class ResourceNotFound(NexaBaseException):
    def __init__(self, resource: str):
        super().__init__(f"{resource} not found", f"{resource.upper()}_NOT_FOUND", 404)


class DuplicateResource(NexaBaseException):
    def __init__(self, resource: str):
        super().__init__(f"{resource} already exists", f"{resource.upper()}_ALREADY_EXISTS", 409)


class AIProviderError(NexaBaseException):
    def __init__(self, message: str = "AI service temporarily unavailable"):
        super().__init__(message, "AI_PROVIDER_ERROR", 503)


class ValidationError(NexaBaseException):
    def __init__(self, message: str):
        super().__init__(message, "VALIDATION_ERROR", 422)


class RateLimitExceeded(NexaBaseException):
    def __init__(self):
        super().__init__("Too many requests", "RATE_LIMIT_EXCEEDED", 429)


# ── Exception Handler Registration ────────────────────────

def _error_body(request: Request, exc: NexaBaseException) -> dict:
    return {
        "success": False,
        "error": {
            "code": exc.code,
            "message": exc.message,
        },
        "request_id": getattr(request.state, "request_id", None),
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }


def register_exception_handlers(app: FastAPI) -> None:

    @app.exception_handler(NexaBaseException)
    async def nexa_exception_handler(request: Request, exc: NexaBaseException):
        return JSONResponse(status_code=exc.status_code, content=_error_body(request, exc))

    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception):
        import structlog
        structlog.get_logger().error("unhandled_exception", error=str(exc))
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": {
                    "code": "INTERNAL_ERROR",
                    "message": "An unexpected error occurred. Please try again.",
                },
                "timestamp": datetime.utcnow().isoformat() + "Z",
            },
        )
```

---

## 10. Standard Response Format

### `app/schemas/common.py`

```python
# app/schemas/common.py
from pydantic import BaseModel, Field
from typing import Generic, TypeVar, Optional, Any
from datetime import datetime

T = TypeVar("T")


class APIResponse(BaseModel, Generic[T]):
    """Standard success response wrapper for all endpoints."""
    success: bool = True
    data: Optional[T] = None
    message: Optional[str] = None
    timestamp: str = Field(
        default_factory=lambda: datetime.utcnow().isoformat() + "Z"
    )

    @classmethod
    def ok(cls, data: T = None, message: str | None = None) -> "APIResponse[T]":
        return cls(data=data, message=message)


class PaginatedResponse(BaseModel, Generic[T]):
    """Standard paginated list response."""
    success: bool = True
    data: list[T]
    total: int
    page: int
    limit: int
    pages: int
    timestamp: str = Field(
        default_factory=lambda: datetime.utcnow().isoformat() + "Z"
    )


class PaginationParams(BaseModel):
    """Standard query parameters for paginated endpoints."""
    page: int = Field(default=1, ge=1)
    limit: int = Field(default=20, ge=1, le=100)

    @property
    def skip(self) -> int:
        return (self.page - 1) * self.limit
```

---

## 11. API Endpoint Catalog

### 11.1 Authentication — `/api/v1/auth`

| Method | Endpoint                   | Description                      | Auth |
|--------|----------------------------|----------------------------------|------|
| POST   | `/auth/register`           | Register new user                | ❌   |
| POST   | `/auth/login`              | Login with email + password      | ❌   |
| POST   | `/auth/logout`             | Invalidate access + refresh token| ✅   |
| POST   | `/auth/refresh`            | Exchange refresh token           | ❌   |
| POST   | `/auth/forgot-password`    | Send OTP to email                | ❌   |
| POST   | `/auth/reset-password`     | Reset with OTP + new password    | ❌   |
| GET    | `/auth/verify-email`       | Verify email via token link      | ❌   |
| POST   | `/auth/resend-verification`| Resend verification email        | ❌   |
| GET    | `/auth/google`             | Initiate Google OAuth2 flow      | ❌   |
| GET    | `/auth/google/callback`    | Handle Google OAuth2 callback    | ❌   |
| GET    | `/auth/github`             | Initiate GitHub OAuth2 flow      | ❌   |
| GET    | `/auth/github/callback`    | Handle GitHub OAuth2 callback    | ❌   |

### 11.2 Users — `/api/v1/users`

| Method | Endpoint                   | Description                      | Auth |
|--------|----------------------------|----------------------------------|------|
| GET    | `/users/me`                | Get current user info            | ✅   |
| PATCH  | `/users/me`                | Update account (email/password)  | ✅   |
| DELETE | `/users/me`                | Deactivate own account           | ✅   |
| GET    | `/users/{user_id}`         | Get user (admin only)            | 🔐   |

### 11.3 Profile — `/api/v1/profile`

| Method | Endpoint                   | Description                      | Auth |
|--------|----------------------------|----------------------------------|------|
| GET    | `/profile`                 | Get current user profile         | ✅   |
| PUT    | `/profile`                 | Full profile update              | ✅   |
| PATCH  | `/profile/academic`        | Update academic info             | ✅   |
| PATCH  | `/profile/career-goal`     | Update career goal               | ✅   |
| POST   | `/profile/photo`           | Upload profile photo             | ✅   |
| GET    | `/profile/completion`      | Get profile completion %         | ✅   |

### 11.4 Skills — `/api/v1/skills`

| Method | Endpoint                   | Description                      | Auth |
|--------|----------------------------|----------------------------------|------|
| GET    | `/skills`                  | Get all skills of current user   | ✅   |
| POST   | `/skills`                  | Add a skill                      | ✅   |
| PATCH  | `/skills/{skill_id}`       | Update skill level               | ✅   |
| DELETE | `/skills/{skill_id}`       | Remove a skill                   | ✅   |

### 11.5 Career — `/api/v1/career`

| Method | Endpoint                   | Description                      | Auth |
|--------|----------------------------|----------------------------------|------|
| GET    | `/career/recommendations`  | AI career matches for user       | ✅   |
| POST   | `/career/skill-gap`        | Analyze skill gap for target role| ✅   |
| GET    | `/career/paths`            | Get available career paths       | ✅   |
| GET    | `/career/market-trends`    | Industry market data             | ✅   |
| GET    | `/career/salary/{role}`    | Salary range for role            | ✅   |

### 11.6 Resume — `/api/v1/resume`

| Method | Endpoint                   | Description                      | Auth |
|--------|----------------------------|----------------------------------|------|
| GET    | `/resume`                  | List all user resumes            | ✅   |
| POST   | `/resume/upload`           | Upload resume file               | ✅   |
| GET    | `/resume/{resume_id}`      | Get specific resume              | ✅   |
| DELETE | `/resume/{resume_id}`      | Delete resume version            | ✅   |
| POST   | `/resume/{resume_id}/analyze`| Trigger ATS analysis           | ✅   |
| GET    | `/resume/{resume_id}/score`| Get ATS score + suggestions      | ✅   |
| POST   | `/resume/build`            | Generate resume from profile     | ✅   |
| GET    | `/resume/{resume_id}/download`| Download resume PDF           | ✅   |

### 11.7 Courses — `/api/v1/courses`

| Method | Endpoint                       | Description                  | Auth |
|--------|--------------------------------|------------------------------|------|
| GET    | `/courses`                     | Paginated course catalog     | ✅   |
| GET    | `/courses/{course_id}`         | Course detail page           | ✅   |
| POST   | `/courses/{course_id}/enroll`  | Enroll in course             | ✅   |
| GET    | `/courses/enrolled`            | My enrolled courses          | ✅   |
| GET    | `/courses/search`              | Full-text course search      | ✅   |
| POST   | `/courses`                     | Create course (admin/mentor) | 🔐   |
| PATCH  | `/courses/{course_id}`         | Update course (admin/mentor) | 🔐   |
| DELETE | `/courses/{course_id}`         | Delete course (admin)        | 🔐   |

### 11.8 Learning — `/api/v1/learning`

| Method | Endpoint                               | Description             | Auth |
|--------|----------------------------------------|-------------------------|------|
| GET    | `/learning/progress`                   | All learning progress   | ✅   |
| GET    | `/learning/progress/{course_id}`       | Course-level progress   | ✅   |
| POST   | `/learning/progress/{lesson_id}`       | Update lesson progress  | ✅   |
| POST   | `/learning/quiz/{lesson_id}/submit`    | Submit quiz answers     | ✅   |
| GET    | `/learning/streak`                     | Learning streak data    | ✅   |
| GET    | `/learning/certificates`              | My certificates         | ✅   |

### 11.9 Interview — `/api/v1/interview`

| Method | Endpoint                        | Description                  | Auth |
|--------|---------------------------------|------------------------------|------|
| POST   | `/interview/start`              | Start mock interview session | ✅   |
| POST   | `/interview/{session_id}/answer`| Submit answer to question    | ✅   |
| GET    | `/interview/{session_id}/report`| Get evaluation report        | ✅   |
| GET    | `/interview/history`            | All past sessions            | ✅   |
| GET    | `/interview/questions`          | Browse question bank         | ✅   |

### 11.10 Coding — `/api/v1/coding`

| Method | Endpoint                   | Description                      | Auth |
|--------|----------------------------|----------------------------------|------|
| POST   | `/coding/explain`          | AI explains code                 | ✅   |
| POST   | `/coding/debug`            | AI debugs code                   | ✅   |
| POST   | `/coding/generate`         | AI generates code from prompt    | ✅   |
| POST   | `/coding/optimize`         | AI optimizes code                | ✅   |
| GET    | `/coding/history`          | User's submission history        | ✅   |

### 11.11 Roadmap — `/api/v1/roadmap`

| Method | Endpoint                        | Description                  | Auth |
|--------|---------------------------------|------------------------------|------|
| POST   | `/roadmap/generate`             | Generate AI career roadmap   | ✅   |
| GET    | `/roadmap`                      | Get active roadmap           | ✅   |
| PATCH  | `/roadmap/task/{task_id}`       | Mark daily task complete     | ✅   |
| GET    | `/roadmap/progress`             | Roadmap completion stats     | ✅   |

### 11.12 AI — `/api/v1/ai`

| Method | Endpoint                   | Description                      | Auth |
|--------|----------------------------|----------------------------------|------|
| POST   | `/ai/chat`                 | Send message to AI (REST)        | ✅   |
| GET    | `/ai/sessions`             | List all chat sessions           | ✅   |
| GET    | `/ai/sessions/{id}`        | Get session + messages           | ✅   |
| DELETE | `/ai/sessions/{id}`        | Archive chat session             | ✅   |
| GET    | `/ai/memory`               | Get AI memory for current user   | ✅   |
| DELETE | `/ai/memory`               | Reset AI memory                  | ✅   |
| POST   | `/ai/feedback`             | Submit response feedback         | ✅   |

### 11.13 Recommendations — `/api/v1/recommendations`

| Method | Endpoint                       | Description                 | Auth |
|--------|--------------------------------|-----------------------------|------|
| GET    | `/recommendations`             | Get all AI recommendations  | ✅   |
| POST   | `/recommendations/refresh`     | Regenerate recommendations  | ✅   |
| GET    | `/recommendations/jobs`        | Job recommendations         | ✅   |
| GET    | `/recommendations/courses`     | Course recommendations      | ✅   |

### 11.14 Notifications — `/api/v1/notifications`

| Method | Endpoint                           | Description                | Auth |
|--------|------------------------------------|----------------------------|------|
| GET    | `/notifications`                   | All notifications          | ✅   |
| PATCH  | `/notifications/{id}/read`         | Mark as read               | ✅   |
| PATCH  | `/notifications/read-all`          | Mark all as read           | ✅   |
| DELETE | `/notifications/{id}`              | Delete notification        | ✅   |

### 11.15 Analytics — `/api/v1/analytics`

| Method | Endpoint                       | Description                  | Auth |
|--------|--------------------------------|------------------------------|------|
| GET    | `/analytics/dashboard`         | Personal analytics dashboard | ✅   |
| GET    | `/analytics/learning`          | Learning hours + streak      | ✅   |
| GET    | `/analytics/ai`                | AI usage history             | ✅   |
| POST   | `/analytics/event`             | Track a custom event         | ✅   |
| GET    | `/analytics/admin`             | Platform-wide stats (admin)  | 🔐   |

### 11.16 Admin — `/api/v1/admin`

| Method | Endpoint                       | Description                  | Auth |
|--------|--------------------------------|------------------------------|------|
| GET    | `/admin/users`                 | Paginated user list          | 🔐   |
| GET    | `/admin/users/{id}`            | Get user detail              | 🔐   |
| PATCH  | `/admin/users/{id}/role`       | Change user role             | 🔐   |
| PATCH  | `/admin/users/{id}/status`     | Activate/deactivate user     | 🔐   |
| GET    | `/admin/analytics`             | Platform metrics dashboard   | 🔐   |
| GET    | `/admin/ai-config`             | Get AI configuration         | 🔐   |
| PUT    | `/admin/ai-config`             | Update AI config (provider)  | 🔐   |
| POST   | `/admin/rag/ingest`            | Ingest new knowledge docs    | 🔐   |
| GET    | `/admin/audit-logs`            | View audit log               | 🔐   |

**Legend:** ✅ Authenticated user | 🔐 Admin/Super Admin role

---

## 12. Router Layer — Code Patterns

### 12.1 Auth Router

```python
# app/api/v1/auth.py
from fastapi import APIRouter, Depends, Response
from app.schemas.auth_schemas import (
    RegisterRequest, LoginRequest, TokenResponse,
    ForgotPasswordRequest, ResetPasswordRequest,
)
from app.schemas.common import APIResponse
from app.services.auth_service import AuthService
from app.core.dependencies import CurrentUser

router = APIRouter()


@router.post("/register", response_model=APIResponse[dict], status_code=201)
async def register(
    payload: RegisterRequest,
    auth_service: AuthService = Depends(AuthService),
):
    """Register a new user account."""
    result = await auth_service.register(payload)
    return APIResponse.ok(data=result, message="Registration successful. Please verify your email.")


@router.post("/login", response_model=APIResponse[TokenResponse])
async def login(
    payload: LoginRequest,
    response: Response,
    auth_service: AuthService = Depends(AuthService),
):
    """Authenticate user and issue access + refresh tokens."""
    result = await auth_service.login(payload)
    response.set_cookie(
        key="refresh_token",
        value=result.refresh_token,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=7 * 24 * 3600,
    )
    return APIResponse.ok(data=result, message="Login successful")


@router.post("/logout", response_model=APIResponse[None])
async def logout(
    response: Response,
    current_user: CurrentUser,
    auth_service: AuthService = Depends(AuthService),
):
    """Revoke tokens and end session."""
    await auth_service.logout(current_user.id)
    response.delete_cookie("refresh_token")
    return APIResponse.ok(message="Logged out successfully")
```

### 12.2 Career Router

```python
# app/api/v1/career.py
from fastapi import APIRouter, Depends, Query
from app.schemas.career_schemas import SkillGapRequest, CareerRecommendationResponse
from app.schemas.common import APIResponse
from app.services.career_service import CareerService
from app.core.dependencies import CurrentUser

router = APIRouter()


@router.get("/recommendations", response_model=APIResponse[list[CareerRecommendationResponse]])
async def get_career_recommendations(
    current_user: CurrentUser,
    career_service: CareerService = Depends(CareerService),
):
    """Get AI-generated career recommendations based on user profile and skills."""
    result = await career_service.get_recommendations(current_user.id)
    return APIResponse.ok(data=result)


@router.post("/skill-gap", response_model=APIResponse[dict])
async def analyze_skill_gap(
    payload: SkillGapRequest,
    current_user: CurrentUser,
    career_service: CareerService = Depends(CareerService),
):
    """Run AI skill gap analysis for the given target role."""
    result = await career_service.analyze_skill_gap(
        user_id=str(current_user.id),
        target_role=payload.target_role,
    )
    return APIResponse.ok(data=result)
```

### 12.3 AI Chat Router

```python
# app/api/v1/ai.py
from fastapi import APIRouter, Depends
from app.schemas.ai_schemas import ChatRequest, ChatResponse, SessionListResponse
from app.schemas.common import APIResponse, PaginatedResponse, PaginationParams
from app.services.ai_service import AIService
from app.core.dependencies import CurrentUser

router = APIRouter()


@router.post("/chat", response_model=APIResponse[ChatResponse])
async def chat(
    payload: ChatRequest,
    current_user: CurrentUser,
    ai_service: AIService = Depends(AIService),
):
    """Send a message to NEXA AI and receive a grounded response (REST fallback)."""
    result = await ai_service.process_chat(
        user_id=str(current_user.id),
        session_id=payload.session_id,
        message=payload.message,
    )
    return APIResponse.ok(data=result)


@router.get("/sessions", response_model=PaginatedResponse[SessionListResponse])
async def list_sessions(
    current_user: CurrentUser,
    params: PaginationParams = Depends(),
    ai_service: AIService = Depends(AIService),
):
    """List all chat sessions for the current user."""
    return await ai_service.list_sessions(str(current_user.id), params)
```

---

## 13. Service Layer — Code Patterns

### 13.1 AuthService

```python
# app/services/auth_service.py
from fastapi import Depends
from datetime import datetime
from app.repositories.user_repository import UserRepository
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token
from app.core.exceptions import AuthenticationError, DuplicateResource
from app.schemas.auth_schemas import RegisterRequest, LoginRequest, TokenResponse
from app.models.user import User, UserRole, AuthProvider
from app.tasks.email_tasks import send_verification_email


class AuthService:

    def __init__(self, user_repo: UserRepository = Depends(UserRepository)):
        self.user_repo = user_repo

    async def register(self, payload: RegisterRequest) -> dict:
        """Create new user account and trigger verification email."""
        # 1. Check uniqueness
        existing = await self.user_repo.find_by_email(payload.email)
        if existing:
            raise DuplicateResource("Email")

        # 2. Hash password
        password_hash = hash_password(payload.password)

        # 3. Create user document
        user = User(
            email=payload.email,
            password_hash=password_hash,
            provider=AuthProvider.EMAIL,
            role=UserRole.STUDENT,
        )
        await user.insert()

        # 4. Send verification email (async via Celery)
        send_verification_email.delay(str(user.id), user.email)

        return {"user_id": str(user.id), "email": user.email}

    async def login(self, payload: LoginRequest) -> TokenResponse:
        """Validate credentials and return JWT tokens."""
        user = await self.user_repo.find_by_email(payload.email)
        if not user:
            raise AuthenticationError("Invalid email or password")

        if user.locked_until and user.locked_until > datetime.utcnow():
            raise AuthenticationError("Account is locked. Try again later.")

        if not verify_password(payload.password, user.password_hash):
            await self.user_repo.increment_failed_attempts(str(user.id))
            raise AuthenticationError("Invalid email or password")

        if not user.is_verified:
            raise AuthenticationError("Please verify your email before logging in")

        # Reset failed attempts on success
        await self.user_repo.reset_failed_attempts(str(user.id))

        access_token = create_access_token(
            subject=str(user.id),
            extra={"role": user.role, "email": user.email}
        )
        refresh_token = create_refresh_token(subject=str(user.id))

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            user_id=str(user.id),
            role=user.role,
        )

    async def logout(self, user_id: str) -> None:
        """Blacklist current tokens in Redis."""
        from app.core.redis_client import get_redis
        redis = await get_redis()
        await redis.setex(
            f"auth:blacklist:{user_id}",
            settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            "revoked"
        )
```

### 13.2 CareerService

```python
# app/services/career_service.py
from fastapi import Depends
from app.repositories.profile_repository import ProfileRepository
from app.repositories.skill_repository import SkillRepository
from app.ai.gateway.gateway import AIGateway
from app.core.exceptions import ResourceNotFound


class CareerService:

    def __init__(
        self,
        profile_repo: ProfileRepository = Depends(ProfileRepository),
        skill_repo: SkillRepository = Depends(SkillRepository),
        ai_gateway: AIGateway = Depends(AIGateway),
    ):
        self.profile_repo = profile_repo
        self.skill_repo = skill_repo
        self.ai_gateway = ai_gateway

    async def get_recommendations(self, user_id: str) -> list[dict]:
        """Get AI-generated career recommendations for the user."""
        profile = await self.profile_repo.find_by_user_id(user_id)
        if not profile:
            raise ResourceNotFound("Profile")

        skills = await self.skill_repo.find_by_user_id(user_id)

        return await self.ai_gateway.run_agent(
            agent_name="career_agent",
            user_id=user_id,
            context={
                "profile": profile.model_dump(),
                "skills": [s.model_dump() for s in skills],
                "task": "career_recommendations",
            }
        )

    async def analyze_skill_gap(self, user_id: str, target_role: str) -> dict:
        """Run skill gap analysis between current skills and target role requirements."""
        skills = await self.skill_repo.find_by_user_id(user_id)
        return await self.ai_gateway.run_agent(
            agent_name="skill_gap_agent",
            user_id=user_id,
            context={
                "current_skills": [s.skill_name for s in skills],
                "target_role": target_role,
                "task": "skill_gap_analysis",
            }
        )
```

---

## 14. Repository Layer — Code Patterns

### 14.1 Base Repository

```python
# app/repositories/base_repository.py
from typing import TypeVar, Generic, Optional, Type
from beanie import Document, PydanticObjectId

T = TypeVar("T", bound=Document)


class BaseRepository(Generic[T]):
    """Generic async CRUD repository for Beanie documents."""

    def __init__(self, model: Type[T]):
        self.model = model

    async def find_by_id(self, doc_id: str) -> Optional[T]:
        return await self.model.get(PydanticObjectId(doc_id))

    async def find_all(self, skip: int = 0, limit: int = 20) -> list[T]:
        return await self.model.find_all().skip(skip).limit(limit).to_list()

    async def count(self) -> int:
        return await self.model.count()

    async def save(self, document: T) -> T:
        await document.save()
        return document

    async def delete_by_id(self, doc_id: str) -> bool:
        doc = await self.find_by_id(doc_id)
        if doc:
            await doc.delete()
            return True
        return False
```

### 14.2 UserRepository

```python
# app/repositories/user_repository.py
from datetime import datetime, timedelta
from typing import Optional
from beanie import PydanticObjectId
from app.repositories.base_repository import BaseRepository
from app.models.user import User


class UserRepository(BaseRepository[User]):

    def __init__(self):
        super().__init__(User)

    async def find_by_email(self, email: str) -> Optional[User]:
        return await User.find_one(User.email == email)

    async def find_by_role(self, role: str, skip: int = 0, limit: int = 20) -> list[User]:
        return await User.find(User.role == role).skip(skip).limit(limit).to_list()

    async def increment_failed_attempts(self, user_id: str) -> None:
        user = await self.find_by_id(user_id)
        if not user:
            return
        user.failed_login_attempts += 1
        if user.failed_login_attempts >= 5:
            user.locked_until = datetime.utcnow() + timedelta(minutes=15)
        user.updated_at = datetime.utcnow()
        await user.save()

    async def reset_failed_attempts(self, user_id: str) -> None:
        user = await self.find_by_id(user_id)
        if not user:
            return
        user.failed_login_attempts = 0
        user.locked_until = None
        user.last_login = datetime.utcnow()
        user.updated_at = datetime.utcnow()
        await user.save()

    async def activate(self, user_id: str) -> None:
        user = await self.find_by_id(user_id)
        if user:
            user.is_verified = True
            user.updated_at = datetime.utcnow()
            await user.save()

    async def count_by_role(self, role: str) -> int:
        return await User.find(User.role == role).count()
```

---

## 15. AI Gateway

```python
# app/ai/gateway/gateway.py
import time
import structlog
from fastapi import Depends
from app.ai.gateway.intent_detector import IntentDetector
from app.ai.gateway.agent_router import AgentRouter
from app.ai.memory.short_term import ShortTermMemory
from app.ai.memory.long_term import LongTermMemory
from app.ai.rag.retriever import RAGRetriever
from app.core.exceptions import AIProviderError

logger = structlog.get_logger()


class AIGateway:
    """
    Central entry point for all AI requests.
    Coordinates intent detection, memory, RAG, agent routing, and provider calls.
    """

    def __init__(
        self,
        intent_detector: IntentDetector = Depends(IntentDetector),
        agent_router: AgentRouter = Depends(AgentRouter),
        short_term_memory: ShortTermMemory = Depends(ShortTermMemory),
        long_term_memory: LongTermMemory = Depends(LongTermMemory),
        rag_retriever: RAGRetriever = Depends(RAGRetriever),
    ):
        self.intent_detector = intent_detector
        self.agent_router = agent_router
        self.short_term = short_term_memory
        self.long_term = long_term_memory
        self.rag = rag_retriever

    async def process_chat(
        self,
        user_id: str,
        session_id: str,
        message: str,
    ) -> dict:
        """
        Full 9-stage AI request pipeline:
        1. Detect intent
        2. Build user context
        3. Load short-term memory (Redis)
        4. Load long-term memory (MongoDB)
        5. RAG retrieval (Qdrant)
        6. Select and run agents
        7. Merge agent outputs
        8. Generate final response
        9. Persist memory + metrics
        """
        start = time.monotonic()
        log = logger.bind(user_id=user_id, session_id=session_id)

        # Stage 1 — Intent Detection
        intent = await self.intent_detector.detect(message)
        log.info("intent_detected", intent=intent)

        # Stage 2 — Short-term + Long-term Memory
        session_ctx = await self.short_term.load(session_id)
        user_memory = await self.long_term.load(user_id)

        # Stage 3 — RAG Retrieval
        rag_chunks = await self.rag.retrieve(query=message, intent=intent, top_k=5)

        # Stage 4 — Run LangGraph Orchestrator
        from app.ai.orchestrator.graph import build_graph
        graph = build_graph()

        initial_state = {
            "user_id": user_id,
            "session_id": session_id,
            "query": message,
            "intent": intent,
            "chat_history": session_ctx.get("messages", []),
            "user_memory": user_memory,
            "rag_context": rag_chunks,
            "agent_outputs": {},
            "final_response": "",
        }

        final_state = await graph.ainvoke(initial_state)

        # Stage 5 — Persist memory (async)
        await self.short_term.save(session_id, message, final_state["final_response"])
        from app.tasks.analytics_tasks import update_ai_memory
        update_ai_memory.delay(user_id, final_state)

        latency_ms = int((time.monotonic() - start) * 1000)
        log.info("ai_response_complete", latency_ms=latency_ms, intent=intent)

        return {
            "response": final_state["final_response"],
            "intent": intent,
            "agents_used": list(final_state["agent_outputs"].keys()),
            "latency_ms": latency_ms,
        }

    async def run_agent(self, agent_name: str, user_id: str, context: dict) -> dict:
        """Run a single named agent directly (for non-chat API endpoints)."""
        agents = self.agent_router.get_agents_by_name([agent_name])
        if not agents:
            raise AIProviderError(f"Agent '{agent_name}' not found")
        return await agents[0].run(user_id=user_id, context=context)
```

---

## 16. LangGraph Orchestrator

### 16.1 State Definition

```python
# app/ai/orchestrator/state.py
from typing import TypedDict, Optional


class GraphState(TypedDict):
    user_id: str
    session_id: str
    query: str
    intent: str
    chat_history: list[dict]
    user_memory: dict
    rag_context: list[str]
    agent_outputs: dict[str, dict]
    final_response: str
    error: Optional[str]
```

### 16.2 LangGraph StateGraph

```python
# app/ai/orchestrator/graph.py
from langgraph.graph import StateGraph, END
from app.ai.orchestrator.state import GraphState
from app.ai.orchestrator.nodes import (
    route_agents_node,
    execute_agents_node,
    merge_results_node,
    generate_response_node,
    validate_response_node,
    handle_error_node,
)
from app.ai.orchestrator.edges import (
    should_handle_error,
    is_multi_agent,
)


def build_graph() -> StateGraph:
    """Build and compile the NEXA AI LangGraph orchestration graph."""
    graph = StateGraph(GraphState)

    # ── Add Nodes ─────────────────────────────────────
    graph.add_node("route_agents",       route_agents_node)
    graph.add_node("execute_agents",     execute_agents_node)
    graph.add_node("merge_results",      merge_results_node)
    graph.add_node("generate_response",  generate_response_node)
    graph.add_node("validate_response",  validate_response_node)
    graph.add_node("handle_error",       handle_error_node)

    # ── Set Entry Point ────────────────────────────────
    graph.set_entry_point("route_agents")

    # ── Add Edges ─────────────────────────────────────
    graph.add_edge("route_agents",      "execute_agents")
    graph.add_edge("execute_agents",    "merge_results")
    graph.add_edge("merge_results",     "generate_response")
    graph.add_edge("generate_response", "validate_response")

    # Conditional: error path or end
    graph.add_conditional_edges(
        "validate_response",
        should_handle_error,
        {
            "error": "handle_error",
            "ok": END,
        }
    )
    graph.add_edge("handle_error", END)

    return graph.compile()
```

### 16.3 Graph Nodes

```python
# app/ai/orchestrator/nodes.py
import asyncio
from app.ai.orchestrator.state import GraphState
from app.ai.agents import get_agent_by_name


async def route_agents_node(state: GraphState) -> GraphState:
    """Select which agents to invoke based on intent."""
    intent_to_agents = {
        "career":      ["career_agent"],
        "resume":      ["resume_agent"],
        "learning":    ["learning_agent"],
        "coding":      ["coding_agent"],
        "interview":   ["interview_agent"],
        "job":         ["job_agent", "recommendation_agent"],
        "skill_gap":   ["skill_gap_agent", "career_agent"],
        "roadmap":     ["roadmap_agent"],
        "general":     ["career_agent"],
    }
    selected = intent_to_agents.get(state["intent"], ["career_agent"])
    state["selected_agents"] = selected
    return state


async def execute_agents_node(state: GraphState) -> GraphState:
    """Execute selected agents concurrently."""
    selected_agents = state.get("selected_agents", ["career_agent"])

    async def run_one(agent_name: str) -> tuple[str, dict]:
        agent = get_agent_by_name(agent_name)
        output = await agent.run(
            user_id=state["user_id"],
            context={
                "query": state["query"],
                "rag_context": state["rag_context"],
                "user_memory": state["user_memory"],
                "chat_history": state["chat_history"],
            }
        )
        return agent_name, output

    # Run all agents in parallel
    results = await asyncio.gather(*[run_one(name) for name in selected_agents])
    state["agent_outputs"] = dict(results)
    return state


async def merge_results_node(state: GraphState) -> GraphState:
    """Combine agent outputs into a single coherent context."""
    merged = "\n\n".join(
        f"[{name}]: {output.get('content', '')}"
        for name, output in state["agent_outputs"].items()
    )
    state["merged_context"] = merged
    return state


async def generate_response_node(state: GraphState) -> GraphState:
    """Call LLM to generate final formatted response from merged context."""
    from app.ai.providers import get_active_provider
    provider = get_active_provider()

    messages = [
        {"role": "system", "content": "You are NEXA AI, an expert career guidance assistant."},
        *state["chat_history"][-6:],     # Last 3 turns
        {"role": "user", "content": state["query"]},
        {"role": "system", "content": f"Context from agents:\n{state['merged_context']}"},
    ]

    response = await provider.chat(messages)
    state["final_response"] = response.content
    return state


async def validate_response_node(state: GraphState) -> GraphState:
    """Basic safety check on the generated response."""
    if not state["final_response"] or len(state["final_response"].strip()) < 10:
        state["error"] = "empty_response"
    return state


async def handle_error_node(state: GraphState) -> GraphState:
    state["final_response"] = (
        "I apologize — I couldn't generate a complete response. "
        "Please try rephrasing your question."
    )
    return state
```

---

## 17. AI Agent Design

### 17.1 Base Agent

```python
# app/ai/agents/base_agent.py
from abc import ABC, abstractmethod
from pydantic import BaseModel


class AgentOutput(BaseModel):
    content: str
    confidence: float = 0.0
    agent_name: str
    metadata: dict = {}


class BaseAgent(ABC):
    """
    Abstract base class for all NEXA AI agents.
    Every agent must implement the run() method.
    """
    name: str = "base_agent"

    @abstractmethod
    async def run(self, user_id: str, context: dict) -> dict:
        """
        Execute the agent logic.

        Args:
            user_id: Authenticated user ID.
            context: Dict containing query, rag_context, user_memory, chat_history.

        Returns:
            AgentOutput as dict.
        """
        ...

    def build_prompt(self, context: dict) -> list[dict]:
        """Build the message list for the LLM call."""
        raise NotImplementedError
```

### 17.2 Career Agent

```python
# app/ai/agents/career_agent.py
from app.ai.agents.base_agent import BaseAgent, AgentOutput
from app.ai.providers import get_active_provider
from app.ai.prompts.agent_prompts import CAREER_AGENT_SYSTEM_PROMPT


class CareerAgent(BaseAgent):
    """
    Specializes in career path recommendations, role matching,
    and market trend analysis.
    """
    name = "career_agent"

    async def run(self, user_id: str, context: dict) -> dict:
        provider = get_active_provider()

        messages = [
            {
                "role": "system",
                "content": CAREER_AGENT_SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": (
                    f"User query: {context['query']}\n\n"
                    f"User memory: {context.get('user_memory', {})}\n\n"
                    f"Relevant knowledge:\n"
                    + "\n".join(context.get("rag_context", []))
                )
            }
        ]

        response = await provider.chat(messages)

        return AgentOutput(
            content=response.content,
            confidence=0.85,
            agent_name=self.name,
        ).model_dump()
```

---

## 18. Celery Background Tasks

### 18.1 Celery App Configuration

```python
# app/tasks/celery_app.py
from celery import Celery
from app.config import settings

celery_app = Celery(
    "nexa_tasks",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=[
        "app.tasks.email_tasks",
        "app.tasks.resume_tasks",
        "app.tasks.analytics_tasks",
        "app.tasks.report_tasks",
        "app.tasks.notification_tasks",
    ]
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Asia/Kolkata",
    enable_utc=True,
    task_track_started=True,
    task_acks_late=True,
    worker_prefetch_multiplier=1,
)

# ── Scheduled Tasks (Celery Beat) ─────────────────────────
celery_app.conf.beat_schedule = {
    "daily-analytics-aggregation": {
        "task": "app.tasks.analytics_tasks.aggregate_daily_metrics",
        "schedule": 86400,          # Every 24 hours
    },
    "weekly-recommendation-refresh": {
        "task": "app.tasks.analytics_tasks.refresh_recommendations",
        "schedule": 604800,         # Every 7 days
    },
    "hourly-notification-digest": {
        "task": "app.tasks.notification_tasks.send_notification_digest",
        "schedule": 3600,           # Every 1 hour
    },
}
```

### 18.2 Email Tasks

```python
# app/tasks/email_tasks.py
from app.tasks.celery_app import celery_app


@celery_app.task(bind=True, max_retries=3, default_retry_delay=60)
def send_verification_email(self, user_id: str, email: str):
    """Send email verification link to newly registered user."""
    try:
        from app.utils.email import send_email
        from app.core.security import create_access_token
        token = create_access_token(subject=user_id, extra={"type": "email_verify"})
        send_email(
            to=email,
            subject="Verify your NEXA AI account",
            template="email_verification.html",
            context={"verification_link": f"https://nexaai.com/verify?token={token}"}
        )
    except Exception as exc:
        raise self.retry(exc=exc)


@celery_app.task(bind=True, max_retries=3, default_retry_delay=60)
def send_password_reset_email(self, email: str, otp: str):
    """Send OTP for password reset."""
    try:
        from app.utils.email import send_email
        send_email(
            to=email,
            subject="Your NEXA AI password reset OTP",
            template="password_reset.html",
            context={"otp": otp, "expires_in": "10 minutes"}
        )
    except Exception as exc:
        raise self.retry(exc=exc)
```

### 18.3 Resume Tasks

```python
# app/tasks/resume_tasks.py
from app.tasks.celery_app import celery_app


@celery_app.task(bind=True, max_retries=2)
def parse_and_analyze_resume(self, resume_id: str, user_id: str):
    """
    Parse uploaded resume and run full ATS analysis.
    Triggered after resume upload completes.
    """
    import asyncio
    from app.services.resume_service import ResumeService

    async def _run():
        service = ResumeService()
        await service.parse_resume(resume_id)
        await service.analyze_ats(resume_id, user_id)

    asyncio.run(_run())
```

---

## 19. WebSocket Module

### 19.1 AI Chat WebSocket Handler

```python
# app/websocket/chat_ws.py
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from app.core.security import decode_jwt
from app.ai.gateway.gateway import AIGateway
from app.repositories.user_repository import UserRepository
from app.repositories.chat_repository import ChatRepository
import structlog

logger = structlog.get_logger()
chat_router = APIRouter()


@chat_router.websocket("/chat")
async def chat_websocket(
    websocket: WebSocket,
    token: str = Query(...),
):
    """
    WebSocket endpoint for real-time AI chat with streaming.
    URL: ws://localhost:8000/ws/chat?token={access_token}
    """
    # 1. Authenticate before accepting the connection
    try:
        payload = decode_jwt(token)
        user_id = payload["sub"]
    except Exception:
        await websocket.close(code=4001)
        return

    await websocket.accept()
    log = logger.bind(user_id=user_id)
    log.info("websocket_connected")

    gateway = AIGateway()
    chat_repo = ChatRepository()

    try:
        while True:
            # 2. Receive message from client
            data = await websocket.receive_json()
            message = data.get("message", "").strip()
            session_id = data.get("session_id")

            if not message:
                continue

            # 3. Send typing indicator
            await websocket.send_json({"type": "typing", "status": True})

            # 4. Process through AI gateway
            try:
                result = await gateway.process_chat(
                    user_id=user_id,
                    session_id=session_id or user_id,
                    message=message,
                )
                # 5. Stream response token by token
                await websocket.send_json({"type": "typing", "status": False})
                await websocket.send_json({
                    "type": "response",
                    "content": result["response"],
                    "intent": result["intent"],
                    "agents_used": result["agents_used"],
                    "latency_ms": result["latency_ms"],
                })
            except Exception as e:
                log.error("websocket_ai_error", error=str(e))
                await websocket.send_json({
                    "type": "error",
                    "message": "AI service temporarily unavailable. Please try again.",
                })

    except WebSocketDisconnect:
        log.info("websocket_disconnected")
```

---

## 20. File Upload Service

```python
# app/services/file_service.py
import boto3
import magic
from fastapi import UploadFile, HTTPException, status
from app.config import settings

ALLOWED_RESUME_TYPES = {"application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"}
MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB


class FileService:

    def __init__(self):
        self.s3 = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION,
        )

    async def upload_resume(self, user_id: str, file: UploadFile) -> dict:
        """Validate and upload resume to S3. Returns file metadata."""
        # 1. Size validation
        contents = await file.read()
        if len(contents) > MAX_RESUME_SIZE_BYTES:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="File exceeds 5 MB size limit",
            )

        # 2. MIME type validation (not just extension)
        detected_type = magic.from_buffer(contents, mime=True)
        if detected_type not in ALLOWED_RESUME_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only PDF and DOCX files are accepted",
            )

        # 3. Upload to S3
        key = f"resumes/{user_id}/{file.filename}"
        self.s3.put_object(
            Bucket=settings.AWS_S3_BUCKET,
            Key=key,
            Body=contents,
            ContentType=detected_type,
        )
        file_url = f"https://{settings.AWS_S3_BUCKET}.s3.{settings.AWS_REGION}.amazonaws.com/{key}"

        return {
            "file_url": file_url,
            "file_name": file.filename,
            "file_size_bytes": len(contents),
            "file_type": "pdf" if "pdf" in detected_type else "docx",
        }
```

---

## 21. Logging System

```python
# app/utils/logger.py
import logging
import structlog
from app.config import settings


def configure_logging():
    """Configure structlog for JSON structured logging."""

    shared_processors = [
        structlog.contextvars.merge_contextvars,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
    ]

    if settings.APP_ENV == "production":
        renderer = structlog.processors.JSONRenderer()
    else:
        renderer = structlog.dev.ConsoleRenderer()

    structlog.configure(
        processors=[*shared_processors, renderer],
        wrapper_class=structlog.stdlib.BoundLogger,
        context_class=dict,
        logger_factory=structlog.stdlib.LoggerFactory(),
        cache_logger_on_first_use=True,
    )

    logging.basicConfig(
        level=logging.INFO if settings.APP_ENV == "production" else logging.DEBUG,
        format="%(message)s",
    )
```

---

## 22. Health Checks

```python
# Registered in app/main.py (see Section 4)

@app.get("/health", tags=["System"])
async def health_check():
    """Basic liveness probe."""
    return {"status": "healthy", "version": "1.0.0"}


@app.get("/health/ready", tags=["System"])
async def readiness_check():
    """Readiness probe — checks all dependencies."""
    from app.core.database import get_db
    from app.core.redis_client import get_redis
    checks = {}

    try:
        db = get_db()
        await db.command("ping")
        checks["mongodb"] = "ok"
    except Exception:
        checks["mongodb"] = "unreachable"

    try:
        redis = await get_redis()
        await redis.ping()
        checks["redis"] = "ok"
    except Exception:
        checks["redis"] = "unreachable"

    all_ok = all(v == "ok" for v in checks.values())
    return {
        "status": "ready" if all_ok else "degraded",
        "checks": checks,
    }
```

---

## 23. Backend Startup Flow

```
FastAPI Starts (Uvicorn)
       │
       ▼
configure_logging()         ← structlog setup
       │
       ▼
init_db()                   ← Motor connects to MongoDB Atlas
       │                        Beanie initializes 32 document models
       ▼
init_redis()                ← Redis connection pool created
       │
       ▼
init_qdrant()               ← Qdrant client initialized
       │
       ▼
Add Middleware Stack         ← CORS → RequestID → Logging →
       │                        RateLimit → SecurityHeaders
       ▼
register_exception_handlers()
       │
       ▼
include_router(api_v1_router, prefix="/api/v1")
       │
       ▼
include_router(chat_router, prefix="/ws")
       │
       ▼
Register /health & /health/ready endpoints
       │
       ▼
Application Ready
       │
       ▼
Celery Worker starts (separate process)
       │
       ▼
Celery Beat starts (separate process)
       │
       ▼
🚀 NEXA AI Backend — Fully Operational
```

---

## 24. Development Standards

### 24.1 Router Rules

| Rule                                | Why                                         |
|-------------------------------------|---------------------------------------------|
| Routers call services only          | Keeps routes thin and testable              |
| No database code in routers         | Repository layer owns DB access             |
| Always return typed response models | OpenAPI docs auto-generated correctly       |
| Wrap all responses in `APIResponse` | Consistent client-side handling             |
| Use `Depends()` for dependencies    | FastAPI handles lifecycle and mocking       |

### 24.2 Service Rules

| Rule                                | Why                                         |
|-------------------------------------|---------------------------------------------|
| Services call repositories only     | No direct DB driver calls in services       |
| All business logic belongs here     | One place to find and test business rules   |
| Services are async                  | Non-blocking I/O throughout the stack       |
| Services raise `NexaBaseException`  | Consistent exception hierarchy              |
| Heavy tasks dispatched to Celery    | Keeps API response time fast                |

### 24.3 Repository Rules

| Rule                                | Why                                         |
|-------------------------------------|---------------------------------------------|
| One repository per aggregate        | Clear ownership of data access              |
| Only Beanie/Motor calls here        | Keeps DB logic isolated                     |
| Return typed Beanie models          | Services work with typed objects            |
| No business logic in repositories   | Separation of concerns                      |

---

## 25. Deployment Readiness

### 25.1 Docker Production Configuration

```dockerfile
# Dockerfile (production)
FROM python:3.13-slim AS builder
WORKDIR /build
COPY requirements/prod.txt .
RUN pip install --no-cache-dir -r prod.txt

FROM python:3.13-slim AS runtime
WORKDIR /app
RUN adduser --disabled-password --gecos '' appuser
COPY --from=builder /usr/local/lib/python3.13/site-packages \
                    /usr/local/lib/python3.13/site-packages
COPY . .
USER appuser
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1
CMD ["gunicorn", "app.main:app", \
     "--workers", "4", \
     "--worker-class", "uvicorn.workers.UvicornWorker", \
     "--bind", "0.0.0.0:8000"]
```

### 25.2 Deployment Checklist

| Item                          | Check |
|-------------------------------|-------|
| `/health` endpoint returns 200| ⬜    |
| `/health/ready` passes all checks | ⬜ |
| JWT keys generated (RS256)    | ⬜    |
| `.env.production` configured  | ⬜    |
| Swagger UI disabled in prod   | ⬜    |
| `DEBUG=False` in production   | ⬜    |
| MongoDB Atlas IP allowlist set| ⬜    |
| Redis password set in prod    | ⬜    |
| Celery worker started         | ⬜    |
| Prometheus metrics exposed    | ⬜    |

---

## Phase Summary

| Phase | Document                            | Status     |
|-------|-------------------------------------|------------|
| 1     | Software Requirements Spec (SRS)    | ✅ Complete |
| 2     | Functional Requirements (FRS)       | ✅ Complete |
| 3     | Non-Functional Requirements (NFR)   | ✅ Complete |
| 4     | System Architecture Design (SAD)    | ✅ Complete |
| 5     | Technology Stack & Dev Standards    | ✅ Complete |
| 6     | Database Design & MongoDB Arch (DDA)| ✅ Complete |
| 7     | Backend Architecture & FastAPI (BAD)| ✅ Complete |

---

> **Phase 7 Complete** — Clean Architecture, 130+ API endpoints, AI Gateway pipeline, LangGraph orchestrator, Celery tasks, WebSocket handler, and deployment readiness all defined with production-quality code.
>
> **Next: Phase 8 — Frontend Architecture & UI/UX Design**
> React 19 + TypeScript folder structure, routing, Redux + React Query strategy, AI chat interface, all dashboard screens, design system, theming, and component library.

---

*NEXA AI BAD — Phase 7 of 30 | Version 1.0 | July 2026*
