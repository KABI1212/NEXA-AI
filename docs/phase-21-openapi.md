# NEXA AI — Complete REST API Specification (OpenAPI Design)
## Phase 21 — Implementation Blueprint

---

| Field              | Details                                                  |
|--------------------|----------------------------------------------------------|
| **Document**       | Complete REST API Specification (OpenAPI Design)         |
| **Phase**          | 21 of 30                                                 |
| **Version**        | 1.0                                                      |
| **Base URL**       | `https://api.nexa-ai.com/api/v1`                         |
| **Format**         | JSON API standard schemas                                |
| **Target Python**  | Python 3.13+                                             |
| **Status**         | ✅ Complete — Implementation Ready                      |

---

## Table of Contents

1. [Standard Response Structures](#1-standard-response-structures)
2. [Phase 1 (Core Module Endpoints)](#2-phase-1-core-module-endpoints)
3. [Phase 2 (Learning & Interview Endpoints)](#3-phase-2-learning--interview-endpoints)
4. [Phase 3 (Admin & Analytics Endpoints)](#4-phase-3-admin--analytics-endpoints)
5. [WebSocket Operations Specs](#5-websocket-operations-specs)
6. [Pagination, Filtering & Sorting Conventions](#6-pagination-filtering--sorting-conventions)
7. [Security Headers & Rate Limiting Configurations](#7-security-headers--rate-limiting-configurations)
8. [Folder Structure Configuration](#8-folder-structure-configuration)
9. [Performance Targets Matrix](#9-performance-targets-matrix)

---

## 1. Standard Response Structures

Every API endpoint must return a structured response payload matching these specifications.

### 1.1 Success Response Schema (Generic JSON)

```json
{
    "success": true,
    "message": "Request completed successfully",
    "data": {},
    "meta": {
        "page": 1,
        "limit": 20,
        "total_count": 120
    },
    "timestamp": "2026-07-03T10:00:00Z"
}
```

### 1.2 Error Response Schema (Generic JSON)

```json
{
    "success": false,
    "error": {
        "code": "RESOURCE_NOT_FOUND",
        "message": "User profile document not found",
        "details": [
            {
                "field": "user_id",
                "message": "Pydantic ID format mismatch"
            }
        ]
    },
    "timestamp": "2026-07-03T10:00:00Z"
}
```

---

## 2. Phase 1 (Core Module Endpoints)

### 2.1 Authentication Router

*   `POST /auth/register` (Register user, initiates pending OTP verify status).
*   `POST /auth/login` (Login with credentials, yields access JWT and sets refresh cookie).
*   `POST /auth/logout` (Deletes session records and blacklists active tokens).
*   `POST /auth/refresh` (Rotates and refreshes access tokens using httponly cookies).
*   `POST /auth/verify-email` (Verifies email addresses with OTPs).
*   `POST /auth/forgot-password` (Sends password reset OTPs anonymously).
*   `POST /auth/reset-password` (Resets password using verification OTPs).
*   `GET /auth/me` (Returns authenticated user profile details).

```python
# app/api/v1/auth/schemas.py (Endpoint payloads)
from pydantic import BaseModel, EmailStr


class AuthRegisterInput(BaseModel):
    first_name: str
    last_name:  str
    email:      EmailStr
    password:   str


class AuthLoginInput(BaseModel):
    email:    EmailStr
    password: str
```

### 2.2 Profile Router

*   `GET /profile` (Fetch profile snapshot).
*   `PUT /profile` (Update background details).
*   `POST /profile/image` (Upload avatar image file).
*   `GET /profile/skills` (Fetch active skills list).
*   `POST /profile/skills` (Create new skill entry).

### 2.3 Resume Router

*   `POST /resume/upload` (Upload PDF, parses sections and sanitizes raw text).
*   `POST /resume/analyze` (Calculates ATS match metrics against job descriptions).
*   `POST /resume/optimize` (Optimizes weak descriptions using metrics-focused phrasing).
*   `GET /resume/history` (Lists previous resume uploads).

---

## 3. Phase 2 (Learning & Interview Endpoints)

### 3.1 Learning Router

*   `GET /courses` (Fetch paginated, filtered course lists).
*   `GET /courses/{id}` (Fetch structural modules and lessons).
*   `POST /courses/enroll` (Enroll user and initialize progress tracker documents).
*   `GET /courses/progress` (Fetch user completion statuses).

### 3.2 Quiz Router

*   `GET /quiz/{lesson_id}` (Fetch lesson quiz questions).
*   `POST /quiz/submit` (Submit quiz answers for review).

### 3.3 Interview Router

*   `POST /interview/start` (Initialize mock sessions and generate first questions).
*   `POST /interview/answer` (Submit answers for evaluation, adjusts next question's difficulty).
*   `POST /interview/end` (End session, compile metrics, and generate final mock report).
*   `GET /interview/report/{id}` (Fetch compiled mock report details).

---

## 4. Phase 3 (Admin & Analytics Endpoints)

### 4.1 Analytics Router

*   `GET /analytics/student` (Fetch placement readiness indices and skills metrics).
*   `GET /analytics/admin` (Fetch active system load statistics and user registrations).

### 4.2 Admin Router

*   `GET /admin/users` (List all users with paginated filters).
*   `PUT /admin/user/{id}` (Update user role permissions).
*   `DELETE /admin/user/{id}` (Soft delete target user account).
*   `POST /admin/course` (Publish new course structures).

---

## 5. WebSocket Operations Specs

FastAPI WebSocket routing endpoints manage real-time streams.

### 5.1 Real-Time Chat (WebSocket Router)

*   **Endpoint:** `WS /api/v1/ws/chat`
*   **Protocol:** JSON payload events.
*   **Handshake/Auth:** Query string JWT Token verification: `WS /api/v1/ws/chat?token=<jwt_token>`

#### Input Frame (Client ➜ Server)
```json
{
    "event": "send_message",
    "data": {
        "session_id": "session-uuid-1234",
        "message": "Which certifications are best for Cloud engineering?"
    }
}
```

#### Output Frame (Server ➜ Client)
```json
{
    "event": "stream_token",
    "data": {
        "session_id": "session-uuid-1234",
        "token": "AWS"
    }
}
```

---

## 6. Pagination, Filtering & Sorting Conventions

Every API listing response with query lists must accept query criteria matching these structures.

### 6.1 Query Parameters Specification

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `page` | integer | `1` | Targeted page number |
| `limit` | integer | `20` | Max count return limit |
| `sort` | string | `created_at` | Target sort key field |
| `order` | string | `desc` | Ordering format: `asc` or `desc` |
| `search` | string | `None` | Free-text keyword search query |

---

## 7. Security Headers & Rate Limiting Configurations

To protect API availability, endpoints enforce specific security headers and rate limits:

```
# Security Headers enforced globally:
X-Request-ID: <uuid-v4>
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

### Rate Limiting Limits (Redis Cache Tracker)
*   **Auth Endpoints:** Max 5 calls per 15 minutes per IP.
*   **AI Chat Generation:** Max 100 calls per hour per user.
*   **Standard API Actions:** Max 1000 calls per day per user.

---

## 8. Folder Structure Configuration

```
backend/app/api/v1/
├── __init__.py
├── auth/
│   ├── schemas.py           # Authentication payload definitions
│   └── router.py            # Authentication endpoints
├── profile/
│   └── router.py            # Profile snap modification routes
├── resume/
│   └── router.py            # Upload & ATS optimization routes
├── learning/
│   └── router.py            # LMS modules list and progress routes
├── interview/
│   └── router.py            # Start, step mock session routes
├── analytics/
│   └── router.py            # Student readiness KPI statistics
├── admin/
│   └── router.py            # System configuration & role routers
└── ws/
    └── chat.py              # WebSocket real-time chat routers
```

---

## 9. Performance Targets Matrix

To keep response times low, operations are designed to match strict latency limits:

| Endpoint Target | SLA Limit | Metric Target |
| :--- | :--- | :--- |
| **Auth/Profile Load** | Database lookup | Target: ≤ 80 ms |
| **LMS Module Listing**| Paginated index query| Target: ≤ 120 ms |
| **Mock Answer Save** | Score index update | Target: ≤ 150 ms |
| **System Health Check** | Status verification | Target: ≤ 200 ms |
| **WebSocket Stream** | Token latency | Target: ≤ 50 ms per token |

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

---

> **Phase 21 Complete** — OpenAPI specifications and API router paths defined.
>
> **Next: Phase 22 — MongoDB Models & Beanie Document Design**
> Beanie document classes, schemas, indices, reference validation, soft delete settings, and DB migrators.

---

*NEXA AI Phase 21 — OpenAPI Specification | Version 1.0 | July 2026*
