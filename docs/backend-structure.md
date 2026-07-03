# NEXA AI — FastAPI Backend Structure Blueprint
## Production Folder Mapping & Layer Responsibilities

---

| Field              | Details                                                  |
|--------------------|----------------------------------------------------------|
| **Document**       | FastAPI Backend Structure Blueprint                      |
| **Version**        | 1.0                                                      |
| **Framework**      | FastAPI 0.115                                            |
| **Pattern**        | Modular Monolith + Clean Architecture                    |
| **Status**         | ✅ Complete — Implementation Ready                      |

---

## 1. Overall Directory Layout

The backend directory structures are divided into core application components and business domain modules.

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   ├── core/
│   ├── middleware/
│   ├── models/
│   ├── repositories/
│   ├── services/
│   ├── ai/
│   │   ├── gateway/
│   │   ├── providers/
│   │   ├── agents/
│   │   ├── memory/
│   │   ├── rag/
│   │   └── tools/
│   ├── tasks/
│   └── main.py
└── tests/
    ├── unit/
    ├── integration/
    ├── ai_eval/
    └── load/
```

---

## 2. Directory Mappings & Layer Specifications

### 2.1 Core System Packages (`app/core/*`)
*   **Purpose:** Configures global database clients, security utils, settings mappings, and core exception classes.
*   **Expected Files:**
    *   `config.py` (BaseSettings configurations loaded from env variables)
    *   `database.py` (Beanie initialization and Redis context client connections)
    *   `security.py` (Password hashing and JWT generation utils)
    *   `exceptions.py` (Custom base exceptions for the platform)
*   **Responsibilities:** Enforces cryptographic rules, database connection lifecycles, and configuration validation.
*   **Dependencies:** `pydantic-settings`, `beanie`, `redis`, `passlib`.

### 2.2 Domain Service Layers (`app/services/*`)
*   **Purpose:** Orchestrates business logic, transactional writes, and service-to-service communication.
*   **Expected Files:**
    *   `auth_service.py` (Credential checks, registration, and logout flows)
    *   `resume_service.py` (ATS score matching and bullet rewriting triggers)
    *   `learning_service.py` (Enrollment logic and quiz grading coordinates)
*   **Responsibilities:** Implements validation rules, error handling, and transaction lifecycle bounds.
*   **Dependencies:** `app.repositories`, `app.models`, `app.core.exceptions`.

### 2.3 Database Repositories (`app/repositories/*`)
*   **Purpose:** Encapsulates raw database queries and index scans.
*   **Expected Files:**
    *   `user_repository.py` (Beanie checks for emails and active status)
    *   `session_repository.py` (Session creation and JTI token checks)
    *   `course_repository.py` (Course list queries with page and sorting filters)
*   **Responsibilities:** Handles MongoDB queries, filters active documents, and enforces indexing strategies.
*   **Dependencies:** `beanie`, `app.models`.

### 2.4 API Routers (`app/api/v1/*`)
*   **Purpose:** Exposes HTTP endpoints, processes input parameters, and returns structured JSON responses.
*   **Expected Files:**
    *   `auth_router.py` (Registration, login, and token refresh endpoints)
    *   `resume_router.py` (Resume upload, analysis, and optimization endpoints)
    *   `learning_router.py` (Course details and enrollment endpoints)
*   **Responsibilities:** Validates requests, decodes auth headers, and maps responses to Pydantic schemas.
*   **Dependencies:** `fastapi`, `app.services`, `app.core.dependencies`.

---

## 3. Operational Performance SLA Targets

To ensure a responsive interface, backend tasks are designed to match strict latency targets:

| Backend Layer | SLA Target Limit | Performance Target |
| :--- | :--- | :--- |
| **API Parsing** | Request schema checks | Target: ≤ 20 ms |
| **JWT Decryption** | Token validation | Target: ≤ 5 ms |
| **DB Query (ID)** | Fetching a document by ID | Target: ≤ 25 ms |
| **JSON Serialization** | Formatting responses | Target: ≤ 30 ms |
| **System Probe check** | Health check ping | Target: ≤ 120 ms |

---

*NEXA AI Backend Structure | Version 1.0 | July 2026*
