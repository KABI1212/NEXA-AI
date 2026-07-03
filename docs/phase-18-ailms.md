# NEXA AI — AI Learning Management System (AI-LMS)
## Phase 18 — Implementation Blueprint

---

| Field              | Details                                                  |
|--------------------|----------------------------------------------------------|
| **Document**       | AI-LMS & Personalized Learning Engine                    |
| **Phase**          | 18 of 30                                                 |
| **Version**        | 1.0                                                      |
| **Framework**      | FastAPI + Beanie + Monaco Code Sandbox                   |
| **Verification**   | Cryptographic Certificates (HMAC-SHA256 QR Codes)        |
| **Target Python**  | Python 3.13+                                             |
| **Status**         | ✅ Complete — Implementation Ready                      |

---

## Table of Contents

1. [Learning OS Layered Architecture](#1-learning-os-layered-architecture)
2. [MongoDB Course & Progress Models](#2-mongodb-course--progress-models)
3. [Personalized Path & Content Recommendation Service](#3-personalized-path--content-recommendation-service)
4. [AI-Driven Adaptive Quiz Evaluator](#4-ai-driven-adaptive-quiz-evaluator)
5. [Monaco Sandbox Coding Lab Executor](#5-monaco-sandbox-coding-lab-executor)
6. [QR-Verified Certificate Generation Service](#6-qr-verified-certificate-generation-service)
7. [API Route Catalog & Enroll Routers](#7-api-route-catalog--enroll-routers)
8. [Folder Structure Configuration](#8-folder-structure-configuration)
9. [Performance SLA Benchmarks](#9-performance-sla-benchmarks)

---

## 1. Learning OS Layered Architecture

The Learning Engine coordinates content delivery, interactive quizzes, automated grading sandboxes, and verification systems.

```
┌────────────────────────────────────────────────────────┐
│                   Engagement Layer                     │
│ - Gamification (XP, streaks)     - Progress Dashboard  │
└───────────────────────────┬────────────────────────────┘
                            │
┌────────────────────────────────────────────────────────┐
│                   Assessment Layer                     │
│ - Coding Labs                    - QR Certifications   │
└───────────────────────────┬────────────────────────────┘
                            │
┌────────────────────────────────────────────────────────┐
│                   Intelligence Layer                   │
│ - Dynamic Path Engine            - AI Tutor QA Node    │
└───────────────────────────┬────────────────────────────┘
                            │
┌────────────────────────────────────────────────────────┐
│                     Content Layer                      │
│ - Lesson Notes                   - Course Modules      │
└────────────────────────────────────────────────────────┘
```

---

## 2. MongoDB Course & Progress Models

We use MongoDB documents to store course structures, quiz definitions, progress logs, and generated certificates.

```python
# app/learning/courses/course_models.py
from datetime import datetime
from enum import Enum
from typing import Optional, Any
from beanie import Document, Indexed
from pydantic import Field


class LessonType(str, Enum):
    TEXT    = "text"
    VIDEO   = "video"
    QUIZ    = "quiz"
    CODING  = "coding"


class Course(Document):
    title:         str
    description:   str
    domain:        Indexed(str)                        # e.g., "AI", "Cloud", "Backend"
    difficulty:    str                                 # "beginner", "intermediate", "advanced"
    modules:       list[dict[str, Any]] = []           # Embedded list of modules and lesson definitions
    is_active:     bool = True
    created_at:    datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "courses"
        indexes = [
            "domain",
            "difficulty"
        ]


class LearningProgress(Document):
    user_id:              Indexed(str)
    course_id:            Indexed(str)
    completed_lessons:    list[str] = []                       # List of completed lesson keys
    streak_count:         int = 0
    total_xp_earned:      int = 0
    last_activity_date:   datetime = Field(default_factory=datetime.utcnow)
    is_completed:         bool = False
    completed_at:         Optional[datetime] = None

    class Settings:
        name = "learning_progress"
        indexes = [
            "user_id",
            "course_id",
            [("user_id", 1), ("course_id", 1)]
        ]


class Certificate(Document):
    user_id:            Indexed(str)
    course_id:          Indexed(str)
    certificate_id:     Indexed(str, unique=True)              # Unique serial string UUID
    verification_hash:  str                                    # Cryptographic validation signature
    issued_at:          datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "certificates"
        indexes = [
            "user_id",
            "certificate_id"
        ]
```

---

## 3. Personalized Path & Content Recommendation Service

Calculates appropriate course options based on target goals and identified skill gaps.

```python
# app/learning/recommendations/path_engine.py
from typing import list
from app.learning.courses.course_models import Course


class NexaAdaptiveLearningEngine:
    async def match_courses_to_gaps(self, skill_gaps: list[str], user_level: str) -> list[dict[str, str]]:
        """Retrieves and recommends active courses that address identified skill gaps."""
        # 1. Fetch matching courses from MongoDB
        matching_courses = await Course.find(
            Course.domain.in_(skill_gaps),
            Course.is_active == True
        ).to_list()

        recommendations = []
        for course in matching_courses:
            # Match course difficulty level to user experience
            if course.difficulty == user_level:
                recommendations.append({
                    "course_id": str(course.id),
                    "title": course.title,
                    "difficulty": course.difficulty,
                    "priority": "HIGH"
                })
                
        return recommendations
```

---

## 4. AI-Driven Adaptive Quiz Evaluator

Evaluates quiz submissions, scoring short answers and code snippets using JSON generation.

```python
# app/learning/quizzes/quiz_evaluator.py
from pydantic import BaseModel, Field
from app.ai.providers.provider_manager import NexaProviderManager


class QuizFeedback(BaseModel):
    is_correct:  bool
    score:       float = Field(ge=0.0, le=100.0)
    explanation: str = Field(description="Factual explanation of correct answers and mistakes")
    next_hint:   Optional[str] = Field(description="Concept hint helping user correct mistakes")


class NexaQuizEvaluator:
    def __init__(self):
        self.provider = NexaProviderManager()

    async def evaluate_answer(self, question: str, user_answer: str, expected_answer: str) -> QuizFeedback:
        """Evaluates quiz answer correctness and formats feedback."""
        system_prompt = (
            "You are a Pedagogical Quiz Evaluator. Review the user's answer against the expected "
            "answer. Score correctness and provide constructive feedback. Return only valid JSON "
            "matching the QuizFeedback schema."
        )

        prompt = (
            f"Question: {question}\n"
            f"Expected Answer: {expected_answer}\n"
            f"User Answer: {user_answer}\n"
        )

        raw = await self.provider.generate_with_fallback(prompt, system_prompt)
        return QuizFeedback.model_validate_json(raw)
```

---

## 5. Monaco Sandbox Coding Lab Executor

Monaco code submissions are compiled and tested inside isolated Docker containers.

```python
# app/learning/coding_lab/sandbox.py
import docker
import json
from typing import Any


class MonacoSandboxLabExecutor:
    def __init__(self):
        self.client = docker.from_env()
        self.image = "python:3.13-slim"

    def execute_lab_tests(self, user_code: str, test_cases: list[dict[str, Any]]) -> dict[str, Any]:
        """Runs Monaco user script against test cases in an isolated Docker sandbox."""
        # execution wrapper template
        execution_template = (
            f"{user_code}\n\n"
            f"import json\n"
            f"tests = {json.dumps(test_cases)}\n"
            f"passed = 0\n"
            f"for t in tests:\n"
            f"    try:\n"
            f"        if run_solution(t['input']) == t['expected']:\n"
            f"            passed += 1\n"
            f"    except Exception:\n"
            f"        pass\n"
            f"print(json.dumps({{'passed_tests': passed, 'total_tests': len(tests)}}))\n"
        )

        try:
            container = self.client.containers.run(
                image=self.image,
                command=f"python -c \"{execution_template}\"",
                detach=False,
                network_disabled=True,
                mem_limit="64m",
                timeout=3
            )
            return json.loads(container.decode("utf-8").strip())
        except Exception as e:
            return {"error": str(e), "passed_tests": 0, "total_tests": len(test_cases)}
```

---

## 6. QR-Verified Certificate Generation Service

Upon course completion, this service generates verified certificates containing QR codes built with HMAC-SHA256 validation signatures.

```python
# app/learning/certificates/generator.py
import hmac
import hashlib
import uuid
from datetime import datetime
from app.config import settings
from app.learning.courses.course_models import Certificate


class NexaCertificateGenerator:
    def generate_verification_signature(self, user_id: str, course_id: str, cert_id: str) -> str:
        """Generates an HMAC-SHA256 signature to verify certificate authenticity."""
        msg = f"{user_id}:{course_id}:{cert_id}"
        return hmac.new(
            settings.SECRET_KEY.encode(),
            msg.encode(),
            hashlib.sha256
        ).hexdigest()

    async def issue_certificate(self, user_id: str, course_id: str) -> Certificate:
        """Issues a new verified certificate document."""
        cert_id = str(uuid.uuid4())
        signature = self.generate_verification_signature(user_id, course_id, cert_id)

        cert = Certificate(
            user_id=user_id,
            course_id=course_id,
            certificate_id=cert_id,
            verification_hash=signature,
            issued_at=datetime.utcnow()
        )
        await cert.insert()
        return cert
```

---

## 7. API Route Catalog & Enroll Routers

```python
# app/learning/learning_api.py
from fastapi import APIRouter, HTTPException
from app.core.dependencies import CurrentUser
from app.learning.courses.course_models import Course, LearningProgress
from app.schemas.common import APIResponse

router = APIRouter(prefix="/learning", tags=["Adaptive LMS OS"])


@router.post("/enroll/{course_id}", response_model=APIResponse[dict])
async def enroll_in_course(
    course_id: str,
    current_user: CurrentUser
):
    """Enrolls a user in a course and initializes their progress in MongoDB."""
    course = await Course.get(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    existing = await LearningProgress.find_one(
        LearningProgress.user_id == str(current_user.id),
        LearningProgress.course_id == course_id
    )
    if existing:
        return APIResponse.ok(data={"status": "already_enrolled"})

    progress = LearningProgress(
        user_id=str(current_user.id),
        course_id=course_id
    )
    await progress.insert()

    return APIResponse.ok(data={
        "status": "enrolled",
        "progress_id": str(progress.id)
    })
```

---

## 8. Folder Structure Configuration

```
backend/app/learning/
├── __init__.py
├── courses/
│   ├── __init__.py
│   └── course_models.py       # Course & Lesson Beanie document models
├── modules/
├── lessons/
├── quizzes/
│   ├── __init__.py
│   └── quiz_evaluator.py      # Quiz evaluator services code
├── assignments/
├── coding_lab/
│   ├── __init__.py
│   └── sandbox.py             # Docker-sandbox script execution
├── certificates/
│   ├── __init__.py
│   └── generator.py           # HMAC verification generator
├── progress/
├── recommendations/
│   ├── __init__.py
│   └── path_engine.py         # Dynamic course recommendation code
├── mentor/
├── analytics/
└── learning_api.py            # API routing controllers
```

---

## 9. Performance SLA Benchmarks

To maintain dashboard responsiveness, learning operations are designed to match strict latency limits:

| Operations Stage | SLA Target | Verification Target |
| :--- | :--- | :--- |
| **Course Details Load** | Fetching course info | Target: ≤ 80 ms |
| **Monaco Execution** | Docker sandbox runtime | Target: ≤ 2900 ms |
| **Adaptive Path Match** | Skill gap calculations | Target: ≤ 320 ms |
| **Verification Sign** | Cryptographic hash time | Target: ≤ 10 ms |
| **Progress Write Update**| MongoDB save duration | Target: ≤ 150 ms |

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

---

> **Phase 18 Complete** — Adaptive learning management system and code execution nodes defined.
>
> **Next: Phase 19 — AI Feedback, Continuous Learning & System Intelligence**
> Response rating, moderation pipelines, prompt versions, quality logs, model evaluations, and A/B test parameters.

---

*NEXA AI Phase 18 — AI LMS & Personalization | Version 1.0 | July 2026*
