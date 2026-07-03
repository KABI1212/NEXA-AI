# NEXA AI — Database Models & Beanie Document Design (MBDD)
## Production Data Layer Blueprint

---

| Field              | Details                                                  |
|--------------------|----------------------------------------------------------|
| **Document**       | MongoDB Models & Beanie Document Design                  |
| **Version**        | 1.0                                                      |
| **ODM Framework**  | Beanie 0.10+ (Motor Driver)                             |
| **Validation**     | Pydantic v2 (Validation & Serialization)                 |
| **Pattern**        | Base Document Pattern with Auditing & Soft Delete        |
| **Status**         | ✅ Complete — Implementation Ready                      |

---

## 1. Domain-Driven Database Architecture

```
NEXA AI Data Layer

├── Identity Domain
│   ├── User
│   ├── UserProfile
│   └── UserSession
│
├── Career Domain
│   ├── CareerGoal
│   ├── UserSkill
│   ├── CareerMatch
│   └── CareerRoadmap
│
├── Resume Domain
│   ├── ResumeDocument
│   └── ATSReport
│
├── Learning Domain
│   ├── Course
│   ├── Lesson
│   ├── QuizQuestion
│   ├── Assignment
│   ├── AssignmentSubmission
│   ├── CodingSubmission
│   └── Certificate
│
├── AI Domain
│   ├── ChatSession
│   ├── ChatMessage
│   ├── UserMemoryItem
│   ├── SystemMetricSnapshot
│   ├── UserFeedback
│   └── AuditLog
│
└── System Domain
    └── SystemSettings
```

---

## 2. Base Document Schema & Enums

### 2.1 Shared Base Document Schema

All documents inherit from `NexaBaseDocument` to enforce unified audit fields, soft-delete capability, and optimistic concurrency version locking.

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

    async def update_timestamp(self) -> None:
        self.updated_at = datetime.utcnow()

    async def soft_delete(self, deleted_by: Optional[str] = None) -> None:
        self.is_deleted = True
        self.deleted_at = datetime.utcnow()
        self.updated_by = deleted_by
        await self.save()
```

### 2.2 System Enums

```python
# app/models/enums.py
from enum import Enum


class UserRole(str, Enum):
    STUDENT     = "student"
    MENTOR      = "mentor"
    ADMIN       = "admin"
    SUPER_ADMIN = "super_admin"


class UserStatus(str, Enum):
    ACTIVE    = "active"
    INACTIVE  = "inactive"
    SUSPENDED = "suspended"
    PENDING   = "pending"


class AuthProvider(str, Enum):
    EMAIL  = "email"
    GOOGLE = "google"
    GITHUB = "github"


