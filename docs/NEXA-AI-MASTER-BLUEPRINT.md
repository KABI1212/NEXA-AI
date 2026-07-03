# NEXA AI — Enterprise Master Architecture Blueprint (NABS)
## Unified Platform Design & Production Delivery Blueprint

---

| Field              | Details                                                  |
|--------------------|----------------------------------------------------------|
| **Document**       | Enterprise Master Architecture Blueprint                 |
| **Version**        | 1.0                                                      |
| **Target Engine**  | Clean Architecture Modular Monolith Backend              |
| **Vector Engine**  | Qdrant Semantic Search + Cohere Reranker                 |
| **Orchestrator**   | LangGraph Stateful Cyclic Multi-Agent Engine             |
| **Status**         | ✅ Complete — Ready for Production Execution             |

---

## Table of Contents

1. [Architectural Overview & Core Patterns](#1-architectural-overview--core-patterns)
2. [Unified Master Directory Folder Tree](#2-unified-master-directory-folder-tree)
3. [Domain Data Layer (MongoDB & Beanie Models)](#3-domain-data-layer-mongodb--beanie-models)
4. [FastAPI Endpoint Routing Specifications](#4-fastapi-endpoint-routing-specifications)
5. [AI Operating System (AI-OS) Workflow Logic](#5-ai-operating-system-ai-os-workflow-logic)
6. [Docker Containerization & Production Deployment](#6-docker-containerization--production-deployment)
7. [Testing, QA & Security Audits](#7-testing-qa--security-audits)
8. [Unified Development & Release Roadmap](#8-unified-development--release-roadmap)
9. [Operational SLA Targets Performance Matrix](#9-operational-sla-targets-performance-matrix)

---

## 1. Architectural Overview & Core Patterns

NEXA AI is designed as a **Modular Monolith** using **Clean Architecture** principles. Business domains are kept isolated, and dependencies flow strictly inward toward the core domain logic.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           API Gateway / Nginx                           │
│                      - SSL Termination  - Rate Limit (10r/s)            │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
         ┌───────────────────────────┴───────────────────────────┐
         ▼                                                       ▼
┌──────────────────────────────────┐   ┌──────────────────────────────────┐
│          React Frontend          │   │         FastAPI Backend          │
│          - Vite Bundler          │   │         - Router Layers          │
│          - Zustand Client Store  │   │         - Service Coordinator    │
└──────────────────────────────────┘   └─────────────────┬────────────────┘
                                                         │
                                           ┌─────────────┴─────────────┐
                                           ▼                           ▼
                                 ┌──────────────────┐        ┌──────────────────┐
                                 │   Celery Queue   │        │  AI-OS Engine    │
                                 │   - Async Parser │        │  - LangGraph     │
                                 │   - QR Cert Gen  │        │  - Qdrant RAG    │
                                 └──────────────────┘        └──────────────────┘
```

---

## 2. Unified Master Directory Folder Tree

Below is the complete project directory structure, separating the frontend UI from the backend services and deployment configurations.

```
AI-Career-Guidance-System/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/           # FastAPI Routes (endpoints)
│   │   ├── core/             # Base configurations & connection managers
│   │   ├── models/           # Beanie MongoDB documents
│   │   ├── repositories/     # Database CRUD wrappers
│   │   ├── services/         # Core business logic coord
│   │   ├── ai/               # AI Operating System (LangGraph)
│   │   └── main.py           # Lifespan startup hooks
│   └── tests/                # Pytest unit & integration suites
├── frontend/
│   ├── src/
│   │   ├── app/              # Lazy routing setups
│   │   ├── features/         # Feature-specific pages & components
│   │   └── shared/           # Common components, stores, & themes
│   └── vite.config.ts        # Manual chunk rollups config
└── deployment/
    ├── docker/               # Docker Compose environments
    └── nginx/                # Proxy routing and rate limiters
```

---

## 3. Domain Data Layer (MongoDB & Beanie Models)

The data layer uses Beanie ODM models, providing validation, indexing strategies, and auditing tracking out of the box.

```python
# app/models/base.py
from datetime import datetime
from typing import Optional
from beanie import Document
from pydantic import Field


class NexaBaseDocument(Document):
    # ── Audit Fields ──────────────────────────────────
    created_at:  datetime = Field(default_factory=datetime.utcnow)
    updated_at:  datetime = Field(default_factory=datetime.utcnow)
    created_by:  Optional[str] = None
    updated_by:  Optional[str] = None
    
    # ── Soft Delete ───────────────────────────────────
    is_deleted:  bool = False
    deleted_at:  Optional[datetime] = None
    
    # ── Versioning ────────────────────────────────────
    revision_id: Optional[str] = Field(default=None, alias="_rev")
```

---

## 4. FastAPI Endpoint Routing Specifications

API responses use a unified format, and secure endpoints require JWT authorization headers.

*   **API Success Wrapper:**
    ```json
    {
      "success": true,
      "message": "Request completed successfully",
      "data": {}
    }
    ```
*   **Secure API Route Catalog:**
    *   `POST /auth/register` ➜ Registers a new user, validating their email and checking password complexity.
    *   `POST /auth/login` ➜ Authenticates credentials and returns access/refresh tokens.
    *   `POST /recommend/career` ➜ Generates personalized career match scores.
    *   `POST /coding/submit` ➜ Compiles and runs coding submissions inside isolated Docker containers.

---

## 5. AI Operating System (AI-OS) Workflow Logic

The AI Operating System orchestrates complex workflows using a stateful cyclic graph built with LangGraph.

```
START ──► load_profile ──► load_memory ──► detect_intent
                                                 │
                                         Conditional Route
                                       /         │         \
                                (Career)     (Resume)     (Coding)
                                  /              │              \
                             run_career      run_resume      run_coding
                                  \              │              /
                                   ▼             ▼             ▼
                                         validate_response
                                                 │
                                              Passed?
                                             /       \
                                          [Yes]      [No] ──► detect_intent (Retry)
                                           /
                                          ▼
                                     save_memory ──► END
```

---

## 6. Docker Containerization & Production Deployment

### 6.1 Multi-Stage Dockerfile (FastAPI Backend)
```dockerfile
# Stage 1: Build dependencies
FROM python:3.13-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Stage 2: Final image runs the app
FROM python:3.13-slim
WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY . .
ENV PATH=/root/.local/bin:$PATH
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 7. Testing, QA & Security Audits

The quality assurance pipeline checks unit logic, database integrations, and vector searches.

```yaml
# .github/workflows/quality_gates.yml
name: Code Quality Gates Verification

on:
  push:
    branches: [ "main" ]

jobs:
  run_checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Pytest Suite
        run: |
          cd backend
          pytest --cov=app --cov-fail-under=90
```

---

## 8. Unified Development & Release Roadmap

The project is structured into weekly milestones, estimating development hours and identifying risk mitigation strategies.

```
Week  │ 1  2  3  4  5  6  7  8  9 10 11 12 │ Tasks / Milestone Groups
──────┼────────────────────────────────────┼──────────────────────────────────────
W1-2  │ ████                               │ Auth & Identity Setup
W3-4  │      ████                          │ Resume Parsing & ATS Matchers
W5-6  │           ████                     │ Monaco Coding Sandbox Setup
W7-8  │                ████                │ LangGraph Agent Orchestrators
W9-10 │                     ████           │ RAG & Memory Context Builders
W11   │                          ██        │ QA Checks & Load tests
W12   │                             ████   │ Deployment & Release Package
```

---

## 9. Operational SLA Targets Performance Matrix

To ensure a fast and responsive user experience, platform components are designed to run within strict latency budgets:

| Platform Segment | Evaluation Target | SLA Metric Budget |
| :--- | :--- | :--- |
| **Indexed DB Query** | Beanie MongoDB find | Target: ≤ 25 ms |
| **JWT RSA Verification**| Decoding bearer headers| Target: ≤ 5 ms |
| **RAG Document Search** | Qdrant + Cohere Rerank | Target: ≤ 570 ms |
| **Sandbox Execution** | Container runtime run | Target: ≤ 2900 ms |
| **Stream Token Publish**| Token stream latency | Target: ≤ 30 ms per token |

---

*NEXA AI Master Architecture Blueprint | Version 1.0 | July 2026*
