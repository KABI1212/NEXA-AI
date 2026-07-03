# NEXA AI — Master Project Structure Blueprint
## Technical Folder Schema & Architectural Layout

---

| Field              | Details                                                  |
|--------------------|----------------------------------------------------------|
| **Document**       | Master Project Structure Blueprint                       |
| **Version**        | 1.0 |
| **Target Engine**  | Clean Architecture + Modular Monolith Backend            |
| **UI Paradigm**    | React 19 Feature-Based Directory Structure               |
| **Status**         | ✅ Complete — Implementation Ready                      |

---

## 1. Complete Project Directory Layout

Below is the complete filesystem layout for the **NEXA AI** platform.

```
AI-Career-Guidance-System/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   ├── core/
│   │   ├── middleware/
│   │   ├── models/
│   │   │   ├── identity/
│   │   │   ├── career/
│   │   │   ├── learning/
│   │   │   └── ai/
│   │   ├── repositories/
│   │   │   ├── identity/
│   │   │   ├── career/
│   │   │   ├── learning/
│   │   │   └── ai/
│   │   ├── services/
│   │   │   ├── identity/
│   │   │   ├── career/
│   │   │   ├── learning/
│   │   │   └── ai/
│   │   ├── ai/
│   │   │   ├── agents/
│   │   │   ├── gateway/
│   │   │   ├── memory/
│   │   │   ├── orchestrator/
│   │   │   ├── prompts/
│   │   │   ├── rag/
│   │   │   └── tools/
│   │   ├── tasks/
│   │   └── main.py
│   ├── tests/
│   │   ├── unit/
│   │   ├── integration/
│   │   ├── ai_eval/
│   │   └── load/
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── career/
│   │   │   ├── resume/
│   │   │   ├── learning/
│   │   │   ├── interview/
│   │   │   └── coding/
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── layouts/
│   │   │   ├── services/
│   │   │   ├── store/
│   │   │   ├── styles/
│   │   │   └── types/
│   │   └── main.tsx
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   ├── package.json
│   └── Dockerfile
├── deployment/
│   ├── docker/
│   │   ├── dev.yml
│   │   └── prod.yml
│   ├── nginx/
│   │   └── nginx.conf
│   ├── ssl/
│   └── scripts/
│       └── backup_mongodb.sh
└── docs/
    ├── srs.md
    ├── sdd.md
    └── master-project-structure.md
```

---

## 2. Architectural Diagrams

### 2.1 System Context Flow

```
   ┌─────────────────────────────────────────────────────────────┐
   │                        Web Browser                          │
   │               (React 19 + TypeScript Client)                │
   └──────────────────────────────┬──────────────────────────────┘
                                  │ HTTPS / WebSocket
                                  ▼
   ┌─────────────────────────────────────────────────────────────┐
   │                    Nginx Reverse Proxy                      │
   │           - SSL Termination  - Rate Limiting (10r/s)        │
   └──────────────────────────────┬──────────────────────────────┘
                                  │
         ┌────────────────────────┴────────────────────────┐
         │                                                 │
         ▼ (Port 80)                                       ▼ (Port 8000)
┌──────────────────┐                              ┌──────────────────┐
│  React Frontend  │                              │   FastAPI API    │
│  - Static Assets │                              │   - Gateway      │
└──────────────────┘                              └────────┬─────────┘
                                                           │
                                            ┌──────────────┴──────────────┐
                                            ▼                             ▼
                                  ┌──────────────────┐           ┌──────────────────┐
                                  │  Celery Worker   │           │    Databases     │
                                  │  - Async Tasks   │           │ - MongoDB Atlas  │
                                  │  - Scheduled Jobs│           │ - Redis Cache    │
                                  └──────────────────┘           │ - Qdrant Vector  │
                                                                 └──────────────────┘
```

### 2.2 Layer Dependency Flow

In accordance with Clean Architecture principles, dependencies flow inwards:

```
  ┌───────────────────────────────────────────────────────────┐
  │                        API Layer                          │
  │                  - Routers  - Request Schemas             │
  └─────────────────────────────┬─────────────────────────────┘
                                │ Calls
                                ▼
  ┌───────────────────────────────────────────────────────────┐
  │                     Application Layer                     │
  │                        - Services                         │
  └─────────────────────────────┬─────────────────────────────┘
                                │ Calls
                                ▼
  ┌───────────────────────────────────────────────────────────┐
  │                       Domain Layer                        │
  │           - Repositories  - Beanie Document Models        │
  └─────────────────────────────┬─────────────────────────────┘
                                │ Operations
                                ▼
  ┌───────────────────────────────────────────────────────────┐
  │                    Infrastructure Layer                   │
  │          - MongoDB  - Redis  - Qdrant  - Sandbox          │
  └───────────────────────────────────────────────────────────┘
```

---

## 3. Detailed Folder Specifications

### 3.1 Backend Modules (`backend/app/modules/*`)

Every module contains its own data access, business logic, schemas, and routes, maintaining clean boundaries.

#### 3.1.1 `auth/` (Identity & Session Module)
*   **Purpose:** Manages registration, logins, JWT RS256 token signing, email verification, and session revoking.
*   **Expected Files:**
    *   `router.py` (Endpoints for `/register`, `/login`, `/logout`, `/refresh`)
    *   `service.py` (Argon2 hashing and session management)
    *   `repository.py` (Queries for `User` and `Session` collections)
    *   `schemas.py` (Pydantic models validating emails and password strength)
*   **Responsibilities:** Enforces password strength rules, session limits, and account lockout protections.
*   **Dependencies:** `app.core.security`, `app.models.identity`, `aiosmtplib`, `redis`.

