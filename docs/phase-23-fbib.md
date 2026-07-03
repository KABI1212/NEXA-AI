# NEXA AI — FastAPI Backend Implementation Blueprint (FBIB)
## Phase 23 — Implementation Blueprint

---

| Field              | Details                                                  |
|--------------------|----------------------------------------------------------|
| **Document**       | FastAPI Backend Implementation Blueprint                 |
| **Phase**          | 23 of 30                                                 |
| **Version**        | 1.0                                                      |
| **Design Pattern** | Modular Monolith + Clean Architecture                    |
| **Framework**      | FastAPI 0.115                                            |
| **Target Python**  | Python 3.13+                                             |
| **Status**         | ✅ Complete — Implementation Ready                      |

---

## Table of Contents

1. [Modular Monolith Architecture Folder Structure](#1-modular-monolith-architecture-folder-structure)
2. [FastAPI App Factory & Lifecycle Settings](#2-fastapi-app-factory--lifecycle-settings)
3. [Global Exception Handlers & Custom Middleware](#3-global-exception-handlers--custom-middleware)
4. [Dependency Injection & Context Management](#4-dependency-injection--context-management)
5. [Celery Async Task Integration (Celery + Redis)](#5-celery-async-task-integration-celery--redis)
6. [Structured JSON Logging & Observability Setup](#6-structured-json-logging--observability-setup)
7. [Health Probe Endpoint Specs](#7-health-probe-endpoint-specs)
8. [Backend Configuration Matrix](#8-backend-configuration-matrix)
9. [Performance Targets Matrix](#9-performance-targets-matrix)

---

## 1. Modular Monolith Architecture Folder Structure

To scale effectively, the backend is organized as a Modular Monolith. Each business domain operates as a self-contained module containing its own routers, models, services, and repositories.

```
backend/app/
├── __init__.py
├── main.py                   # App Entry point & Lifespan setup
├── core/                     # Platform shared infrastructure
│   ├── config.py             # Settings class
│   ├── exceptions.py         # Global Exceptions base
│   ├── security.py           # JWT token signers
│   └── database.py           # Beanie & Redis clients
├── middleware/               # CORS, logging, exception handlers
├── modules/                  # Modular Monolith domains
│   ├── __init__.py
│   ├── auth/                 # Auth routes, services, models
│   ├── career/               # Goals & matching logic
│   ├── resume/               # Parser and ATS systems
│   └── learning/             # LMS & Quiz modules
└── tasks/                    # Celery asynchronous tasks
```

---

## 2. FastAPI App Factory & Lifecycle Settings

We use a lifespan context manager to initialize database connections, index structures, and background task clients.

```python
# app/main.py
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import init_mongodb, init_redis, close_connections
from app.middleware.exception_middleware import GlobalExceptionMiddleware
from app.modules.auth.router import router as auth_router
from app.modules.resume.router import router as resume_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle manager governing database connections on startup and shutdown."""
    # ── Startup Events ────────────────────────────────
    await init_mongodb()
    await init_redis()
    
    yield
    
    # ── Shutdown Events ───────────────────────────────
    await close_connections()


def create_app() -> FastAPI:
    """App Factory initializing middleware, routing paths, and error handlers."""
    app = FastAPI(
        title="NEXA AI Backend",
        version="1.0",
        lifespan=lifespan,
        docs_url="/docs",
        redoc_url="/redoc"
    )

    # Enforce CORS rules
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Enforce Exception & Request Logging Middleware
    app.add_middleware(GlobalExceptionMiddleware)

    # Mount modules routers
    app.include_router(auth_router, prefix="/api/v1/auth")
    app.include_router(resume_router, prefix="/api/v1/resume")

    return app

app = create_app()
```

---

## 3. Global Exception Handlers & Custom Middleware

Standardizes error responses and logs incoming requests.

```python
# app/middleware/exception_middleware.py
import time
import logging
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.responses import JSONResponse
from app.core.exceptions import BaseNexaException

logger = logging.getLogger("nexa.api")


class GlobalExceptionMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        start_time = time.time()
        try:
            response = await call_next(request)
            process_time = time.time() - start_time
            logger.info(
                f"Path: {request.url.path} | Status: {response.status_code} | Time: {process_time:.4f}s"
            )
            return response
        except Exception as exc:
            process_time = time.time() - start_time
            logger.error(
                f"Path: {request.url.path} | Error: {str(exc)} | Time: {process_time:.4f}s"
            )
            return self._handle_exception(exc)

    def _handle_exception(self, exc: Exception) -> JSONResponse:
        """Translates uncaught exceptions into standard error payloads."""
        if isinstance(exc, BaseNexaException):
            return JSONResponse(
                status_code=exc.status_code,
                content={
                    "success": False,
                    "error": {
                        "code": exc.error_code,
                        "message": exc.message
                    }
                }
            )
            
        # Catch-all fallback
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": {
                    "code": "INTERNAL_SERVER_ERROR",
                    "message": "An unexpected error occurred."
                }
            }
        )
```

---

## 4. Dependency Injection & Context Management

Dependencies are injected dynamically to manage resource allocation.

```python
# app/core/dependencies.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.security import decode_access_token
from app.modules.auth.repository import AuthRepository
from app.models.identity.user import NexaUserDocument

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> NexaUserDocument:
    """Dependency extracting and validating user contexts from JWT."""
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token."
        )

    user_id = payload.get("sub")
    repo = AuthRepository()
    user = await repo.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authenticated user document not found."
        )
    return user
```

---

## 5. Celery Async Task Integration (Celery + Redis)

We use Celery to run long-running background tasks (like PDF parsing and email delivery) asynchronously.

```python
# app/tasks/celery_app.py
from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "nexa_tasks",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=["app.tasks.resume_tasks"]
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True
)
```

```python
# app/tasks/resume_tasks.py
from app.tasks.celery_app import celery_app
import asyncio


@celery_app.task(bind=True, max_retries=3)
def process_resume_parsing_task(self, file_path: str, user_id: str):
    """Celery task processing PDF text extraction in background workers."""
    try:
        from app.modules.resume.service import ResumeParsingService
        service = ResumeParsingService()
        # Run async function inside sync worker thread
        asyncio.run(service.parse_and_evaluate(file_path, user_id))
    except Exception as exc:
        raise self.retry(exc=exc, countdown=10)
```

---

## 6. Structured JSON Logging & Observability Setup

Logs are formatted in structured JSON, making them ready to export to centralized logging systems like Grafana Loki.

```python
# app/core/logging_config.py
import logging
import json
from datetime import datetime


class StructuredJSONFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        log_record = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        if record.exc_info:
            log_record["exception"] = self.formatException(record.exc_info)
        return json.dumps(log_record)


def configure_structured_logging():
    handler = logging.StreamHandler()
    handler.setFormatter(StructuredJSONFormatter())
    logging.basicConfig(level=logging.INFO, handlers=[handler])
```

---

## 7. Health Probe Endpoint Specs

Kubernetes-style readiness and liveness checks verify that the backend and its databases are online.

```python
# app/api/v1/system/probes.py
from fastapi import APIRouter
from app.core.database import get_mongodb_client, get_redis_client

router = APIRouter(prefix="/probes", tags=["Kubernetes Probes"])


@router.get("/ready")
async def readiness_probe():
    """Verify that backend databases are accessible."""
    try:
        # Check MongoDB
        client = get_mongodb_client()
        await client.admin.command("ping")
        # Check Redis
        redis = get_redis_client()
        await redis.ping()
    except Exception:
        from fastapi import HTTPException
        raise HTTPException(status_code=503, detail="Service not ready")
        
    return {"status": "ready"}
```

---

## 8. Backend Configuration Matrix

Settings are loaded dynamically from environment variables, using fallback defaults for local development.

```python
# app/core/config.py
from pydantic_settings import BaseSettings
from typing import list


class Settings(BaseSettings):
    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000"]
    MONGO_URL:       str = "mongodb://localhost:27017/nexa"
    REDIS_URL:       str = "redis://localhost:6379/0"
    QDRANT_URL:      str = "http://localhost:6333"
    SECRET_KEY:      str = "DEV_SECRET_KEY_REPLACE_IN_PRODUCTION"

    class Config:
        env_file = ".env"


settings = Settings()
```

---

## 9. Performance Targets Matrix

To keep response times low, backend tasks are designed to match strict latency targets:

| Operation Step | Target Metric | Metric SLA |
| :--- | :--- | :--- |
| **Request Parsing** | Pydantic validation | Target: ≤ 20 ms |
| **JWT Decoding** | JWT decode runtime | Target: ≤ 5 ms |
| **Celery Queue Enqueue** | Redis push task | Target: ≤ 40 ms |
| **Error Rendering** | Exception middleware | Target: ≤ 10 ms |
| **System Probe check** | Ping response | Target: ≤ 120 ms |

---

## Phase Summary

| Phase | Document                                  | Status     |
|-------|-------------------------------------------|------------|
| 1     | Software Requirements Spec (SRS)          | ✅ Complete |
| 2     | Functional Requirements (FRS)             | ✅ Complete |
| 3     | Non-Functional Requirements (NFR)         | ✅ Complete |
| 4     | System Architecture Design (SAD)          | ✅ Complete |
| 5     | Technology Stack & Dev Standards          | ✅ Complete |
| 6     | Database Design & MongoDB Arch (DDA)      | ✅ Complete |
| 7     | Backend Architecture & FastAPI (BAD)      | ✅ Complete |
| 8     | Frontend Architecture & UI/UX (FAD)       | ✅ Complete |
| 9     | Authentication & Authorization System     | ✅ Complete |
| 10    | AI Multi-Agent System Architecture (AMSA)  | ✅ Complete |
| 11    | LangGraph Orchestrator & Workflow Engine  | ✅ Complete |
| 12    | AI Memory & Personalization Engine (AMPE)  | ✅ Complete |
| 13    | RAG & Knowledge Base Architecture          | ✅ Complete |
| 14    | AI Career Recommendation Engine (ACRE)     | ✅ Complete |
| 15    | AI Career Guidance Agent (CGA)            | ✅ Complete |
| 16    | AI Resume Intelligence System (RAIOS)      | ✅ Complete |
| 17    | AI Interview Coach System (AICPPS)        | ✅ Complete |
| 18    | AI Learning Management System (AI-LMS)     | ✅ Complete |
| 19    | Feedback & System Intelligence (FCLSIP)   | ✅ Complete |
| 20    | Production Deployment & DevOps (PDO)      | ✅ Complete |
| 21    | Complete REST API Specification (OpenAPI)  | ✅ Complete |
| 22    | MongoDB Models & Beanie Design (MBDD)     | ✅ Complete |
| 23    | FastAPI Backend Implementation (FBIB)     | ✅ Complete |

---

> **Phase 23 Complete** — App configurations, error handling middleware, dependency injection, and Celery task systems defined.
>
> **Next: Phase 24 — React Frontend Implementation Blueprint**
> React architecture directories, routing structures, TanStack Query hooks, Zustand slices, and Monaco custom wrapper styles.

---

*NEXA AI Phase 23 — FastAPI Backend Blueprint | Version 1.0 | July 2026*
