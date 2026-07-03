# NEXA AI — AI Interview Coach & Placement Preparation System
## Phase 17 — Implementation Blueprint

---

| Field              | Details                                                  |
|--------------------|----------------------------------------------------------|
| **Document**       | AI Interview Coach & Placement Prep System (AICPPS)      |
| **Phase**          | 17 of 30                                                 |
| **Version**        | 1.0                                                      |
| **Framework**      | FastAPI + LangGraph                                      |
| **Sandbox Runtime**| Isolated Docker Container Sandbox                        |
| **Target Python**  | Python 3.13+                                             |
| **Status**         | ✅ Complete — Implementation Ready                      |

---

## Table of Contents

1. [Placement Readiness OS Architecture](#1-placement-readiness-os-architecture)
2. [MongoDB Interview Tracking Models](#2-mongodb-interview-tracking-models)
3. [Adaptive Question Selection & Difficulty Logic](#3-adaptive-question-selection--difficulty-logic)
4. [STAR Framework Behavioral Evaluation Engine](#4-star-framework-behavioral-evaluation-engine)
5. [Docker-Sandbox Coding Evaluation Compiler](#5-docker-sandbox-coding-evaluation-compiler)
6. [Structured Interview Feedback & Report Generator](#6-structured-interview-feedback--report-generator)
7. [API Catalog & Dialogue Router Endpoints](#7-api-catalog--dialogue-router-endpoints)
8. [Folder Structure Configuration](#8-folder-structure-configuration)
9. [Performance SLA Benchmarks](#9-performance-sla-benchmarks)

---

## 1. Placement Readiness OS Architecture

The Interview Coach is organized into a four-tiered **Placement Readiness OS** to manage session parameters, dynamic adaptive difficulty levels, sandbox coding runs, and feedback generators.

```
┌────────────────────────────────────────────────────────┐
│                    Coaching Layer                      │
│ - Mock Scheduling                - Action plans        │
└───────────────────────────┬────────────────────────────┘
                            │
┌────────────────────────────────────────────────────────┐
│                   Intelligence Layer                   │
│ - Company Prep Profiles          - Adaptive Difficulty │
└───────────────────────────┬────────────────────────────┘
                            │
┌────────────────────────────────────────────────────────┐
│                   Interview Layer                      │
│ - HR Mock Interviews             - Behavioral STAR check│
└───────────────────────────┬────────────────────────────┘
                            │
┌────────────────────────────────────────────────────────┐
│                   Assessment Layer                     │
│ - Code Compilation Sandbox       - Overall Metrics     │
└────────────────────────────────────────────────────────┘
```

---

## 2. MongoDB Interview Tracking Models

We use MongoDB documents to store ongoing mock sessions, active questions, and evaluation reports.

```python
# app/ai/interview/interview_models.py
from datetime import datetime
from enum import Enum
from typing import Optional, Any
from beanie import Document, Indexed
from pydantic import Field


class InterviewCategory(str, Enum):
    HR         = "hr"
    TECHNICAL  = "technical"
    BEHAVIORAL = "behavioral"
    CODING     = "coding"


class SessionStatus(str, Enum):
    ONGOING   = "ongoing"
    COMPLETED = "completed"
    ABANDONED = "abandoned"


class InterviewSession(Document):
    user_id:         Indexed(str)
    category:        Indexed(InterviewCategory)
    company_target:  Optional[str] = None
    role_target:     str
    status:          SessionStatus = SessionStatus.ONGOING
    current_step:    int = 1
    max_steps:       int = 5
    created_at:      datetime = Field(default_factory=datetime.utcnow)
    completed_at:    Optional[datetime] = None

    class Settings:
        name = "interview_sessions"
        indexes = [
            "user_id",
            "status",
            "created_at"
        ]


class InterviewQuestion(Document):
    session_id:      Indexed(str)
    question_num:    int
    question_text:   str
    difficulty:      str                                       # "easy", "medium", "hard"
    expected_topics: list[str] = []
    user_answer:     Optional[str] = None
    evaluation_score: Optional[float] = None
    feedback_notes:  Optional[str] = None

    class Settings:
        name = "interview_questions"
        indexes = [
            "session_id",
            "question_num"
        ]


class InterviewReport(Document):
    session_id:       Indexed(str, unique=True)
    user_id:          Indexed(str)
    overall_score:    float = Field(ge=0.0, le=100.0)
    strengths:        list[str] = []
    weaknesses:       list[str] = []
    recommendations:  list[str] = []
    generated_at:     datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "interview_reports"
```

---

## 3. Adaptive Question Selection & Difficulty Logic

The question generator adjusts interview difficulty dynamically based on the score of the user's previous answer.

```python
# app/ai/interview/planner.py
from app.ai.interview.interview_models import InterviewQuestion


class NexaAdaptiveDifficultyPlanner:
    def determine_next_difficulty(self, previous_questions: list[InterviewQuestion]) -> str:
        """Determines the next question's difficulty level based on previous scores."""
        if not previous_questions:
            return "medium"

        # Read the score of the last answered question
        last_q = sorted(previous_questions, key=lambda q: q.question_num)[-1]
        score = last_q.evaluation_score or 50.0

        current_diff = last_q.difficulty
        if score >= 80.0:
            # Upgrade difficulty
            if current_diff == "easy":
                return "medium"
            return "hard"
        elif score <= 45.0:
            # Downgrade difficulty
            if current_diff == "hard":
                return "medium"
            return "easy"
            
        return current_diff
```

---

## 4. STAR Framework Behavioral Evaluation Engine

Evaluates behavioral answers against the STAR framework (Situation, Task, Action, Result) using structured JSON generation.

```python
# app/ai/interview/behavioral_interview.py
from pydantic import BaseModel, Field
from app.ai.providers.provider_manager import NexaProviderManager


class STAREvaluation(BaseModel):
    has_situation: bool = Field(description="Was a clear context or situation established?")
    has_task:      bool = Field(description="Was the assignment/challenge defined?")
    has_action:    bool = Field(description="Were concrete steps taken explained?")
    has_result:    bool = Field(description="Was a measurable outcome provided?")
    score:         float = Field(description="STAR framework compliance score (0-100)")
    critique:      str = Field(description="Suggestions for structural improvement")


class STARBehavioralEvaluator:
    def __init__(self):
        self.provider = NexaProviderManager()

    async def evaluate_behavioral_answer(self, question: str, answer: str) -> STAREvaluation:
        """Evaluates compliance with the STAR method using structured JSON."""
        system_prompt = (
            "You are a STAR Framework Evaluation Bot. Analyze the provided interview answer "
            "and check for the presence of Situation, Task, Action, and Result components. "
            "Return only valid JSON matching the STAREvaluation schema."
        )

        prompt = (
            f"Question: {question}\n"
            f"Answer: {answer}\n\n"
            f"Evaluate structural compliance."
        )

        raw = await self.provider.generate_with_fallback(prompt, system_prompt)
        return STAREvaluation.model_validate_json(raw)
```

---

## 5. Docker-Sandbox Coding Evaluation Compiler

Coding questions are validated inside isolated sandbox containers, testing user code blocks against pre-configured test parameters.

```python
# app/ai/interview/coding_interview.py
import docker
import json
from typing import Any


class NexaCodingSandboxCompiler:
    def __init__(self):
        self.client = docker.from_env()
        self.image = "python:3.13-slim"

    def run_tests(self, user_code: str, test_cases: list[dict[str, Any]]) -> dict[str, Any]:
        """Runs user code against test cases in an isolated Docker container."""
        # Wrap user code with execution test checks
        test_script = (
            f"{user_code}\n\n"
            f"import json\n"
            f"cases = {json.dumps(test_cases)}\n"
            f"passed = 0\n"
            f"for idx, c in enumerate(cases):\n"
            f"    try:\n"
            f"        # Assuming function target named 'solve'\n"
            f"        res = solve(c['input'])\n"
            f"        if res == c['expected']:\n"
            f"            passed += 1\n"
            f"    except Exception:\n"
            f"        pass\n"
            f"print(json.dumps({{'passed': passed, 'total': len(cases)}}))\n"
        )

        try:
            container = self.client.containers.run(
                image=self.image,
                command=f"python -c \"{test_script}\"",
                detach=False,
                network_disabled=True,
                mem_limit="64m",
                timeout=4
            )
            return json.loads(container.decode("utf-8").strip())
        except Exception as e:
            return {"error": str(e), "passed": 0, "total": len(test_cases)}
```

---

## 6. Structured Interview Feedback & Report Generator

At session completion, the evaluator gathers all metrics to build a comprehensive feedback report.

```python
# app/ai/interview/report_generator.py
from app.ai.interview.interview_models import InterviewQuestion, InterviewReport


class NexaInterviewReportGenerator:
    def generate_final_report(self, session_id: str, questions: list[InterviewQuestion]) -> InterviewReport:
        """Compiles scores across all questions to generate the final report."""
        scores = [q.evaluation_score for q in questions if q.evaluation_score is not None]
        avg_score = sum(scores) / len(scores) if scores else 50.0

        strengths = []
        weaknesses = []
        recommendations = []

        for q in questions:
            if q.evaluation_score and q.evaluation_score >= 80.0:
                strengths.append(f"Answered {q.question_text[:30]}... successfully.")
            elif q.evaluation_score and q.evaluation_score < 60.0:
                weaknesses.append(f"Struggled with topic {', '.join(q.expected_topics)}.")
                recommendations.append(f"Review core concepts on: {', '.join(q.expected_topics)}.")

        return InterviewReport(
            session_id=session_id,
            user_id="user_id_placeholder",
            overall_score=round(avg_score, 2),
            strengths=list(set(strengths))[:3],
            weaknesses=list(set(weaknesses))[:3],
            recommendations=list(set(recommendations))[:3]
        )
```

---

## 7. API Catalog & Dialogue Router Endpoints

```python
# app/ai/interview/interview_api.py
from fastapi import APIRouter, HTTPException
from app.core.dependencies import CurrentUser
from app.ai.interview.interview_models import InterviewSession, InterviewQuestion
from app.schemas.common import APIResponse

router = APIRouter(prefix="/interview", tags=["Interview Coach OS"])


@router.post("/start", response_model=APIResponse[dict])
async def start_mock_session(
    role: str,
    category: str,
    current_user: CurrentUser
):
    """Starts a new mock interview session and returns the first question."""
    session = InterviewSession(
        user_id=str(current_user.id),
        category=category,
        role_target=role
    )
    await session.insert()

    first_q = InterviewQuestion(
        session_id=str(session.id),
        question_num=1,
        question_text="Tell me about your technical background.",
        difficulty="medium",
        expected_topics=["introduction"]
    )
    await first_q.insert()

    return APIResponse.ok(data={
        "session_id": str(session.id),
        "question_num": 1,
        "question_text": first_q.question_text
    })
```

---

## 8. Folder Structure Configuration

```
backend/app/ai/interview/
├── __init__.py
├── planner.py               # Adaptive logic coordinators
├── question_generator.py
├── answer_evaluator.py
├── scoring.py               # Weight calculators
├── feedback.py
├── company_preparation.py
├── coding_interview.py      # Sandbox execution interface code
├── hr_interview.py
├── behavioral_interview.py  # STAR framework analysis helper
├── technical_interview.py
├── report_generator.py      # Report compilation builder
└── interview_api.py         # Start/Step endpoints router
```

---

## 9. Performance SLA Benchmarks

To maintain a fast interface, interview coach operations are designed to match strict latency limits:

| Evaluation Stage | SLA Target | Verification Target |
| :--- | :--- | :--- |
| **Question Retrieval** | Mapping parameters | Target: ≤ 80 ms |
| **Sandbox Execution** | Container runtime | Target: ≤ 2900 ms |
| **STAR JSON Checking** | Verification pipeline | Target: ≤ 1800 ms |
| **Report Generation** | Index parsing time | Target: ≤ 220 ms |
| **Metric Sync Write** | MongoDB save duration | Target: ≤ 150 ms |

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

---

> **Phase 17 Complete** — Mock interview systems and sandbox execution adapters defined.
>
> **Next: Phase 18 — Learning Management System (LMS) & Personalized Learning Engine**
> Course architectures, dynamic progress trackers, video indexes, certificate schemas, and AI tutor nodes.

---

*NEXA AI Phase 17 — AI Interview Coach | Version 1.0 | July 2026*