class GoalStatus(str, Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED   = "completed"
    ABANDONED   = "abandoned"


class IngestionStatus(str, Enum):
    PENDING    = "pending"
    PROCESSING = "processing"
    COMPLETED  = "completed"
    FAILED     = "failed"


class KnowledgeDomain(str, Enum):
    CAREER        = "career"
    LEARNING      = "learning"
    RESUME        = "resume"
    INTERVIEW     = "interview"
    COMPANY       = "company"
    CERTIFICATION = "certification"


class LessonType(str, Enum):
    TEXT   = "text"
    VIDEO  = "video"
    QUIZ   = "quiz"
    CODING = "coding"
```

---

## 3. Beanie Document Definitions

### 3.1 Identity Domain

#### 3.1.1 User Document
*   **Collection Name:** `users`
*   **Beanie Model Schema:**
    ```python
    from beanie import Indexed
    from pydantic import EmailStr

    class User(NexaBaseDocument):
        email:                 Indexed(EmailStr, unique=True)
        password_hash:         Optional[str] = None
        role:                  UserRole = UserRole.STUDENT
        status:                UserStatus = UserStatus.PENDING
        provider:              AuthProvider = AuthProvider.EMAIL
        provider_id:           Optional[str] = None
        is_verified:           bool = False
        failed_login_attempts: int = 0
        locked_until:          Optional[datetime] = None
        last_login:            Optional[datetime] = None

        class Settings:
            name = "users"
            indexes = ["email", "role", "status", "is_deleted"]
    ```

#### 3.1.2 UserProfile Document
*   **Collection Name:** `profiles`
*   **Beanie Model Schema:**
    ```python
    class UserProfile(NexaBaseDocument):
        user_id:         Indexed(str, unique=True)
        first_name:      str
        last_name:       str
        phone:           Optional[str] = None
        college:         str
        department:      str
        cgpa:            float = Field(ge=0.0, le=10.0)
        graduation_year: int
        bio:             Optional[str] = None
        github:          Optional[str] = None
        linkedin:        Optional[str] = None
        portfolio:       Optional[str] = None

        class Settings:
            name = "profiles"
            indexes = ["user_id"]
    ```

#### 3.1.3 UserSession Document
*   **Collection Name:** `sessions`
*   **Beanie Model Schema:**
    ```python
    class UserSession(NexaBaseDocument):
        user_id:            Indexed(str)
        jti:                Indexed(str, unique=True)
        refresh_token_hash: str
        access_token_jti:   str
        device_name:        Optional[str] = None
        ip_address:         Optional[str] = None
        is_active:          bool = True
        expires_at:         datetime

        class Settings:
            name = "sessions"
            indexes = ["user_id", "jti", "is_active", [("expires_at", 1)]]
    ```

### 3.2 Career Domain

#### 3.2.1 CareerGoal Document
*   **Collection Name:** `career_goals`
*   **Beanie Model Schema:**
    ```python
    class CareerGoal(NexaBaseDocument):
        user_id:        Indexed(str)
        primary_goal:   Indexed(str)
        secondary_goals: list[str] = []
        target_company: Optional[str] = None
        status:         GoalStatus = GoalStatus.IN_PROGRESS

        class Settings:
            name = "career_goals"
            indexes = ["user_id", "status"]
    ```

#### 3.2.2 UserSkill Document
*   **Collection Name:** `skills`
*   **Beanie Model Schema:**
    ```python
    class UserSkill(NexaBaseDocument):
        user_id:           Indexed(str)
        name:              Indexed(str)
        category:          str
        level:             str
        experience_months: int = Field(default=0, ge=0)
        is_verified:       bool = False

        class Settings:
            name = "skills"
            indexes = ["user_id", [("user_id", 1), ("name", 1)]]
    ```

---

## 4. Generic Repository & Service Interfaces

```python
# app/repositories/base.py
from typing import TypeVar, Generic, Type, Optional, list
from beanie import PydanticObjectId
from app.models.base import NexaBaseDocument

DocType = TypeVar("DocType", bound=NexaBaseDocument)


class IBaseRepository(Generic[DocType]):
    async def get_by_id(self, doc_id: str) -> Optional[DocType]:
        pass

    async def list_active(self, skip: int = 0, limit: int = 20) -> list[DocType]:
        pass

    async def create(self, document: DocType) -> DocType:
        pass

    async def update(self, doc_id: str, updates: dict) -> Optional[DocType]:
        pass

    async def delete(self, doc_id: str) -> bool:
        pass
```

```python
# app/services/base.py
from typing import TypeVar, Generic, Type, Optional, list
from app.repositories.base import IBaseRepository

DocType = TypeVar("DocType")


class IBaseService(Generic[DocType]):
    def __init__(self, repository: IBaseRepository[DocType]):
        self.repository = repository

    async def retrieve_item(self, doc_id: str) -> Optional[DocType]:
        return await self.repository.get_by_id(doc_id)

    async def remove_item(self, doc_id: str) -> bool:
        return await self.repository.delete(doc_id)
```

---

## 5. Performance SLA Benchmarks

To ensure fast query times, database operations are designed to match strict latency targets:

| Operation | DB Target | SLA Metric |
| :--- | :--- | :--- |
| **Indexed Read** | Query by indexed field | Target: ≤ 25 ms |
| **Document Insert** | Single document write | Target: ≤ 50 ms |
| **Optimistic Lock Check** | Version check overhead | Target: ≤ 5 ms |
| **Soft Delete Update** | Flag update | Target: ≤ 30 ms |
| **ACID Transaction** | Multi-document commit | Target: ≤ 180 ms |

---

*NEXA AI Database Models | Version 1.0 | July 2026*
