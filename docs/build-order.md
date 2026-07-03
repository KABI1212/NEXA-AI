# NEXA AI — Implementation Build Order Specification
## Step-by-Step Dependency Tree & Coding Guide

---

| Field              | Details                                                  |
|--------------------|----------------------------------------------------------|
| **Document**       | Implementation Build Order Specification                 |
| **Version**        | 1.0                                                      |
| **Pattern**        | Bottom-Up Dependency Ordering                            |
| **Architecture**   | Modular Monolith Clean Architecture                      |
| **Status**         | ✅ Complete — Implementation Ready                      |

---

## 1. Core Architecture Dependency Tree

To prevent dependency loops, components are built using a bottom-up approach.

```
                    ┌─────────────────────────┐
                    │  1. Config & Databases  │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │  2. Beanie Doc Models   │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │  3. Repository Layer    │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │  4. Business Services   │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │  5. API Router Layers   │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │  6. Frontend Client     │
                    └─────────────────────────┘
```

---

## 2. Backend Coding Sequence

### 2.1 Step 1: Core Configs & Connection Managers
Create configurations and connection clients first.
1.  `app/core/config.py` (Base settings loader)
2.  `app/core/database.py` (Beanie + Motor initialization)
3.  `app/core/exceptions.py` (Custom base exception definitions)

### 2.2 Step 2: Database Models
Define Beanie database models to establish the data layer.
1.  `app/models/base.py` (Shared audit base schemas)
2.  `app/models/enums.py` (User role, status, and goal enums)
3.  `app/models/identity/user.py` (User credentials model)
4.  `app/models/identity/profile.py` (User profiles model)

### 2.3 Step 3: Repositories & Services
Implement database query layers followed by service business logic.
1.  `app/repositories/base.py` (Generic CRUD interfaces)
2.  `app/repositories/identity/user_repository.py` (Queries for users)
3.  `app/services/identity/auth_service.py` (Password hashing and session checks)

---

## 3. Frontend to Backend Integrations

Frontend views depend directly on backend API endpoints. Build endpoints before starting their respective frontend views.

```
Frontend Page                  Backend API Dependency
─────────────────────────────  ─────────────────────────────
/login, /register             ➜ POST /auth/login, POST /auth/register
/dashboard (Home)             ➜ GET /profile/me, GET /learning/progress
/resume (ATS parser)          ➜ POST /resume/upload, POST /resume/analyze
/coding (Monaco IDE)          ➜ POST /coding/run, POST /coding/submit
/interview (Mock Coach)       ➜ POST /interview/start, POST /interview/submit
```

---

## 4. Operational Performance SLA Targets

To ensure a responsive interface, coding steps are optimized to match target latencies:

| Coding Step | Target Latency | Performance Target |
| :--- | :--- | :--- |
| **Model Init Checks** | Connecting to database | Target: ≤ 120 ms |
| **JWT Signature check** | Authenticating token | Target: ≤ 5 ms |
| **Generic Repo Find** | Database query by ID | Target: ≤ 25 ms |
| **Router Parse Hook** | JSON input validation | Target: ≤ 20 ms |
| **Celery Queue Trigger**| Message broker enqueue | Target: ≤ 40 ms |

---

*NEXA AI Build Order | Version 1.0 | July 2026*
