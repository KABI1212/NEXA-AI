# NEXA AI — Database Design & MongoDB Architecture (DDA)
## Enterprise AI-Based Career Guidance and Learning Platform

---

| Field             | Details                                        |
|-------------------|------------------------------------------------|
| **Document**      | Database Design & Architecture (DDA)          |
| **Phase**         | 6 of 30                                        |
| **Version**       | 1.0                                            |
| **Project**       | NEXA AI                                        |
| **Database**      | MongoDB Atlas                                  |
| **ODM**           | Beanie (async MongoDB ODM)                     |
| **Driver**        | Motor 3.x (async)                              |
| **Architecture**  | Document-Oriented Database                     |
| **Date**          | July 2026                                      |
| **Status**        | ✅ Complete                                    |

---

## Table of Contents

1. [Database Overview](#1-database-overview)
2. [Database Architecture](#2-database-architecture)
3. [Naming Conventions](#3-naming-conventions)
4. [Collection: users](#4-collection-users)
5. [Collection: profiles](#5-collection-profiles)
6. [Collection: skills](#6-collection-skills)
7. [Collection: resumes](#7-collection-resumes)
8. [Collection: resume\_scores](#8-collection-resume_scores)
9. [Collection: chat\_sessions](#9-collection-chat_sessions)
10. [Collection: chat\_messages](#10-collection-chat_messages)
11. [Collection: ai\_memory](#11-collection-ai_memory)
12. [Collection: recommendations](#12-collection-recommendations)
13. [Collection: roadmaps](#13-collection-roadmaps)
14. [Collection: learning\_progress](#14-collection-learning_progress)
15. [Collection: courses](#15-collection-courses)
16. [Collection: lessons](#16-collection-lessons)
17. [Collection: quizzes](#17-collection-quizzes)
18. [Collection: coding\_submissions](#18-collection-coding_submissions)
19. [Collection: interview\_sessions](#19-collection-interview_sessions)
20. [Collection: feedback](#20-collection-feedback)
21. [Collection: notifications](#21-collection-notifications)
22. [Collection: certificates](#22-collection-certificates)
23. [Collection: jobs](#23-collection-jobs)
24. [Collection: internships](#24-collection-internships)
25. [Collection: projects](#25-collection-projects)
26. [Collection: companies](#26-collection-companies)
27. [Collection: mentor\_sessions](#27-collection-mentor_sessions)
28. [Collection: analytics](#28-collection-analytics)
29. [Collection: audit\_logs](#29-collection-audit_logs)
30. [Collection: activity\_logs](#30-collection-activity_logs)
31. [Collection: search\_history](#31-collection-search_history)
32. [Collection: rag\_documents](#32-collection-rag_documents)
33. [Collection: settings](#33-collection-settings)
34. [Document Relationships](#34-document-relationships)
35. [Indexing Strategy](#35-indexing-strategy)
36. [Data Validation Rules](#36-data-validation-rules)
37. [AI Data Flow](#37-ai-data-flow)
38. [Backup Strategy](#38-backup-strategy)
39. [Database Security](#39-database-security)
40. [Beanie Model Organization](#40-beanie-model-organization)
41. [Database Initialization](#41-database-initialization)
42. [Database Design Principles](#42-database-design-principles)

---

## 1. Database Overview

NEXA AI stores multiple categories of data in MongoDB Atlas. Each category maps to a distinct group of collections, separating concerns while enabling rich cross-collection queries through references.

```
Authentication Data        → users, audit_logs
│
User Data                  → profiles, skills, activity_logs, search_history
│
AI Conversation Data       → chat_sessions, chat_messages, ai_memory
│
Career & Guidance Data     → roadmaps, recommendations
│
Learning Data              → courses, lessons, quizzes, learning_progress, certificates
│
Resume Data                → resumes, resume_scores
│
Practice Data              → coding_submissions, interview_sessions
│
Opportunity Data           → jobs, internships, projects, companies
│
Mentor Data                → mentor_sessions
│
Analytics & Feedback       → analytics, feedback, notifications
│
AI Knowledge Data          → rag_documents
│
System Data                → settings
```

---

## 2. Database Architecture

```
MongoDB Atlas Cluster: nexa-ai-cluster
│
└── Database: nexa_ai
    │
    ├── Authentication Collections
    │   ├── users
    │   └── audit_logs
    │
    ├── User Collections
    │   ├── profiles
    │   ├── skills
    │   ├── activity_logs
    │   └── search_history
    │
    ├── AI Collections
    │   ├── chat_sessions
    │   ├── chat_messages
    │   └── ai_memory
    │
    ├── Guidance Collections
    │   ├── roadmaps
    │   └── recommendations
    │
    ├── Learning Collections
    │   ├── courses
    │   ├── lessons
    │   ├── quizzes
    │   ├── learning_progress
    │   └── certificates
    │
    ├── Resume Collections
    │   ├── resumes
    │   └── resume_scores
    │
    ├── Practice Collections
    │   ├── coding_submissions
    │   └── interview_sessions
    │
    ├── Opportunity Collections
    │   ├── jobs
    │   ├── internships
    │   ├── projects
    │   └── companies
    │
    ├── Mentor Collections
    │   └── mentor_sessions
    │
    ├── Analytics Collections
    │   ├── analytics
    │   └── feedback
    │
    ├── Notification Collections
    │   └── notifications
    │
    ├── Knowledge Collections
    │   └── rag_documents
    │
    └── System Collections
        └── settings
```

---

## 3. Naming Conventions

### 3.1 Database Name

```
nexa_ai
```

### 3.2 Collection Registry (32 Collections)

| Group         | Collections                                                          |
|---------------|----------------------------------------------------------------------|
| Auth          | `users`, `audit_logs`                                               |
| Users         | `profiles`, `skills`, `activity_logs`, `search_history`            |
| AI            | `chat_sessions`, `chat_messages`, `ai_memory`                       |
| Guidance      | `roadmaps`, `recommendations`                                        |
| Learning      | `courses`, `lessons`, `quizzes`, `learning_progress`, `certificates`|
| Resume        | `resumes`, `resume_scores`                                           |
| Practice      | `coding_submissions`, `interview_sessions`                          |
| Opportunities | `jobs`, `internships`, `projects`, `companies`                      |
| Mentor        | `mentor_sessions`                                                    |
| Analytics     | `analytics`, `feedback`, `notifications`                            |
| Knowledge     | `rag_documents`                                                      |
| System        | `settings`                                                           |

### 3.3 Naming Rules

| Rule                  | Example                               |
|-----------------------|---------------------------------------|
| Lowercase             | `users` ✅ / `Users` ❌              |
| Plural nouns          | `courses` ✅ / `course` ❌           |
| Underscores           | `chat_sessions` ✅ / `chatSessions` ❌|
| No abbreviations      | `certificates` ✅ / `certs` ❌       |
| Field names           | `snake_case` only                     |
| References            | `{entity}_id` (e.g., `user_id`)      |
| Timestamps            | `created_at`, `updated_at` (UTC)     |
| Boolean flags         | `is_` prefix (`is_active`, `is_read`)|

---

## 4. Collection: `users`

**Purpose:** Stores authentication credentials, role, and account status.

### Sample Document

```json
{
  "_id": "ObjectId('686614c0...')",
  "email": "john.smith@example.com",
  "password_hash": "$argon2id$v=19$m=65536...",
  "provider": "email",
  "provider_id": null,
  "role": "student",
  "is_verified": true,
  "is_active": true,
  "failed_login_attempts": 0,
  "locked_until": null,
  "last_login": "2026-07-03T09:00:00Z",
  "created_at": "2026-06-01T08:00:00Z",
  "updated_at": "2026-07-03T09:00:00Z"
}
```

### Beanie Model

```python
from beanie import Document, Indexed
from pydantic import EmailStr, Field
from datetime import datetime
from typing import Optional
from enum import Enum


class UserRole(str, Enum):
    STUDENT = "student"
    MENTOR = "mentor"
    ADMIN = "admin"
    SUPER_ADMIN = "super_admin"


class AuthProvider(str, Enum):
    EMAIL = "email"
    GOOGLE = "google"
    GITHUB = "github"
    MICROSOFT = "microsoft"


class User(Document):
    email: Indexed(EmailStr, unique=True)
    password_hash: Optional[str] = None
    provider: AuthProvider = AuthProvider.EMAIL
    provider_id: Optional[str] = None
    role: UserRole = UserRole.STUDENT
    is_verified: bool = False
    is_active: bool = True
    failed_login_attempts: int = Field(default=0, ge=0)
    locked_until: Optional[datetime] = None
    last_login: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users"
        indexes = [
            "email",
            "role",
            "created_at",
        ]
```

### Indexes

| Field      | Type   | Reason                           |
|------------|--------|----------------------------------|
| `email`    | Unique | Fast lookup on login; prevent dupes |
| `role`     | Single | Admin dashboards filter by role |
| `created_at` | Single | Sort users by registration date |

---

## 5. Collection: `profiles`

**Purpose:** Stores extended user profile — personal, academic, and career info.

### Sample Document

```json
{
  "_id": "ObjectId('...')",
  "user_id": "ObjectId('686614c0...')",
  "first_name": "John",
  "last_name": "Smith",
  "gender": "male",
  "dob": "2002-04-15",
  "phone": "+91-9876543210",
  "country": "India",
  "state": "Tamil Nadu",
  "city": "Chennai",
  "college": "SRM Institute of Science and Technology",
  "university": "SRM University",
  "degree": "B.Tech",
  "department": "Computer Science",
  "semester": 6,
  "cgpa": 8.7,
  "graduation_year": 2026,
  "bio": "Aspiring AI Engineer passionate about NLP and LLMs.",
  "profile_image": "https://storage.example.com/profiles/john.jpg",
  "linkedin": "https://linkedin.com/in/johnsmith",
  "github": "https://github.com/johnsmith",
  "portfolio": "https://johnsmith.dev",
  "career_goal": "AI Engineer",
  "preferred_language": "Python",
  "learning_style": "visual",
  "profile_completion": 82,
  "created_at": "2026-06-01T08:00:00Z",
  "updated_at": "2026-07-03T09:00:00Z"
}
```

### Beanie Model

```python
from beanie import Document, PydanticObjectId
from pydantic import Field, HttpUrl
from datetime import date, datetime
from typing import Optional
from enum import Enum


class Degree(str, Enum):
    BTECH = "B.Tech"
    MTECH = "M.Tech"
    BCA = "BCA"
    MCA = "MCA"
    BSC = "B.Sc"
    MSC = "M.Sc"
    MBA = "MBA"
    PHD = "Ph.D"
    OTHER = "Other"


class LearningStyle(str, Enum):
    VISUAL = "visual"
    READING = "reading"
    HANDS_ON = "hands_on"
    VIDEO = "video"


class Profile(Document):
    user_id: PydanticObjectId
    first_name: str = Field(..., min_length=2, max_length=50)
    last_name: str = Field(..., min_length=2, max_length=50)
    gender: Optional[str] = None
    dob: Optional[date] = None
    phone: Optional[str] = None
    country: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    college: Optional[str] = None
    university: Optional[str] = None
    degree: Optional[Degree] = None
    department: Optional[str] = None
    semester: Optional[int] = Field(None, ge=1, le=12)
    cgpa: Optional[float] = Field(None, ge=0.0, le=10.0)
    graduation_year: Optional[int] = Field(None, ge=2000, le=2040)
    bio: Optional[str] = Field(None, max_length=500)
    profile_image: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    portfolio: Optional[str] = None
    career_goal: Optional[str] = None
    preferred_language: Optional[str] = None
    learning_style: Optional[LearningStyle] = None
    profile_completion: int = Field(default=0, ge=0, le=100)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "profiles"
        indexes = ["user_id"]
```

---

## 6. Collection: `skills`

**Purpose:** Stores user skills with proficiency levels. One document per user-skill pair.

### Sample Document

```json
{
  "_id": "ObjectId('...')",
  "user_id": "ObjectId('...')",
  "skill_name": "Python",
  "category": "programming_language",
  "level": "intermediate",
  "experience_months": 18,
  "is_verified": false,
  "endorsed_by": [],
  "created_at": "2026-06-01T08:00:00Z",
  "updated_at": "2026-06-20T08:00:00Z"
}
```

### Beanie Model

```python
class SkillLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"


class SkillCategory(str, Enum):
    PROGRAMMING_LANGUAGE = "programming_language"
    FRAMEWORK = "framework"
    DATABASE = "database"
    CLOUD = "cloud"
    AI_ML = "ai_ml"
    DEVOPS = "devops"
    SOFT_SKILL = "soft_skill"
    OTHER = "other"


class Skill(Document):
    user_id: PydanticObjectId
    skill_name: str = Field(..., min_length=1, max_length=100)
    category: SkillCategory = SkillCategory.OTHER
    level: SkillLevel = SkillLevel.BEGINNER
    experience_months: int = Field(default=0, ge=0)
    is_verified: bool = False
    endorsed_by: list[PydanticObjectId] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "skills"
        indexes = [
            "user_id",
            [("user_id", 1), ("skill_name", 1)],  # Compound: prevent duplicates
        ]
```

---

## 7. Collection: `resumes`

**Purpose:** Stores uploaded resume files and their parsed metadata.

### Sample Document

```json
{
  "_id": "ObjectId('...')",
  "user_id": "ObjectId('...')",
  "file_name": "john_smith_resume_v3.pdf",
  "file_url": "https://storage.example.com/resumes/john_v3.pdf",
  "file_size_bytes": 204800,
  "file_type": "pdf",
  "version": 3,
  "is_primary": true,
  "status": "analyzed",
  "is_parsed": true,
  "parsed_data": {
    "skills": ["Python", "FastAPI", "MongoDB"],
    "education": [{"degree": "B.Tech", "institution": "SRM", "year": 2026}],
    "experience": [],
    "projects": [{"name": "NEXA AI", "tech": ["FastAPI", "React"]}],
    "certificates": [],
    "achievements": ["Winner - National Hackathon 2025"]
  },
  "embedding_id": "qdrant-vector-uuid-...",
  "upload_date": "2026-07-03T09:00:00Z",
  "created_at": "2026-07-03T09:00:00Z",
  "updated_at": "2026-07-03T09:05:00Z"
}
```

### Beanie Model

```python
class ResumeStatus(str, Enum):
    UPLOADED = "uploaded"
    PARSING = "parsing"
    ANALYZED = "analyzed"
    FAILED = "failed"


class ParsedEducation(BaseModel):
    degree: Optional[str] = None
    institution: Optional[str] = None
    year: Optional[int] = None
    cgpa: Optional[float] = None


class ParsedExperience(BaseModel):
    company: str
    role: str
    duration_months: Optional[int] = None
    description: Optional[str] = None


class ParsedData(BaseModel):
    skills: list[str] = Field(default_factory=list)
    education: list[ParsedEducation] = Field(default_factory=list)
    experience: list[ParsedExperience] = Field(default_factory=list)
    projects: list[dict] = Field(default_factory=list)
    certificates: list[str] = Field(default_factory=list)
    achievements: list[str] = Field(default_factory=list)


class Resume(Document):
    user_id: PydanticObjectId
    file_name: str
    file_url: str
    file_size_bytes: int = Field(..., gt=0)
    file_type: str = Field(..., pattern="^(pdf|docx)$")
    version: int = Field(default=1, ge=1)
    is_primary: bool = False
    status: ResumeStatus = ResumeStatus.UPLOADED
    is_parsed: bool = False
    parsed_data: Optional[ParsedData] = None
    embedding_id: Optional[str] = None
    upload_date: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "resumes"
        indexes = [
            "user_id",
            [("user_id", 1), ("version", -1)],
            [("user_id", 1), ("is_primary", 1)],
        ]
```

---

## 8. Collection: `resume_scores`

**Purpose:** Stores ATS analysis results for each resume.

### Sample Document

```json
{
  "_id": "ObjectId('...')",
  "resume_id": "ObjectId('...')",
  "user_id": "ObjectId('...')",
  "ats_score": 72,
  "grammar_score": 88,
  "keyword_score": 65,
  "design_score": 80,
  "overall_score": 76,
  "missing_keywords": ["FastAPI", "Docker", "CI/CD", "REST API"],
  "weak_sections": ["Professional Summary", "Achievements"],
  "formatting_issues": ["Inconsistent bullet points", "Missing section headers"],
  "grammar_issues": ["Run-on sentence in Experience section"],
  "suggestions": [
    "Add a concise professional summary at the top",
    "Include Docker and CI/CD in skills section",
    "Quantify achievements with metrics"
  ],
  "target_role": "Backend Developer",
  "created_at": "2026-07-03T09:05:00Z"
}
```

### Beanie Model

```python
class ResumeScore(Document):
    resume_id: PydanticObjectId
    user_id: PydanticObjectId
    ats_score: int = Field(..., ge=0, le=100)
    grammar_score: int = Field(..., ge=0, le=100)
    keyword_score: int = Field(..., ge=0, le=100)
    design_score: int = Field(..., ge=0, le=100)
    overall_score: int = Field(..., ge=0, le=100)
    missing_keywords: list[str] = Field(default_factory=list)
    weak_sections: list[str] = Field(default_factory=list)
    formatting_issues: list[str] = Field(default_factory=list)
    grammar_issues: list[str] = Field(default_factory=list)
    suggestions: list[str] = Field(default_factory=list)
    target_role: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "resume_scores"
        indexes = [
            "resume_id",
            "user_id",
            [("user_id", 1), ("created_at", -1)],
        ]
```

---

## 9. Collection: `chat_sessions`

**Purpose:** Represents a single conversation session between a user and the AI system.

### Sample Document

```json
{
  "_id": "ObjectId('...')",
  "user_id": "ObjectId('...')",
  "title": "Career path in AI Engineering",
  "model": "gpt-4o",
  "provider": "openai",
  "message_count": 14,
  "total_tokens": 3847,
  "is_archived": false,
  "primary_agent": "career_agent",
  "agents_used": ["career_agent", "skill_gap_agent"],
  "created_at": "2026-07-03T08:00:00Z",
  "updated_at": "2026-07-03T09:00:00Z"
}
```

### Beanie Model

```python
class ChatSession(Document):
    user_id: PydanticObjectId
    title: Optional[str] = Field(None, max_length=200)
    model: str = Field(default="gpt-4o")
    provider: str = Field(default="openai")
    message_count: int = Field(default=0, ge=0)
    total_tokens: int = Field(default=0, ge=0)
    is_archived: bool = False
    primary_agent: Optional[str] = None
    agents_used: list[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "chat_sessions"
        indexes = [
            "user_id",
            [("user_id", 1), ("updated_at", -1)],
            [("user_id", 1), ("is_archived", 1)],
        ]
```

---

## 10. Collection: `chat_messages`

**Purpose:** Stores each individual message within a chat session.

### Sample Document

```json
{
  "_id": "ObjectId('...')",
  "session_id": "ObjectId('...')",
  "user_id": "ObjectId('...')",
  "role": "assistant",
  "content": "Based on your Python and ML skills, I recommend pursuing an ML Engineer role...",
  "agent": "career_agent",
  "attachments": [],
  "tokens_used": 312,
  "latency_ms": 1840,
  "model": "gpt-4o",
  "provider": "openai",
  "feedback": {
    "rating": "helpful",
    "submitted_at": "2026-07-03T08:05:00Z"
  },
  "timestamp": "2026-07-03T08:04:00Z"
}
```

### Beanie Model

```python
class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class MessageFeedback(BaseModel):
    rating: Optional[str] = None  # "helpful" | "not_helpful"
    submitted_at: Optional[datetime] = None


class ChatMessage(Document):
    session_id: PydanticObjectId
    user_id: PydanticObjectId
    role: MessageRole
    content: str = Field(..., min_length=1)
    agent: Optional[str] = None
    attachments: list[str] = Field(default_factory=list)
    tokens_used: int = Field(default=0, ge=0)
    latency_ms: int = Field(default=0, ge=0)
    model: Optional[str] = None
    provider: Optional[str] = None
    feedback: Optional[MessageFeedback] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "chat_messages"
        indexes = [
            [("session_id", 1), ("timestamp", 1)],
            "user_id",
        ]
```

---

## 11. Collection: `ai_memory`

**Purpose:** Stores long-term AI memory for personalization. One document per user, continuously updated.

### Sample Document

```json
{
  "_id": "ObjectId('...')",
  "user_id": "ObjectId('...')",
  "career_goal": "AI Engineer",
  "current_skills": ["Python", "Machine Learning", "FastAPI"],
  "interests": ["AI", "NLP", "Cloud"],
  "preferred_learning_style": "video",
  "favorite_programming_language": "Python",
  "completed_topics": ["Python Basics", "OOP", "Data Structures"],
  "weak_topics": ["System Design", "Docker"],
  "strong_topics": ["Python", "ML Algorithms"],
  "learning_pace": "moderate",
  "session_count": 42,
  "total_interaction_minutes": 360,
  "summary": "User is a B.Tech CS student targeting AI Engineer roles. Strong in Python and ML fundamentals. Needs work on system design and deployment skills.",
  "last_updated": "2026-07-03T09:00:00Z",
  "created_at": "2026-06-01T08:00:00Z"
}
```

### Beanie Model

```python
class LearningPace(str, Enum):
    SLOW = "slow"
    MODERATE = "moderate"
    FAST = "fast"


class AIMemory(Document):
    user_id: PydanticObjectId
    career_goal: Optional[str] = None
    current_skills: list[str] = Field(default_factory=list)
    interests: list[str] = Field(default_factory=list)
    preferred_learning_style: Optional[str] = None
    favorite_programming_language: Optional[str] = None
    completed_topics: list[str] = Field(default_factory=list)
    weak_topics: list[str] = Field(default_factory=list)
    strong_topics: list[str] = Field(default_factory=list)
    learning_pace: LearningPace = LearningPace.MODERATE
    session_count: int = Field(default=0, ge=0)
    total_interaction_minutes: int = Field(default=0, ge=0)
    summary: Optional[str] = None
    last_updated: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "ai_memory"
        indexes = ["user_id"]
```

---

## 12. Collection: `recommendations`

**Purpose:** Stores AI-generated cross-domain recommendations per user.

### Sample Document

```json
{
  "_id": "ObjectId('...')",
  "user_id": "ObjectId('...')",
  "recommended_courses": [
    {"course_id": "ObjectId('...')", "reason": "Fills gap in Deep Learning", "priority": "high"}
  ],
  "recommended_projects": [
    {"title": "Build a Sentiment Analysis API", "tech_stack": ["Python", "FastAPI", "HuggingFace"], "priority": "high"}
  ],
  "recommended_jobs": [
    {"job_id": "ObjectId('...')", "match_score": 78, "missing_skills": ["Docker"]}
  ],
  "recommended_certificates": [
    {"name": "Google Professional ML Engineer", "provider": "Google", "priority": "medium"}
  ],
  "recommended_skills": ["Docker", "Kubernetes", "LangChain"],
  "confidence": 0.87,
  "generated_by": "recommendation_agent",
  "expires_at": "2026-07-10T00:00:00Z",
  "created_at": "2026-07-03T09:00:00Z"
}
```

### Beanie Model

```python
class CourseRecommendation(BaseModel):
    course_id: Optional[PydanticObjectId] = None
    title: Optional[str] = None
    reason: str
    priority: str = Field(..., pattern="^(high|medium|low)$")


class ProjectRecommendation(BaseModel):
    title: str
    description: Optional[str] = None
    tech_stack: list[str] = Field(default_factory=list)
    priority: str = Field(..., pattern="^(high|medium|low)$")


class JobRecommendation(BaseModel):
    job_id: Optional[PydanticObjectId] = None
    title: Optional[str] = None
    match_score: float = Field(..., ge=0.0, le=100.0)
    missing_skills: list[str] = Field(default_factory=list)


class Recommendation(Document):
    user_id: PydanticObjectId
    recommended_courses: list[CourseRecommendation] = Field(default_factory=list)
    recommended_projects: list[ProjectRecommendation] = Field(default_factory=list)
    recommended_jobs: list[JobRecommendation] = Field(default_factory=list)
    recommended_certificates: list[dict] = Field(default_factory=list)
    recommended_skills: list[str] = Field(default_factory=list)
    confidence: float = Field(default=0.0, ge=0.0, le=1.0)
    generated_by: str = "recommendation_agent"
    expires_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "recommendations"
        indexes = [
            "user_id",
            [("user_id", 1), ("created_at", -1)],
        ]
```

---

## 13. Collection: `roadmaps`

**Purpose:** Stores the generated career roadmap for a user with monthly/weekly/daily breakdown.

### Sample Document

```json
{
  "_id": "ObjectId('...')",
  "user_id": "ObjectId('...')",
  "career": "AI Engineer",
  "total_months": 6,
  "completion_percentage": 23,
  "status": "active",
  "months": [
    {
      "month": 1,
      "title": "Python & Math Foundations",
      "weeks": [
        {
          "week": 1,
          "title": "Python Basics",
          "daily_tasks": [
            {"day": 1, "task": "Setup Python environment", "completed": true},
            {"day": 2, "task": "Variables and data types", "completed": true}
          ]
        }
      ]
    }
  ],
  "generated_by": "roadmap_agent",
  "created_at": "2026-06-01T00:00:00Z",
  "updated_at": "2026-07-03T00:00:00Z"
}
```

### Beanie Model

```python
class DailyTask(BaseModel):
    day: int = Field(..., ge=1, le=7)
    task: str
    is_completed: bool = False
    completed_at: Optional[datetime] = None


class WeekPlan(BaseModel):
    week: int = Field(..., ge=1)
    title: str
    daily_tasks: list[DailyTask] = Field(default_factory=list)


class MonthPlan(BaseModel):
    month: int = Field(..., ge=1)
    title: str
    weeks: list[WeekPlan] = Field(default_factory=list)


class RoadmapStatus(str, Enum):
    ACTIVE = "active"
    COMPLETED = "completed"
    PAUSED = "paused"
    ABANDONED = "abandoned"


class Roadmap(Document):
    user_id: PydanticObjectId
    career: str
    total_months: int = Field(..., ge=1, le=24)
    completion_percentage: float = Field(default=0.0, ge=0.0, le=100.0)
    status: RoadmapStatus = RoadmapStatus.ACTIVE
    months: list[MonthPlan] = Field(default_factory=list)
    generated_by: str = "roadmap_agent"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "roadmaps"
        indexes = [
            "user_id",
            [("user_id", 1), ("status", 1)],
        ]
```

---

## 14. Collection: `learning_progress`

**Purpose:** Tracks per-user, per-course, per-lesson progress in the LMS.

### Sample Document

```json
{
  "_id": "ObjectId('...')",
  "user_id": "ObjectId('...')",
  "course_id": "ObjectId('...')",
  "lesson_id": "ObjectId('...')",
  "watch_percentage": 85,
  "quiz_score": 90,
  "quiz_attempts": 2,
  "time_spent_minutes": 45,
  "is_completed": true,
  "completed_at": "2026-07-02T10:00:00Z",
  "last_accessed": "2026-07-03T08:00:00Z",
  "created_at": "2026-06-15T08:00:00Z",
  "updated_at": "2026-07-02T10:00:00Z"
}
```

### Beanie Model

```python
class LearningProgress(Document):
    user_id: PydanticObjectId
    course_id: PydanticObjectId
    lesson_id: Optional[PydanticObjectId] = None
    watch_percentage: float = Field(default=0.0, ge=0.0, le=100.0)
    quiz_score: Optional[float] = Field(None, ge=0.0, le=100.0)
    quiz_attempts: int = Field(default=0, ge=0)
    time_spent_minutes: int = Field(default=0, ge=0)
    is_completed: bool = False
    completed_at: Optional[datetime] = None
    last_accessed: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "learning_progress"
        indexes = [
            [("user_id", 1), ("course_id", 1)],
            [("user_id", 1), ("course_id", 1), ("lesson_id", 1)],
            [("user_id", 1), ("is_completed", 1)],
        ]
```

---

## 15. Collection: `courses`

**Purpose:** Stores LMS course catalog with metadata.

### Sample Document

```json
{
  "_id": "ObjectId('...')",
  "title": "Complete Python for AI Engineering",
  "slug": "python-for-ai-engineering",
  "description": "Master Python fundamentals through advanced AI applications.",
  "category": "artificial_intelligence",
  "difficulty": "intermediate",
  "duration_hours": 40,
  "lesson_count": 52,
  "thumbnail": "https://storage.example.com/courses/python-ai.jpg",
  "instructor_id": "ObjectId('...')",
  "tags": ["python", "ai", "machine-learning"],
  "language": "English",
  "rating": 4.8,
  "enrollment_count": 1240,
  "is_published": true,
  "is_free": false,
  "price": 999,
  "prerequisites": ["Basic programming knowledge"],
  "learning_outcomes": ["Build ML models", "Use FastAPI for AI deployment"],
  "status": "published",
  "created_at": "2026-05-01T00:00:00Z",
  "updated_at": "2026-07-01T00:00:00Z"
}
```

### Beanie Model

```python
class CourseDifficulty(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class CourseStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class Course(Document):
    title: str = Field(..., min_length=5, max_length=200)
    slug: Indexed(str, unique=True)
    description: str = Field(..., min_length=20)
    category: str
    difficulty: CourseDifficulty
    duration_hours: float = Field(..., gt=0)
    lesson_count: int = Field(default=0, ge=0)
    thumbnail: Optional[str] = None
    instructor_id: Optional[PydanticObjectId] = None
    tags: list[str] = Field(default_factory=list)
    language: str = Field(default="English")
    rating: float = Field(default=0.0, ge=0.0, le=5.0)
    enrollment_count: int = Field(default=0, ge=0)
    is_published: bool = False
    is_free: bool = True
    price: float = Field(default=0.0, ge=0)
    prerequisites: list[str] = Field(default_factory=list)
    learning_outcomes: list[str] = Field(default_factory=list)
    status: CourseStatus = CourseStatus.DRAFT
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "courses"
        indexes = [
            "slug",
            "category",
            "difficulty",
            "status",
            [("tags", 1)],
            [("rating", -1)],
        ]
```

---

## 16. Collection: `lessons`

**Purpose:** Individual lesson content within a course.

### Beanie Model

```python
class LessonType(str, Enum):
    VIDEO = "video"
    PDF = "pdf"
    ARTICLE = "article"
    QUIZ = "quiz"
    CODING_LAB = "coding_lab"
    ASSIGNMENT = "assignment"


class Lesson(Document):
    course_id: PydanticObjectId
    title: str = Field(..., min_length=3, max_length=200)
    lesson_type: LessonType
    content_url: Optional[str] = None       # video URL or PDF URL
    content_text: Optional[str] = None      # For article-type lessons
    duration_minutes: Optional[int] = Field(None, ge=0)
    order: int = Field(..., ge=1)           # Position in course
    is_preview: bool = False                # Free preview available
    is_published: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "lessons"
        indexes = [
            [("course_id", 1), ("order", 1)],
        ]
```

---

## 17. Collection: `quizzes`

**Purpose:** Quiz questions linked to lessons with answer validation.

### Sample Document

```json
{
  "_id": "ObjectId('...')",
  "lesson_id": "ObjectId('...')",
  "course_id": "ObjectId('...')",
  "question": "Which Python keyword is used to define a function?",
  "options": ["class", "def", "func", "lambda"],
  "correct_answer": "def",
  "explanation": "'def' is the Python keyword for defining functions.",
  "difficulty": "beginner",
  "points": 1,
  "order": 3,
  "created_at": "2026-05-10T00:00:00Z"
}
```

### Beanie Model

```python
class Quiz(Document):
    lesson_id: PydanticObjectId
    course_id: PydanticObjectId
    question: str = Field(..., min_length=10)
    options: list[str] = Field(..., min_items=2, max_items=6)
    correct_answer: str
    explanation: Optional[str] = None
    difficulty: CourseDifficulty = CourseDifficulty.BEGINNER
    points: int = Field(default=1, ge=1)
    order: int = Field(default=1, ge=1)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "quizzes"
        indexes = [
            "lesson_id",
            "course_id",
        ]
```

---

## 18. Collection: `coding_submissions`

**Purpose:** Stores user code submissions to the coding assistant.

### Sample Document

```json
{
  "_id": "ObjectId('...')",
  "user_id": "ObjectId('...')",
  "problem_title": "Two Sum",
  "language": "python",
  "code": "def two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        if target - n in seen:\n            return [seen[target - n], i]\n        seen[n] = i",
  "action": "explain",
  "ai_response": "This solution uses a hash map for O(n) time complexity...",
  "execution_status": "success",
  "execution_time_ms": 42,
  "memory_usage_kb": 14336,
  "time_complexity": "O(n)",
  "space_complexity": "O(n)",
  "score": 95,
  "created_at": "2026-07-03T09:00:00Z"
}
```

### Beanie Model

```python
class CodingAction(str, Enum):
    EXPLAIN = "explain"
    DEBUG = "debug"
    GENERATE = "generate"
    OPTIMIZE = "optimize"
    DRY_RUN = "dry_run"


class CodingSubmission(Document):
    user_id: PydanticObjectId
    problem_title: Optional[str] = None
    language: str = Field(..., pattern="^(python|java|cpp|c|javascript|sql)$")
    code: str = Field(..., min_length=1)
    action: CodingAction
    ai_response: Optional[str] = None
    execution_status: Optional[str] = None
    execution_time_ms: Optional[int] = None
    memory_usage_kb: Optional[int] = None
    time_complexity: Optional[str] = None
    space_complexity: Optional[str] = None
    score: Optional[float] = Field(None, ge=0.0, le=100.0)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "coding_submissions"
        indexes = [
            "user_id",
            [("user_id", 1), ("created_at", -1)],
        ]
```

---

## 19. Collection: `interview_sessions`

**Purpose:** Stores complete mock interview sessions with Q&A and scoring.

### Sample Document

```json
{
  "_id": "ObjectId('...')",
  "user_id": "ObjectId('...')",
  "interview_type": "technical",
  "target_role": "Backend Developer",
  "questions_answers": [
    {
      "question": "Explain the difference between SQL and NoSQL databases.",
      "user_answer": "SQL databases are relational and use structured schemas...",
      "ideal_answer": "SQL uses structured schemas with ACID properties...",
      "score": 78,
      "feedback": "Good explanation but missed ACID properties"
    }
  ],
  "overall_score": 74,
  "confidence_score": 68,
  "communication_score": 80,
  "technical_score": 74,
  "duration_minutes": 32,
  "status": "completed",
  "completed_at": "2026-07-03T09:30:00Z",
  "created_at": "2026-07-03T09:00:00Z"
}
```

### Beanie Model

```python
class InterviewType(str, Enum):
    HR = "hr"
    TECHNICAL = "technical"
    BEHAVIORAL = "behavioral"
    CODING = "coding"


class QAItem(BaseModel):
    question: str
    user_answer: str
    ideal_answer: Optional[str] = None
    score: Optional[float] = Field(None, ge=0.0, le=100.0)
    feedback: Optional[str] = None


class InterviewSession(Document):
    user_id: PydanticObjectId
    interview_type: InterviewType
    target_role: Optional[str] = None
    questions_answers: list[QAItem] = Field(default_factory=list)
    overall_score: Optional[float] = Field(None, ge=0.0, le=100.0)
    confidence_score: Optional[float] = Field(None, ge=0.0, le=100.0)
    communication_score: Optional[float] = Field(None, ge=0.0, le=100.0)
    technical_score: Optional[float] = Field(None, ge=0.0, le=100.0)
    duration_minutes: Optional[int] = None
    status: str = "in_progress"
    completed_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "interview_sessions"
        indexes = [
            "user_id",
            [("user_id", 1), ("created_at", -1)],
        ]
```

---

## 20. Collection: `feedback`

**Purpose:** Stores user feedback on AI responses (quick rating and detailed review).

### Beanie Model

```python
class FeedbackRating(str, Enum):
    HELPFUL = "helpful"
    NOT_HELPFUL = "not_helpful"


class FeedbackCategory(str, Enum):
    INCORRECT = "incorrect"
    INCOMPLETE = "incomplete"
    OUTDATED = "outdated"
    TOO_LONG = "too_long"
    NOT_HELPFUL = "not_helpful"
    OTHER = "other"


class Feedback(Document):
    user_id: PydanticObjectId
    session_id: PydanticObjectId
    message_id: PydanticObjectId
    rating: FeedbackRating
    accuracy: Optional[int] = Field(None, ge=1, le=5)
    clarity: Optional[int] = Field(None, ge=1, le=5)
    helpfulness: Optional[int] = Field(None, ge=1, le=5)
    completeness: Optional[int] = Field(None, ge=1, le=5)
    speed: Optional[int] = Field(None, ge=1, le=5)
    category: Optional[FeedbackCategory] = None
    comment: Optional[str] = Field(None, max_length=1000)
    sentiment: Optional[str] = None     # "positive" | "neutral" | "negative"
    agent: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "feedback"
        indexes = [
            "user_id",
            "message_id",
            [("user_id", 1), ("created_at", -1)],
        ]
```

---

## 21. Collection: `notifications`

**Purpose:** Stores platform notifications per user.

### Beanie Model

```python
class NotificationType(str, Enum):
    COURSE_NEW = "course_new"
    INTERVIEW_REMINDER = "interview_reminder"
    ROADMAP_TASK = "roadmap_task"
    CERTIFICATE_ISSUED = "certificate_issued"
    JOB_MATCH = "job_match"
    WEEKLY_REPORT = "weekly_report"
    MENTOR_MESSAGE = "mentor_message"
    SYSTEM = "system"


class NotificationPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class Notification(Document):
    user_id: PydanticObjectId
    title: str = Field(..., max_length=200)
    message: str = Field(..., max_length=1000)
    notification_type: NotificationType
    priority: NotificationPriority = NotificationPriority.MEDIUM
    is_read: bool = False
    action_url: Optional[str] = None
    metadata: dict = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    read_at: Optional[datetime] = None

    class Settings:
        name = "notifications"
        indexes = [
            [("user_id", 1), ("is_read", 1)],
            [("user_id", 1), ("created_at", -1)],
        ]
```

---

## 22. Collection: `certificates`

**Purpose:** Stores issued course completion certificates with verification data.

### Beanie Model

```python
import secrets

class Certificate(Document):
    user_id: PydanticObjectId
    course_id: PydanticObjectId
    certificate_id: Indexed(str, unique=True)    # Human-readable: NEXA-2026-XXXX
    verification_code: str                        # UUID for public verification
    issue_date: datetime = Field(default_factory=datetime.utcnow)
    pdf_url: Optional[str] = None
    verification_url: Optional[str] = None
    is_valid: bool = True
    revoked_at: Optional[datetime] = None
    revocation_reason: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "certificates"
        indexes = [
            "user_id",
            "certificate_id",
            "verification_code",
            [("user_id", 1), ("course_id", 1)],
        ]
```

---

## 23. Collection: `jobs`

**Purpose:** Job listings matched and shown to users.

### Beanie Model

```python
class Job(Document):
    title: str = Field(..., min_length=3, max_length=200)
    company_id: Optional[PydanticObjectId] = None
    company_name: str
    location: str
    job_type: str = Field(..., pattern="^(full_time|part_time|remote|hybrid)$")
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    salary_currency: str = Field(default="INR")
    required_skills: list[str] = Field(default_factory=list)
    description: str
    apply_link: str
    deadline: Optional[datetime] = None
    experience_years_min: int = Field(default=0, ge=0)
    is_active: bool = True
    source: str = Field(default="manual")   # "manual" | "scraped" | "api"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "jobs"
        indexes = [
            [("required_skills", 1)],
            [("location", 1)],
            [("is_active", 1), ("created_at", -1)],
        ]
```

---

## 24. Collection: `internships`

### Beanie Model

```python
class Internship(Document):
    title: str = Field(..., min_length=3, max_length=200)
    company_name: str
    duration_months: int = Field(..., ge=1, le=24)
    stipend_monthly: Optional[int] = None
    stipend_currency: str = Field(default="INR")
    location: str
    is_remote: bool = False
    required_skills: list[str] = Field(default_factory=list)
    eligibility: Optional[str] = None
    description: str
    apply_link: str
    deadline: Optional[datetime] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "internships"
        indexes = [
            [("required_skills", 1)],
            [("is_active", 1), ("created_at", -1)],
        ]
```

---

## 25. Collection: `projects`

**Purpose:** Recommended hands-on project ideas to build portfolio.

### Beanie Model

```python
class Project(Document):
    title: str = Field(..., min_length=5, max_length=200)
    description: str
    difficulty: CourseDifficulty
    category: str
    skills_required: list[str] = Field(default_factory=list)
    tech_stack: list[str] = Field(default_factory=list)
    github_template: Optional[str] = None
    estimated_hours: Optional[int] = Field(None, ge=1)
    career_goals: list[str] = Field(default_factory=list)
    learning_outcomes: list[str] = Field(default_factory=list)
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "projects"
        indexes = [
            [("skills_required", 1)],
            [("difficulty", 1)],
        ]
```

---

## 26. Collection: `companies`

### Beanie Model

```python
class Company(Document):
    name: Indexed(str, unique=True)
    industry: str
    website: Optional[str] = None
    logo_url: Optional[str] = None
    headquarters: Optional[str] = None
    size: Optional[str] = None          # "startup" | "mid" | "large" | "enterprise"
    required_skills: list[str] = Field(default_factory=list)
    interview_pattern: Optional[str] = None
    salary_range: Optional[str] = None
    culture_notes: Optional[str] = None
    is_verified: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "companies"
        indexes = ["name", "industry"]
```

---

## 27. Collection: `mentor_sessions`

### Beanie Model

```python
class MentorSessionStatus(str, Enum):
    SCHEDULED = "scheduled"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    NO_SHOW = "no_show"


class MentorSession(Document):
    mentor_id: PydanticObjectId
    student_id: PydanticObjectId
    meeting_date: datetime
    duration_minutes: int = Field(default=60, ge=15)
    topic: Optional[str] = None
    notes: Optional[str] = None
    mentor_rating: Optional[int] = Field(None, ge=1, le=5)
    student_rating: Optional[int] = Field(None, ge=1, le=5)
    status: MentorSessionStatus = MentorSessionStatus.SCHEDULED
    meeting_link: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "mentor_sessions"
        indexes = [
            "mentor_id",
            "student_id",
            [("mentor_id", 1), ("meeting_date", 1)],
        ]
```

---

## 28. Collection: `analytics`

**Purpose:** Pre-aggregated daily platform metrics for admin dashboards.

### Beanie Model

```python
class DailyAnalytics(Document):
    date: Indexed(datetime, unique=True)
    active_users: int = Field(default=0, ge=0)
    new_registrations: int = Field(default=0, ge=0)
    total_logins: int = Field(default=0, ge=0)
    ai_queries: int = Field(default=0, ge=0)
    ai_queries_by_agent: dict = Field(default_factory=dict)
    course_completions: int = Field(default=0, ge=0)
    resume_uploads: int = Field(default=0, ge=0)
    interviews_completed: int = Field(default=0, ge=0)
    avg_feedback_score: float = Field(default=0.0, ge=0.0, le=5.0)
    total_learning_minutes: int = Field(default=0, ge=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "analytics"
        indexes = [
            [("date", -1)],
        ]
```

---

## 29. Collection: `audit_logs`

**Purpose:** Immutable security and admin action audit trail.

### Beanie Model

```python
class AuditLog(Document):
    user_id: Optional[PydanticObjectId] = None
    action: str                            # "login" | "role_change" | "resume_upload"
    module: str                            # "auth" | "admin" | "resume"
    resource_id: Optional[str] = None
    old_value: Optional[dict] = None
    new_value: Optional[dict] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    device: Optional[str] = None
    outcome: str = "success"              # "success" | "failure"
    error_message: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "audit_logs"
        indexes = [
            "user_id",
            "action",
            [("timestamp", -1)],
            [("user_id", 1), ("timestamp", -1)],
        ]
```

---

## 30. Collection: `activity_logs`

**Purpose:** Tracks all user interactions for personalization and analytics.

### Beanie Model

```python
class ActivityLog(Document):
    user_id: PydanticObjectId
    activity: str              # "logged_in" | "uploaded_resume" | "completed_lesson"
    module: Optional[str] = None
    metadata: dict = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "activity_logs"
        indexes = [
            [("user_id", 1), ("created_at", -1)],
            [("user_id", 1), ("activity", 1)],
        ]
```

---

## 31. Collection: `search_history`

### Beanie Model

```python
class SearchHistory(Document):
    user_id: PydanticObjectId
    query: str = Field(..., min_length=1, max_length=500)
    search_type: str = Field(default="global")   # "global" | "courses" | "jobs"
    filters: dict = Field(default_factory=dict)
    results_count: int = Field(default=0, ge=0)
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "search_history"
        indexes = [
            [("user_id", 1), ("timestamp", -1)],
        ]
```

---

## 32. Collection: `rag_documents`

**Purpose:** Stores metadata for documents indexed in Qdrant. Vectors live in Qdrant; metadata lives here.

### Beanie Model

```python
class RAGCategory(str, Enum):
    CAREER = "career"
    INTERVIEW = "interview"
    COURSE = "course"
    COMPANY = "company"
    RESUME = "resume"
    SKILLS = "skills"


class RAGDocument(Document):
    title: str
    category: RAGCategory
    source: str                             # File name, URL, or manual
    qdrant_collection: str                  # Which Qdrant collection holds this
    embedding_model: str                    # e.g., "text-embedding-3-small"
    embedding_dimension: int
    chunk_count: int = Field(..., ge=1)
    file_url: Optional[str] = None
    version: int = Field(default=1, ge=1)
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "rag_documents"
        indexes = [
            "category",
            "qdrant_collection",
        ]
```

---

## 33. Collection: `settings`

**Purpose:** Stores system-wide platform configuration managed by admins.

### Beanie Model

```python
class Settings(Document):
    key: Indexed(str, unique=True)          # e.g., "active_ai_provider"
    value: Any                              # String, int, bool, dict
    description: Optional[str] = None
    updated_by: Optional[PydanticObjectId] = None
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "settings"
```

**Example Settings Documents:**

```json
{ "key": "active_ai_provider",    "value": "openai" }
{ "key": "maintenance_mode",      "value": false }
{ "key": "default_language",      "value": "en" }
{ "key": "max_resume_size_mb",    "value": 5 }
{ "key": "enabled_ai_agents",     "value": ["career_agent", "resume_agent"] }
```

---

## 34. Document Relationships

### 34.1 User-Centric Relationship Map

```
users (_id)
    │
    ├──→ profiles         (user_id)
    ├──→ skills           (user_id)  [1 doc per skill]
    ├──→ resumes          (user_id)  [multiple versions]
    │       └──→ resume_scores (resume_id)
    ├──→ roadmaps         (user_id)
    ├──→ learning_progress(user_id, course_id, lesson_id)
    ├──→ chat_sessions    (user_id)
    │       └──→ chat_messages (session_id)
    ├──→ ai_memory        (user_id)  [1 doc per user]
    ├──→ recommendations  (user_id)
    ├──→ interview_sessions(user_id)
    ├──→ coding_submissions(user_id)
    ├──→ certificates     (user_id, course_id)
    ├──→ feedback         (user_id, message_id)
    ├──→ notifications    (user_id)
    ├──→ activity_logs    (user_id)
    ├──→ search_history   (user_id)
    └──→ audit_logs       (user_id)  [security events]

courses (_id)
    └──→ lessons          (course_id)
            └──→ quizzes  (lesson_id, course_id)
```

### 34.2 Referencing vs Embedding Decision

| Pattern     | When to Use                              | Example                           |
|-------------|------------------------------------------|-----------------------------------|
| **Reference** | Data is large, changes often, shared   | `user_id` in `profiles`          |
| **Embed**     | Data is small, owned, read together   | `QAItem` inside `interview_sessions` |
| **Hybrid**   | Partial embed for reads, ref for writes  | `questions_answers` in `interview_sessions` |

---

## 35. Indexing Strategy

### 35.1 Index Definitions (MongoDB Shell)

```javascript
// ── users ──────────────────────────────────────────────
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "role": 1 })
db.users.createIndex({ "created_at": -1 })

// ── profiles ────────────────────────────────────────────
db.profiles.createIndex({ "user_id": 1 }, { unique: true })

// ── skills ──────────────────────────────────────────────
db.skills.createIndex({ "user_id": 1 })
db.skills.createIndex({ "user_id": 1, "skill_name": 1 }, { unique: true })

// ── resumes ─────────────────────────────────────────────
db.resumes.createIndex({ "user_id": 1 })
db.resumes.createIndex({ "user_id": 1, "version": -1 })
db.resumes.createIndex({ "user_id": 1, "is_primary": 1 })

// ── resume_scores ───────────────────────────────────────
db.resume_scores.createIndex({ "resume_id": 1 })
db.resume_scores.createIndex({ "user_id": 1, "created_at": -1 })

// ── chat_sessions ───────────────────────────────────────
db.chat_sessions.createIndex({ "user_id": 1, "updated_at": -1 })
db.chat_sessions.createIndex({ "user_id": 1, "is_archived": 1 })

// ── chat_messages ───────────────────────────────────────
db.chat_messages.createIndex({ "session_id": 1, "timestamp": 1 })
db.chat_messages.createIndex({ "user_id": 1 })

// ── ai_memory ───────────────────────────────────────────
db.ai_memory.createIndex({ "user_id": 1 }, { unique: true })

// ── roadmaps ────────────────────────────────────────────
db.roadmaps.createIndex({ "user_id": 1, "status": 1 })

// ── learning_progress ───────────────────────────────────
db.learning_progress.createIndex({ "user_id": 1, "course_id": 1 })
db.learning_progress.createIndex({ "user_id": 1, "is_completed": 1 })

// ── courses ─────────────────────────────────────────────
db.courses.createIndex({ "slug": 1 }, { unique: true })
db.courses.createIndex({ "category": 1, "difficulty": 1 })
db.courses.createIndex({ "tags": 1 })
db.courses.createIndex({ "rating": -1 })
db.courses.createIndex(
  { "title": "text", "description": "text" },
  { name: "courses_full_text" }
)

// ── lessons ─────────────────────────────────────────────
db.lessons.createIndex({ "course_id": 1, "order": 1 })

// ── notifications ───────────────────────────────────────
db.notifications.createIndex({ "user_id": 1, "is_read": 1 })
db.notifications.createIndex({ "user_id": 1, "created_at": -1 })

// ── certificates ────────────────────────────────────────
db.certificates.createIndex({ "certificate_id": 1 }, { unique: true })
db.certificates.createIndex({ "user_id": 1, "course_id": 1 })
db.certificates.createIndex({ "verification_code": 1 })

// ── jobs ────────────────────────────────────────────────
db.jobs.createIndex({ "required_skills": 1 })
db.jobs.createIndex({ "is_active": 1, "created_at": -1 })
db.jobs.createIndex(
  { "title": "text", "description": "text" },
  { name: "jobs_full_text" }
)

// ── feedback ────────────────────────────────────────────
db.feedback.createIndex({ "user_id": 1, "created_at": -1 })
db.feedback.createIndex({ "message_id": 1 })

// ── audit_logs ──────────────────────────────────────────
db.audit_logs.createIndex({ "user_id": 1, "timestamp": -1 })
db.audit_logs.createIndex({ "action": 1, "timestamp": -1 })

// ── analytics ───────────────────────────────────────────
db.analytics.createIndex({ "date": -1 }, { unique: true })

// ── activity_logs ───────────────────────────────────────
db.activity_logs.createIndex({ "user_id": 1, "created_at": -1 })
db.activity_logs.createIndex(
  { "created_at": 1 },
  { expireAfterSeconds: 7776000 }  // TTL: auto-delete after 90 days
)
```

### 35.2 Index Strategy Summary

| Strategy              | Applied To                                       |
|-----------------------|--------------------------------------------------|
| Unique Index          | `email`, `slug`, `certificate_id`, `ai_memory`  |
| Compound Index        | All queries filtering on 2+ fields              |
| Descending Sort       | `created_at`, `updated_at`, `timestamp`         |
| Multikey (Array)      | `required_skills`, `tags`                       |
| Full-Text Index       | `courses`, `jobs` (for search module)           |
| TTL Index             | `activity_logs` (auto-purge after 90 days)      |

---

## 36. Data Validation Rules

### 36.1 Pydantic Validation (Applied in Beanie Models)

| Rule                       | Implementation                                    |
|----------------------------|---------------------------------------------------|
| Email uniqueness           | `Indexed(EmailStr, unique=True)` on `users.email`|
| Password not stored        | Only `password_hash` stored; never raw password  |
| Enums for controlled fields| `UserRole`, `SkillLevel`, `CourseStatus`, etc.   |
| Score ranges               | `Field(..., ge=0, le=100)` on all score fields   |
| Non-negative counts        | `Field(..., ge=0)` on count/duration fields      |
| String length bounds       | `min_length` and `max_length` on all text fields |
| UTC timestamps             | `datetime.utcnow` default on all timestamp fields|
| ObjectId references        | `PydanticObjectId` type on all cross-references  |
| File type constraints      | `pattern="^(pdf|docx)$"` on `file_type`         |
| Soft delete                | `is_active: bool = True` on users and courses    |

### 36.2 MongoDB-Level Validation

JSON Schema validation defined for critical collections:

```javascript
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "role", "is_verified", "created_at"],
      properties: {
        email: { bsonType: "string", pattern: "^.+@.+\\..+$" },
        role: { enum: ["student", "mentor", "admin", "super_admin"] },
        is_verified: { bsonType: "bool" },
        is_active: { bsonType: "bool" }
      }
    }
  }
})
```

---

## 37. AI Data Flow

```
User sends chat message (React)
          │
          ▼
POST /api/v1/ai/chat
          │
          ▼
Create/Update chat_sessions document
          │
          ▼
Insert user message → chat_messages
          │
          ▼
Load ai_memory (long-term context)
          │
          ▼
Load recent chat_messages (session context)
          │
          ▼
Qdrant semantic search → RAG chunks
          │
          ▼
Agent processes with full context
          │
          ▼
AI response generated
          │
          ▼
Insert assistant message → chat_messages
(with tokens_used, latency_ms, agent)
          │
          ▼
Update chat_sessions
(message_count++, updated_at, total_tokens)
          │
          ▼
Celery task: update ai_memory summary
(async — non-blocking)
          │
          ▼
Celery task: insert activity_logs entry
(async — non-blocking)
          │
          ▼
Feedback collected → feedback document
(if user rates the response)
          │
          ▼
Daily Celery Beat: aggregate → analytics
```

---

## 38. Backup Strategy

### 38.1 Backup Schedule

| Backup Type        | Frequency         | Retention     | Storage                    |
|--------------------|-------------------|---------------|----------------------------|
| MongoDB Incremental| Daily at 2:00 AM  | 30 days       | Atlas automated backups    |
| MongoDB Full       | Weekly (Sunday)   | 12 weeks      | Atlas automated backups    |
| Monthly Archive    | 1st of each month | 12 months     | Encrypted cloud storage    |
| File Storage       | Daily             | 30 days       | S3 versioning              |
| Configuration      | On change         | Indefinite    | Git version control        |

### 38.2 Recovery Objectives

| Metric | Target        |
|--------|---------------|
| RTO    | ≤ 4 hours     |
| RPO    | ≤ 24 hours    |

### 38.3 Backup Security

- All backups encrypted at rest (AES-256)
- Backup access restricted to Super Admin
- Restore procedure documented in `docs/runbooks/restore.md`
- Monthly restore drill to validate backup integrity

---

## 39. Database Security

| Control                         | Implementation                                         |
|---------------------------------|--------------------------------------------------------|
| Atlas Authentication            | Username + password (strong policy enforced)          |
| Network Access                  | IP allowlist — only application server IPs allowed    |
| TLS Connections                 | TLS 1.3 enforced; unencrypted connections rejected    |
| Database Users                  | Separate users per service (least privilege)          |
| Connection String Security      | Stored in `MONGODB_URI` env variable only             |
| Field-Level Encryption          | PII fields encrypted using Atlas FLE if required      |
| Audit Logging                   | Atlas audit log enabled for admin operations          |
| Role Separation                 | `app_user` (readWrite), `analytics_user` (read only)  |

---

## 40. Beanie Model Organization

```
backend/
└── app/
    └── models/
        ├── __init__.py              # Exports all document classes
        │
        ├── user.py                  # User, UserRole, AuthProvider
        ├── profile.py               # Profile, Degree, LearningStyle
        ├── skill.py                 # Skill, SkillLevel, SkillCategory
        │
        ├── resume.py                # Resume, ParsedData, ResumeStatus
        ├── resume_score.py          # ResumeScore
        │
        ├── chat_session.py          # ChatSession
        ├── chat_message.py          # ChatMessage, MessageRole, MessageFeedback
        ├── ai_memory.py             # AIMemory, LearningPace
        │
        ├── roadmap.py               # Roadmap, MonthPlan, WeekPlan, DailyTask
        ├── recommendation.py        # Recommendation, CourseRecommendation, etc.
        │
        ├── course.py                # Course, CourseDifficulty, CourseStatus
        ├── lesson.py                # Lesson, LessonType
        ├── quiz.py                  # Quiz
        ├── learning_progress.py     # LearningProgress
        │
        ├── interview_session.py     # InterviewSession, InterviewType, QAItem
        ├── coding_submission.py     # CodingSubmission, CodingAction
        │
        ├── feedback.py              # Feedback, FeedbackRating, FeedbackCategory
        ├── notification.py          # Notification, NotificationType
        ├── certificate.py           # Certificate
        │
        ├── job.py                   # Job
        ├── internship.py            # Internship
        ├── project.py               # Project
        ├── company.py               # Company
        │
        ├── mentor_session.py        # MentorSession, MentorSessionStatus
        │
        ├── analytics.py             # DailyAnalytics
        ├── audit_log.py             # AuditLog
        ├── activity_log.py          # ActivityLog
        ├── search_history.py        # SearchHistory
        ├── rag_document.py          # RAGDocument, RAGCategory
        └── settings.py              # Settings
```

---

## 41. Database Initialization

### 41.1 Beanie Initialization (FastAPI Lifespan)

```python
# app/core/database.py
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings
from app import models


async def init_db():
    """Initialize MongoDB connection and Beanie ODM."""
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB_NAME]

    await init_beanie(
        database=db,
        document_models=[
            models.User,
            models.Profile,
            models.Skill,
            models.Resume,
            models.ResumeScore,
            models.ChatSession,
            models.ChatMessage,
            models.AIMemory,
            models.Roadmap,
            models.Recommendation,
            models.Course,
            models.Lesson,
            models.Quiz,
            models.LearningProgress,
            models.InterviewSession,
            models.CodingSubmission,
            models.Feedback,
            models.Notification,
            models.Certificate,
            models.Job,
            models.Internship,
            models.Project,
            models.Company,
            models.MentorSession,
            models.DailyAnalytics,
            models.AuditLog,
            models.ActivityLog,
            models.SearchHistory,
            models.RAGDocument,
            models.Settings,
        ]
    )
    return client


# app/main.py
from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.core.database import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    app.state.db_client = await init_db()
    yield
    # Shutdown
    app.state.db_client.close()

app = FastAPI(lifespan=lifespan)
```

---

## 42. Database Design Principles

| Principle          | How NEXA AI Implements It                                     |
|--------------------|---------------------------------------------------------------|
| **User-Centric**   | Every collection references `user_id` for personalization    |
| **Document-Oriented** | Embed when data is owned and read together (QAItems, daily tasks) |
| **Scalable**       | Reference for shared, large, or frequently changing data     |
| **AI-Ready**       | Separate collections for AI memory, chat, RAG metadata       |
| **Auditable**      | Immutable `audit_logs` + time-tracked `activity_logs`        |
| **Extensible**     | New collections added without impacting existing schemas     |

---

## Phase Summary

| Phase | Document                            | Status     |
|-------|-------------------------------------|------------|
| 1     | Software Requirements Spec (SRS)    | ✅ Complete |
| 2     | Functional Requirements (FRS)       | ✅ Complete |
| 3     | Non-Functional Requirements (NFR)   | ✅ Complete |
| 4     | System Architecture Design (SAD)    | ✅ Complete |
| 5     | Technology Stack & Dev Standards    | ✅ Complete |
| 6     | Database Design & MongoDB Arch (DDA)| ✅ Complete |

---

> **Phase 6 Complete** — 32 collections, complete Beanie models, index strategy, relationship map, AI data flow, and initialization code defined.
>
> **Next: Phase 7 — Backend Architecture & FastAPI Design**
> Complete FastAPI project structure, API endpoint catalog, authentication middleware, repository pattern, LangGraph integration, Celery task architecture, WebSocket support, and production-ready backend patterns.

---

*NEXA AI DDA — Phase 6 of 30 | Version 1.0 | July 2026*
