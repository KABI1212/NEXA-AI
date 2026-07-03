# NEXA AI — MongoDB Models & Beanie Document Design (MBDD)
## Phase 22 — Implementation Blueprint

---

| Field              | Details                                                  |
|--------------------|----------------------------------------------------------|
| **Document**       | MongoDB Models & Beanie Document Design                  |
| **Phase**          | 22 of 30                                                 |
| **Version**        | 1.0                                                      |
| **ODM Framework**  | Beanie 0.10+ (Motor Driver)                             |
| **Validation**     | Pydantic v2 (Validation and Serialization)              |
| **Pattern**        | Base Document Pattern with Auditing & Soft Delete        |
| **Status**         | ✅ Complete — Implementation Ready                      |

---

## Table of Contents

1. [Domain-Driven Data Layer Folder Structure](#1-domain-driven-data-layer-folder-structure)
2. [Shared Base Document Schema](#2-shared-base-document-schema)
3. [Identity Domain Models](#3-identity-domain-models)
4. [Career Domain Models](#4-career-domain-models)
5. [Learning Domain Models](#5-learning-domain-models)
6. [AI & Memory Domain Models](#6-ai--memory-domain-models)
7. [Base Repository & Service Pattern](#7-base-repository--service-pattern)
8. [MongoDB Indexing Strategy Table](#8-mongodb-indexing-strategy-table)
9. [Schema Migration, Soft Delete & Validation Rules](#9-schema-migration-soft-delete--validation-rules)
10. [Performance SLA Benchmarks](#10-performance-sla-benchmarks)

---

## 1. Domain-Driven Data Layer Folder Structure

The data persistence layer is structured around distinct business domains to group models, schemas, and database operations.

```
backend/app/
├── models/                   # Beanie Document Definitions
│   ├── __init__.py
│   ├── base.py               # Shared Base Document class
│   ├── identity/             # User, Profile, active session docs
│   ├── career/               # Goals, Roadmaps, Recommendations
│   ├── learning/             # Course, Lesson, Quiz, Assignment
│   └── ai/                   # ChatSession, MemoryItem, Analytics
├── repositories/             # Database Query Repositories
│   ├── base.py               # Generic CRUD Repository base
│   ├── identity/
│   ├── career/
│   └── learning/
└── services/                 # Business Logic Services
    ├── identity/
    ├── career/
    └── learning/
```

---

## 2. Shared Base Document Schema

All Beanie document models inherit from a common base class. This base class implements optimistic version locking, metadata tracking, and soft-delete capabilities.

```python
# app/models/base.py
from datetime import datetime
from typing import Optional
from beanie import Document
from pydantic import Field


class NexaBaseDocument(Document):
    # ── Timestamps ────────────────────────────────────
    created_at:     datetime = Field(default_factory=datetime.utcnow)
    updated_at:     datetime = Field(default_factory=datetime.utcnow)
    
    # ── Audit Trails ──────────────────────────────────
    created_by:     Optional[str] = None
    updated_by:     Optional[str] = None
    
    # ── Soft Delete Fields ────────────────────────────
    is_deleted:     bool = False
    deleted_at:     Optional[datetime] = None
    
    # ── Optimistic Locking ────────────────────────────
    revision_id:    Optional[str] = Field(default=None, alias="_rev")

    async def update_timestamp(self) -> None:
        """Call this hook before saving to update the updated_at timestamp."""
        self.updated_at = datetime.utcnow()

    async def soft_delete(self, deleted_by: Optional[str] = None) -> None:
        """Flags the document as deleted without removing it from the database."""
        self.is_deleted = True
        self.deleted_at = datetime.utcnow()
        self.updated_by = deleted_by
        await self.save()
```

---

## 3. Identity Domain Models

### 3.1 User Model

```python
# app/models/identity/user.py
from beanie import Indexed
from pydantic import EmailStr
from app.models.base import NexaBaseDocument
from app.models.user import UserRole, UserStatus, AuthProvider, User


class NexaUserDocument(NexaBaseDocument, User):
    """Beanie model mapped to the user credentials collection."""

    class Settings:
        name = "users"
        indexes = [
            "email",
            "role",
            "status",
            "is_deleted"
        ]
```

### 3.2 Profile Model

```python
# app/models/identity/profile.py
from beanie import Indexed
from pydantic import Field
from typing import Optional
from app.models.base import NexaBaseDocument


class NexaUserProfileDocument(NexaBaseDocument):
    user_id:            Indexed(str, unique=True)
    first_name:         str
    last_name:          str
    phone:              Optional[str] = None
    college:            str
    department:         str
    cgpa:               float = Field(ge=0.0, le=10.0)
    graduation_year:    int
    bio:                Optional[str] = None
    
    # ── Social URLs ───────────────────────────────────
    github:             Optional[str] = None
    linkedin:           Optional[str] = None
    portfolio:          Optional[str] = None

    class Settings:
        name = "profiles"
        indexes = [
            "user_id",
            "graduation_year"
        ]
```

---

## 4. Career Domain Models

### 4.1 Career Goal Model

```python
# app/models/career/career_goal.py
from beanie import Indexed
from typing import Optional
from app.models.base import NexaBaseDocument
from app.models.career.career_models import GoalStatus


class NexaCareerGoalDocument(NexaBaseDocument):
    user_id:        Indexed(str)
    target_role:    str
    target_company: Optional[str] = None
    priority:       str = "high"                        # "high", "medium", "low"
    status:         GoalStatus = GoalStatus.IN_PROGRESS

    class Settings:
        name = "career_goals"
        indexes = [
            "user_id",
            "status"
        ]
```

### 4.2 Skills Model

```python
# app/models/career/skill.py
from beanie import Indexed
from datetime import datetime
from pydantic import Field
from app.models.base import NexaBaseDocument


class NexaUserSkillDocument(NexaBaseDocument):
    user_id:           Indexed(str)
    name:              Indexed(str)
    category:          str                              # e.g., "Languages", "Frameworks"
    level:             str                              # "beginner", "intermediate", "advanced"
    experience_months: int = Field(default=0, ge=0)
    is_verified:       bool = False
    last_updated:      datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "skills"
        indexes = [
            "user_id",
            [("user_id", 1), ("name", 1)]
        ]
```

---

## 5. Learning Domain Models

### 5.1 Course Model

```python
# app/models/learning/course.py
from beanie import Indexed
from typing import Optional, Any
from app.models.base import NexaBaseDocument


class NexaCourseDocument(NexaBaseDocument):
    title:       str
    slug:        Indexed(str, unique=True)
    category:    Indexed(str)
    difficulty:  str                                    # "beginner", "intermediate", "advanced"
    duration:    int                                    # duration in minutes
    thumbnail:   Optional[str] = None
    mentor_id:   Optional[str] = None
    is_published: bool = False

    class Settings:
        name = "courses"
        indexes = [
            "category",
            "slug"
        ]
```

---

## 6. AI & Memory Domain Models

### 6.1 Memory Model

```python
# app/models/ai/memory.py
from beanie import Indexed
from datetime import datetime
from pydantic import Field
from app.models.base import NexaBaseDocument


class NexaMemoryItemDocument(NexaBaseDocument):
    user_id:      Indexed(str)
    fact_text:    str
    category:     str                                   # e.g. "preference", "background"
    confidence:   float = Field(default=1.0, ge=0.0, le=1.0)
    last_updated: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "user_memories"
        indexes = [
            "user_id",
            "category"
        ]
```

---

## 7. Base Repository & Service Pattern

The repository pattern abstracts database operations from the service layer, keeping DB query logic isolated.

```python
# app/repositories/base.py
from typing import TypeVar, Generic, Type, Optional, list
from beanie import PydanticObjectId
from app.models.base import NexaBaseDocument

DocType = TypeVar("DocType", bound=NexaBaseDocument)


class NexaBaseRepository(Generic[DocType]):
    def __init__(self, model_class: Type[DocType]):
        self.model = model_class

    async def get_by_id(self, doc_id: str) -> Optional[DocType]:
        """Fetch a single active document by ID."""
        return await self.model.find_one(
            self.model.id == PydanticObjectId(doc_id),
            self.model.is_deleted == False
        )

    async def list_active(self, skip: int = 0, limit: int = 20) -> list[DocType]:
        """List active documents with pagination."""
        return await self.model.find(
            self.model.is_deleted == False
        ).skip(skip).limit(limit).to_list()

    async def save(self, document: DocType) -> DocType:
        """Inserts or updates a document and updates its timestamps."""
        await document.update_timestamp()
        await document.save()
        return document
```

---

## 8. MongoDB Indexing Strategy Table

| Collection | Target Fields Index | Index Properties |
| :--- | :--- | :--- |
| **users** | `email` | Unique index, filters duplicates |
| **profiles** | `user_id` | Unique index, speeds up profile loads |
| **skills** | `user_id`, `category` | Compound index, filters skills by category |
| **courses** | `slug` | Unique index, supports dynamic URLs |
| **user_memories** | `user_id`, `category` | Compound index, retrieves profile facts |
| **chat_sessions** | `user_id`, `updated_at` | Compound index, orders chat lists |

---

## 9. Schema Migration, Soft Delete & Validation Rules

*   **Soft Deletes:** Documents are never permanently deleted from MongoDB during typical operations. Instead, the `is_deleted` flag is set to True, and endpoints filter query returns accordingly.
*   **Transactions:** Operations affecting multiple documents (like user registration or issuing certificates) run inside ACID transactions using MongoDB sessions:
    ```python
    async with await client.start_session() as session:
        async with session.start_transaction():
            # write mutations...
    ```
*   **Migrations:** Schema modifications include a `version_tag` metadata property in the document to allow incremental validation updates.

---

## 10. Performance SLA Benchmarks

To ensure fast database query times, operations are designed to match strict latency targets:

| DB Operation | SLA Target Limit | Performance Target |
| :--- | :--- | :--- |
| **Indexed Read (ID)** | Fetching a document by ID | Target: ≤ 25 ms |
| **Indexed Query (List)**| Querying with filters | Target: ≤ 45 ms |
| **Transactional Write** | Writing multiple updates | Target: ≤ 180 ms |
| **Aggregation Pipelines**| Complex metrics grouping | Target: ≤ 320 ms |
| **Database Save (Save)** | Direct insert or update | Target: ≤ 80 ms |

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

---

> **Phase 22 Complete** — Beanie ODM documents, repository abstractions, and indexes defined.
>
> **Next: Phase 23 — FastAPI Backend Implementation Blueprint**
> Config settings, middleware pipelines, error handlers, websocket mounts, and life-cycle tasks.

---

*NEXA AI Phase 22 — Beanie Models | Version 1.0 | July 2026*
