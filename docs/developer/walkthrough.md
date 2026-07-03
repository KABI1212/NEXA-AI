# NEXA AI Complete Foundation Walkthrough

This document outlines the design decisions and implementation details for the **NEXA AI** core platform infrastructure (Phases 1–7 of the master project foundation).

---

## 🛠️ Summary of Foundation Components

### 1. Vertical Slice & Module Boundaries (STEP 1)
*   Business domains are isolated under `backend/app/modules/` containing slice files (models, routers, schemas, etc.).
*   Shared kernels are grouped under `backend/app/shared/`.
*   AI Operating System components are separated under `backend/app/ai_os/`.
*   Deployment, Terraform, Kubernetes, and monitoring configurations are kept under `infrastructure/`.

### 2. Environment Settings Managers (STEP 2)
*   **Pydantic Settings v2:** Standardizes variables with type validation for MongoDB, Redis, Qdrant, JWT, SMTP, and OAuth profiles.
*   **Settings Selection & Audit Validator:** Dynamically resolves active environment parameters and validates database URL formats. Blocks server execution on startup if secrets are default in production environments.
*   **Feature Toggles:** Manages boolean properties (RAG reranking, sandbox compilation) dynamically at runtime.

### 3. FastAPI Application Skeleton (STEP 3)
*   Configures lifespan context hooks, structured JSON logging, trusted host headers, GZip, request IDs, and validation handlers.
*   Exposes endpoints: `/health` (live check), `/ready` (ready check), and `/live` (liveness checks).

### 4. Database Connection Pools (STEP 4)
*   **MongoDB (Beanie ODM):** Connects pools using `AsyncIOMotorClient` and initializes schemas. Includes a descriptor monkeypatch resolving version conflicts between Beanie 2.1.0 and Motor 3.5+.
*   **Redis Async Cache & Qdrant:** Gracefully handles offline database connections during local development.
*   **Generic Base Repository:** Implements CRUD methods (`NexaBaseRepository`) ignoring soft-deleted elements.

### 5. Security & Cryptography (STEP 5)
*   **Bcrypt Password Cryptography:** Direct secure encryption algorithms.
*   **JWT RS256 Signature Controls:** Generates and verifies tokens via private/public keys, falling back to HS256 in local development for easier onboarding.
*   **Auth Dependency Hooks:** Implements `get_current_user_token_payload` to validate sessions.

### 6. Shared Utilities & Pagination (STEP 6)
*   Provides `PageParams` and `PagedResponse[T]` helper classes.

### 7. Testing Infrastructure (STEP 7)
*   Configures `pytest` and `pytest-asyncio` automatic session fixtures.
*   Runs probe check integration test assertions.

---

## 🔍 Validation Metrics
*   **Local Uvicorn Server:** Active and responsive on `http://127.0.0.1:8000/health`.
*   **Pytest Suite:** All tests passed (`3 passed in 0.21s`).
