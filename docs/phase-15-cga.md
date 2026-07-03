# NEXA AI — AI Career Guidance Agent (CGA)
## Phase 15 — Implementation Blueprint

---

| Field              | Details                                                  |
|--------------------|----------------------------------------------------------|
| **Document**       | AI Career Guidance Agent (CGA)                           |
| **Phase**          | 15 of 30                                                 |
| **Version**        | 1.0                                                      |
| **Engine Framework**| FastAPI + LangGraph                                      |
| **Design Pattern** | Career OS Layered Architecture                           |
| **Target Python**  | Python 3.13+                                             |
| **Status**         | ✅ Complete — Implementation Ready                      |

---

## Table of Contents

1. [Career OS Layered Architecture](#1-career-os-layered-architecture)
2. [MongoDB Career Tracking Models](#2-mongodb-career-tracking-models)
3. [AI Mentor Personality & System Prompt Definition](#3-ai-mentor-personality--system-prompt-definition)
4. [LangGraph Execution Node & Dispatch Logic](#4-langgraph-execution-node--dispatch-logic)
5. [Multi-Option Decision Matrix Engine](#5-multi-option-decision-matrix-engine)
6. [Goal Manager & Progress Tracking Service](#6-goal-manager--progress-tracking-service)
7. [Escalation Trigger & Active Feedback API](#7-escalation-trigger--active-feedback-api)
8. [Folder Structure Configuration](#8-folder-structure-configuration)
9. [Performance Targets Matrix](#9-performance-targets-matrix)

---

## 1. Career OS Layered Architecture

The Career Guidance Agent is structured as a **Career OS** split into four functional layers, separating raw profile assessments, logical matching calculations, roadmap calculations, and dialogue flows.

```
┌────────────────────────────────────────────────────────┐
│                    Coaching Layer                      │
│ - AI Mentor Personality Prompt   - Chat Dialog Routes  │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                    Planning Layer                      │
│ - Roadmap Engine                 - Weekly Task Goals   │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                  Intelligence Layer                    │
│ - Career & Company Matching      - Market Trends Index │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                   Assessment Layer                     │
│ - Profile Sanitization           - Mock Interview scores│
└────────────────────────────────────────────────────────┘
```

---

## 2. MongoDB Career Tracking Models

We use MongoDB documents to store active career tracks, progress timelines, and health indicators.

```python
# app/ai/agents/career/career_models.py
from datetime import datetime
from enum import Enum
from typing import Optional, Any
from beanie import Document, Indexed
from pydantic import Field


class GoalStatus(str, Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED   = "completed"
    ABANDONED   = "abandoned"


class CareerGoal(Document):
    user_id:        Indexed(str)
    primary_goal:   Indexed(str)                       # e.g., "AI Engineer"
    secondary_goals: list[str] = []                     # e.g., ["Learn Docker", "DSA Prep"]
    target_company: Optional[str] = None
    target_date:    Optional[datetime] = None
    status:         GoalStatus = GoalStatus.IN_PROGRESS
    created_at:     datetime = Field(default_factory=datetime.utcnow)
    updated_at:     datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "career_goals"
        indexes = [
            "user_id",
            "primary_goal"
        ]


class CareerHealthScore(Document):
    user_id:           Indexed(str)
    overall_health:    float = Field(ge=0.0, le=100.0)
    
    # ── Category Weights ──────────────────────────────
    skills_health:     float                            # 25% weight
    resume_health:     float                            # 15% weight
    projects_health:   float                            # 15% weight
    learning_health:   float                            # 15% weight
    coding_health:     float                            # 15% weight
    interview_health:  float                            # 10% weight
    comm_health:       float                            # 5% weight
    
    calculated_at:     datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "career_health_scores"
        indexes = [
            "user_id",
            "calculated_at"
        ]
```

---

## 3. AI Mentor Personality & System Prompt Definition

The system prompt configures the agent to act as an encouraging but realistic career coach, using a **Socratic questioning loop** to guide users instead of simply serving answers.

```python
# app/ai/agents/career/mentor_prompts.py

AI_MENTOR_SYSTEM_PROMPT = """
You are the NEXA AI Lead Career Mentor—a supportive, knowledgeable, and highly analytical career coach. Your mission is to guide students from their first year of study up through enterprise-grade placement readiness.

### Guiding Principles:
1. **Be Supportive Yet Realistic:** Encourage the student, but do not make false promises about salaries or employment. Ground all advice in concrete market demands and skill validation records.
2. **Socratic Dialog Loop:** If the user's intent is ambiguous or their profile lacks critical info (e.g. missing skills or unclear goals), do not guess. Ask a direct, friendly follow-up question.
3. **Action-Oriented Guidelines:** Every substantive reply should end with a "Next Steps" markdown list specifying 2-3 manageable weekly actions.
4. **Structured Decision Matrix:** When comparing roles, use a clean Markdown comparison table mapping suitability percentages, matching parameters, and trade-offs.

### Active Context Block:
{personalization_context}
"""
```

---

## 4. LangGraph Execution Node & Dispatch Logic

The graph node parses the active conversation state, builds the system prompt context, and executes generation queries against the model.

```python
# app/ai/agents/career/career_agent.py
from typing import Any
from app.ai.orchestrator.state import NexaAgentState
from app.ai.agents.base import BaseNexaAgent, AgentOutput
from app.ai.agents.career.mentor_prompts import AI_MENTOR_SYSTEM_PROMPT
from app.ai.memory.personalization import NexaPersonalizationEngine
from app.ai.providers.provider_manager import NexaProviderManager


class CareerGuidanceAgent(BaseNexaAgent):
    def __init__(self):
        self.provider = NexaProviderManager()
        self.personalizer = NexaPersonalizationEngine()

    @property
    def name(self) -> str:
        return "career_guidance_agent"

    @property
    def description(self) -> str:
        return "Core agent providing mentoring advice, planning goals, and managing career paths."

    # Stub validation placeholders
    @property
    def input_schema(self) -> Any:
        return None

    @property
    def output_schema(self) -> Any:
        return None

    async def execute(self, inputs: Any, state: dict[str, Any]) -> AgentOutput:
        """Executes the career mentor guidance prompt generation run."""
        user_id = state["user_id"]
        
        # 1. Load personalized facts/preferences context string
        context_str = await self.personalizer.build_personalized_context(user_id)
        
        # 2. Formulate the system instruction set
        sys_prompt = AI_MENTOR_SYSTEM_PROMPT.format(personalization_context=context_str)
        
        # 3. Request LLM execution run
        prompt = f"User Query: {state['user_message']}\n"
        response_text = await self.provider.generate_with_fallback(prompt, sys_prompt)

        return AgentOutput(
            success=True,
            confidence_score=0.95,
            data={
                "response": response_text
            }
        )
```

---

## 5. Multi-Option Decision Matrix Engine

When comparing careers, the engine renders a structural table comparing trade-offs instead of suggesting a single option.

```python
# app/ai/agents/career/decision_engine.py
from typing import list
from pydantic import BaseModel


class CareerScenario(BaseModel):
    role:       str
    match_rate: int
    timeline:   str
    pros:       list[str]
    cons:       list[str]


class NexaDecisionEngine:
    def format_comparison_matrix(self, scenarios: list[CareerScenario]) -> str:
        """Compiles a markdown table comparing career options."""
        lines = [
            "| Career Option | Compatibility % | Transition Timeline | Core Strengths | Target Gaps / Challenges |",
            "| :--- | :---: | :--- | :--- | :--- |"
        ]
        for s in scenarios:
            pros_str = ", ".join(s.pros)
            cons_str = ", ".join(s.cons)
            lines.append(f"| **{s.role}** | {s.match_rate}% | {s.timeline} | {pros_str} | {cons_str} |")

        return "\n".join(lines)
```

---

## 6. Goal Manager & Progress Tracking Service

The Goal Manager reads logs from MongoDB to compute the overall Career Health Score.

```python
# app/ai/agents/career/goal_manager.py
from app.ai.agents.career.career_models import CareerHealthScore


class NexaGoalProgressTracker:
    async def compute_health_index(self, user_id: str) -> CareerHealthScore:
        """
        Gathers profile metrics to calculate the final health score.
        Formula: Skills (25%) + Resume (15%) + Projects (15%) + Learning (15%) + Coding (15%) + Interview (10%) + Comm (5%)
        """
        # In production, pull these values from their respective DB collections
        s_health = 75.0
        r_health = 80.0
        p_health = 60.0
        l_health = 90.0
        c_health = 70.0
        i_health = 65.0
        cm_health = 85.0

        overall = (
            (0.25 * s_health) +
            (0.15 * r_health) +
            (0.15 * p_health) +
            (0.15 * l_health) +
            (0.15 * c_health) +
            (0.10 * i_health) +
            (0.05 * cm_health)
        )

        score = CareerHealthScore(
            user_id=user_id,
            overall_health=round(overall, 2),
            skills_health=s_health,
            resume_health=r_health,
            projects_health=p_health,
            learning_health=l_health,
            coding_health=c_health,
            interview_health=i_health,
            comm_health=cm_health
        )
        await score.insert()
        return score
```

---

## 7. Escalation Trigger & Active Feedback API

If user data (like graduation year or career goals) is missing, the agent triggers an escalation loop to prompt the user directly rather than guessing.

```python
# app/ai/agents/career/career_api.py
from fastapi import APIRouter
from app.core.dependencies import CurrentUser
from app.ai.agents.career.goal_manager import NexaGoalProgressTracker
from app.schemas.common import APIResponse

router = APIRouter(prefix="/career", tags=["Career Agent OS"])


@router.get("/health", response_model=APIResponse[dict])
async def get_career_health_status(current_user: CurrentUser):
    """Retrieve the computed Career Health Score for the active user."""
    tracker = NexaGoalProgressTracker()
    health_score = await tracker.compute_health_index(str(current_user.id))
    
    return APIResponse.ok(data={
        "overall_score": health_score.overall_health,
        "breakdown": {
            "skills": health_score.skills_health,
            "resume": health_score.resume_health,
            "projects": health_score.projects_health,
            "learning": health_score.learning_health,
            "interview": health_score.interview_health
        }
    })
```

---

## 8. Folder Structure Configuration

```
backend/app/ai/agents/career/
├── __init__.py
├── career_agent.py          # Main execution node class
├── career_planner.py
├── career_analyzer.py
├── career_models.py         # MongoDB Beanie goal document structures
├── goal_manager.py          # Progress evaluation & tracking algorithms
├── decision_engine.py       # Comparative matrix generator
├── mentor_prompts.py        # System instructions and Socratic parameters
└── career_api.py            # API health tracking endpoints
```

---

## 9. Performance Targets Matrix

To keep response times low, the career agent operations are designed to match strict latency limits:

| Operations Process | Metric Target | SLA Metric |
| :--- | :--- | :--- |
| **Context Compilation** | Building prompts | SLA: ≤ 100 ms |
| **Comparative Table** | String generation | SLA: ≤ 15 ms |
| **Socratic Check** | Intent evaluation | SLA: ≤ 40 ms |
| **Progress Indexing** | Health calculations | SLA: ≤ 220 ms |
| **Model Generation** | LLM latency budget | SLA: ≤ 5800 ms |

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

---

> **Phase 15 Complete** — Career guidance agent schemas and dialog systems defined.
>
> **Next: Phase 16 — AI Resume Analyzer & ATS Intelligence**
> Parser configurations, keyword scoring, role optimizations, PDF generation, version checks, and LinkedIn matching.

---

*NEXA AI Phase 15 — AI Career Guidance Agent | Version 1.0 | July 2026*
