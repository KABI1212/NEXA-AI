# NEXA AI — Technology Stack & Development Standards
## Enterprise AI-Based Career Guidance and Learning Platform

---

| Field             | Details                                                  |
|-------------------|----------------------------------------------------------|
| **Document**      | Technology Stack & Development Standards                |
| **Phase**         | 5 of 30                                                  |
| **Version**       | 1.0                                                      |
| **Project**       | NEXA AI                                                  |
| **Architecture**  | Modular Monolith (v1) → Microservice Ready (Future)      |
| **Date**          | July 2026                                                |
| **Status**        | ✅ Complete                                              |

---

## Table of Contents

1. [Technology Philosophy](#1-technology-philosophy)
2. [Complete Technology Stack](#2-complete-technology-stack)
3. [Backend Technology Stack](#3-backend-technology-stack)
4. [Frontend Technology Stack](#4-frontend-technology-stack)
5. [Database Standards](#5-database-standards)
6. [Redis Standards](#6-redis-standards)
7. [Qdrant Standards](#7-qdrant-standards)
8. [Docker Standards](#8-docker-standards)
9. [AI Provider Standards](#9-ai-provider-standards)
10. [AI Agent Standards](#10-ai-agent-standards)
11. [Folder Structure Standards](#11-folder-structure-standards)
12. [Git Workflow](#12-git-workflow)
13. [Coding Standards](#13-coding-standards)
14. [API Standards](#14-api-standards)
15. [Error Response Standard](#15-error-response-standard)
16. [Environment Variables](#16-environment-variables)
17. [Testing Standards](#17-testing-standards)
18. [Documentation Standards](#18-documentation-standards)
19. [CI/CD Standards](#19-cicd-standards)
20. [Monitoring Standards](#20-monitoring-standards)
21. [Security Standards](#21-security-standards)
22. [Development Workflow](#22-development-workflow)
23. [Versioning Strategy](#23-versioning-strategy)
24. [Project Deliverables](#24-project-deliverables)
25. [Engineering Principles](#25-engineering-principles)

---

## 1. Technology Philosophy

NEXA AI is built using modern, production-ready technologies selected on three criteria:

| Criteria           | Meaning                                                       |
|--------------------|---------------------------------------------------------------|
| **Proven**         | Used in real production systems — not experimental           |
| **AI-Native**      | Strong ecosystem for LLM integration and agent development   |
| **Career-Ready**   | Technologies employers actively hire for in 2026             |

**Design Intent:** The system starts as a well-structured modular monolith and is architected so individual services can be extracted into independent microservices without breaking changes.

**Core Pillars:**

| Pillar             | How NEXA AI Addresses It                                     |
|--------------------|--------------------------------------------------------------|
| Scalability        | Stateless API + Redis sessions + horizontal container scaling|
| Maintainability    | Modular services, typed code, clean separation of concerns  |
| Performance        | Async FastAPI, Redis caching, Qdrant semantic indexing      |
| Security           | JWT RS256, Argon2id, RBAC, audit logs, secrets management   |
| AI Integration     | LangGraph orchestrator, multi-provider support, RAG pipeline|
| Cloud Readiness    | Docker Compose (dev) → Cloud container services (prod)      |
| DevOps             | GitHub Actions CI/CD, Prometheus/Grafana, structured logging|

---

## 2. Complete Technology Stack

### 2.1 Master Technology Reference

| Layer               | Technology           | Version  | Purpose                              |
|---------------------|----------------------|----------|--------------------------------------|
| **Frontend**        | React                | 19.x     | User Interface framework             |
| **Language (FE)**   | TypeScript           | 5.x      | Type-safe frontend development       |
| **Build Tool**      | Vite                 | 6.x      | Fast dev server and bundler          |
| **Styling**         | Tailwind CSS         | 4.x      | Utility-first CSS framework          |
| **UI Components**   | shadcn/ui            | latest   | Accessible component library         |
| **Animations**      | Framer Motion        | 12.x     | Declarative UI animations            |
| **Icons**           | Lucide React         | latest   | Consistent icon library              |
| **Global State**    | Redux Toolkit        | 2.x      | Predictable global state management  |
| **Server State**    | TanStack Query       | 5.x      | Cache, sync, and async data fetching |
| **Forms**           | React Hook Form      | 7.x      | Performant form state management     |
| **Validation (FE)** | Zod                  | 3.x      | Schema-based runtime validation      |
| **HTTP Client**     | Axios                | 1.x      | HTTP requests with interceptors      |
| **Charts**          | Chart.js + react-chartjs-2 | 4.x | Analytics visualizations         |
| **Code Editor**     | Monaco Editor        | 0.x      | VS Code-grade in-browser editor      |
| **Markdown**        | React Markdown       | 9.x      | Render AI markdown responses         |
| **Routing**         | React Router         | 7.x      | Client-side navigation               |
| **Backend**         | FastAPI              | 0.115.x  | Async Python REST API                |
| **Runtime (BE)**    | Python               | 3.13+    | Backend language                     |
| **ASGI Server**     | Uvicorn + Gunicorn   | latest   | Production ASGI server               |
| **ODM**             | Beanie               | 1.x      | Async MongoDB ODM                    |
| **Async DB Driver** | Motor                | 3.x      | Async MongoDB driver                 |
| **Cache / Broker**  | Redis                | 7.x      | Sessions, rate limiting, Celery      |
| **Task Queue**      | Celery               | 5.x      | Background job processing            |
| **DB**              | MongoDB Atlas        | 7.x      | Primary document database            |
| **Vector DB**       | Qdrant               | 1.x      | Semantic search and RAG              |
| **AI Orchestration**| LangGraph            | 0.3.x    | Stateful multi-agent workflows       |
| **AI Framework**    | LangChain            | 0.3.x    | LLM tools, chains, memory            |
| **Auth**            | JWT (RS256) + OAuth2 | —        | Authentication and authorization     |
| **Password Hash**   | Argon2id (passlib)   | latest   | Secure password storage              |
| **Reverse Proxy**   | Nginx                | alpine   | Routing, SSL termination, caching    |
| **Containers**      | Docker               | 27.x     | Application containerization         |
| **Orchestration**   | Docker Compose       | 2.x      | Multi-container local deployment     |
| **Metrics**         | Prometheus           | 2.x      | Metrics collection and alerting      |
| **Dashboards**      | Grafana              | 11.x     | Monitoring visualization             |
| **Log Aggregation** | Loki + Promtail      | 3.x      | Centralized structured logs          |
| **Backend Testing** | Pytest + HTTPX       | latest   | Unit and integration tests           |
| **E2E Testing**     | Playwright           | 1.x      | End-to-end browser automation        |
| **Load Testing**    | Locust               | 2.x      | Performance and stress testing       |
| **CI/CD**           | GitHub Actions       | —        | Automated pipeline                   |
| **Project Docs**    | MkDocs + Material    | 9.x      | Developer documentation site         |

---

## 3. Backend Technology Stack

### 3.1 Runtime

| Item    | Choice      | Reason                                                         |
|---------|-------------|----------------------------------------------------------------|
| Language| Python 3.13+| Best AI/ML ecosystem, FastAPI support, async-first, type hints |
| Framework| FastAPI    | Async, auto OpenAPI docs, Pydantic validation, high performance |
| Server  | Uvicorn     | ASGI server — event-loop based, handles WebSockets             |
| Process Manager | Gunicorn | Multi-worker process management in production           |

### 3.2 Python Package Registry

All packages organized by concern. Pin versions in `requirements/base.txt`.

#### Core Framework

```text
fastapi==0.115.*
uvicorn[standard]==0.32.*
gunicorn==23.*
pydantic==2.*
pydantic-settings==2.*
python-dotenv==1.*
python-multipart==0.0.*
```

#### MongoDB (Database)

```text
motor==3.*
beanie==1.*
pymongo==4.*
```

#### Authentication & Security

```text
python-jose[cryptography]==3.*     # JWT encoding/decoding (RS256)
passlib[argon2]==1.*               # Password hashing (Argon2id)
argon2-cffi==23.*                  # Argon2 backend
authlib==1.*                       # OAuth2 / OpenID Connect
itsdangerous==2.*                  # Token signing utilities
```

#### AI & LLM

```text
langgraph==0.3.*                   # Multi-agent orchestration
langchain==0.3.*                   # Core AI framework
langchain-core==0.3.*              # Core abstractions
langchain-community==0.3.*         # Community integrations
langchain-openai==0.2.*            # OpenAI provider
langchain-google-genai==2.*        # Google Gemini provider
langchain-anthropic==0.3.*         # Claude provider
langchain-deepseek==0.1.*          # DeepSeek provider
ollama==0.4.*                      # Local Ollama models
tiktoken==0.8.*                    # Token counting for OpenAI
openai==1.*                        # OpenAI SDK
google-generativeai==0.8.*         # Google Gemini SDK
anthropic==0.40.*                  # Anthropic Claude SDK
```

#### Vector Database

```text
qdrant-client==1.*                 # Qdrant vector DB client
sentence-transformers==3.*         # Local embedding models
fastembed==0.4.*                   # Fast CPU-friendly embeddings
```

#### Resume Processing

```text
pymupdf==1.25.*                    # PDF parsing (fitz)
python-docx==1.*                   # DOCX file processing
pdfplumber==0.11.*                 # Text extraction from PDF
pytesseract==0.3.*                 # OCR for scanned PDFs
Pillow==11.*                       # Image processing
```

#### Background Tasks

```text
celery==5.*                        # Task queue
redis==5.*                         # Redis client (also Celery broker)
flower==2.*                        # Celery monitoring UI
celery[redis]==5.*                 # Celery with Redis backend
```

#### File Storage

```text
boto3==1.*                         # AWS S3 client
google-cloud-storage==2.*          # GCS client (alternative)
aiofiles==24.*                     # Async file I/O
python-magic==0.4.*                # File type detection
```

#### Email

```text
fastapi-mail==1.*                  # Email integration for FastAPI
jinja2==3.*                        # HTML email templates
```

#### HTTP Client

```text
httpx==0.28.*                      # Async HTTP client (for external APIs)
aiohttp==3.*                       # Async HTTP (alternative)
```

#### PDF / Report Generation

```text
reportlab==4.*                     # PDF generation
weasyprint==62.*                   # HTML-to-PDF (alternative)
openpyxl==3.*                      # Excel report generation
```

#### Monitoring & Logging

```text
prometheus-client==0.21.*          # Prometheus metrics exposition
structlog==24.*                    # Structured JSON logging
python-json-logger==3.*            # JSON log formatter
sentry-sdk==2.*                    # Error tracking (optional)
```

#### Testing

```text
pytest==8.*
pytest-asyncio==0.24.*
httpx==0.28.*                      # Async test client
faker==33.*                        # Fake data generation
factory-boy==3.*                   # Test fixtures
pytest-cov==6.*                    # Coverage reports
pytest-mock==3.*                   # Mocking utilities
```

#### Code Quality

```text
ruff==0.8.*                        # Fast Python linter
black==24.*                        # Code formatter
isort==5.*                         # Import sorter
mypy==1.*                          # Static type checker
bandit==1.*                        # Security linting
pip-audit==2.*                     # Dependency vulnerability scan
```

### 3.3 requirements/ Organization

```
requirements/
├── base.txt        # Core production dependencies
├── dev.txt         # base.txt + testing + linting tools
└── prod.txt        # base.txt + production-only (gunicorn, sentry)
```

---

## 4. Frontend Technology Stack

### 4.1 Core Stack

| Package         | Version | Purpose                                       |
|-----------------|---------|-----------------------------------------------|
| react           | 19.x    | UI library                                    |
| react-dom       | 19.x    | DOM renderer                                  |
| typescript      | 5.x     | Type safety                                   |
| vite            | 6.x     | Build tool + dev server                       |
| react-router-dom| 7.x     | Client-side routing                           |

### 4.2 UI & Styling

| Package              | Version | Purpose                                  |
|----------------------|---------|------------------------------------------|
| tailwindcss          | 4.x     | Utility-first CSS framework              |
| @shadcn/ui           | latest  | Pre-built accessible components          |
| framer-motion        | 12.x    | Declarative animations and transitions  |
| lucide-react         | latest  | Consistent SVG icon library              |
| clsx                 | 2.x     | Conditional className utility            |
| tailwind-merge       | 2.x     | Merge Tailwind classes safely            |

### 4.3 State & Data Fetching

| Package              | Version | Purpose                                  |
|----------------------|---------|------------------------------------------|
| @reduxjs/toolkit     | 2.x     | Global application state                 |
| react-redux          | 9.x     | React bindings for Redux                 |
| @tanstack/react-query| 5.x     | Server state, caching, sync             |
| axios                | 1.x     | HTTP requests with interceptors          |

### 4.4 Forms & Validation

| Package              | Version | Purpose                                  |
|----------------------|---------|------------------------------------------|
| react-hook-form      | 7.x     | Form state management                    |
| zod                  | 3.x     | Schema validation (shared with backend) |
| @hookform/resolvers  | 3.x     | Zod integration with React Hook Form    |

### 4.5 Data Visualization

| Package              | Version | Purpose                                  |
|----------------------|---------|------------------------------------------|
| chart.js             | 4.x     | Canvas-based chart rendering             |
| react-chartjs-2      | 5.x     | React wrapper for Chart.js              |
| recharts             | 2.x     | Declarative charts (alternative)        |

### 4.6 Rich Components

| Package              | Version | Purpose                                  |
|----------------------|---------|------------------------------------------|
| @monaco-editor/react | 4.x     | VS Code-grade code editor               |
| react-markdown       | 9.x     | Render AI markdown responses             |
| remark-gfm           | 4.x     | GitHub Flavored Markdown support        |
| react-syntax-highlighter | 15.x| Code block syntax highlighting          |
| react-pdf            | 9.x     | Render PDF files in browser             |
| video.js             | 8.x     | Video player for course content          |

### 4.7 Developer Experience

| Package              | Version | Purpose                                  |
|----------------------|---------|------------------------------------------|
| eslint               | 9.x     | Code linting                             |
| prettier             | 3.x     | Code formatting                          |
| @typescript-eslint   | 8.x     | TypeScript ESLint rules                  |
| vitest               | 2.x     | Unit testing (Vite-native)              |
| @testing-library/react| 16.x  | Component testing utilities              |
| playwright           | 1.x     | End-to-end browser testing              |

### 4.8 package.json Scripts

```json
{
  "scripts": {
    "dev":       "vite",
    "build":     "tsc -b && vite build",
    "preview":   "vite preview",
    "lint":      "eslint . --ext ts,tsx",
    "format":    "prettier --write src/",
    "typecheck": "tsc --noEmit",
    "test":      "vitest",
    "test:e2e":  "playwright test",
    "test:cov":  "vitest --coverage"
  }
}
```

---

## 5. Database Standards

### 5.1 MongoDB Atlas Configuration

| Setting              | Value                                            |
|----------------------|--------------------------------------------------|
| Atlas Tier           | M10+ (production), M0 free tier (development)  |
| Replica Set          | 3-node minimum                                  |
| Write Concern        | `majority`                                      |
| Read Preference      | `secondaryPreferred` for analytics queries      |
| Connection String    | Stored in `MONGODB_URI` environment variable    |
| Driver               | Motor 3.x (async)                               |
| ODM                  | Beanie 1.x (built on Motor)                    |

### 5.2 Collection Naming Convention

| Rule                | Example                    |
|---------------------|----------------------------|
| Lowercase           | `users` ✅ / `Users` ❌   |
| Plural nouns        | `courses` ✅ / `course` ❌ |
| Underscores for spaces | `chat_sessions` ✅      |
| No abbreviations    | `certificates` ✅ / `certs` ❌ |

**Registered Collections:**

```
users               profiles            skill_history
roadmaps            courses             lessons
enrollments         quizzes             quiz_attempts
resumes             resume_scores       interviews
interview_reports   coding_submissions  chat_sessions
chat_messages       memory_summaries    feedback
notifications       certificates        analytics
jobs                internships         mentors
reports             settings
```

### 5.3 Document ID Convention

- All documents use MongoDB `ObjectId` as `_id`
- String IDs are never manually assigned (no UUID unless specifically required)
- References between collections use `ObjectId` (not embedded unless the data is truly owned)

### 5.4 Field Naming Convention

```python
# Python / Beanie model field names → snake_case
class UserProfile(Document):
    user_id: PydanticObjectId
    full_name: str
    career_goal: str
    created_at: datetime
    updated_at: datetime
```

### 5.5 Timestamp Conventions

Every document that stores persistent data must include:

```python
created_at: datetime = Field(default_factory=datetime.utcnow)
updated_at: datetime = Field(default_factory=datetime.utcnow)
```

- `updated_at` must be refreshed on every write via a Beanie pre-save hook
- All timestamps stored in UTC

### 5.6 Soft Delete Convention

Documents representing users and courses use soft delete:

```python
is_active: bool = True
deleted_at: Optional[datetime] = None
```

Hard deletes only for: OTPs, temporary sessions, analytics raw events (after aggregation).

---

## 6. Redis Standards

### 6.1 Key Naming Convention

All Redis keys follow the pattern: `{service}:{entity}:{identifier}`

```
auth:session:{user_id}
auth:blacklist:{jti}
auth:otp:{email}
ratelimit:{endpoint}:{ip}
cache:dashboard:{user_id}
cache:courses:catalog
ai:context:{session_id}
celery:task:{task_id}
```

**Rules:**
- Keys are lowercase with colons as separators
- No spaces in key names
- All temporary keys must have TTL defined at creation

### 6.2 TTL Policy

| Key Pattern              | TTL          |
|--------------------------|--------------|
| `auth:session:*`         | 86400s (24h) |
| `auth:blacklist:*`       | Token expiry |
| `auth:otp:*`             | 600s (10min) |
| `ratelimit:*`            | 60s          |
| `cache:dashboard:*`      | 300s (5min)  |
| `cache:courses:catalog`  | 1800s (30min)|
| `ai:context:*`           | 7200s (2h)   |

### 6.3 Redis Configuration

```
maxmemory-policy: allkeys-lru
appendonly: yes              # AOF persistence for Celery durability
save: ""                     # Disable RDB snapshots (use AOF only)
```

---

## 7. Qdrant Standards

### 7.1 Collection Naming

```
nexa_career_docs        # Career guides, role descriptions, industry info
nexa_interview_docs     # Interview questions, model answers
nexa_course_docs        # Course descriptions and content chunks
nexa_company_docs       # Company profiles, tech stacks
nexa_resume_examples    # Anonymized ATS-optimized resume patterns
nexa_job_descriptions   # Job postings for semantic matching
```

### 7.2 Vector Configuration

| Setting          | Value                                              |
|------------------|----------------------------------------------------|
| Embedding Model  | `text-embedding-3-small` (OpenAI) or `all-MiniLM-L6-v2` (local) |
| Vector Dimension | 1536 (OpenAI) / 384 (MiniLM local)               |
| Distance Metric  | Cosine similarity                                  |
| Top-K Retrieval  | 5 (configurable per agent)                        |
| Score Threshold  | 0.75 (minimum relevance score)                    |

### 7.3 Metadata Schema (per chunk)

```json
{
  "doc_id": "uuid-string",
  "source": "career_guide_aiml.pdf",
  "category": "career",
  "topic": "machine_learning",
  "chunk_index": 3,
  "total_chunks": 12,
  "created_at": "2026-07-03T00:00:00Z",
  "embedding_model": "text-embedding-3-small"
}
```

### 7.4 Embedding Model Versioning

- The embedding model name is stored with every vector as metadata
- Changing the embedding model requires re-indexing all collections
- Model version tracked in the `settings` MongoDB collection

---

## 8. Docker Standards

### 8.1 Container Responsibilities

| Container       | Single Responsibility                                 |
|-----------------|-------------------------------------------------------|
| `nginx`         | Reverse proxy, SSL termination, static file serving  |
| `frontend`      | Build React app → serve via Nginx                    |
| `backend`       | Run FastAPI with Uvicorn                             |
| `celery_worker` | Process async background jobs                        |
| `celery_beat`   | Schedule periodic tasks                              |
| `flower`        | Celery monitoring web UI                             |
| `mongodb`       | Primary database (dev only; Atlas in production)     |
| `redis`         | Cache, sessions, rate limiting, Celery broker        |
| `qdrant`        | Vector database                                      |
| `prometheus`    | Scrape and store metrics                             |
| `grafana`       | Metrics visualization and alerting                   |
| `loki`          | Log aggregation                                      |
| `promtail`      | Log shipping from containers to Loki                 |

### 8.2 Docker Image Standards

| Rule                          | Implementation                               |
|-------------------------------|----------------------------------------------|
| Use official base images      | `python:3.13-slim`, `node:20-alpine`        |
| Multi-stage builds            | Separate `builder` and `runtime` stages     |
| Pin image versions            | Never use `:latest` in production           |
| Non-root user                 | Add `appuser` and switch to it              |
| No secrets in images          | Use environment variables at runtime        |
| `.dockerignore`               | Exclude `__pycache__`, `.env`, `node_modules`|
| Layer caching optimization    | Copy `requirements.txt` before source code  |

### 8.3 Example Backend Dockerfile Structure

```dockerfile
# Stage 1: Builder
FROM python:3.13-slim AS builder
WORKDIR /build
COPY requirements/prod.txt .
RUN pip install --no-cache-dir -r prod.txt

# Stage 2: Runtime
FROM python:3.13-slim AS runtime
WORKDIR /app
RUN adduser --disabled-password --gecos '' appuser
COPY --from=builder /usr/local/lib/python3.13/site-packages /usr/local/lib/python3.13/site-packages
COPY . .
USER appuser
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 8.4 Named Volumes Strategy

```yaml
volumes:
  mongodb_data:        # MongoDB data persistence
  redis_data:          # Redis AOF persistence
  qdrant_data:         # Qdrant vector index storage
  prometheus_data:     # Metrics history
  grafana_data:        # Dashboard configurations
  loki_data:           # Log storage
```

---

## 9. AI Provider Standards

### 9.1 Supported Providers

| Provider       | Model Examples                    | Use Case                         |
|----------------|-----------------------------------|----------------------------------|
| OpenAI         | gpt-4o, gpt-4o-mini               | Primary (best capability)        |
| Google Gemini  | gemini-1.5-pro, gemini-flash      | Alternative primary              |
| Anthropic Claude| claude-3-5-sonnet, claude-haiku  | Complex reasoning, fallback      |
| DeepSeek       | deepseek-chat, deepseek-reasoner  | Cost-optimized alternative       |
| Ollama         | llama3.2, mistral, codellama      | Local / air-gapped deployments   |

### 9.2 Provider Interface Contract

Every provider adapter must implement:

```python
class BaseAIProvider:
    async def chat(self, messages: list[Message], **kwargs) -> AIResponse: ...
    async def stream(self, messages: list[Message], **kwargs) -> AsyncIterator[str]: ...
    async def embed(self, texts: list[str]) -> list[list[float]]: ...
    def count_tokens(self, text: str) -> int: ...
    def is_available(self) -> bool: ...
```

### 9.3 Provider Selection Logic

```
1. Read ACTIVE_AI_PROVIDER from settings (Admin-configurable)
2. Initialize primary provider
3. If unavailable → auto-switch to FALLBACK_AI_PROVIDER_1
4. If unavailable → auto-switch to FALLBACK_AI_PROVIDER_2
5. Log every provider switch as a WARNING event
6. Circuit breaker opens after 5 consecutive failures
```

### 9.4 Provider Configuration (Environment Variables)

```bash
ACTIVE_AI_PROVIDER=openai
FALLBACK_AI_PROVIDER_1=gemini
FALLBACK_AI_PROVIDER_2=claude

OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o
OPENAI_MAX_TOKENS=4096
OPENAI_TEMPERATURE=0.7

GEMINI_API_KEY=AIza...
GEMINI_MODEL=gemini-1.5-pro

ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022

OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

---

## 10. AI Agent Standards

### 10.1 Agent Definition Contract

Every agent must document and implement all of the following:

| Property          | Description                                              |
|-------------------|----------------------------------------------------------|
| **Name**          | Unique identifier (e.g., `career_agent`)                |
| **Purpose**       | Single-sentence description of what the agent does      |
| **Input Schema**  | Pydantic model defining accepted inputs                 |
| **Output Schema** | Pydantic model defining guaranteed output structure     |
| **System Prompt** | Versioned prompt template (in `ai/prompts/`)           |
| **Tools**         | List of LangChain tools the agent may call             |
| **Memory Policy** | Uses short-term / long-term / none                     |
| **RAG Policy**    | Which Qdrant collections to query                      |
| **Fallback**      | Behavior when agent cannot produce confident output    |
| **Max Retries**   | Number of LLM retries on failure                       |
| **Timeout**       | Maximum execution time (seconds)                       |

### 10.2 Agent Input/Output Schema Example

```python
class CareerAgentInput(BaseModel):
    user_id: str
    query: str
    user_profile: UserProfileContext
    chat_history: list[ChatMessage]
    rag_context: list[str]

class CareerAgentOutput(BaseModel):
    career_recommendations: list[CareerMatch]
    reasoning: str
    confidence: float          # 0.0 – 1.0
    next_actions: list[str]
    agent_name: str = "career_agent"
    latency_ms: int
```

### 10.3 Agent Communication Rule

```
❌ WRONG: career_agent.call(learning_agent)   # Direct agent-to-agent
✅ RIGHT:  orchestrator.route(intent) → [career_agent, learning_agent]
```

All agent invocation is routed through the LangGraph orchestrator only.

---

## 11. Folder Structure Standards

### 11.1 Backend Structure

```
backend/
│
├── app/
│   ├── __init__.py
│   ├── main.py                      # FastAPI app factory + lifespan
│   ├── config.py                    # Pydantic BaseSettings + env loading
│   │
│   ├── api/
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── router.py            # Include all sub-routers
│   │       ├── auth.py
│   │       ├── users.py
│   │       ├── career.py
│   │       ├── resume.py
│   │       ├── learning.py
│   │       ├── interview.py
│   │       ├── coding.py
│   │       ├── ai.py
│   │       ├── feedback.py
│   │       ├── notifications.py
│   │       ├── analytics.py
│   │       └── admin.py
│   │
│   ├── core/
│   │   ├── database.py              # Motor/Beanie init
│   │   ├── redis.py                 # Redis connection pool
│   │   ├── qdrant.py                # Qdrant client init
│   │   ├── security.py              # JWT encode/decode, password hash
│   │   ├── dependencies.py          # FastAPI Depends() definitions
│   │   └── exceptions.py            # Custom exceptions + handlers
│   │
│   ├── middleware/
│   │   ├── logging_middleware.py
│   │   ├── rate_limit_middleware.py
│   │   └── cors_middleware.py
│   │
│   ├── auth/
│   │   ├── service.py
│   │   ├── repository.py
│   │   ├── schemas.py
│   │   ├── oauth.py
│   │   └── dependencies.py
│   │
│   ├── ai/
│   │   ├── gateway/
│   │   │   ├── gateway.py           # Entry point for all AI requests
│   │   │   ├── intent_detector.py   # Classify query intent
│   │   │   └── agent_router.py      # Select agents for intent
│   │   │
│   │   ├── agents/
│   │   │   ├── base_agent.py        # Abstract base agent class
│   │   │   ├── career_agent.py
│   │   │   ├── resume_agent.py
│   │   │   ├── learning_agent.py
│   │   │   ├── coding_agent.py
│   │   │   ├── interview_agent.py
│   │   │   ├── recommendation_agent.py
│   │   │   ├── skill_gap_agent.py
│   │   │   ├── roadmap_agent.py
│   │   │   ├── feedback_agent.py
│   │   │   └── analytics_agent.py
│   │   │
│   │   ├── orchestrator/
│   │   │   ├── graph.py             # LangGraph StateGraph definition
│   │   │   ├── nodes.py             # Each graph node function
│   │   │   ├── state.py             # GraphState TypedDict
│   │   │   └── edges.py             # Conditional edge functions
│   │   │
│   │   ├── memory/
│   │   │   ├── short_term.py        # Redis session memory
│   │   │   └── long_term.py         # MongoDB user memory
│   │   │
│   │   ├── rag/
│   │   │   ├── pipeline.py          # Ingestion + retrieval
│   │   │   ├── embedder.py          # Embedding model wrapper
│   │   │   ├── retriever.py         # Qdrant query interface
│   │   │   └── chunker.py           # Document chunking strategies
│   │   │
│   │   ├── prompts/
│   │   │   ├── system_prompts.py    # All system prompt templates
│   │   │   └── agent_prompts.py     # Per-agent prompt templates
│   │   │
│   │   ├── tools/
│   │   │   ├── web_search_tool.py
│   │   │   ├── resume_tool.py
│   │   │   └── job_search_tool.py
│   │   │
│   │   └── providers/
│   │       ├── base_provider.py     # Abstract provider interface
│   │       ├── openai_provider.py
│   │       ├── gemini_provider.py
│   │       ├── claude_provider.py
│   │       ├── deepseek_provider.py
│   │       └── ollama_provider.py
│   │
│   ├── services/
│   │   ├── user_service.py
│   │   ├── career_service.py
│   │   ├── resume_service.py
│   │   ├── learning_service.py
│   │   ├── interview_service.py
│   │   ├── coding_service.py
│   │   ├── feedback_service.py
│   │   ├── notification_service.py
│   │   ├── analytics_service.py
│   │   └── admin_service.py
│   │
│   ├── repositories/
│   │   ├── user_repository.py
│   │   ├── course_repository.py
│   │   ├── resume_repository.py
│   │   ├── chat_repository.py
│   │   ├── feedback_repository.py
│   │   └── analytics_repository.py
│   │
│   ├── models/                      # Beanie document models (MongoDB)
│   │   ├── user.py
│   │   ├── profile.py
│   │   ├── course.py
│   │   ├── resume.py
│   │   ├── chat.py
│   │   ├── feedback.py
│   │   └── analytics.py
│   │
│   ├── schemas/                     # Pydantic request/response schemas
│   │   ├── common.py                # Shared schemas (Pagination, Response)
│   │   ├── auth_schemas.py
│   │   ├── user_schemas.py
│   │   ├── resume_schemas.py
│   │   ├── course_schemas.py
│   │   └── ai_schemas.py
│   │
│   ├── tasks/                       # Celery task definitions
│   │   ├── celery_app.py
│   │   ├── email_tasks.py
│   │   ├── resume_tasks.py
│   │   ├── analytics_tasks.py
│   │   ├── report_tasks.py
│   │   └── notification_tasks.py
│   │
│   ├── websocket/
│   │   ├── chat_ws.py               # AI chat streaming WebSocket
│   │   └── notification_ws.py       # Real-time notification WebSocket
│   │
│   └── utils/
│       ├── logger.py                # structlog configuration
│       ├── file_storage.py          # S3/GCS upload helpers
│       ├── pdf_generator.py
│       ├── validators.py
│       └── constants.py
│
├── tests/
│   ├── unit/
│   │   ├── test_auth_service.py
│   │   ├── test_resume_service.py
│   │   └── test_ai_gateway.py
│   ├── integration/
│   │   ├── test_auth_api.py
│   │   ├── test_resume_api.py
│   │   └── test_ai_api.py
│   └── conftest.py                  # Fixtures (test DB, test client)
│
├── scripts/
│   ├── seed_data.py                 # Seed courses, skills, jobs
│   ├── create_indexes.py            # Create MongoDB indexes
│   └── ingest_knowledge.py          # Load documents into Qdrant
│
├── requirements/
│   ├── base.txt
│   ├── dev.txt
│   └── prod.txt
│
├── Dockerfile
├── .env.example
├── pyproject.toml                   # Tool config: black, ruff, mypy, pytest
└── alembic.ini                      # (Reserved for SQL migrations if needed)
```

### 11.2 Frontend Structure

```
frontend/
│
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── router.tsx               # React Router route definitions
│   │   └── providers.tsx            # QueryClient, Redux, Toaster
│   │
│   ├── pages/                       # One file per route page
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── chat/
│   │   ├── courses/
│   │   ├── resume/
│   │   ├── interview/
│   │   ├── coding/
│   │   ├── analytics/
│   │   ├── profile/
│   │   ├── admin/
│   │   └── settings/
│   │
│   ├── features/                    # Feature-specific logic (co-located)
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── api.ts
│   │   ├── chat/
│   │   ├── resume/
│   │   └── courses/
│   │
│   ├── components/
│   │   ├── ui/                      # Atomic components (Button, Input, Card)
│   │   ├── layout/                  # Shell, Sidebar, Header, Footer
│   │   ├── shared/                  # Loader, Modal, Toast, EmptyState
│   │   └── charts/                  # Chart components
│   │
│   ├── hooks/                       # Shared custom hooks
│   │   ├── useAuth.ts
│   │   ├── useAIChat.ts
│   │   └── useWebSocket.ts
│   │
│   ├── store/                       # Redux Toolkit slices
│   │   ├── index.ts
│   │   ├── authSlice.ts
│   │   └── notificationSlice.ts
│   │
│   ├── services/                    # Axios API layer
│   │   ├── api.ts                   # Axios instance + interceptors
│   │   ├── authService.ts
│   │   ├── resumeService.ts
│   │   ├── aiService.ts
│   │   └── courseService.ts
│   │
│   ├── types/                       # TypeScript interface definitions
│   │   ├── api.types.ts             # Generic API response types
│   │   ├── user.types.ts
│   │   ├── course.types.ts
│   │   ├── resume.types.ts
│   │   └── ai.types.ts
│   │
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   │
│   └── assets/
│       ├── images/
│       └── fonts/
│
├── public/
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── .eslintrc.cjs
├── .prettierrc
└── package.json
```

---

## 12. Git Workflow

### 12.1 Branch Strategy (GitFlow)

```
main            ─── Production-ready code only; protected branch
│
develop         ─── Integration branch; all features merge here first
│
├── feature/*   ─── New features (branch from develop)
├── bugfix/*    ─── Bug fixes for develop
├── hotfix/*    ─── Emergency production fixes (branch from main)
└── release/*   ─── Release preparation (QA, version bump)
```

**Branch Protection Rules (GitHub):**
- `main`: Requires 1 review + all CI checks passing
- `develop`: Requires all CI checks passing
- Direct pushes to `main` blocked for all contributors

### 12.2 Branch Naming Convention

```
feature/auth-google-oauth
feature/ai-resume-analyzer
feature/lms-quiz-module
bugfix/jwt-refresh-token-expiry
hotfix/resume-upload-crash
release/v1.1.0
```

### 12.3 Commit Message Convention (Conventional Commits)

**Format:** `type(scope): short description`

```
feat(auth):     add Google OAuth2 login flow
fix(ai):        resolve memory retrieval null pointer
docs(api):      update resume endpoint documentation
refactor(chat): simplify LangGraph state management
test(resume):   add ATS score calculation unit tests
style(ui):      align dashboard card spacing
chore(deps):    upgrade LangChain to 0.3.5
ci(actions):    add Docker image vulnerability scan
perf(db):       add compound index on chat_messages
```

**Types:**

| Type       | When to Use                                       |
|------------|---------------------------------------------------|
| `feat`     | New feature                                       |
| `fix`      | Bug fix                                           |
| `docs`     | Documentation changes                            |
| `refactor` | Code restructure without behavior change          |
| `test`     | Adding or updating tests                         |
| `style`    | Formatting, no logic change                      |
| `chore`    | Dependency updates, build config                 |
| `ci`       | CI/CD configuration changes                      |
| `perf`     | Performance improvements                         |

### 12.4 Pull Request Checklist

Before opening a PR, the author confirms:

- [ ] Feature branch created from `develop`
- [ ] Code follows PEP 8 (Python) / ESLint (TypeScript)
- [ ] Unit tests written and passing
- [ ] No hardcoded secrets or credentials
- [ ] `.env.example` updated if new env vars added
- [ ] API documentation updated if endpoints changed
- [ ] `CHANGELOG.md` entry added

---

## 13. Coding Standards

### 13.1 Python Standards

| Standard           | Rule                                                   |
|--------------------|--------------------------------------------------------|
| Style Guide        | PEP 8 (enforced by `ruff`)                            |
| Formatter          | `black` (line length: 88)                             |
| Import Order       | `isort` (stdlib → third-party → local)               |
| Type Hints         | Required on all function signatures                   |
| Async              | `async/await` for all I/O-bound operations           |
| Docstrings         | Google-style for all public functions and classes     |
| Max Function Length| 50 lines (prefer smaller focused functions)           |

**Naming Conventions:**

| Element    | Convention   | Example                     |
|------------|--------------|-----------------------------|
| Variable   | `snake_case` | `user_profile`              |
| Function   | `snake_case` | `get_user_by_email()`       |
| Class      | `PascalCase` | `ResumeAnalyzer`            |
| Constant   | `UPPER_CASE` | `MAX_RETRY_COUNT = 3`       |
| Private    | `_prefix`    | `_build_context()`          |
| Module     | `snake_case` | `career_service.py`         |

**Example (well-structured FastAPI endpoint):**

```python
@router.post("/resume/analyze", response_model=ResumeAnalysisResponse)
async def analyze_resume(
    resume_id: str,
    current_user: User = Depends(get_current_user),
    resume_service: ResumeService = Depends(get_resume_service),
) -> ResumeAnalysisResponse:
    """Analyze an uploaded resume and return ATS score with suggestions.

    Args:
        resume_id: ObjectId of the resume document.
        current_user: Authenticated user (injected by auth middleware).
        resume_service: Resume business logic service.

    Returns:
        ResumeAnalysisResponse with ATS score, keywords, and suggestions.

    Raises:
        HTTPException 404: If resume not found.
        HTTPException 403: If resume does not belong to current_user.
    """
    return await resume_service.analyze(resume_id, current_user.id)
```

### 13.2 TypeScript Standards

| Standard         | Rule                                                    |
|------------------|---------------------------------------------------------|
| Strict Mode      | `"strict": true` in `tsconfig.json`                    |
| Formatter        | Prettier (single quotes, 2-space indent)               |
| Linter           | ESLint with `@typescript-eslint/recommended`           |
| Null Safety      | No implicit `any`; use `unknown` over `any`            |
| Props            | TypeScript `interface` for all component props         |
| No `var`         | Always use `const` or `let`                            |

**Naming Conventions:**

| Element          | Convention   | Example                      |
|------------------|--------------|------------------------------|
| Component        | `PascalCase` | `DashboardCard.tsx`          |
| Hook             | `camelCase`  | `useAIChat.ts`               |
| Variable/Function| `camelCase`  | `fetchUserProfile()`         |
| Type/Interface   | `PascalCase` | `UserProfile`, `ApiResponse` |
| Constant         | `UPPER_CASE` | `MAX_RETRY = 3`              |
| CSS Class        | `kebab-case` | (Tailwind utilities)         |

**Example (React component):**

```tsx
interface ResumeScoreCardProps {
  readonly score: number;
  readonly previousScore?: number;
  readonly suggestions: string[];
}

const ResumeScoreCard: React.FC<ResumeScoreCardProps> = ({
  score,
  previousScore,
  suggestions,
}) => {
  const trend = previousScore ? score - previousScore : 0;

  return (
    <div className="rounded-lg border p-4">
      <h3 className="text-lg font-semibold">ATS Score: {score}/100</h3>
      {trend !== 0 && (
        <p className={trend > 0 ? "text-green-600" : "text-red-600"}>
          {trend > 0 ? "▲" : "▼"} {Math.abs(trend)} from last analysis
        </p>
      )}
    </div>
  );
};

export default ResumeScoreCard;
```

---

## 14. API Standards

### 14.1 URL Conventions

| Rule                 | Example                                    |
|----------------------|--------------------------------------------|
| Base path            | `/api/v1/`                                |
| Resource: plural noun| `/api/v1/users/`, `/api/v1/courses/`     |
| Sub-resource         | `/api/v1/courses/{id}/lessons`            |
| Action (non-CRUD)    | `/api/v1/resume/analyze`                  |
| No verbs in URL      | ❌ `/api/v1/getUser` → ✅ `GET /api/v1/users/me` |
| Lowercase + hyphens  | `/api/v1/chat-sessions/`                  |

### 14.2 HTTP Method Mapping

| Action           | Method   | Example                          |
|------------------|----------|----------------------------------|
| Retrieve one     | `GET`    | `GET /api/v1/users/me`          |
| List collection  | `GET`    | `GET /api/v1/courses/`          |
| Create           | `POST`   | `POST /api/v1/courses/`         |
| Full update      | `PUT`    | `PUT /api/v1/profile/`          |
| Partial update   | `PATCH`  | `PATCH /api/v1/profile/skills`  |
| Delete           | `DELETE` | `DELETE /api/v1/chat/{id}`      |

### 14.3 Standard Success Response Schema

```json
{
  "success": true,
  "data": { },
  "message": "Profile updated successfully.",
  "timestamp": "2026-07-03T10:15:00Z"
}
```

### 14.4 Pagination Response Schema

```json
{
  "success": true,
  "data": {
    "items": [ ],
    "total": 150,
    "page": 1,
    "limit": 20,
    "pages": 8
  },
  "timestamp": "2026-07-03T10:15:00Z"
}
```

### 14.5 HTTP Status Code Reference

| Status | When to Use                                          |
|--------|------------------------------------------------------|
| 200    | Successful GET, PUT, PATCH                           |
| 201    | Successful POST (resource created)                   |
| 204    | Successful DELETE (no content returned)              |
| 400    | Validation error / bad request payload               |
| 401    | Missing or invalid authentication token              |
| 403    | Authenticated but insufficient role/permission       |
| 404    | Resource not found                                   |
| 409    | Conflict (e.g., email already registered)            |
| 422    | Unprocessable entity (Pydantic validation failure)   |
| 429    | Rate limit exceeded                                  |
| 500    | Internal server error (log + alert, hide details)    |

---

## 15. Error Response Standard

### 15.1 Error Response Schema

```json
{
  "success": false,
  "error": {
    "code": "PROFILE_NOT_FOUND",
    "message": "The requested profile does not exist.",
    "details": null
  },
  "request_id": "req_abc123xyz",
  "timestamp": "2026-07-03T10:15:00Z"
}
```

### 15.2 Error Code Registry

| Error Code               | HTTP Status | Meaning                              |
|--------------------------|-------------|--------------------------------------|
| `VALIDATION_ERROR`       | 422         | Request payload fails Pydantic model |
| `UNAUTHORIZED`           | 401         | Token missing or expired             |
| `FORBIDDEN`              | 403         | Role does not permit this action     |
| `USER_NOT_FOUND`         | 404         | User ID does not exist               |
| `PROFILE_NOT_FOUND`      | 404         | Profile document missing             |
| `RESUME_NOT_FOUND`       | 404         | Resume ID does not exist             |
| `EMAIL_ALREADY_EXISTS`   | 409         | Registration with duplicate email    |
| `RATE_LIMIT_EXCEEDED`    | 429         | Too many requests                    |
| `AI_PROVIDER_ERROR`      | 503         | All AI providers unavailable         |
| `INTERNAL_ERROR`         | 500         | Unexpected server-side error         |

---

## 16. Environment Variables

### 16.1 File Strategy

| File                 | Purpose                                         |
|----------------------|-------------------------------------------------|
| `.env.example`       | Template committed to Git (no real values)      |
| `.env.development`   | Local development secrets (gitignored)          |
| `.env.testing`       | Isolated test database and services             |
| `.env.production`    | Production secrets (managed externally / CI)    |

### 16.2 Environment Variable Reference

```bash
# ─── Application ──────────────────────────────────────────
APP_NAME=NEXA-AI
APP_ENV=development                 # development | testing | production
APP_PORT=8000
APP_DEBUG=true
ALLOWED_ORIGINS=http://localhost:3000,https://nexaai.com

# ─── Database ─────────────────────────────────────────────
MONGODB_URI=mongodb+srv://...       # Atlas connection string
MONGODB_DB_NAME=nexa_db

# ─── Redis ────────────────────────────────────────────────
REDIS_URL=redis://localhost:6379/0

# ─── Authentication ───────────────────────────────────────
JWT_PRIVATE_KEY_PATH=./keys/private.pem
JWT_PUBLIC_KEY_PATH=./keys/public.pem
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=15
JWT_REFRESH_TOKEN_EXPIRE_DAYS=7

# ─── OAuth2 Providers ─────────────────────────────────────
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
MICROSOFT_CLIENT_ID=...
MICROSOFT_CLIENT_SECRET=...

# ─── AI Providers ─────────────────────────────────────────
ACTIVE_AI_PROVIDER=openai
FALLBACK_AI_PROVIDER_1=gemini
FALLBACK_AI_PROVIDER_2=claude
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o
GEMINI_API_KEY=AIza...
ANTHROPIC_API_KEY=sk-ant-...
DEEPSEEK_API_KEY=...

# ─── Vector Database ──────────────────────────────────────
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=                     # Required in production
EMBEDDING_MODEL=text-embedding-3-small
EMBEDDING_DIMENSION=1536

# ─── Email ────────────────────────────────────────────────
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG....
EMAIL_FROM=noreply@nexaai.com

# ─── File Storage ─────────────────────────────────────────
STORAGE_PROVIDER=s3             # s3 | gcs | local
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=nexa-ai-files
AWS_REGION=ap-south-1

# ─── Celery ───────────────────────────────────────────────
CELERY_BROKER_URL=redis://localhost:6379/1
CELERY_RESULT_BACKEND=redis://localhost:6379/2
```

---

## 17. Testing Standards

### 17.1 Coverage Targets

| Test Type       | Target       | Tool                           |
|-----------------|--------------|--------------------------------|
| Unit Tests      | ≥ 80%        | Pytest + pytest-cov            |
| Integration     | All critical APIs | Pytest + HTTPX async client|
| End-to-End      | 5 core flows | Playwright                     |
| Load            | Core endpoints | Locust                       |
| Security        | OWASP Top 10 | OWASP ZAP + bandit             |

### 17.2 Priority Test Flows (E2E)

| Flow                 | Steps                                              |
|----------------------|----------------------------------------------------|
| **Registration**     | Register → Verify Email → Login → Dashboard       |
| **AI Chat**          | Login → Ask career question → Verify response     |
| **Resume Upload**    | Upload PDF → Verify parse → Check ATS score       |
| **Course Enroll**    | Browse → Enroll → Complete lesson → Quiz → Cert  |
| **Mock Interview**   | Select mode → Complete session → View report      |

### 17.3 Test File Organization

```
tests/
├── unit/
│   ├── test_auth_service.py        # Test password hashing, JWT
│   ├── test_resume_parser.py       # Test PDF/DOCX parsing
│   ├── test_ats_scorer.py          # Test ATS scoring algorithm
│   └── test_ai_gateway.py          # Test intent detection, routing
│
├── integration/
│   ├── test_auth_api.py            # Register, login, refresh flows
│   ├── test_resume_api.py          # Upload, analyze, builder
│   ├── test_ai_api.py              # Chat, career prediction
│   └── test_course_api.py          # Enroll, progress, certificate
│
├── e2e/                            # Playwright tests
│   ├── auth.spec.ts
│   ├── chat.spec.ts
│   └── resume.spec.ts
│
└── conftest.py                     # Shared fixtures
    # test_db, test_client, fake_user, mock_ai_provider
```

---

## 18. Documentation Standards

### 18.1 Documentation Inventory

| Document               | Location                    | Owner         |
|------------------------|-----------------------------|---------------|
| Phase documents (1–30) | `docs/`                     | Tech Lead     |
| API Reference          | FastAPI `/docs` (auto-gen)  | Auto          |
| Developer Guide        | `docs/developer-guide.md`   | Dev Team      |
| Database Schema        | `docs/database-schema.md`   | Backend Dev   |
| Deployment Guide       | `docs/deployment-guide.md`  | DevOps        |
| Architecture Diagrams  | `docs/architecture/`        | Architect     |
| User Guide             | `docs/user-guide.md`        | Product Owner |
| Admin Guide            | `docs/admin-guide.md`       | Product Owner |
| Runbooks               | `docs/runbooks/`            | DevOps        |
| Changelog              | `CHANGELOG.md`              | All           |
| README                 | `README.md`                 | All           |

### 18.2 README.md Minimum Contents

```markdown
# NEXA AI

Brief description (2 sentences)

## Tech Stack
## Prerequisites
## Local Development Setup
## Environment Configuration
## Running with Docker
## Running Tests
## API Documentation
## Project Structure
## Contributing Guide
## License
```

### 18.3 Code Documentation Rules

- All public functions: docstring required
- All API endpoints: `summary` and `description` in FastAPI decorator
- Complex algorithms: inline comments explaining the why, not the what
- All Pydantic models: field-level descriptions (`Field(description="...")`)

---

## 19. CI/CD Standards

### 19.1 GitHub Actions Pipeline

**File:** `.github/workflows/ci.yml`

```
Trigger: push to develop / pull_request to main or develop

Pipeline Stages:
┌─────────────────────────────────────────────┐
│  Stage 1 — Code Quality                     │
│  ├── Python: ruff lint + black format check │
│  ├── TypeScript: ESLint + Prettier check    │
│  └── Type check: mypy (Python) + tsc (TS)  │
├─────────────────────────────────────────────┤
│  Stage 2 — Security Scan                    │
│  ├── bandit (Python security linting)       │
│  ├── pip-audit (dependency CVE scan)        │
│  └── npm audit (frontend dependency scan)  │
├─────────────────────────────────────────────┤
│  Stage 3 — Automated Tests                  │
│  ├── Unit tests (Pytest + Vitest)           │
│  ├── Integration tests (HTTPX)              │
│  └── Coverage report generated             │
├─────────────────────────────────────────────┤
│  Stage 4 — Docker Build                     │
│  ├── Build backend image                    │
│  ├── Build frontend image                   │
│  └── Verify images start correctly          │
├─────────────────────────────────────────────┤
│  Stage 5 — Publish Artifacts                │
│  └── Push tagged images to GHCR            │
├─────────────────────────────────────────────┤
│  Stage 6 — Deploy Staging (auto)           │
│  └── Deploy to staging environment         │
└─────────────────────────────────────────────┤
│  Stage 7 — Deploy Production (manual gate) │
│  └── Requires reviewer approval            │
└─────────────────────────────────────────────┘
```

---

## 20. Monitoring Standards

### 20.1 Metrics to Monitor

| Category       | Metric                        | Alert Threshold            |
|----------------|-------------------------------|----------------------------|
| API            | Request latency p95           | > 3 seconds                |
| API            | Error rate                    | > 5% in 5 minutes          |
| AI             | AI response latency           | > 20 seconds               |
| AI             | Provider error rate           | > 3 consecutive failures   |
| AI             | Token usage (daily)           | > 80% of budget            |
| Database       | MongoDB query latency         | > 500ms average            |
| Database       | MongoDB connection pool       | > 80% utilized             |
| Cache          | Redis memory usage            | > 85%                      |
| Cache          | Redis hit rate                | < 60% (investigate)        |
| Queue          | Celery queue depth            | > 500 pending tasks        |
| Queue          | Task failure rate             | > 10% in 10 minutes        |
| Infrastructure | CPU usage                     | > 85% for 5 minutes        |
| Infrastructure | RAM usage                     | > 90% for 5 minutes        |
| Containers     | Restart count                 | > 3 in 10 minutes          |

---

## 21. Security Standards

### 21.1 Security Checklist (Pre-Launch)

| Category          | Requirement                                          | Status |
|-------------------|------------------------------------------------------|--------|
| Authentication    | JWT RS256 with 15-min access + 7-day refresh        | ⬜     |
| Password          | Argon2id with work factor ≥ 2                        | ⬜     |
| Authorization     | RBAC enforced on every protected route               | ⬜     |
| Transport         | HTTPS with TLS 1.3 enforced in production           | ⬜     |
| Cookies           | `HttpOnly`, `Secure`, `SameSite=Strict`             | ⬜     |
| CORS              | Allowlist of approved origins only                   | ⬜     |
| Rate Limiting     | Per-user: 100 req/min; per-IP: 200 req/min          | ⬜     |
| Input Validation  | Pydantic v2 on all endpoints                         | ⬜     |
| File Upload       | Type + size validation before processing             | ⬜     |
| Secrets           | No hardcoded secrets; all from environment          | ⬜     |
| Security Headers  | HSTS, X-Frame-Options, CSP configured in Nginx      | ⬜     |
| Audit Log         | All auth events and admin actions logged            | ⬜     |
| Dep Scanning      | pip-audit and npm audit in CI                        | ⬜     |

---

## 22. Development Workflow

### 22.1 Feature Development Lifecycle

```
Step 1 — Pick a task from the project backlog
          │
          ▼
Step 2 — Create feature branch from develop
          git checkout -b feature/ai-skill-gap-agent
          │
          ▼
Step 3 — Implement the feature
          Follow coding standards (PEP8 / ESLint)
          │
          ▼
Step 4 — Write / update tests
          pytest tests/unit/test_skill_gap.py
          │
          ▼
Step 5 — Run local quality checks
          ruff check . && black . && mypy app/
          │
          ▼
Step 6 — Open Pull Request to develop
          Fill PR template (description, screenshots, checklist)
          │
          ▼
Step 7 — CI pipeline runs automatically
          Lint → Tests → Security scan → Docker build
          │
          ▼
Step 8 — Peer review (at least 1 approval required)
          Address reviewer comments
          │
          ▼
Step 9 — Merge into develop
          Squash and merge (clean commit history)
          │
          ▼
Step 10 — Release branch created from develop
           QA sign-off → Merge to main → Tag release
```

### 22.2 Local Development Setup

```bash
# Clone repository
git clone https://github.com/your-org/nexa-ai.git
cd nexa-ai

# Start all services with Docker Compose
docker compose up -d

# Verify all services are healthy
docker compose ps

# API available at:
# http://localhost:8000/docs    ← Swagger UI
# http://localhost:3000         ← React frontend
# http://localhost:5555         ← Flower (Celery monitoring)
# http://localhost:3001         ← Grafana
# http://localhost:9090         ← Prometheus
```

---

## 23. Versioning Strategy

### 23.1 Semantic Versioning (SemVer)

**Format:** `MAJOR.MINOR.PATCH`

| Component | When to Increment                                  |
|-----------|----------------------------------------------------|
| `MAJOR`   | Breaking API changes or major architecture changes |
| `MINOR`   | New features added (backward-compatible)           |
| `PATCH`   | Bug fixes (backward-compatible)                    |

**Version Examples:**

| Version  | Meaning                                      |
|----------|----------------------------------------------|
| `1.0.0`  | Initial production release                   |
| `1.1.0`  | New AI agent or LMS feature added            |
| `1.1.1`  | Bug fix for resume parser                    |
| `2.0.0`  | API v2 with breaking changes                 |

### 23.2 Git Tagging Convention

```bash
git tag -a v1.0.0 -m "Release v1.0.0 — Initial production release"
git push origin v1.0.0
```

Docker images tagged to match Git releases:
```
ghcr.io/your-org/nexa-backend:v1.0.0
ghcr.io/your-org/nexa-frontend:v1.0.0
```

---

## 24. Project Deliverables

### 24.1 Complete Deliverables Checklist

| Category          | Deliverable                                    | Status |
|-------------------|------------------------------------------------|--------|
| **Source Code**   | Frontend React application                     | ⬜     |
| **Source Code**   | Backend FastAPI application                    | ⬜     |
| **Source Code**   | AI agent system (LangGraph)                    | ⬜     |
| **Infrastructure**| Docker Compose configuration                   | ⬜     |
| **Infrastructure**| Nginx configuration                            | ⬜     |
| **Infrastructure**| GitHub Actions CI/CD pipelines                 | ⬜     |
| **Infrastructure**| Prometheus + Grafana monitoring                | ⬜     |
| **Documentation** | Phase 1–30 design documents (this series)      | ⬜     |
| **Documentation** | API documentation (OpenAPI / Swagger)          | ⬜     |
| **Documentation** | Developer setup guide                          | ⬜     |
| **Documentation** | Deployment guide                               | ⬜     |
| **Documentation** | User manual                                    | ⬜     |
| **Documentation** | Administrator manual                           | ⬜     |
| **Testing**       | Unit test suite (≥ 80% coverage)               | ⬜     |
| **Testing**       | Integration test suite                         | ⬜     |
| **Testing**       | E2E test suite (Playwright)                    | ⬜     |
| **Presentation**  | Placement presentation deck                    | ⬜     |
| **Presentation**  | Technical report (viva document)               | ⬜     |
| **Presentation**  | Demo video (3–5 minutes)                       | ⬜     |

---

## 25. Engineering Principles

| Principle              | Description                                                        |
|------------------------|--------------------------------------------------------------------|
| **AI-First**           | AI capabilities are core workflows, not add-on features           |
| **Modularity**         | Every feature is an independent module with clear interfaces      |
| **Scalability**        | Components scale independently as user demand grows               |
| **Security by Default**| Auth, RBAC, encryption, and validation built in from day one     |
| **Observability**      | Logging, monitoring, and metrics are first-class requirements     |
| **Maintainability**    | Clean code, tests, and documentation enable long-term development |

---

## Phase Summary — Documentation Complete (Phases 1–5)

| Phase | Document                           | Status     |
|-------|------------------------------------|------------|
| 1     | Software Requirements Spec (SRS)   | ✅ Complete |
| 2     | Functional Requirements (FRS)      | ✅ Complete |
| 3     | Non-Functional Requirements (NFR)  | ✅ Complete |
| 4     | System Architecture Design (SAD)   | ✅ Complete |
| 5     | Technology Stack & Dev Standards   | ✅ Complete |

---

> **Phase 5 Complete** — Full technology stack and engineering standards defined.
>
> **Next: Phase 6 — Database Design & MongoDB Architecture**
> Field-by-field schema definitions, Beanie models, index strategy, relationships, aggregation patterns, validation rules, sample documents, and initialization scripts.

---

*NEXA AI Tech Stack — Phase 5 of 30 | Version 1.0 | July 2026*
