# NEXA AI — System Architecture Design (SAD)
## Enterprise AI-Based Career Guidance and Learning Platform

---

| Field             | Details                                        |
|-------------------|------------------------------------------------|
| **Document**      | System Architecture Design (SAD)              |
| **Phase**         | 4 of 30                                        |
| **Version**       | 1.0                                            |
| **Project**       | NEXA AI                                        |
| **Project Type**  | Major Placement Project                        |
| **Date**          | July 2026                                      |
| **Status**        | ✅ Complete                                    |

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [High-Level Three-Layer Architecture](#2-high-level-three-layer-architecture)
3. [Microservice Architecture](#3-microservice-architecture)
4. [Frontend Architecture](#4-frontend-architecture)
5. [Backend Architecture](#5-backend-architecture)
6. [AI Architecture](#6-ai-architecture)
7. [AI Agent Architecture](#7-ai-agent-architecture)
8. [LangGraph Orchestration Workflow](#8-langgraph-orchestration-workflow)
9. [AI Gateway](#9-ai-gateway)
10. [Memory Architecture](#10-memory-architecture)
11. [RAG Architecture](#11-rag-architecture)
12. [Database Architecture](#12-database-architecture)
13. [Docker Architecture](#13-docker-architecture)
14. [Authentication Flow](#14-authentication-flow)
15. [API Request Flow](#15-api-request-flow)
16. [AI Request Flow](#16-ai-request-flow)
17. [Notification Flow](#17-notification-flow)
18. [Analytics Flow](#18-analytics-flow)
19. [Security Architecture](#19-security-architecture)
20. [Deployment Architecture](#20-deployment-architecture)
21. [Logging & Monitoring](#21-logging--monitoring)
22. [Folder Structure](#22-folder-structure)
23. [Architectural Principles](#23-architectural-principles)
24. [Architecture Decision Records](#24-architecture-decision-records)

---

## 1. Architecture Overview

NEXA AI follows a **modular, AI-first architecture** designed for enterprise-grade scalability. Unlike traditional CRUD applications, NEXA AI is built around specialized intelligent agents that collaborate through an orchestration layer.

### 1.1 System Context Diagram

```
                              ╔═══════════════╗
                              ║     USERS     ║
                              ╚═══════════════╝
                                      │
               ┌──────────────────────┼──────────────────────┐
               │                      │                      │
          ┌────▼────┐           ┌──────▼──────┐       ┌──────▼──────┐
          │ Student │           │   Mentor    │       │    Admin    │
          └────┬────┘           └──────┬──────┘       └──────┬──────┘
               └──────────────────────┼──────────────────────┘
                                      │ HTTPS / WebSocket
                              ╔═══════▼═══════╗
                              ║ React Frontend ║
                              ║ TypeScript+Vite║
                              ╚═══════╤═══════╝
                                      │
                              ╔═══════▼═══════╗
                              ║     NGINX      ║
                              ║ Reverse Proxy  ║
                              ╚═══════╤═══════╝
                                      │
                              ╔═══════▼═══════╗
                              ║  FastAPI API   ║
                              ║    Gateway     ║
                              ╚═══════╤═══════╝
                                      │
          ┌───────────────────────────┼───────────────────────────┐
          │                           │                           │
  ╔═══════▼═══════╗          ╔════════▼════════╗        ╔════════▼════════╗
  ║ Authentication ║          ║   AI Gateway    ║        ║  Core Services  ║
  ║    Service     ║          ║  (LangGraph)    ║        ║   (Business)    ║
  ╚═══════╤═══════╝          ╚════════╤════════╝        ╚════════╤════════╝
          │                           │                           │
          └───────────────────────────┼───────────────────────────┘
                                      │
                           ╔══════════▼══════════╗
                           ║  LangGraph           ║
                           ║  Orchestrator        ║
                           ╚══════════╤══════════╝
                                      │
    ┌─────────┬──────────┬────────────┼────────────┬──────────┬─────────┐
    │         │          │            │            │          │         │
    ▼         ▼          ▼            ▼            ▼          ▼         ▼
 Career   Resume    Learning     Coding       Interview  Feedback  Analytics
 Agent    Agent      Agent       Agent         Agent      Agent     Agent
                                      │
                             Recommendation
                                 Agent
                                      │
                         ┌────────────┼────────────┐
                         │            │            │
                     MongoDB       Redis        Qdrant
                                      │
                   ┌──────────────────┼──────────────────┐
                   │                  │                  │
              AI Providers      Celery Workers      Monitoring
           (OpenAI/Gemini/    (Background Tasks)  (Prometheus
              Claude)                              + Grafana)
```

---

## 2. High-Level Three-Layer Architecture

### Layer 1 — Presentation Layer

**Responsibility:** Deliver a rich, interactive user interface to all user roles.

| Attribute     | Details                                              |
|---------------|------------------------------------------------------|
| **Framework** | React 18 + TypeScript                               |
| **Build Tool**| Vite                                                |
| **Styling**   | Tailwind CSS + shadcn/ui                            |
| **Animation** | Framer Motion                                       |
| **State**     | Zustand (global) + React Query (server state)       |
| **HTTP**      | Axios with interceptors                             |
| **Routing**   | React Router v6 with protected routes              |
| **Realtime**  | WebSocket (AI chat streaming)                       |

**UI Modules:**

| Module           | Description                                       |
|------------------|---------------------------------------------------|
| Authentication   | Login, register, forgot password, OAuth           |
| Dashboard        | Personalized widgets and daily AI suggestions     |
| AI Chat          | Multi-turn conversational AI with streaming       |
| Courses          | LMS course catalog, lessons, quizzes, coding lab  |
| Resume           | Upload, view analysis, builder, ATS score         |
| Interview        | Mock interview sessions with real-time evaluation |
| Coding           | In-browser code editor with AI assistant          |
| Analytics        | Personal progress charts and insights             |
| Notifications    | In-app notification center                        |
| Profile          | Personal, academic, skills, career goal editor    |
| Admin            | User management, content, AI config, reports      |
| Settings         | Account, privacy, notification preferences        |

---

### Layer 2 — Business Layer

**Responsibility:** Implement all business logic, AI orchestration, and data access.

| Attribute     | Details                                       |
|---------------|-----------------------------------------------|
| **Framework** | FastAPI (Python 3.12)                         |
| **Server**    | Uvicorn with Gunicorn workers                 |
| **AI**        | LangGraph + LangChain                         |
| **Tasks**     | Celery + Celery Beat                          |
| **Auth**      | JWT (RS256) + OAuth2                          |
| **Validation**| Pydantic v2                                   |

**Business Services:**

| Service                | Responsibility                                |
|------------------------|-----------------------------------------------|
| Auth Service           | Registration, login, token management         |
| User Service           | Profile CRUD, skills, academic info           |
| Career Service         | Career predictions, roadmap generation        |
| AI Gateway             | Intent detection, agent routing, LLM calls    |
| Resume Service         | Upload, parsing, ATS scoring, builder         |
| Learning Service       | Courses, lessons, quizzes, progress           |
| Interview Service      | Mock sessions, evaluation, reports            |
| Coding Service         | Code execution, explanation, AI assist        |
| Recommendation Service | Cross-domain resource recommendations         |
| Feedback Service       | AI response feedback, aggregation             |
| Notification Service   | Event triggering, delivery, preferences       |
| Analytics Service      | Metric computation, dashboard data            |
| Admin Service          | User management, content, configuration       |

---

### Layer 3 — Data Layer

**Responsibility:** Persist, cache, and semantically index all platform data.

| Store     | Technology    | Purpose                                       |
|-----------|---------------|-----------------------------------------------|
| Primary DB| MongoDB Atlas | All persistent data (users, courses, etc.)   |
| Cache     | Redis 7       | Sessions, OTPs, rate limits, AI context      |
| Vector DB | Qdrant        | Embeddings for RAG and semantic search        |
| Files     | S3 / GCS      | Resumes, certificates, uploaded documents    |

---

## 3. Microservice Architecture

NEXA AI begins as a **modular monolith** with clean service boundaries, enabling future extraction to independent microservices with minimal refactoring.

### 3.1 Service Boundaries

```
API Gateway (FastAPI main.py)
│
├── /auth/*         → Auth Service
├── /users/*        → User Service
├── /career/*       → Career Service
├── /learning/*     → Learning Service
├── /resume/*       → Resume Service
├── /interview/*    → Interview Service
├── /coding/*       → Coding Service
├── /ai/*           → AI Gateway Service
├── /recommendations/* → Recommendation Service
├── /feedback/*     → Feedback Service
├── /notifications/* → Notification Service
├── /analytics/*    → Analytics Service
└── /admin/*        → Admin Service
```

### 3.2 Service Communication

| Pattern          | Used For                                          |
|------------------|---------------------------------------------------|
| HTTP (sync)      | Standard REST API calls between client and API   |
| Celery (async)   | Email delivery, AI background jobs, reports      |
| WebSocket        | AI chat streaming, real-time notifications       |
| Redis Pub/Sub    | Internal event broadcasting                      |

### 3.3 Inter-Service Dependency Map

```
Auth Service     ◄── all services (JWT validation)
User Service     ◄── Career, Learning, Resume, AI Services
AI Gateway       ◄── Career, Resume, Learning, Coding, Interview
Celery Workers   ◄── Notification, Analytics, Report Services
Redis            ◄── Auth, AI Gateway, Rate Limiting, Sessions
MongoDB          ◄── All services
Qdrant           ◄── AI Gateway, RAG pipeline
```

---

## 4. Frontend Architecture

### 4.1 Module Tree

```
src/
│
├── app/                        # App entry, router, providers
│   ├── App.tsx
│   ├── router.tsx
│   └── providers.tsx
│
├── pages/                      # Top-level route pages
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── ForgotPasswordPage.tsx
│   ├── dashboard/
│   │   └── DashboardPage.tsx
│   ├── chat/
│   │   └── AIChatPage.tsx
│   ├── courses/
│   │   ├── CourseListPage.tsx
│   │   ├── CourseDetailPage.tsx
│   │   └── LessonPage.tsx
│   ├── resume/
│   │   ├── ResumeUploadPage.tsx
│   │   ├── ResumeAnalysisPage.tsx
│   │   └── ResumeBuilderPage.tsx
│   ├── interview/
│   │   └── MockInterviewPage.tsx
│   ├── coding/
│   │   └── CodingAssistantPage.tsx
│   ├── analytics/
│   │   └── AnalyticsPage.tsx
│   ├── profile/
│   │   └── ProfilePage.tsx
│   ├── admin/
│   │   ├── AdminDashboardPage.tsx
│   │   ├── UserManagementPage.tsx
│   │   └── AIConfigPage.tsx
│   └── settings/
│       └── SettingsPage.tsx
│
├── components/                  # Reusable UI components
│   ├── ui/                      # Base components (Button, Input, Card)
│   ├── layout/                  # Sidebar, Header, Footer, Shell
│   ├── chat/                    # ChatWindow, MessageBubble, TypingIndicator
│   ├── resume/                  # AtsScoreCard, ResumePreview
│   ├── analytics/               # Charts, StatCard, ProgressBar
│   └── shared/                  # Loaders, Modals, Toasts, EmptyState
│
├── hooks/                       # Custom React hooks
│   ├── useAuth.ts
│   ├── useAIChat.ts
│   ├── useProfile.ts
│   └── useNotifications.ts
│
├── store/                       # Zustand global state
│   ├── authStore.ts
│   ├── chatStore.ts
│   └── notificationStore.ts
│
├── services/                    # Axios API service layer
│   ├── api.ts                   # Axios instance + interceptors
│   ├── authService.ts
│   ├── resumeService.ts
│   ├── aiService.ts
│   └── courseService.ts
│
├── types/                       # TypeScript interfaces
│   ├── user.types.ts
│   ├── course.types.ts
│   ├── resume.types.ts
│   └── ai.types.ts
│
├── utils/                       # Pure utility functions
│   ├── formatters.ts
│   ├── validators.ts
│   └── constants.ts
│
└── assets/                      # Static files, images, fonts
```

### 4.2 Data Fetching Strategy

| Pattern         | Tool          | Use Case                                    |
|-----------------|---------------|---------------------------------------------|
| Server State    | React Query   | All API data (cache, refetch, stale-while-revalidate) |
| Global State    | Zustand       | Auth user, chat session, notifications      |
| Form State      | React Hook Form| All forms with Zod schema validation       |
| Realtime        | WebSocket     | AI chat streaming, live notifications       |

### 4.3 Routing Strategy

```
/                       → Landing Page
/login                  → Login Page
/register               → Register Page
/dashboard              → Protected: Student Dashboard
/chat                   → Protected: AI Chat
/courses                → Protected: Course Catalog
/courses/:id            → Protected: Course Detail
/resume                 → Protected: Resume Hub
/interview              → Protected: Mock Interview
/coding                 → Protected: Coding Assistant
/analytics              → Protected: Analytics
/profile                → Protected: Profile Editor
/admin/*                → Protected + Admin Role Required
/settings               → Protected: Account Settings
```

---

## 5. Backend Architecture

### 5.1 FastAPI Request Lifecycle

```
Incoming HTTP Request
        │
        ▼
  NGINX (Reverse Proxy)
        │
        ▼
  Uvicorn (ASGI Server)
        │
        ▼
  FastAPI App Entry (main.py)
        │
        ▼
  CORS Middleware
        │
        ▼
  Request Logging Middleware
        │
        ▼
  Rate Limiting Middleware (Redis)
        │
        ▼
  API Router (versioned: /api/v1/)
        │
        ▼
  JWT Authentication Middleware
        │
        ▼
  Role Authorization Check
        │
        ▼
  Pydantic Request Validation
        │
        ▼
  Business Service Layer
        │
        ▼
  Repository Layer (Data Access)
        │
        ▼
  MongoDB / Redis / Qdrant
        │
        ▼
  Pydantic Response Schema
        │
        ▼
  JSON HTTP Response
```

### 5.2 Backend Module Structure

```
app/
│
├── main.py                     # FastAPI app factory
├── config.py                   # Settings via Pydantic BaseSettings
│
├── api/                        # Route handlers (thin controllers)
│   └── v1/
│       ├── __init__.py
│       ├── auth.py
│       ├── users.py
│       ├── career.py
│       ├── resume.py
│       ├── learning.py
│       ├── interview.py
│       ├── coding.py
│       ├── ai.py
│       ├── feedback.py
│       ├── notifications.py
│       ├── analytics.py
│       └── admin.py
│
├── core/                       # Core infrastructure
│   ├── database.py             # MongoDB connection (Motor)
│   ├── redis.py                # Redis connection
│   ├── qdrant.py               # Qdrant client
│   ├── security.py             # JWT, password hashing
│   ├── dependencies.py         # FastAPI Depends() definitions
│   └── exceptions.py           # Custom exception handlers
│
├── middleware/                 # ASGI middleware
│   ├── logging.py
│   ├── rate_limit.py
│   └── cors.py
│
├── auth/                       # Auth domain
│   ├── service.py
│   ├── repository.py
│   ├── schemas.py
│   └── oauth.py
│
├── ai/                         # AI subsystem
│   ├── gateway/
│   │   ├── gateway.py          # AI Gateway entry point
│   │   ├── intent.py           # Intent detection
│   │   └── router.py           # Agent selection router
│   ├── agents/
│   │   ├── career_agent.py
│   │   ├── resume_agent.py
│   │   ├── learning_agent.py
│   │   ├── coding_agent.py
│   │   ├── interview_agent.py
│   │   ├── recommendation_agent.py
│   │   ├── skill_gap_agent.py
│   │   ├── roadmap_agent.py
│   │   ├── feedback_agent.py
│   │   └── analytics_agent.py
│   ├── memory/
│   │   ├── short_term.py       # Redis-based session memory
│   │   └── long_term.py        # MongoDB-based user memory
│   ├── rag/
│   │   ├── pipeline.py         # Ingestion + retrieval
│   │   ├── embedder.py         # Embedding model wrapper
│   │   └── retriever.py        # Qdrant semantic search
│   ├── prompts/
│   │   ├── system_prompts.py
│   │   └── agent_prompts.py
│   ├── tools/
│   │   ├── search_tool.py
│   │   ├── resume_tool.py
│   │   └── job_tool.py
│   └── providers/
│       ├── openai_provider.py
│       ├── gemini_provider.py
│       ├── claude_provider.py
│       └── ollama_provider.py
│
├── services/                   # Business logic layer
│   ├── user_service.py
│   ├── career_service.py
│   ├── resume_service.py
│   ├── learning_service.py
│   ├── interview_service.py
│   ├── coding_service.py
│   ├── feedback_service.py
│   ├── notification_service.py
│   ├── analytics_service.py
│   └── admin_service.py
│
├── repositories/               # Data access layer (MongoDB)
│   ├── user_repository.py
│   ├── course_repository.py
│   ├── resume_repository.py
│   ├── chat_repository.py
│   └── analytics_repository.py
│
├── models/                     # MongoDB document models (Beanie/Motor)
│   ├── user.py
│   ├── course.py
│   ├── resume.py
│   ├── chat.py
│   └── feedback.py
│
├── schemas/                    # Pydantic request/response schemas
│   ├── auth_schemas.py
│   ├── user_schemas.py
│   ├── resume_schemas.py
│   ├── course_schemas.py
│   └── ai_schemas.py
│
├── tasks/                      # Celery async tasks
│   ├── celery_app.py
│   ├── email_tasks.py
│   ├── resume_tasks.py
│   ├── analytics_tasks.py
│   └── notification_tasks.py
│
├── websocket/                  # WebSocket handlers
│   ├── chat_ws.py
│   └── notification_ws.py
│
└── utils/                      # Shared utilities
    ├── logger.py
    ├── file_storage.py
    ├── pdf_generator.py
    └── validators.py
```

---

## 6. AI Architecture

NEXA AI does not use a single monolithic chatbot. Instead, it uses an **AI Gateway** that intelligently routes requests to specialized agents.

### 6.1 AI Processing Pipeline

```
User Message
      │
      ▼
┌─────────────────────────┐
│      AI Gateway         │
│                         │
│  1. Intent Detection    │  ← Classify query domain
│  2. Context Builder     │  ← Assemble user profile context
│  3. Memory Retrieval    │  ← Fetch session + long-term memory
│  4. RAG Retrieval       │  ← Semantic search from Qdrant
│  5. Agent Selection     │  ← Choose specialist agent(s)
│  6. Tool Calling        │  ← External API / database tools
│  7. LLM Provider Call   │  ← OpenAI / Gemini / Claude
│  8. Response Validation │  ← Format check, safety check
│  9. Memory Storage      │  ← Save to Redis + MongoDB
└─────────────────────────┘
      │
      ▼
Streamed Response → User
      │
      ▼
Feedback Collection
```

### 6.2 Intent Classification

| Intent Category     | Routed To                              |
|---------------------|----------------------------------------|
| Career guidance     | Career Agent                           |
| Resume review       | Resume Agent + ATS Agent               |
| Learning path       | Learning Agent + Roadmap Agent         |
| Code help           | Coding Agent                           |
| Interview prep      | Interview Agent                        |
| Job/internship      | Job Agent + Recommendation Agent       |
| Skill gap           | Skill Gap Agent                        |
| General Q&A         | Career Agent (default)                 |
| Multi-domain        | Orchestrator selects multiple agents   |

---

## 7. AI Agent Architecture

### 7.1 Agent Registry

| Agent               | Input                          | Output                                     |
|---------------------|--------------------------------|--------------------------------------------|
| Career Agent        | Profile, goals, market data    | Career match %, reasons, salary, roadmap   |
| Resume Agent        | Resume text, target role       | Improvement suggestions, missing sections  |
| ATS Agent           | Resume text, job description   | ATS score, missing keywords, formatting    |
| Learning Agent      | Skills, goals, progress        | Course list, learning plan                 |
| Coding Agent        | Code, language, question       | Explanation, debugged code, complexity     |
| Interview Agent     | Role, mode, responses          | Questions, evaluation, score, feedback     |
| Recommendation Agent| Profile, history               | Courses, books, projects, certs           |
| Skill Gap Agent     | Current skills, target role    | Missing skills, priority, remediation      |
| Roadmap Agent       | Goal, timeline, skills         | Monthly/weekly/daily plan                  |
| Job Agent           | Profile, preferences           | Matched jobs with score                    |
| Feedback Agent      | AI response, user rating       | Stored feedback, quality signal            |
| Analytics Agent     | User activity logs             | Insights, progress summary                 |

### 7.2 Agent Communication Pattern

```
User Query
    │
    ▼
Orchestrator (LangGraph StateGraph)
    │
    ├──→ [Career Agent]        returns CareerOutput
    ├──→ [Skill Gap Agent]     returns SkillGapOutput
    └──→ [Learning Agent]      returns LearningOutput
              │
              ▼
        Result Merger
              │
              ▼
    Final Response (merged, formatted)
```

**Rules:**
- Agents do not call each other directly
- All communication routed through the LangGraph state graph
- Each agent receives a standardized `AgentInput` Pydantic model
- Each agent returns a standardized `AgentOutput` Pydantic model

---

## 8. LangGraph Orchestration Workflow

### 8.1 State Graph Definition

```python
# Conceptual representation of the LangGraph StateGraph

State = {
    "user_id": str,
    "query": str,
    "intent": str,
    "user_profile": dict,
    "chat_history": list,
    "rag_context": list,
    "agent_outputs": dict,
    "final_response": str,
    "memory_saved": bool
}
```

### 8.2 Workflow Sequence

```
[START]
   │
   ▼
[Detect Intent Node]
   │  Classifies query domain
   ▼
[Build Context Node]
   │  Assembles user profile, academic info, skills, goals
   ▼
[Retrieve Memory Node]
   │  Loads Redis session + MongoDB long-term summaries
   ▼
[RAG Retrieval Node]
   │  Semantic search from Qdrant knowledge base
   ▼
[Route Agents Node]
   │  Decides which agents to invoke (parallel capable)
   ▼
[Execute Agents Node]  ←── Parallel execution for multi-agent queries
   │  Career Agent ──┐
   │  Learning Agent ─┤  All run concurrently
   │  Skill Gap Agent ┘
   ▼
[Merge Results Node]
   │  Combines outputs into coherent narrative
   ▼
[Generate Response Node]
   │  Final LLM call for formatting and personalization
   ▼
[Validate Response Node]
   │  Safety check, format check, completeness check
   ▼
[Store Memory Node]
   │  Saves session to Redis; summarizes for MongoDB
   ▼
[Stream Response]
   │  Token streaming via WebSocket to React frontend
   ▼
[Collect Feedback]
   │  Feedback UI shown; rating stored asynchronously
   ▼
[END]
```

---

## 9. AI Gateway

### 9.1 Gateway Responsibilities

| Responsibility       | Implementation                                      |
|----------------------|-----------------------------------------------------|
| Provider Selection   | Admin-configured; runtime-switchable               |
| System Prompt Mgmt   | Per-agent system prompts loaded from config        |
| Agent Routing        | Intent-based routing to one or more agents         |
| Retry Logic          | Exponential backoff, up to 3 attempts              |
| Provider Failover    | Primary → Secondary → Tertiary chain               |
| Context Injection    | User profile + RAG chunks injected per request     |
| Token Tracking       | Token usage logged per request for cost monitoring |
| Latency Measurement  | Request-level latency logged to metrics store      |

### 9.2 Provider Fallback Chain

```
Request arrives at AI Gateway
          │
          ▼
   Primary Provider
   (e.g., OpenAI GPT-4o)
          │
    ┌─────┴──────┐
  Success      Failure (retry × 3)
    │               │
    ▼               ▼
  Return      Secondary Provider
  Response    (e.g., Gemini 1.5 Pro)
                    │
              ┌─────┴──────┐
            Success      Failure
              │               │
              ▼               ▼
            Return      Tertiary Provider
            Response    (e.g., Claude 3.5)
                              │
                        ┌─────┴──────┐
                      Success      All Failed
                        │               │
                        ▼               ▼
                      Return    Graceful Error
                      Response  "AI temporarily
                                unavailable"
```

---

## 10. Memory Architecture

### 10.1 Short-Term Memory (Redis)

Stores per-session conversational context. Automatically expires when session ends.

| Data                   | Redis Key Pattern              | TTL      |
|------------------------|--------------------------------|----------|
| Active conversation    | `chat:{session_id}:messages`   | 2 hours  |
| LangGraph state        | `graph:{session_id}:state`     | 2 hours  |
| Agent working memory   | `agent:{session_id}:{agent}`   | 2 hours  |
| User context cache     | `ctx:{user_id}:profile`        | 5 minutes|

### 10.2 Long-Term Memory (MongoDB)

Persists user knowledge across all sessions for true personalization.

| Data                   | MongoDB Collection            | Updated         |
|------------------------|-------------------------------|-----------------|
| Career goals           | `profiles`                    | On goal change  |
| Skill history          | `skill_history`               | On skill update |
| Completed milestones   | `roadmaps`                    | On completion   |
| Learning preferences   | `profiles`                    | Learned over time|
| Resume versions        | `resumes`                     | On each upload  |
| AI conversation summary| `memory_summaries`            | End of session  |
| Interaction patterns   | `analytics`                   | Continuously    |

### 10.3 Memory Flow

```
New Session Starts
       │
       ▼
Load from Redis (if active session exists)
       │
       ├── Found → Use existing session context
       │
       └── Not found
               │
               ▼
       Load from MongoDB (long-term summary)
               │
               ▼
       Reconstruct context for LangGraph
               │
               ▼
  Session Runs (short-term in Redis)
               │
               ▼
  Session Ends → Summarize with LLM
               │
               ▼
  Save summary to MongoDB (long-term)
               │
               ▼
  Clear session from Redis
```

---

## 11. RAG Architecture

### 11.1 Knowledge Sources

| Source Category         | Content                                         |
|-------------------------|-------------------------------------------------|
| Career Guides           | Industry career paths, role descriptions        |
| Interview Knowledge     | Common interview questions, model answers       |
| Skill Documentation     | Technology descriptions, learning resources     |
| Company Information     | Top companies, their tech stacks, culture       |
| Resume Templates        | ATS-optimized resume patterns and examples      |
| Course Catalog          | Course metadata, descriptions, prerequisites    |

### 11.2 Ingestion Pipeline

```
Source Documents (PDF / DOCX / Web / MD)
          │
          ▼
  Document Loader
  (LangChain UnstructuredLoader)
          │
          ▼
  Text Chunker
  (RecursiveCharacterTextSplitter)
  chunk_size=512, overlap=50
          │
          ▼
  Embedding Model
  (OpenAI text-embedding-3-small
   or Sentence Transformers local)
          │
          ▼
  Qdrant Upsert
  (Collection: nexa_knowledge)
          │
          ▼
  Metadata Indexed
  (source, category, timestamp, doc_id)
```

### 11.3 Retrieval Pipeline (per query)

```
User Query
     │
     ▼
Embed Query → Float[1536] vector
     │
     ▼
Qdrant Similarity Search
(top_k=5, score_threshold=0.75)
     │
     ▼
Retrieved Chunks + Metadata
     │
     ▼
Context Assembly
(chunks inserted into LLM prompt)
     │
     ▼
Grounded AI Response
```

### 11.4 Qdrant Collections

| Collection           | Vector Dim | Content                         |
|----------------------|------------|---------------------------------|
| `nexa_knowledge`     | 1536       | Career, skill, interview docs   |
| `nexa_resumes`       | 1536       | Anonymized resume examples      |
| `nexa_courses`       | 1536       | Course descriptions and content |
| `nexa_jobs`          | 1536       | Job descriptions for matching   |

---

## 12. Database Architecture

### 12.1 MongoDB Collections

| Collection          | Primary Purpose                                    | Key Fields                           |
|---------------------|----------------------------------------------------|--------------------------------------|
| `users`             | Account credentials and role                       | email, password_hash, role, is_active|
| `profiles`          | Extended user profile                              | user_id, skills, goals, academic_info|
| `skill_history`     | Skill progression over time                        | user_id, skill, level, updated_at    |
| `roadmaps`          | Generated career roadmaps                          | user_id, goal, phases, progress      |
| `courses`           | LMS course catalog                                 | title, description, modules, level   |
| `lessons`           | Individual lesson content                          | course_id, type, content, duration   |
| `enrollments`       | Student course enrollment and progress             | user_id, course_id, progress, score  |
| `quizzes`           | Quiz questions and answers                         | lesson_id, questions, correct_answers|
| `resumes`           | Uploaded and built resume versions                 | user_id, file_url, parsed_data, version|
| `resume_scores`     | ATS analysis results                               | resume_id, ats_score, suggestions    |
| `interviews`        | Mock interview sessions                            | user_id, mode, role, questions       |
| `interview_reports` | Post-interview evaluation reports                  | interview_id, scores, feedback       |
| `coding_submissions`| Code submissions to coding assistant               | user_id, language, code, result      |
| `chat_sessions`     | AI conversation sessions                           | user_id, session_id, started_at      |
| `chat_messages`     | Individual messages in chat                        | session_id, role, content, timestamp |
| `memory_summaries`  | LLM-compressed long-term memory                   | user_id, summary, session_date       |
| `feedback`          | User feedback on AI responses                      | message_id, user_id, rating, category|
| `notifications`     | Platform notifications                             | user_id, type, content, read, sent_at|
| `certificates`      | Issued course certificates                         | user_id, course_id, cert_id, issued_at|
| `analytics`         | User activity events                               | user_id, event_type, metadata, ts    |
| `jobs`              | Job listings                                       | title, company, skills, salary, url  |
| `internships`       | Internship listings                                | title, company, duration, stipend    |
| `mentors`           | Mentor profiles                                    | user_id, expertise, availability     |
| `reports`           | Generated PDF/Excel reports                        | user_id, type, file_url, created_at  |
| `settings`          | Platform-wide configuration                        | key, value, updated_by               |

### 12.2 Key MongoDB Indexes

```javascript
// users collection
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "role": 1 })

// chat_messages collection
db.chat_messages.createIndex({ "session_id": 1, "timestamp": 1 })

// analytics collection
db.analytics.createIndex({ "user_id": 1, "event_type": 1, "timestamp": -1 })

// courses collection
db.courses.createIndex({ "tags": 1, "level": 1 })
db.courses.createIndex({ "$**": "text" })  // Full-text search

// resumes collection
db.resumes.createIndex({ "user_id": 1, "version": -1 })

// notifications collection
db.notifications.createIndex({ "user_id": 1, "read": 1 })
```

### 12.3 Redis Data Map

| Key Pattern                    | Structure    | TTL        | Purpose                    |
|--------------------------------|--------------|------------|----------------------------|
| `session:{user_id}`            | Hash         | 24 hours   | JWT session data           |
| `blacklist:jwt:{jti}`          | String       | Token TTL  | Revoked token blacklist    |
| `otp:{email}`                  | String       | 10 minutes | Email OTP for verification |
| `ratelimit:{ip}:{endpoint}`    | Sorted Set   | 1 minute   | Rate limiting window       |
| `chat:{session_id}:messages`   | List         | 2 hours    | Active conversation        |
| `cache:dashboard:{user_id}`    | String (JSON)| 5 minutes  | Dashboard widget data      |
| `celery:*`                     | Various      | Job-based  | Celery broker data         |

---

## 13. Docker Architecture

### 13.1 Container Topology

```
┌─────────────────────────────────────────────────────────┐
│                    Docker Network: nexa-network          │
│                                                         │
│  ┌───────────┐    ┌───────────┐    ┌───────────┐       │
│  │  nginx    │    │ frontend  │    │  backend  │       │
│  │ :80/:443  │───▶│  :3000    │    │  :8000    │       │
│  └─────┬─────┘    └───────────┘    └─────┬─────┘       │
│        │                                 │             │
│        └─────────────────────────────────┘             │
│                          │                             │
│          ┌───────────────┼───────────────┐             │
│          │               │               │             │
│  ┌───────▼─────┐  ┌──────▼──────┐  ┌────▼────────┐   │
│  │   mongodb   │  │    redis    │  │   qdrant    │   │
│  │   :27017    │  │    :6379    │  │   :6333     │   │
│  └─────────────┘  └─────────────┘  └─────────────┘   │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐                      │
│  │celery_worker│  │ celery_beat │                      │
│  │  (async)    │  │ (scheduler) │                      │
│  └─────────────┘  └─────────────┘                      │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │ prometheus  │  │   grafana   │  │    loki     │    │
│  │   :9090     │  │   :3001     │  │   :3100     │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### 13.2 Docker Compose Service Definitions

| Service         | Image                  | Ports       | Dependencies              |
|-----------------|------------------------|-------------|---------------------------|
| `nginx`         | nginx:alpine           | 80, 443     | frontend, backend         |
| `frontend`      | node:20-alpine → nginx | 3000        | —                         |
| `backend`       | python:3.12-slim       | 8000        | mongodb, redis, qdrant    |
| `celery_worker` | python:3.12-slim       | —           | backend, redis, mongodb   |
| `celery_beat`   | python:3.12-slim       | —           | redis                     |
| `mongodb`       | mongo:7                | 27017       | —                         |
| `redis`         | redis:7-alpine         | 6379        | —                         |
| `qdrant`        | qdrant/qdrant:latest   | 6333, 6334  | —                         |
| `prometheus`    | prom/prometheus        | 9090        | backend                   |
| `grafana`       | grafana/grafana        | 3001        | prometheus, loki          |
| `loki`          | grafana/loki           | 3100        | —                         |

---

## 14. Authentication Flow

### 14.1 Registration Flow

```
User submits registration form
           │
           ▼
  POST /api/v1/auth/register
           │
           ▼
  Validate: email uniqueness + password policy
           │
           ▼
  Hash password (Argon2id)
           │
           ▼
  Create user document (MongoDB)
           │
           ▼
  Generate email verification token
           │
           ▼
  Queue email via Celery (async)
           │
           ▼
  Return 201: "Verification email sent"
           │
           ▼
  User clicks verification link
           │
           ▼
  GET /api/v1/auth/verify?token={token}
           │
           ▼
  Mark user as verified → Redirect to login
```

### 14.2 Login Flow

```
User submits credentials
         │
         ▼
POST /api/v1/auth/login
         │
         ▼
Lookup user by email (MongoDB)
         │
    ┌────┴────┐
  Found     Not Found
    │            │
    ▼            ▼
Verify password  401 Unauthorized
(Argon2id verify)
    │
  ┌─┴──┐
Match  No Match (increment fail count)
  │        │
  ▼        ▼
Check   If 5 fails → Lock account 15 min
email   → 401 Unauthorized
verified?
  │
  ▼
Generate JWT (RS256, 15 min expiry)
Generate Refresh Token (7 days, HttpOnly cookie)
         │
         ▼
Store session in Redis
         │
         ▼
Return 200: { access_token, user, role }
```

### 14.3 Token Refresh Flow

```
Access token expires
        │
        ▼
Frontend auto-calls POST /api/v1/auth/refresh
        │
        ▼
Validate refresh token (HttpOnly cookie)
        │
   ┌────┴────┐
 Valid      Invalid / Expired
   │              │
   ▼              ▼
Issue new     Redirect to login
access token  (session ended)
   │
   ▼
Return 200: { access_token }
```

---

## 15. API Request Flow

```
Client (React)
     │
     │  HTTP Request + Authorization: Bearer {token}
     ▼
NGINX (reverse proxy, SSL termination)
     │
     ▼
FastAPI (Uvicorn ASGI)
     │
     ├── CORS Middleware          → Reject non-whitelisted origins
     ├── Request Logger           → Log request metadata
     ├── Rate Limiter (Redis)     → Block if limit exceeded
     │
     ▼
API Router: /api/v1/{resource}
     │
     ▼
JWT Middleware
     │  Decode + verify RS256 signature
     │  Check token in Redis blacklist
     │  Extract: user_id, role, exp
     │
     ▼
Role Authorization Decorator
     │  @require_role(["student", "admin"])
     │
     ▼
Pydantic Request Validation
     │  400 Bad Request if invalid
     │
     ▼
Business Service (async)
     │  Core logic, business rules
     │
     ▼
Repository Layer
     │  Motor (async MongoDB driver)
     │
     ▼
MongoDB Atlas
     │
     ▼
Repository returns typed model
     │
     ▼
Service returns Pydantic schema
     │
     ▼
FastAPI serializes to JSON
     │
     ▼
HTTP Response (with correct status code)
```

---

## 16. AI Request Flow

```
User types message in React Chat
           │
           ▼
POST /api/v1/ai/chat (or WebSocket)
           │
           ▼
JWT Middleware (authenticate user)
           │
           ▼
AI Gateway Entry Point
           │
           ▼
Intent Detection
(classify: career/resume/coding/etc.)
           │
           ▼
Context Builder
(load: profile, skills, goals, history)
           │
           ▼
Memory Retrieval
(Redis: session / MongoDB: long-term)
           │
           ▼
RAG Retrieval
(Qdrant semantic search → top-k chunks)
           │
           ▼
Agent Router
(select: 1 or N agents based on intent)
           │
     ┌─────┼─────┐
     ▼     ▼     ▼
  Agent  Agent  Agent   ← Parallel execution
  (A)    (B)    (C)
     │     │     │
     └─────┼─────┘
           │
           ▼
Result Merger
(combine agent outputs coherently)
           │
           ▼
Final LLM Call
(format, personalize, stream)
           │
           ▼
Response streamed via WebSocket
(token-by-token to React frontend)
           │
           ▼
Store conversation (MongoDB)
Summarize session (Celery task)
           │
           ▼
Feedback UI shown to user
```

---

## 17. Notification Flow

```
Platform Event Triggered
(e.g., course completed, interview scheduled)
           │
           ▼
Notification Service: create_notification()
           │
           ▼
Save notification to MongoDB
(status: pending)
           │
           ▼
Push to Redis queue (Celery task)
           │
           ▼
Celery Worker picks up task
           │
     ┌─────┼──────┐
     ▼     ▼      ▼
  Email   In-App  Push
  Task    Task    Task
     │     │      │
     ▼     ▼      ▼
 SendGrid WebSocket Web Push API
  SMTP   / Polling  (browser)
     │     │      │
     └─────┼──────┘
           │
           ▼
Update MongoDB: notification.status = "sent"
           │
           ▼
User receives notification
```

---

## 18. Analytics Flow

```
User performs action
(login, view course, complete quiz, etc.)
           │
           ▼
Frontend fires analytics event
POST /api/v1/analytics/event
{
  event_type: "course_completed",
  metadata: { course_id, duration_seconds }
}
           │
           ▼
Analytics Service (async, non-blocking)
           │
           ▼
Write to MongoDB: analytics collection
           │
           ▼
Celery Beat: scheduled aggregation jobs
(hourly / daily rollups)
           │
           ▼
Aggregated metrics written to analytics_summary
           │
           ▼
Dashboard API: GET /api/v1/analytics/dashboard
           │
           ▼
Redis cache: dashboard:{user_id} (5 min TTL)
           │
           ▼
React Dashboard renders charts and KPIs
```

**Tracked Metrics:**

| Metric                | Granularity     |
|-----------------------|-----------------|
| Daily Active Users    | Per day         |
| Learning Hours        | Per user/day    |
| AI Usage by Agent     | Per agent/day   |
| Resume Score Trend    | Per upload      |
| Interview Performance | Per session     |
| Feedback Sentiment    | Per agent/day   |

---

## 19. Security Architecture

### 19.1 Security Layers

```
Layer 1 — Network
  ├── HTTPS everywhere (TLS 1.3)
  ├── NGINX rate limiting
  └── CORS allowlist

Layer 2 — Authentication
  ├── JWT RS256 (15 min access token)
  ├── HttpOnly refresh token cookie
  ├── OAuth2 (Google, GitHub, Microsoft)
  └── Token revocation via Redis blacklist

Layer 3 — Authorization
  ├── RBAC on all API routes
  ├── Role checked server-side on every request
  └── Privilege escalation logged as security event

Layer 4 — Input Security
  ├── Pydantic validation on all payloads
  ├── File type and size validation
  └── Content-type enforcement

Layer 5 — Data Security
  ├── Passwords: Argon2id hash
  ├── Secrets: environment variables only
  └── PII: encrypted fields where required

Layer 6 — Application Security
  ├── Rate limiting (per user + per IP)
  ├── Brute-force account lockout
  ├── Security headers (HSTS, X-Frame-Options)
  └── Dependency scanning (pip-audit, npm audit)

Layer 7 — Audit & Compliance
  ├── Append-only audit log (MongoDB)
  ├── All admin actions recorded
  └── Security event alerting
```

---

## 20. Deployment Architecture

### 20.1 Cloud Deployment Topology

```
                    Internet
                        │
                        ▼
              ┌─────────────────┐
              │  Cloud Load      │
              │  Balancer (ALB)  │
              └────────┬────────┘
                       │
              ┌────────▼────────┐
              │  NGINX Container │
              │  (SSL + Routing) │
              └────────┬────────┘
                       │
          ┌────────────┼────────────┐
          │                         │
  ┌───────▼───────┐     ┌───────────▼───────┐
  │ Frontend CDN  │     │ FastAPI Containers │
  │ (Static files)│     │ (N replicas)       │
  └───────────────┘     └───────────┬───────┘
                                     │
               ┌─────────────────────┼─────────────────────┐
               │                     │                     │
       ┌───────▼──────┐   ┌──────────▼──────┐   ┌─────────▼────────┐
       │ MongoDB Atlas │   │  Redis Cluster  │   │  Qdrant Cluster  │
       │ (Replica Set) │   │                 │   │                  │
       └───────────────┘   └─────────────────┘   └──────────────────┘
                                     │
               ┌─────────────────────┼─────────────────────┐
               │                                           │
       ┌───────▼──────┐                       ┌───────────▼────────┐
       │ Celery Workers│                       │  AI Provider APIs   │
       │ (Background)  │                       │  OpenAI/Gemini/etc  │
       └───────────────┘                       └────────────────────┘
                                     │
                           ┌─────────▼──────────┐
                           │  Monitoring Stack   │
                           │ Prometheus + Grafana│
                           └────────────────────┘
```

---

## 21. Logging & Monitoring

### 21.1 Logging Stack

| Component  | Tool           | Output                              |
|------------|----------------|-------------------------------------|
| API Logs   | structlog      | JSON → Loki via Promtail            |
| Celery Logs| structlog      | JSON → Loki via Promtail            |
| NGINX Logs | NGINX          | Access + error log → Loki           |
| MongoDB    | Atlas Auditing | Atlas built-in audit logs           |

### 21.2 Monitoring Dashboards (Grafana)

| Dashboard              | Panels                                           |
|------------------------|--------------------------------------------------|
| System Overview        | CPU, RAM, Disk, Network per container           |
| API Performance        | Request rate, error rate, p95 latency           |
| AI Subsystem           | AI response time, provider usage, token cost    |
| Database Health        | MongoDB connections, query latency, replica lag |
| Queue Status           | Celery queue depth, task success/failure rate   |
| User Analytics         | DAU, MAU, feature usage                        |

---

## 22. Folder Structure

### 22.1 Project Root

```
nexa-ai/
│
├── frontend/                    # React TypeScript app
│   ├── src/                     # (see Section 4.1)
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── backend/                     # FastAPI Python app
│   ├── app/                     # (see Section 5.1)
│   ├── tests/
│   │   ├── unit/
│   │   ├── integration/
│   │   └── conftest.py
│   ├── scripts/
│   │   ├── seed_data.py
│   │   └── create_indexes.py
│   ├── requirements/
│   │   ├── base.txt
│   │   ├── dev.txt
│   │   └── prod.txt
│   ├── Dockerfile
│   ├── .env.example
│   └── pyproject.toml
│
├── docker/                      # Per-service Dockerfiles
│   ├── frontend.Dockerfile
│   ├── backend.Dockerfile
│   └── celery.Dockerfile
│
├── nginx/                       # NGINX configuration
│   ├── nginx.conf
│   └── ssl/
│
├── monitoring/                  # Observability config
│   ├── prometheus/
│   │   └── prometheus.yml
│   ├── grafana/
│   │   └── dashboards/
│   └── loki/
│       └── loki-config.yaml
│
├── docs/                        # Project documentation
│   ├── phase-01-srs.md
│   ├── phase-02-frs.md
│   ├── phase-03-nfr.md
│   ├── phase-04-sad.md
│   └── runbooks/
│       └── disaster-recovery.md
│
├── backups/                     # Backup scripts
│   └── backup_mongo.sh
│
├── .github/                     # GitHub Actions CI/CD
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
├── docker-compose.yml           # Full local stack
├── docker-compose.prod.yml      # Production overrides
├── .env.example
├── .gitignore
└── README.md
```

---

## 23. Architectural Principles

| Principle                   | Description                                                        |
|-----------------------------|--------------------------------------------------------------------|
| **API-First Design**        | All features accessible via RESTful endpoints; frontend is a client|
| **Modular Architecture**    | Each service owns its logic and data access; no tight coupling     |
| **AI-First Orchestration**  | Specialized agents rather than monolithic chatbot                  |
| **Containerized Deployment**| Every service runs in Docker; reproducible across environments     |
| **Asynchronous Processing** | Long-running tasks (email, AI, reports) handled by Celery          |
| **Scalable Data Storage**   | MongoDB (documents), Redis (cache), Qdrant (vectors) each optimized|
| **Security by Design**      | Auth, RBAC, validation, audit logging built in from day one       |
| **Observability First**     | Every service emits logs, metrics, and health checks               |
| **Extensibility**           | New agents, providers, services added without core changes        |

---

## 24. Architecture Decision Records

### ADR-001: Modular Monolith First, Microservices Later

**Decision:** Start with a well-structured modular monolith.

**Reason:** Microservices add operational complexity (service discovery, distributed tracing, network latency) that slows early development. A modular monolith with clean service boundaries achieves the same code organization and can be extracted to microservices when traffic justifies it.

---

### ADR-002: LangGraph Over Raw LangChain for AI Orchestration

**Decision:** Use LangGraph StateGraph for all multi-agent workflows.

**Reason:** LangGraph provides stateful, cyclical graph execution — essential for multi-step agent workflows, retries, memory management, and conditional routing. Raw LangChain chains are linear and lack the control flow needed for NEXA AI's complexity.

---

### ADR-003: Qdrant Over ChromaDB / Pinecone

**Decision:** Use Qdrant as the vector database.

**Reason:** Qdrant is self-hostable (fits Docker architecture), production-grade, supports metadata filtering, and has an excellent Python SDK. ChromaDB lacks production features; Pinecone is cloud-only with cost concerns.

---

### ADR-004: Motor (Async MongoDB Driver) Over PyMongo

**Decision:** Use Motor for all MongoDB access.

**Reason:** FastAPI is async-first. Motor is the async driver for MongoDB, enabling non-blocking database operations that maximize throughput on async FastAPI endpoints.

---

> **Phase 4 Complete** — Full system architecture defined.
>
> **Next: Phase 5 — Technology Stack & Development Standards**
> Exact package versions, Python/Node dependencies, Git branching strategy, environment configuration, development workflow, and coding conventions.

---

*NEXA AI SAD — Phase 4 of 30 | Version 1.0 | July 2026*
