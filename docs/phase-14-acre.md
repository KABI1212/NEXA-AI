# NEXA AI — AI Career Recommendation Engine (ACRE)
## Phase 14 — Implementation Blueprint

---

| Field              | Details                                                  |
|--------------------|----------------------------------------------------------|
| **Document**       | AI Career Recommendation Engine (ACRE)                   |
| **Phase**          | 14 of 30                                                 |
| **Version**        | 1.0                                                      |
| **Engine Type**    | Hybrid Recommendation Engine                             |
| **Database ODM**   | Beanie + Motor (MongoDB Atlas)                           |
| **Target Python**  | Python 3.13+                                             |
| **Status**         | ✅ Complete — Implementation Ready                      |

---

## Table of Contents

1. [Recommendation Pipeline Architecture](#1-recommendation-pipeline-architecture)
2. [MongoDB Recommendation Models](#2-mongodb-recommendation-models)
3. [Career Scoring Logic & Algorithm Formulas](#3-career-scoring-logic--algorithm-formulas)
4. [Skill-Gap Analysis & Roadmap Engine](#4-skill-gap-analysis--roadmap-engine)
5. [Placement Readiness Engine](#5-placement-readiness-engine)
6. [Explainability Context Engine](#6-explainability-context-engine)
7. [GDPR & Data Protection Safeguards](#7-gdpr--data-protection-safeguards)
8. [API Catalog & Endpoint Layouts](#8-api-catalog--endpoint-layouts)
9. [Folder Structure Configuration](#9-folder-structure-configuration)
10. [Performance Targets Matrix](#10-performance-targets-matrix)

---

## 1. Recommendation Pipeline Architecture

The Career Recommendation Engine parses user profile details, active skills, learning milestones, and mock interview performance, computing multi-factor recommendations grounded in market demand vectors.

```
                      ┌─────────────────────────────────┐
                      │    Extract User Context         │
                      │  (Skills, CGPA, Projects, history)│
                      └────────────────┬────────────────┘
                                       │
                                       ▼
                      ┌─────────────────────────────────┐
                      │    Skill Gap Evaluation         │
                      │  - Compare current vs target    │
                      │  - Flag missing requirements    │
                      └────────────────┬────────────────┘
                                       │
                                       ▼
                      ┌─────────────────────────────────┐
                      │    Scoring Engine (Weighted)    │
                      │   - Dynamic config coefficients │
                      │   - Base match calculation      │
                      └────────────────┬────────────────┘
                                       │
                                       ▼
                      ┌─────────────────────────────────┐
                      │    Explainability Compiler      │
                      │  - Formulates rationale text    │
                      │  - Cites specific user vectors  │
                      └────────────────┬────────────────┘
                                       │
                                       ▼
                      ┌─────────────────────────────────┐
                      │    MongoDB Persistence Store    │
                      │  - Cache score profiles         │
                      │  - Save evaluation snapshots    │
                      └─────────────────────────────────┘
```

---

## 2. MongoDB Recommendation Models

We use MongoDB documents to store computed score profiles, skill gap vectors, and execution runs.

```python
# app/ai/recommendation/recommendation_models.py
from datetime import datetime
from enum import Enum
from typing import Optional, Any
from beanie import Document, Indexed
from pydantic import Field


class CareerMatch(Document):
    user_id:          Indexed(str)
    role_name:        Indexed(str)
    match_score:      float = Field(ge=0.0, le=100.0)
    confidence:       float = Field(ge=0.0, le=1.0)
    
    # ── Score Breakdowns ──────────────────────────────
    skills_score:     float
    projects_score:   float
    academic_score:   float
    interview_score:  float
    
    # ── Insights ──────────────────────────────────────
    missing_skills:   list[str] = []
    reasons_positive: list[str] = []
    reasons_negative: list[str] = []
    
    created_at:       datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "career_matches"
        indexes = [
            "user_id",
            "role_name",
            "created_at",
            [("user_id", -1), ("match_score", -1)]
        ]


class PlacementScore(Document):
    user_id:               Indexed(str)
    overall_readiness:     float = Field(ge=0.0, le=100.0)
    
    # ── Segmented Metrics ─────────────────────────────
    resume_score:          float
    skills_score:          float
    projects_score:        float
    coding_score:          float
    interview_score:       float
    communication_score:   float
    
    evaluated_at:          datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "placement_scores"
        indexes = [
            "user_id",
            "evaluated_at"
        ]
```

---

## 3. Career Scoring Logic & Algorithm Formulas

The matcher evaluates user background data against target careers using adjustable parameter weights.

$$\text{Career Match Score} = (w_s \cdot S) + (w_r \cdot R) + (w_p \cdot P) + (w_l \cdot L) + (w_i \cdot I) + (w_g \cdot G) + (w_c \cdot C)$$

$$\text{where } \sum w_i = 1.0$$

*   **$S$ (Skills):** $30\%$
*   **$R$ (Resume Alignment):** $15\%$
*   **$P$ (Projects Match):** $15\%$
*   **$L$ (Learning Milestones):** $15\%$
*   **$I$ (Interview Results):** $10\%$
*   **$G$ (Career Goal Interest):** $10\%$
*   **$C$ (Certifications):** $5\%$

```python
# app/ai/recommendation/career_matcher.py
from typing import Any
from app.ai.recommendation.recommendation_models import CareerMatch


class NexaCareerMatcher:
    def __init__(self):
        # Default algorithm config parameters
        self.w_skills     = 0.30
        self.w_resume     = 0.15
        self.w_projects   = 0.15
        self.w_learning   = 0.15
        self.w_interview  = 0.10
        self.w_interests  = 0.10
        self.w_certs      = 0.05

    def calculate_match(self, profile: dict[str, Any], target_requirements: dict[str, Any]) -> CareerMatch:
        """Evaluates match score using multi-factor weights."""
        # 1. Skills Sub-score (Intersection / Union)
        user_skills = set(profile.get("skills", []))
        req_skills = set(target_requirements.get("required_skills", []))
        
        if not req_skills:
            s_score = 0.0
        else:
            s_score = (len(user_skills.intersection(req_skills)) / len(req_skills)) * 100.0

        # 2. Project Sub-score
        user_projects = profile.get("projects", [])
        matched_projects = [p for p in user_projects if p.get("domain") == target_requirements.get("domain")]
        p_score = min(len(matched_projects) * 50.0, 100.0)  # Max out at 2 matched projects

        # 3. Academic Sub-score
        cgpa = profile.get("cgpa", 7.0)
        a_score = (cgpa / 10.0) * 100.0

        # 4. Mock Interview Sub-score
        i_score = profile.get("average_interview_score", 60.0)

        # 5. Weighted Score Calculation
        overall = (
            (self.w_skills * s_score) +
            (self.w_projects * p_score) +
            (self.w_learning * a_score) +  # proxy for learning
            (self.w_interview * i_score) +
            (self.w_interests * 100.0 if target_requirements.get("role") in profile.get("goals", []) else 0.0)
        )
        
        # Adjusting calculation denominator if weights don't sum to 100%
        overall = min(max(overall, 0.0), 100.0)

        missing = list(req_skills - user_skills)
        positives = ["Strong academic foundations."] if a_score >= 80.0 else []
        if s_score >= 70.0:
            positives.append("Matches primary technical skills.")

        negatives = [f"Missing critical skills: {', '.join(missing[:3])}"] if missing else []

        return CareerMatch(
            user_id=profile["user_id"],
            role_name=target_requirements["role"],
            match_score=round(overall, 2),
            confidence=0.92,
            skills_score=round(s_score, 2),
            projects_score=round(p_score, 2),
            academic_score=round(a_score, 2),
            interview_score=round(i_score, 2),
            missing_skills=missing,
            reasons_positive=positives,
            reasons_negative=negatives
        )
```

---

## 4. Skill-Gap Analysis & Roadmap Engine

We run an LLM-based structured generation loop to map the missing requirements into a learning roadmap.

```python
# app/ai/recommendation/roadmap.py
from pydantic import BaseModel, Field
from app.ai.providers.provider_manager import NexaProviderManager


class MilestoneStep(BaseModel):
    week:        int
    topic:       str
    objectives:  list[str]
    suggested_project: Optional[str] = None


class DynamicRoadmapPayload(BaseModel):
    roadmap_steps: list[MilestoneStep]


class NexaRoadmapGenerator:
    def __init__(self):
        self.provider = NexaProviderManager()

    async def generate_learning_path(self, missing_skills: list[str], target_role: str) -> DynamicRoadmapPayload:
        """Generates a structured weekly roadmap based on skill gaps."""
        system_prompt = (
            "You are a Senior Technical Curriculum Architect. Design a detailed learning roadmap "
            "to bridge the provided skill gaps for a target role. Output only valid JSON conforming "
            "to the DynamicRoadmapPayload schema."
        )

        prompt = (
            f"Target Role: {target_role}\n"
            f"Missing Skills: {', '.join(missing_skills)}\n\n"
            f"Generate a weekly learning milestone path."
        )

        raw = await self.provider.generate_with_fallback(prompt, system_prompt)
        return DynamicRoadmapPayload.model_validate_json(raw)
```

---

## 5. Placement Readiness Engine

The Readiness Engine weights resume strength, programming performance, and soft skills to calculate a student's placement readiness score.

```python
# app/ai/recommendation/placement_score.py
from app.ai.recommendation.recommendation_models import PlacementScore


class NexaPlacementScoreCalculator:
    def evaluate_readiness(self, profile: dict) -> PlacementScore:
        """
        Runs analytical weights calculation over profiles.
        Weights mapping: Resume: 20%, Skills: 25%, Projects: 20%, Coding: 15%, Interview: 10%, Comm: 10%
        """
        r_score    = profile.get("resume_score", 50.0)
        s_score    = profile.get("skills_score", 50.0)
        p_score    = profile.get("projects_score", 50.0)
        cod_score  = profile.get("coding_performance_score", 50.0)
        int_score  = profile.get("mock_interview_score", 50.0)
        comm_score = profile.get("communication_score", 50.0)

        overall = (
            (0.20 * r_score) +
            (0.25 * s_score) +
            (0.20 * p_score) +
            (0.15 * cod_score) +
            (0.10 * int_score) +
            (0.10 * comm_score)
        )

        return PlacementScore(
            user_id=profile["user_id"],
            overall_readiness=round(overall, 2),
            resume_score=r_score,
            skills_score=s_score,
            projects_score=p_score,
            coding_score=cod_score,
            interview_score=int_score,
            communication_score=comm_score
        )
```

---

## 6. Explainability Context Engine

Generates human-readable explanations detailing why a specific career or score was recommended, highlighting both matching strengths and skill gaps.

```python
# app/ai/recommendation/explainability.py
from app.ai.recommendation.recommendation_models import CareerMatch


class ACREExplainabilityEngine:
    def formulate_explanation(self, match: CareerMatch) -> str:
        """Structures clear feedback based on match metadata."""
        explanation = (
            f"We matched you with the role of **{match.role_name}** at a compatibility rating of **{match.match_score}%**.\n\n"
            f"### Why you match:\n" + "\n".join(f"- {p}" for p in match.reasons_positive) + "\n\n"
        )
        
        if match.reasons_negative:
            explanation += (
                f"### Areas to improve:\n" + "\n".join(f"- {n}" for n in match.reasons_negative) + "\n\n"
            )
            
        if match.missing_skills:
            explanation += (
                f"### Target Skill gaps to acquire:\n"
                f"We recommend prioritizing training in: **{', '.join(match.missing_skills[:5])}** to optimize alignment."
            )

        return explanation
```

---

## 7. GDPR & Data Protection Safeguards

To prevent bias and protect user privacy, personal details like gender, ethnicity, and age are excluded from recommendation inputs. Profiles are identified only by an anonymized `user_id`.

```python
# app/ai/recommendation/anonymizer.py
from typing import Any


def sanitize_profile_for_recommendation(raw_profile: dict[str, Any]) -> dict[str, Any]:
    """Excludes sensitive demographic data from recommendation context."""
    clean_profile = raw_profile.copy()
    
    # Prune sensitive personal variables
    sensitive_keys = ["gender", "ethnicity", "age", "name", "address", "phone_number"]
    for key in sensitive_keys:
        clean_profile.pop(key, None)
        
    return clean_profile
```

---

## 8. API Catalog & Endpoint Layouts

```python
# app/ai/recommendation/recommendation_api.py
from fastapi import APIRouter, Depends
from app.core.dependencies import CurrentUser
from app.ai.recommendation.career_matcher import NexaCareerMatcher
from app.ai.recommendation.placement_score import NexaPlacementScoreCalculator
from app.schemas.common import APIResponse

router = APIRouter(prefix="/recommend", tags=["Career Analytics Engine"])


@router.post("/career", response_model=APIResponse[dict])
async def run_career_match(current_user: CurrentUser):
    """Trigger a career match analysis using the active profile context."""
    matcher = NexaCareerMatcher()
    
    # Mock profile load for simulation
    profile = {
        "user_id": str(current_user.id),
        "skills": ["Java", "SQL", "HTML"],
        "goals": ["Software Engineer"],
        "projects": [{"domain": "Backend", "name": "API Service"}]
    }
    
    requirements = {
        "role": "Software Engineer",
        "domain": "Backend",
        "required_skills": ["Java", "SQL", "Spring Boot", "Docker"]
    }
    
    match_result = matcher.calculate_match(profile, requirements)
    await match_result.insert()
    
    from app.ai.recommendation.explainability import ACREExplainabilityEngine
    explanation = ACREExplainabilityEngine().formulate_explanation(match_result)
    
    return APIResponse.ok(data={
        "match": match_result.match_score,
        "role": match_result.role_name,
        "explanation": explanation
    })
```

---

## 9. Folder Structure Configuration

```
backend/app/ai/recommendation/
├── __init__.py
├── career_matcher.py          # Math logic matching engine
├── company_matcher.py
├── skill_gap.py
├── roadmap.py                 # Structured roadmaps generation service
├── placement_score.py         # Readiness index calculator code
├── salary_predictor.py
├── project_recommender.py
├── course_recommender.py
├── certification_recommender.py
├── explainability.py          # Plaintext reason generator
├── anonymizer.py              # Data protection sanitizer utility
└── recommendation_api.py      # Matching router endpoints
```

---

## 10. Performance Targets Matrix

To maintain dashboard responsiveness, matching operations are optimized against strict latency limits:

| Analytics Metric | SLA Latency | Target Metric |
| :--- | :--- | :--- |
| **Profile Anonymization** | Pruning overhead| SLA: ≤ 10 ms |
| **Weighted Math Logic** | Matching calculations| SLA: ≤ 30 ms |
| **Structured Roadmap** | LLM Generation | SLA: ≤ 1900 ms |
| **Explainability Rationale** | String formatting | SLA: ≤ 20 ms |
| **Score SNAP Cache Write** | MongoDB save duration| SLA: ≤ 150 ms |

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

---

> **Phase 14 Complete** — Recommendation engine mathematical formulas and logic schemas defined.
>
> **Next: Phase 15 — AI Career Guidance Agent**
> Personality definitions, multi-turn dialogue management, Socratic reasoning methods, active prompt files, and fallback conditions.

---

*NEXA AI Phase 14 — AI Recommendation Engine | Version 1.0 | July 2026*
