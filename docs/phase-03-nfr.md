# NEXA AI — Non-Functional Requirements (NFR)
## Enterprise AI-Based Career Guidance and Learning Platform

---

| Field             | Details                                        |
|-------------------|------------------------------------------------|
| **Document**      | Non-Functional Requirements Specification (NFR)|
| **Phase**         | 3 of 30                                        |
| **Version**       | 1.0                                            |
| **Project**       | NEXA AI                                        |
| **Project Type**  | Major Placement Project                        |
| **Date**          | July 2026                                      |
| **Status**        | ✅ Complete                                    |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Performance Requirements](#2-performance-requirements)
3. [Scalability](#3-scalability)
4. [Availability](#4-availability)
5. [Reliability](#5-reliability)
6. [Security Requirements](#6-security-requirements)
7. [Data Privacy](#7-data-privacy)
8. [Database Requirements](#8-database-requirements)
9. [Redis Requirements](#9-redis-requirements)
10. [AI Requirements](#10-ai-requirements)
11. [AI Agent Requirements](#11-ai-agent-requirements)
12. [AI Response Quality](#12-ai-response-quality)
13. [Feedback Requirements](#13-feedback-requirements)
14. [Logging](#14-logging)
15. [Monitoring](#15-monitoring)
16. [Backup & Recovery](#16-backup--recovery)
17. [Notification Requirements](#17-notification-requirements)
18. [Accessibility](#18-accessibility)
19. [Browser Compatibility](#19-browser-compatibility)
20. [Mobile Responsiveness](#20-mobile-responsiveness)
21. [Maintainability](#21-maintainability)
22. [Coding Standards](#22-coding-standards)
23. [Testing Requirements](#23-testing-requirements)
24. [Deployment Requirements](#24-deployment-requirements)
25. [CI/CD Requirements](#25-cicd-requirements)
26. [Disaster Recovery](#26-disaster-recovery)
27. [AI Ethics](#27-ai-ethics)
28. [Internationalization](#28-internationalization)
29. [Future Scalability](#29-future-scalability)
30. [Acceptance Criteria](#30-acceptance-criteria)
31. [Enterprise Tools Reference](#31-enterprise-tools-reference)

---

## 1. Introduction

### 1.1 Purpose

This document defines the **quality requirements** of NEXA AI — the non-functional characteristics that determine how well the system must operate, rather than what it must do.

Unlike the Functional Requirements Specification (Phase 2), which defines features and behaviors, this document specifies the **engineering standards** that make those features production-ready.

### 1.2 Scope

These requirements apply to all components of the NEXA AI platform:

- React frontend application
- FastAPI backend services
- MongoDB Atlas database
- Redis cache layer
- Qdrant vector database
- LangGraph AI orchestration layer
- Celery background workers
- Nginx reverse proxy
- Docker deployment stack

### 1.3 NFR Categories

| Category            | NFR IDs          |
|---------------------|------------------|
| Performance         | NFR-001 – NFR-003|
| Scalability         | NFR-004          |
| Availability        | NFR-005          |
| Reliability         | NFR-006          |
| Security            | NFR-007 – NFR-011|
| Data Privacy        | NFR-012          |
| Data Storage        | NFR-013 – NFR-014|
| AI Subsystem        | NFR-015 – NFR-018|
| Observability       | NFR-019 – NFR-021|
| Infrastructure      | NFR-022 – NFR-023|
| Quality             | NFR-024 – NFR-026|
| Compliance          | NFR-027 – NFR-030|

---

## 2. Performance Requirements

### NFR-001 — Response Time Targets

**Description:** The system shall meet the following maximum response time thresholds under normal load conditions.

| Operation                    | Maximum Response Time | Priority |
|------------------------------|-----------------------|----------|
| User Login                   | ≤ 2 seconds           | Critical |
| Dashboard Loading            | ≤ 3 seconds           | Critical |
| Global Search                | ≤ 2 seconds           | High     |
| Resume Upload (processing)   | ≤ 5 seconds           | High     |
| AI Response — Simple Query   | ≤ 5 seconds           | High     |
| AI Response — Complex Query  | ≤ 15 seconds          | Medium   |
| Course Content Loading       | ≤ 3 seconds           | High     |
| Report Generation (PDF)      | ≤ 20 seconds          | Medium   |
| Resume ATS Analysis          | ≤ 10 seconds          | High     |
| Certificate Generation       | ≤ 5 seconds           | Medium   |

**Conditions:**
- Targets apply at p95 (95th percentile) under normal load
- Measured from client request to first meaningful response
- AI response times assume external LLM provider latency; streaming shall be used to improve perceived responsiveness

---

### NFR-002 — Concurrent User Targets

**Description:** The platform shall support the following concurrent user loads at each stage of deployment.

| Environment  | Concurrent Users | Notes                              |
|--------------|------------------|------------------------------------|
| Development  | 100              | Local Docker Compose               |
| Testing/QA   | 1,000            | Single-node staging environment    |
| Production   | 10,000+          | Horizontally scaled containers     |

**Scaling Strategy:**
- Stateless FastAPI services allow horizontal pod/container scaling
- Redis handles shared session state across multiple instances
- MongoDB Atlas provides read replicas for increased read throughput
- Load balancer (Nginx or cloud ALB) distributes traffic evenly

---

### NFR-003 — API Performance Standards

**Description:** All REST API endpoints shall conform to the following engineering standards.

| Standard                  | Requirement                                          |
|---------------------------|------------------------------------------------------|
| Async Endpoints           | Use `async/await` in FastAPI for I/O-bound operations|
| Response Format           | Consistent JSON with `status`, `data`, `message` fields |
| Compression               | Gzip / Brotli enabled on all responses > 1KB        |
| Pagination                | All list endpoints support `page` + `limit` params  |
| Request Timeout           | Server-side timeout enforced (max 30s per request)  |
| API Versioning            | All endpoints prefixed `/api/v1/`                   |
| Rate Limiting             | Applied per-user and per-IP (see NFR-010)           |
| Content Negotiation       | `Content-Type: application/json` enforced           |

---

## 3. Scalability

### NFR-004 — Independent Service Scaling

**Description:** Each major service shall be independently deployable and scalable without affecting other services.

**Scalable Services:**

| Service              | Scaling Approach                                  |
|----------------------|---------------------------------------------------|
| Frontend (React)     | CDN edge distribution + static hosting           |
| Backend API (FastAPI)| Horizontal — multiple container replicas         |
| AI Gateway           | Independent container with LLM provider pool     |
| Celery Workers       | Scale worker replicas based on queue depth       |
| Redis                | Redis Cluster or Redis Sentinel for HA           |
| MongoDB              | Atlas auto-scaling + read replicas               |
| Qdrant               | Clustered mode for vector index partitioning     |
| Notification Service | Separate Celery queue with dedicated workers     |

**Design Principle:**
- No shared in-process state between API instances
- All shared state stored externally (Redis, MongoDB)
- New services can be added without modifying existing ones

---

## 4. Availability

### NFR-005 — Uptime SLA

**Description:** The system shall maintain high availability with minimal unplanned downtime.

| Metric               | Target                                         |
|----------------------|------------------------------------------------|
| Production Uptime    | ≥ 99.9% (≤ 8.7 hours downtime/year)           |
| Planned Maintenance  | Scheduled during 2:00–4:00 AM local time      |
| Health Check Latency | Health endpoints respond within 1 second      |

**Health Endpoints:**

Every service shall expose a `/health` endpoint returning:

```json
{
  "status": "healthy",
  "service": "nexa-api",
  "version": "1.0.0",
  "timestamp": "2026-07-03T09:00:00Z"
}
```

**Health checks shall cover:**
- API server responsiveness
- MongoDB connectivity
- Redis connectivity
- Qdrant connectivity
- Celery worker availability

---

## 5. Reliability

### NFR-006 — System Reliability

**Description:** The system shall remain functional and preserve data integrity under adverse conditions.

| Requirement                     | Description                                            |
|---------------------------------|--------------------------------------------------------|
| Transient Error Recovery        | AI provider errors retried up to 3 times with backoff |
| Background Task Durability      | Celery tasks persisted in Redis; not lost on crash    |
| Data Integrity                  | MongoDB write concern `majority` for critical writes  |
| Automatic Service Restart       | Docker `restart: unless-stopped` on all containers   |
| Graceful Shutdown               | API handles SIGTERM and drains in-flight requests    |
| Circuit Breaker                 | AI gateway uses circuit breaker for provider failures|
| Idempotent Operations           | Resume uploads and report generation are idempotent  |

---

## 6. Security Requirements

### NFR-007 — Authentication Security

**Description:** All authentication mechanisms shall implement industry-standard protocols.

| Mechanism         | Implementation                                      |
|-------------------|-----------------------------------------------------|
| JWT Access Token  | RS256 signed, 15-minute expiry                      |
| Refresh Token     | Stored in HttpOnly cookie, 7-day expiry             |
| OAuth2 / OIDC     | Google, GitHub, Microsoft — standard flows          |
| Token Revocation  | Blacklist in Redis on logout / password change      |
| MFA               | TOTP-based (Google Authenticator) — future phase   |

---

### NFR-008 — Authorization (RBAC)

**Description:** All protected API endpoints shall enforce role-based access control.

**Role Hierarchy:**

```
Super Admin
    │
   Admin
    │
  Mentor
    │
 Student
```

**Rules:**
- Every API route decorated with required role(s)
- Role checked server-side on every request — never rely on client
- Privilege escalation attempts logged as security events
- Sensitive admin endpoints require both role AND fresh authentication

---

### NFR-009 — Password Policy

**Description:** Passwords shall meet complexity requirements and be stored securely.

**Complexity Rules:**

| Rule                | Requirement                         |
|---------------------|-------------------------------------|
| Minimum Length      | 8 characters                        |
| Uppercase Letters   | At least 1 required                 |
| Lowercase Letters   | At least 1 required                 |
| Numeric Digits      | At least 1 required                 |
| Special Characters  | At least 1 required (e.g., @#$!%*) |
| History             | Cannot reuse last 3 passwords       |

**Storage:**
- Passwords hashed using **Argon2id** (preferred) or **bcrypt** (minimum cost factor 12)
- Plaintext passwords never logged, transmitted, or stored
- Password reset invalidates all existing sessions

---

### NFR-010 — API Security Hardening

**Description:** The backend API shall enforce multiple layers of security controls.

| Control               | Implementation                                        |
|-----------------------|-------------------------------------------------------|
| Input Validation      | Pydantic models validate all request payloads        |
| SQL/NoSQL Injection   | Parameterized queries; no raw string interpolation   |
| Rate Limiting         | 100 req/min per authenticated user (configurable)   |
| Brute-Force Protection| Account locked after 5 failed logins (15 min)       |
| HTTPS                 | Mandatory in staging and production                  |
| CORS                  | Allowlist of approved frontend origins only          |
| Security Headers      | HSTS, X-Content-Type-Options, X-Frame-Options       |
| Request Size Limit    | Max body size 10MB (configurable per endpoint)      |

---

### NFR-011 — Secrets Management

**Description:** All sensitive configuration values shall be managed through environment variables, never hardcoded in source code.

**Secrets Categories:**

| Category          | Examples                                            |
|-------------------|-----------------------------------------------------|
| Auth Secrets      | JWT private/public key pair                         |
| Database URIs     | MongoDB Atlas connection string                     |
| Cache URI         | Redis connection URL                                |
| AI API Keys       | OpenAI, Gemini, Claude API keys                     |
| Email Credentials | SMTP host, port, username, password                 |
| OAuth Secrets     | Google, GitHub, Microsoft client ID and secret      |
| Storage Keys      | S3/GCS bucket credentials                           |

**Rules:**
- `.env` files excluded from version control via `.gitignore`
- `.env.example` provided with placeholder values only
- Production secrets managed via Docker Secrets or cloud secret managers (AWS Secrets Manager / GCP Secret Manager)
- Secret rotation procedure documented

---

## 7. Data Privacy

### NFR-012 — User Data Protection

**Description:** The system shall implement privacy controls that give users full ownership of their personal data.

**Personal Data Classification:**

| Data Type          | Classification  | Retention Policy              |
|--------------------|-----------------|-------------------------------|
| Name, Email        | PII — Basic     | Until account deletion        |
| Phone, Address     | PII — Basic     | Until account deletion        |
| Resume             | PII — Sensitive | Until user deletes            |
| AI Conversations   | PII — Sensitive | User-controlled (see below)  |
| Learning History   | Behavioral      | Until account deletion        |
| Career Goals       | Behavioral      | Until account deletion        |

**User Privacy Controls:**

| Control                  | Description                                          |
|--------------------------|------------------------------------------------------|
| Data Download            | User can export all their data as JSON               |
| Account Deletion         | Permanently deletes all PII within 30 days           |
| Chat History Clear       | Clears stored AI conversation history                |
| AI Memory Toggle         | User can disable long-term AI memory at any time    |
| Consent Management       | Explicit consent captured at registration           |

---

## 8. Database Requirements

### NFR-013 — MongoDB Atlas Requirements

**Description:** The primary database shall be configured for durability, performance, and resilience.

| Requirement            | Configuration                                         |
|------------------------|-------------------------------------------------------|
| Deployment             | MongoDB Atlas (M10+ tier for production)             |
| Replica Sets           | Minimum 3-node replica set                           |
| Write Concern          | `majority` for all critical write operations         |
| Read Preference        | `secondaryPreferred` for analytics queries           |
| Backup                 | Atlas automated daily backups enabled                |
| Indexing               | Compound indexes on all frequently queried fields    |
| Document Validation    | JSON Schema validation on all collections            |
| Transactions           | Used for multi-document atomic operations            |
| Connection Pooling     | Min 5, Max 50 connections per service instance      |
| Aggregation Pipeline   | Used for analytics and reporting queries             |

---

### NFR-014 — Redis Requirements

**Description:** Redis shall serve as the in-memory store for all short-lived, high-frequency data.

| Use Case              | Redis Data Structure     | TTL Policy                    |
|-----------------------|--------------------------|-------------------------------|
| Session Cache         | Hash                     | 24 hours (sliding)            |
| OTP Storage           | String                   | 10 minutes                    |
| Rate Limiting         | Sorted Set               | 1 minute sliding window       |
| Background Job State  | Hash / List              | Job-dependent                 |
| AI Context Cache      | Hash                     | Session duration              |
| Refresh Token Blacklist | Set                    | Token expiry time             |
| Dashboard Cache       | String (JSON)            | 5 minutes                     |

**Rules:**
- Redis data is treated as cache — all data also persisted in MongoDB
- `maxmemory-policy: allkeys-lru` for cache eviction
- Redis persistence (AOF) enabled for job queue durability

---

## 9. (See Section 8 — Redis in NFR-014)

---

## 10. AI Requirements

### NFR-015 — Multi-Provider AI Support

**Description:** The AI subsystem shall support multiple LLM providers with dynamic runtime selection.

**Supported AI Providers:**

| Provider     | Interface           | Use Case                              |
|--------------|---------------------|---------------------------------------|
| OpenAI       | OpenAI SDK          | Primary LLM for all agents            |
| Google Gemini| Google AI SDK       | Alternative primary provider          |
| Anthropic Claude | Anthropic SDK   | Fallback / complex reasoning          |
| DeepSeek     | OpenAI-compatible   | Cost-optimized alternative            |
| Ollama       | Local REST API      | Self-hosted / air-gapped deployments  |

**Configuration:**
- Active provider configurable via Admin panel (no code change required)
- Provider credentials stored in secrets manager
- Fallback chain: Primary → Secondary → Tertiary (configurable order)

---

### NFR-016 — AI Context & Memory Management

**Description:** The AI subsystem shall maintain user context across sessions with appropriate controls.

| Memory Type       | Description                                          | User Control |
|-------------------|------------------------------------------------------|--------------|
| Session Memory    | Conversation history within active session           | Not exposed  |
| Cross-session Memory | Summarized long-term user context             | Toggle in settings |
| Profile Context   | Skills, goals, academic info fed automatically       | Via profile edit |
| RAG Context       | Retrieved knowledge base chunks                      | No direct control |

**Rules:**
- LangGraph manages stateful graph execution per session
- Long-term memory summarized using LLM compression (not raw storage)
- Memory context truncated to model's context window (configurable per model)
- User can fully wipe AI memory from privacy settings

---

### NFR-017 — AI Fallback & Resilience

**Description:** The AI subsystem shall remain functional even when a primary provider is unavailable.

**Fallback Strategy:**

```
Primary Provider (e.g., OpenAI) fails
              │
              ▼
        Retry × 3 (exponential backoff)
              │
              ▼
        Switch to Secondary Provider (e.g., Gemini)
              │
              ▼
        If Secondary fails → Tertiary (e.g., Claude)
              │
              ▼
        If all fail → Return graceful degradation message
```

**Circuit Breaker Pattern:**
- Open after 5 consecutive failures in 60 seconds
- Half-open probe after 30 seconds
- Closed on successful probe response

---

### NFR-018 — AI Request Logging

**Description:** AI interactions shall be logged for audit, quality, and usage tracking without exposing sensitive content.

**Logged Fields (metadata only):**

| Field             | Logged |
|-------------------|--------|
| Request ID        | ✅     |
| User ID (hashed)  | ✅     |
| Agent Type        | ✅     |
| Provider Used     | ✅     |
| Tokens Used       | ✅     |
| Latency (ms)      | ✅     |
| Success / Error   | ✅     |
| Prompt Content    | ❌ Not logged (privacy) |
| Full AI Response  | ❌ Not logged (configurable) |

---

## 11. AI Agent Requirements

### NFR-019 — Agent Architecture Standards

**Description:** All AI agents shall follow a consistent architectural pattern for reliability and maintainability.

**Agent Design Rules:**

| Rule                     | Requirement                                           |
|--------------------------|-------------------------------------------------------|
| Single Responsibility    | Each agent handles exactly one domain                |
| No Direct Agent-to-Agent Calls | All routing through Orchestrator            |
| Stateless Processing     | Agent logic is stateless; state managed by LangGraph |
| Timeout Enforcement      | Each agent has a max execution time (configurable)   |
| Error Isolation          | One agent failing does not crash others              |
| Input/Output Schema      | Pydantic models define agent I/O contracts           |
| Logging                  | Each agent emits structured logs                     |

**Registered Agents:**

```
Orchestrator
    ├── Career Agent
    ├── Resume Agent
    ├── Learning Agent
    ├── Coding Agent
    ├── Interview Agent
    ├── Recommendation Agent
    ├── Skill Gap Agent
    ├── Feedback Agent
    ├── Notification Agent
    └── Analytics Agent
```

---

## 12. AI Response Quality

### NFR-020 — Response Quality Standards

**Description:** All AI-generated responses shall meet minimum quality standards before delivery to the user.

| Quality Dimension   | Standard                                                |
|---------------------|---------------------------------------------------------|
| Accuracy            | Responses grounded in RAG knowledge base where possible|
| Context-Awareness   | Responses tailored using user profile context          |
| Personalization     | References user's skills, goals, and progress         |
| Clarity             | Structured responses with markdown when appropriate   |
| Actionability       | Each career/skill response includes a concrete next step|
| Uncertainty Handling| AI explicitly states when confidence is low           |
| Hallucination Control| RAG + temperature tuning to reduce fabrication       |

**Quality Enforcement:**
- System prompts enforce response format and tone
- Output validation checks for required fields before delivery
- Feedback loop connects negative ratings to prompt review

---

## 13. Feedback Requirements

### NFR-021 — AI Feedback Pipeline

**Description:** Every AI interaction shall support optional user feedback that feeds into quality analytics.

| Requirement           | Details                                              |
|-----------------------|------------------------------------------------------|
| Feedback Capture      | Thumbs up/down after every AI response              |
| Detailed Rating       | Optional 5-dimension rating (helpfulness, accuracy, etc.) |
| Category Tagging      | User selects issue category for negative feedback   |
| Storage               | All feedback stored in MongoDB with response metadata|
| Aggregation           | Daily rollup jobs compute agent-level quality scores|
| Admin Review          | Admin can view, filter, and export all feedback     |
| Prompt Improvement    | Low-rated responses flagged for prompt engineering review |

---

## 14. Logging

### NFR-022 — Structured Logging Requirements

**Description:** All services shall emit structured logs in a consistent, machine-readable format.

**Log Format (JSON):**

```json
{
  "timestamp": "2026-07-03T09:00:00.000Z",
  "level": "INFO",
  "service": "nexa-api",
  "request_id": "req_abc123",
  "user_id": "usr_xyz789",
  "action": "resume_upload",
  "status": "success",
  "latency_ms": 432,
  "message": "Resume uploaded and parsed successfully"
}
```

**Events to Log:**

| Category          | Events                                                  |
|-------------------|---------------------------------------------------------|
| Authentication    | Login success/failure, registration, logout             |
| AI Interactions   | Agent invoked, provider used, tokens, latency           |
| Resume            | Upload, parse start, parse complete, parse error        |
| Errors            | 4xx and 5xx responses with stack trace                  |
| Admin Actions     | User role changes, course publish, AI config update     |
| Security          | Failed logins, account lockout, suspicious activity     |
| Background Jobs   | Task queued, started, completed, failed                 |

**Exclusions (must never appear in logs):**
- Passwords or password hashes
- JWT tokens or refresh tokens
- API keys or OAuth secrets
- Raw prompt content containing PII
- Full resume text content

---

## 15. Monitoring

### NFR-023 — Platform Monitoring Requirements

**Description:** All production services shall be continuously monitored with alerting on key metrics.

**Monitoring Stack:**

| Tool         | Purpose                                              |
|--------------|------------------------------------------------------|
| Prometheus   | Metrics collection from all services                 |
| Grafana      | Metrics visualization and alerting dashboards        |
| Loki         | Log aggregation from Docker containers               |
| Promtail     | Log shipping agent for Loki                          |
| Alertmanager | Alert routing to email / Slack                       |

**Key Metrics to Monitor:**

| Category        | Metrics                                              |
|-----------------|------------------------------------------------------|
| Infrastructure  | CPU %, RAM %, Disk %, Network I/O                   |
| API             | Request rate, error rate, p95 latency per endpoint  |
| AI Subsystem    | AI response time, provider error rate, token usage  |
| MongoDB         | Connection pool, query latency, replica lag          |
| Redis           | Memory usage, hit rate, eviction rate               |
| Celery          | Queue depth, task success/failure rate              |
| Docker          | Container restart count, resource limits            |

**Alerting Rules:**

| Alert                   | Threshold                            |
|-------------------------|--------------------------------------|
| High CPU                | > 85% for 5 minutes                 |
| High Memory             | > 90% for 5 minutes                 |
| API Error Rate          | > 5% of requests in 5 minutes       |
| AI Provider Failure     | > 3 consecutive failures             |
| Queue Depth             | > 1,000 tasks pending               |
| MongoDB Replica Lag     | > 10 seconds                        |
| Container Restart       | > 3 restarts in 10 minutes          |

---

## 16. Backup & Recovery

### NFR-024 — Backup Strategy

**Description:** All user data and configurations shall be backed up on a regular schedule.

**Backup Schedule:**

| Backup Type        | Frequency     | Retention  |
|--------------------|---------------|------------|
| MongoDB Incremental| Daily 2:00 AM | 30 days    |
| MongoDB Full       | Weekly Sunday | 12 weeks   |
| File Storage (resumes, certs) | Daily | 30 days |
| Docker volumes     | Weekly        | 4 weeks    |
| Environment config | On change     | Version-controlled |

**Recovery Objectives:**

| Metric  | Target                                                |
|---------|-------------------------------------------------------|
| **RTO** (Recovery Time Objective)  | ≤ 4 hours        |
| **RPO** (Recovery Point Objective) | ≤ 24 hours       |

**Backup Rules:**
- Backups stored in geographically separate location
- Backup integrity verified weekly via restore test
- Recovery procedures documented in operations runbook
- Backup access restricted to Super Admin only

---

## 17. Notification Requirements

### NFR-025 — Notification Delivery Standards

**Description:** All platform notifications shall be delivered asynchronously and reliably.

**Supported Channels:**

| Channel       | Status         | Implementation                    |
|---------------|----------------|-----------------------------------|
| Email         | ✅ Active       | SMTP via SendGrid / Mailgun       |
| In-App        | ✅ Active       | WebSocket or polling              |
| Push (Browser)| ✅ Active       | Web Push API                      |
| SMS           | 🔮 Future       | Twilio integration                |

**Delivery Standards:**

| Standard             | Requirement                                      |
|----------------------|--------------------------------------------------|
| Async Processing     | All notifications via Celery task queue          |
| Retry on Failure     | Up to 3 retries with exponential backoff        |
| Delivery Tracking    | Status tracked: queued → sent → delivered       |
| User Preferences     | Per-channel opt-out honored before sending      |
| Template Management  | All email templates version-controlled          |
| Rate Limiting        | Max 10 non-critical emails per user per day     |

---

## 18. Accessibility

### NFR-026 — Accessibility Standards

**Description:** The frontend application shall meet minimum accessibility standards to support users with disabilities.

| Requirement              | Standard / Detail                                  |
|--------------------------|----------------------------------------------------|
| WCAG Compliance          | WCAG 2.1 Level AA                                  |
| Keyboard Navigation      | All interactive elements reachable via Tab key    |
| Color Contrast           | Minimum 4.5:1 ratio for normal text               |
| Focus Indicators         | Visible focus ring on all focusable elements      |
| Form Labels              | Every input has a visible, associated `<label>`   |
| Image Alt Text           | All informational images include descriptive alt  |
| ARIA Attributes          | Used for complex components (modals, dropdowns)   |
| Screen Reader Support    | Tested with NVDA / VoiceOver                      |
| Error Identification     | Form errors identify the field and describe the issue |

---

## 19. Browser Compatibility

### NFR-027 — Supported Browsers

**Description:** The application shall render correctly and function fully in the following browsers.

| Browser          | Minimum Version | Support Level |
|------------------|-----------------|---------------|
| Google Chrome    | Latest – 2      | Full          |
| Microsoft Edge   | Latest – 2      | Full          |
| Mozilla Firefox  | Latest – 2      | Full          |
| Apple Safari     | Latest – 2      | Full          |
| Mobile Chrome    | Latest – 2      | Full          |
| Mobile Safari    | Latest – 2      | Full          |

**Rules:**
- Internet Explorer is not supported
- Browser-specific CSS prefixes handled via PostCSS / Autoprefixer
- Progressive enhancement applied for experimental features

---

## 20. Mobile Responsiveness

### NFR-028 — Responsive Design Requirements

**Description:** The UI shall adapt seamlessly to all screen sizes without loss of functionality.

**Breakpoint Definitions:**

| Device         | Breakpoint     | Target Experience           |
|----------------|----------------|-----------------------------|
| Mobile Phone   | < 640px        | Single-column, touch-first  |
| Tablet         | 640px – 1024px | Two-column, adapted nav     |
| Laptop         | 1024px – 1440px| Full layout                 |
| Desktop        | > 1440px       | Extended layout with sidebars|

**Rules:**
- No horizontal scrolling on any breakpoint
- Touch targets minimum 44×44px on mobile
- Navigation collapses to hamburger menu on mobile
- Tables use horizontal scroll or card view on small screens
- Images are responsive (`srcset` or CSS fluid)

---

## 21. Maintainability

### NFR-029 — Code Maintainability Standards

**Description:** The codebase shall be structured for long-term maintainability by multiple contributors.

| Principle                  | Implementation                                   |
|----------------------------|--------------------------------------------------|
| Modular Architecture       | Clear separation between services and layers    |
| Separation of Concerns     | Routes, services, repositories, models separate |
| Dependency Injection       | FastAPI `Depends()` for service injection       |
| Naming Conventions         | Consistent, descriptive names enforced via linting |
| Reusable Components        | React component library with shared design system |
| No Magic Numbers           | All constants defined in configuration files    |
| Documentation              | All public APIs documented in OpenAPI (Swagger) |
| Changelog                  | `CHANGELOG.md` maintained per semantic versioning|

---

## 22. Coding Standards

### NFR-030 — Backend (Python / FastAPI)

| Standard          | Requirement                                         |
|-------------------|-----------------------------------------------------|
| Style Guide       | PEP 8 enforced via `ruff` or `flake8`              |
| Type Hints        | Required on all function signatures                 |
| Async Programming | `async/await` used for all I/O-bound handlers      |
| Docstrings        | Google-style docstrings for all public functions   |
| Models            | Pydantic v2 for all request/response schemas       |
| Imports           | Sorted via `isort`; absolute imports preferred     |
| Linting           | `ruff` (fast Rust-based linter) or `pylint`       |
| Formatting        | `black` code formatter                             |
| Security Linting  | `bandit` for security antipattern detection        |

### NFR-031 — Frontend (TypeScript / React)

| Standard          | Requirement                                         |
|-------------------|-----------------------------------------------------|
| Language          | TypeScript strict mode enabled                     |
| Framework         | React 18+ with functional components only          |
| State Management  | Zustand or React Query (no class components)       |
| Linting           | ESLint with `eslint-plugin-react` and `@typescript-eslint` |
| Formatting        | Prettier (2-space indent, single quotes)           |
| Component Style   | Tailwind CSS utility classes; no inline styles     |
| Naming            | PascalCase components, camelCase variables         |
| Imports           | Path aliases configured (`@/components`, `@/hooks`)|
| Prop Types        | TypeScript interfaces for all component props      |

---

## 23. Testing Requirements

### NFR-032 — Test Coverage Targets

**Description:** The platform shall maintain meaningful automated test coverage across all critical paths.

| Test Type         | Target Coverage | Tooling                      |
|-------------------|-----------------|------------------------------|
| Unit Tests        | ≥ 80%           | Pytest (backend), Vitest (frontend) |
| Integration Tests | All critical APIs| Pytest + HTTPX               |
| End-to-End Tests  | Key user flows  | Playwright                   |
| Load Tests        | Core endpoints  | Locust                       |
| Security Tests    | OWASP Top 10    | OWASP ZAP / manual           |

**Priority Test Areas:**

| Area                  | Reason                                           |
|-----------------------|--------------------------------------------------|
| Authentication        | Security-critical path                           |
| AI Orchestration      | Complex multi-agent logic                        |
| Resume Upload/Parse   | File handling edge cases                         |
| Course Management     | LMS data integrity                               |
| Feedback Pipeline     | Data aggregation accuracy                        |
| Notification Delivery | Async worker reliability                         |

**CI Integration:**
- All PRs must pass unit and integration tests before merge
- Test results reported in CI pipeline output
- Coverage report generated and published per build

---

## 24. Deployment Requirements

### NFR-033 — Docker Deployment Architecture

**Description:** The platform shall be fully containerized using Docker and orchestrated with Docker Compose.

**Service Container Map:**

| Container         | Image Base          | Port  | Purpose                           |
|-------------------|---------------------|-------|-----------------------------------|
| `nexa-frontend`   | Node / Nginx        | 3000  | React app served by Nginx        |
| `nexa-backend`    | Python 3.12-slim    | 8000  | FastAPI application               |
| `nexa-worker`     | Python 3.12-slim    | —     | Celery task worker                |
| `nexa-beat`       | Python 3.12-slim    | —     | Celery Beat scheduler             |
| `mongodb`         | mongo:7             | 27017 | Primary database                  |
| `redis`           | redis:7-alpine      | 6379  | Cache, sessions, queues           |
| `qdrant`          | qdrant/qdrant       | 6333  | Vector database                   |
| `nginx`           | nginx:alpine        | 80/443| Reverse proxy + SSL termination   |

**Environment Configuration:**
- `.env.development`, `.env.staging`, `.env.production` maintained separately
- Secrets injected at runtime (not baked into images)
- All images pinned to specific versions (no `:latest` in production)

---

## 25. CI/CD Requirements

### NFR-034 — CI/CD Pipeline Stages

**Description:** All code changes shall pass through an automated pipeline before reaching production.

**Pipeline Stages:**

```
Stage 1 — Lint & Format Check
  ├── Python: ruff + black
  └── Frontend: ESLint + Prettier

Stage 2 — Automated Tests
  ├── Unit tests (Pytest + Vitest)
  ├── Integration tests (HTTPX)
  └── Coverage report generated

Stage 3 — Build Docker Images
  ├── Backend image built and tagged
  └── Frontend image built and tagged

Stage 4 — Dependency Security Scan
  ├── Python: pip-audit or Safety
  └── Node: npm audit

Stage 5 — Publish Artifacts
  └── Push images to container registry (GHCR / DockerHub)

Stage 6 — Deploy to Staging
  └── Auto-deploy to staging environment

Stage 7 — Promote to Production
  └── Manual approval gate required
```

**Tooling:** GitHub Actions (`.github/workflows/`)
**Trigger:** Push to `main` branch or Pull Request merge

---

## 26. Disaster Recovery

### NFR-035 — Disaster Recovery Plan

**Description:** The platform shall have documented and tested recovery procedures for common failure scenarios.

**Failure Scenarios and Recovery:**

| Scenario                  | Recovery Action                                     |
|---------------------------|-----------------------------------------------------|
| Container crash           | Docker auto-restart (`restart: unless-stopped`)    |
| Database corruption       | Restore from most recent MongoDB Atlas backup       |
| Redis data loss           | Session re-authentication; jobs re-queued          |
| AI provider outage        | Automatic failover to secondary provider            |
| Full server failure       | Restore containers from registry + DB from backup  |
| Accidental data deletion  | Point-in-time recovery from Atlas backup            |

**DR Testing:**
- Monthly simulated failure drill (at least one scenario)
- Recovery steps documented in `docs/runbooks/disaster-recovery.md`
- RTO and RPO targets validated during drills

---

## 27. AI Ethics

### NFR-036 — Responsible AI Requirements

**Description:** The AI system shall operate within ethical guidelines that protect users and ensure fair, honest interactions.

| Principle               | Requirement                                              |
|-------------------------|----------------------------------------------------------|
| Privacy Respect         | AI context does not share user data between accounts    |
| Non-Discrimination      | Career recommendations shall not be biased by gender, race, or religion |
| Uncertainty Declaration | AI shall explicitly state when it is uncertain or lacks data |
| Scope Boundaries        | AI shall redirect legal/medical queries to professionals |
| Transparency            | Users are informed they are interacting with AI, not a human |
| Data Minimization       | AI context uses only the minimum data needed            |
| Opt-Out                 | Users can disable AI memory and personalization at any time |

---

## 28. Internationalization

### NFR-037 — i18n Architecture

**Description:** The application shall be architected to support multiple languages without code changes.

| Requirement           | Implementation                                      |
|-----------------------|-----------------------------------------------------|
| Initial Language      | English                                             |
| i18n Library          | `react-i18next` (frontend)                         |
| Translation Files     | JSON key-value files per language (`en.json`, `hi.json`) |
| Text Externalization  | No hardcoded UI text strings in components         |
| Date/Time Formatting  | `Intl.DateTimeFormat` respects user locale          |
| Currency Formatting   | Locale-aware number formatting                      |
| RTL Support           | Architecture allows RTL layout (Arabic/Urdu — future) |

**Planned Languages:**

| Language  | Code  | Phase       |
|-----------|-------|-------------|
| English   | `en`  | v1.0        |
| Hindi     | `hi`  | v1.1        |
| Tamil     | `ta`  | v1.1        |
| Telugu    | `te`  | v1.2        |
| Kannada   | `kn`  | v1.2        |
| Malayalam | `ml`  | v1.2        |

---

## 29. Future Scalability

### NFR-038 — Extensibility Requirements

**Description:** The architecture shall be designed to accommodate major feature expansions without requiring redesign.

| Future Capability             | Architectural Accommodation                         |
|-------------------------------|-----------------------------------------------------|
| Mobile App (Android / iOS)    | REST API designed as mobile-first; JWT-based auth   |
| Voice-Based AI Mentor         | STT/TTS integration points reserved in AI gateway  |
| Video Interview Analysis      | Async video processing pipeline via Celery          |
| Enterprise Dashboards         | Multi-tenant data isolation via tenant ID in schema |
| University Portals            | Subdomain-based tenant routing via Nginx            |
| Plugin Architecture           | Agent registry allows new agents without core changes|
| Multi-Tenant Deployment       | Tenant context propagated through all layers        |

---

## 30. Acceptance Criteria

### NFR-039 — Production Readiness Checklist

**Description:** The platform shall be declared production-ready when all of the following criteria are met.

| Category           | Criterion                                                   | Status |
|--------------------|-------------------------------------------------------------|--------|
| Performance        | All response time targets met under 1,000 concurrent users | ⬜     |
| Security           | OWASP Top 10 vulnerabilities assessed and mitigated        | ⬜     |
| Availability       | Health checks passing on all services                      | ⬜     |
| AI Stability       | AI agents respond successfully under normal load           | ⬜     |
| Data Protection    | User data export and deletion functional                   | ⬜     |
| Containerization   | All services running in Docker with Compose                | ⬜     |
| Monitoring         | Prometheus + Grafana dashboards active                     | ⬜     |
| Logging            | Structured logs flowing to centralized log store           | ⬜     |
| Backup             | Automated MongoDB backup verified by test restore          | ⬜     |
| Testing            | ≥ 80% unit test coverage; all integration tests passing    | ⬜     |
| CI/CD              | Full pipeline operational on GitHub Actions                | ⬜     |
| Documentation      | API docs (Swagger), README, and runbooks complete          | ⬜     |

---

## 31. Enterprise Tools Reference

| Category            | Recommended Tool               | Purpose                            |
|---------------------|--------------------------------|------------------------------------|
| Backend Framework   | FastAPI                        | High-performance async Python API  |
| Database            | MongoDB Atlas                  | Scalable document database         |
| Cache               | Redis 7                        | Sessions, rate limiting, queues    |
| Vector Database     | Qdrant                         | Semantic search and RAG            |
| AI Orchestration    | LangGraph                      | Stateful multi-agent workflows     |
| AI Framework        | LangChain                      | LLM chains, tools, memory          |
| Task Queue          | Celery + Celery Beat           | Async jobs and scheduled tasks     |
| Reverse Proxy       | Nginx                          | Routing, SSL, load balancing       |
| Containers          | Docker & Docker Compose        | Service containerization           |
| Metrics             | Prometheus                     | Metrics collection                 |
| Dashboards          | Grafana                        | Visualization and alerting         |
| Log Aggregation     | Loki + Promtail                | Centralized log storage            |
| CI/CD               | GitHub Actions                 | Automated build and deploy         |
| Backend Testing     | Pytest + HTTPX                 | Unit and integration tests         |
| Frontend Testing    | Vitest + Playwright            | UI unit and E2E tests              |
| Load Testing        | Locust                         | Performance and stress testing     |
| Security Scanning   | Bandit + pip-audit + ZAP       | Code and dependency security       |
| API Documentation   | OpenAPI / FastAPI Swagger UI   | Auto-generated interactive API docs|
| Project Docs        | MkDocs or Sphinx               | Maintainable documentation site    |

---

## NFR Summary Registry

| NFR ID   | Requirement Name             | Category        | Priority |
|----------|------------------------------|-----------------|----------|
| NFR-001  | Response Time Targets        | Performance     | Critical |
| NFR-002  | Concurrent User Support      | Performance     | Critical |
| NFR-003  | API Performance Standards    | Performance     | High     |
| NFR-004  | Independent Service Scaling  | Scalability     | High     |
| NFR-005  | Uptime SLA (99.9%)           | Availability    | Critical |
| NFR-006  | System Reliability           | Reliability     | Critical |
| NFR-007  | Authentication Security      | Security        | Critical |
| NFR-008  | RBAC Authorization           | Security        | Critical |
| NFR-009  | Password Policy              | Security        | Critical |
| NFR-010  | API Security Hardening       | Security        | Critical |
| NFR-011  | Secrets Management           | Security        | Critical |
| NFR-012  | User Data Privacy            | Data Privacy    | High     |
| NFR-013  | MongoDB Atlas Configuration  | Database        | High     |
| NFR-014  | Redis Configuration          | Database        | High     |
| NFR-015  | Multi-Provider AI Support    | AI              | High     |
| NFR-016  | AI Context & Memory          | AI              | High     |
| NFR-017  | AI Fallback & Resilience     | AI              | Critical |
| NFR-018  | AI Request Logging           | AI              | Medium   |
| NFR-019  | Agent Architecture Standards | AI Agents       | High     |
| NFR-020  | AI Response Quality          | AI Quality      | High     |
| NFR-021  | AI Feedback Pipeline         | Feedback        | Medium   |
| NFR-022  | Structured Logging           | Observability   | High     |
| NFR-023  | Platform Monitoring          | Observability   | High     |
| NFR-024  | Backup Strategy              | Infrastructure  | Critical |
| NFR-025  | Notification Delivery        | Notifications   | Medium   |
| NFR-026  | Accessibility (WCAG 2.1 AA)  | Accessibility   | Medium   |
| NFR-027  | Browser Compatibility        | Compatibility   | Medium   |
| NFR-028  | Mobile Responsiveness        | Compatibility   | High     |
| NFR-029  | Code Maintainability         | Quality         | High     |
| NFR-030  | Python Coding Standards      | Quality         | High     |
| NFR-031  | TypeScript Coding Standards  | Quality         | High     |
| NFR-032  | Test Coverage Targets        | Quality         | High     |
| NFR-033  | Docker Deployment            | Infrastructure  | Critical |
| NFR-034  | CI/CD Pipeline               | Infrastructure  | High     |
| NFR-035  | Disaster Recovery            | Infrastructure  | High     |
| NFR-036  | Responsible AI Ethics        | Compliance      | High     |
| NFR-037  | Internationalization         | Compliance      | Medium   |
| NFR-038  | Future Extensibility         | Architecture    | Medium   |
| NFR-039  | Production Readiness Checklist | Acceptance    | Critical |

---

> **Phase 3 Complete** — 39 formal non-functional requirements defined across 12 quality categories.
>
> **Next: Phase 4 — System Architecture Design**
> The most critical technical document: microservice boundaries, LangGraph orchestration flows, Docker networking, MongoDB schema overview, RAG pipeline, authentication flow, sequence diagrams, and the full deployment topology.

---

*NEXA AI NFR — Phase 3 of 30 | Version 1.0 | July 2026*