#### 3.1.2 `resume/` (Resume Analysis Module)
*   **Purpose:** Processes PDF resume uploads, parses sections, matches keywords, and calculates ATS scores.
*   **Expected Files:**
    *   `router.py` (Endpoints for `/upload`, `/analyze`, `/optimize`)
    *   `service.py` (Orchestrates text extraction and ATS analysis)
    *   `parser.py` (Uses `pdfplumber` to extract text and identify sections)
    *   `ats_engine.py` (Calculates ATS scores based on job descriptions)
*   **Responsibilities:** Extracts contact info, skills, projects, and work history, and flags missing keywords.
*   **Dependencies:** `pdfplumber`, `app.ai.rag.retriever`, `app.ai.providers.provider_manager`.

#### 3.1.3 `learning/` (Adaptive LMS Module)
*   **Purpose:** Manages courses, lessons, quizzes, assignments, coding challenges, and certificates.
*   **Expected Files:**
    *   `router.py` (Endpoints for `/courses`, `/enroll`, `/quiz/submit`)
    *   `service.py` (Enrollment logic and progress tracking)
    *   `quiz_evaluator.py` (Scores quizzes and provides hints using JSON schemas)
    *   `sandbox.py` (Runs coding challenges in isolated Docker containers)
*   **Responsibilities:** Tracks XP points, learning streaks, and issues cryptographic certificates.
*   **Dependencies:** `docker`, `app.core.database`, `app.models.learning`.

---

### 3.2 AI OS Module (`backend/app/ai/*`)

Acts as an isolated intelligence engine within the backend application.

#### 3.2.1 `orchestrator/`
*   **Purpose:** Manages the main LangGraph compilation, workflow nodes, and routing edges.
*   **Expected Files:**
    *   `graph.py` (Defines the `StateGraph` nodes and transitions)
    *   `state.py` (Defines the global `NexaAgentState` dictionary)
    *   `router.py` (Implements conditional routing functions)
    *   `nodes.py` (Implements individual execution nodes)
*   **Responsibilities:** Routes queries to specialized agents, executes parallel flows, and runs the validator node.
*   **Dependencies:** `langgraph`, `app.ai.state`, `app.ai.agents`.

#### 3.2.2 `memory/`
*   **Purpose:** Manages short-term conversation logs in Redis and long-term user memories.
*   **Expected Files:**
    *   `memory_service.py` (Redis active context client)
    *   `importance.py` (Extracts facts and analyzes sentiment)
    *   `personalization.py` (Constructs system prompt context blocks)
*   **Responsibilities:** Keeps memory summaries under 50 messages and tracks facts, preferences, and goals.
*   **Dependencies:** `redis`, `app.models.ai`, `app.ai.providers.provider_manager`.

#### 3.2.3 `rag/`
*   **Purpose:** Handles vector document search using Qdrant.
*   **Expected Files:**
    *   `retriever.py` (Sends similarity queries to Qdrant)
    *   `reranker.py` (Runs second-stage cross-encoder re-ranking)
    *   `context_builder.py` (Structures system prompts with inline citations)
*   **Responsibilities:** Matches context documents, filters by user permissions, and provides source citations.
*   **Dependencies:** `qdrant-client`, `app.config`.

---

### 3.3 Frontend Features (`frontend/src/features/*`)

The frontend is organized by domain features, keeping components and feature logic modular.

#### 3.3.1 `auth/`
*   **Purpose:** Renders registration, login, OTP verification, and password reset views.
*   **Expected Files:**
    *   `pages/LoginPage.tsx` (Sign in page with validation checks)
    *   `components/ProtectedRoute.tsx` (Ensures pages are accessible only to authorized roles)
    *   `hooks/useAuth.ts` (Signs users in and updates the Zustand store)
*   **Responsibilities:** Enforces route protection and cleans local storage on logout.
*   **Dependencies:** `react-router-dom`, `react-hook-form`, `zod`, `@/shared/store/authStore`.

#### 3.3.2 `coding/`
*   **Purpose:** Renders the Monaco coding editor and compiler output logs.
*   **Expected Files:**
    *   `pages/CodingLab.tsx` (Editor panel layout)
    *   `components/MonacoEditor.tsx` (Custom Monaco wrapper component)
    *   `hooks/useExecuteCode.ts` (Sends code to the backend Docker sandbox)
*   **Responsibilities:** Safely mounts and disposes the editor to prevent memory leaks.
*   **Dependencies:** `monaco-editor`, `@tanstack/react-query`, `@/shared/services/api`.

---

### 3.4 DevOps & Deployment (`deployment/*`)

Manages the containerized production infrastructure.

#### 3.4.1 `nginx/`
*   **Purpose:** Acts as the reverse proxy, SSL termination endpoint, and request rate limiter.
*   **Expected Files:**
    *   `nginx.conf` (Defines HTTP-to-HTTPS redirects and proxy rules)
*   **Responsibilities:** Restricts client IPs to 10 requests per second and manages WebSocket upgrade handshakes.
*   **Dependencies:** Let's Encrypt SSL Certificates, Docker.

---

## 4. Operational Performance Targets

To maintain a fast and reliable user experience, system operations are measured against these target latencies:

| Action Category | Target Latency | Metric Target |
| :--- | :--- | :--- |
| **Indexed DB Query** | Database lookup | Target: ≤ 45 ms |
| **Monaco Code Compile** | Docker sandbox run | Target: ≤ 2900 ms |
| **JWT Verification** | Token validation | Target: ≤ 5 ms |
| **RAG Document Search** | Qdrant + Cohere Rerank | Target: ≤ 570 ms |
| **AI Stream Token** | WebSocket pub-sub | Target: ≤ 30 ms per token |

---

*NEXA AI Master Project Structure | Version 1.0 | July 2026*
