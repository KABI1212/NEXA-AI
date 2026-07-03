# NEXA AI — AI Feedback & System Intelligence Platform (FCLSIP)
## Phase 19 — Implementation Blueprint

---

| Field              | Details                                                  |
|--------------------|----------------------------------------------------------|
| **Document**       | AI Feedback & System Intelligence Platform (FCLSIP)      |
| **Phase**          | 19 of 30                                                 |
| **Version**        | 1.0                                                      |
| **Framework**      | FastAPI 0.115 + Prometheus Client                        |
| **Architecture**   | AI Intelligence Center (AIC) Framework                   |
| **Target Python**  | Python 3.13+                                             |
| **Status**         | ✅ Complete — Implementation Ready                      |

---

## Table of Contents

1. [AI Intelligence Center (AIC) Architecture](#1-ai-intelligence-center-aic-architecture)
2. [MongoDB Feedback & Analytics Models](#2-mongodb-feedback--analytics-models)
3. [User Feedback Evaluation & Sentiment Analyzer](#3-user-feedback-evaluation--sentiment-analyzer)
4. [Prompt A/B Testing & Dynamic Router Engine](#4-prompt-ab-testing--dynamic-router-engine)
5. [Prometheus Metrics Registrar & OpenTelemetry Mapping](#5-prometheus-metrics-registrar--opentelemetry-mapping)
6. [GDPR & Data Protection Sanitization Policies](#6-gdpr--data-protection-sanitization-policies)
7. [API Route Catalog & Feedback Endpoints](#7-api-route-catalog--feedback-endpoints)
8. [Folder Structure Configuration](#8-folder-structure-configuration)
9. [Performance SLA Benchmarks](#9-performance-sla-benchmarks)

---

## 1. AI Intelligence Center (AIC) Architecture

The Feedback and System Intelligence modules coordinate tasks across four specialized intelligence domains to monitor system logs, track prompt versions, and capture user ratings.

```
┌────────────────────────────────────────────────────────┐
│                   System Intelligence                  │
│ - API Latency Metrics            - DB Connection Pool  │
└───────────────────────────┬────────────────────────────┘
                            │
┌────────────────────────────────────────────────────────┐
│                     AI Intelligence                    │
│ - Prompt A/B Routing             - Agent Performance   │
└───────────────────────────┬────────────────────────────┘
                            │
┌────────────────────────────────────────────────────────┐
│                    User Intelligence                   │
│ - Explicit Feedback Rating       - Sentiment Check     │
└───────────────────────────┬────────────────────────────┘
                            │
┌────────────────────────────────────────────────────────┐
│                  Business Intelligence                 │
│ - User Growth                    - Placement Trends    │
└────────────────────────────────────────────────────────┘
```

---

## 2. MongoDB Feedback & Analytics Models

We use MongoDB documents to store user ratings, prompt test configurations, and operational snapshots.

```python
# app/intelligence/feedback/feedback_models.py
from datetime import datetime
from enum import Enum
from typing import Optional, Any
from beanie import Document, Indexed
from pydantic import Field


class SentimentType(str, Enum):
    POSITIVE     = "positive"
    CONSTRUCTIVE = "constructive"
    NEGATIVE     = "negative"
    NEUTRAL      = "neutral"


class FeedbackItem(Document):
    user_id:        Indexed(str)
    interaction_id: Indexed(str)
    rating:         int = Field(ge=1, le=5)
    comment:        Optional[str] = None
    sentiment:      SentimentType = SentimentType.NEUTRAL
    metadata:       dict[str, Any] = {}
    created_at:     datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "user_feedbacks"
        indexes = [
            "user_id",
            "interaction_id",
            "rating",
            "created_at"
        ]


class PromptVersion(Document):
    agent_name:      Indexed(str)
    version_tag:     str                                       # e.g., "v1.2_system"
    prompt_template: str
    is_active:       bool = True
    usage_count:     int = 0
    success_rating:  float = 1.0                               # calculated rating average
    created_at:      datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "prompt_versions"
        indexes = [
            "agent_name",
            "version_tag"
        ]


class SystemMetricSnapshot(Document):
    metric_name: Indexed(str)
    metric_value: float
    dimensions:  dict[str, str] = {}
    timestamp:   Indexed(datetime) = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "system_metric_snapshots"
        indexes = [
            "metric_name",
            "timestamp"
        ]
```

---

## 3. User Feedback Evaluation & Sentiment Analyzer

Categorizes user comment fields using JSON structured analysis blocks.

```python
# app/intelligence/feedback/evaluator.py
from pydantic import BaseModel, Field
from app.ai.providers.provider_manager import NexaProviderManager
from app.intelligence.feedback.feedback_models import SentimentType


class SentimentAnalysisResult(BaseModel):
    sentiment:  SentimentType
    score:      float = Field(ge=-1.0, le=1.0, description="Sentiment polarity score")
    key_phrases: list[str] = []
    urgency:    bool = Field(description="True if critical issue requires admin action")


class NexaFeedbackEvaluator:
    def __init__(self):
        self.provider = NexaProviderManager()

    async def analyze_sentiment(self, comment: str) -> SentimentAnalysisResult:
        """Analyzes review comments to extract sentiment polarity and key phrases."""
        system_prompt = (
            "You are an expert user sentiment analysis bot. Analyze the user's feedback comment "
            "to determine the sentiment type, polarity score, key phrases, and urgency flag. "
            "Return only valid JSON matching the SentimentAnalysisResult schema."
        )

        prompt = f"User Comment: {comment}\n"
        
        raw = await self.provider.generate_with_fallback(prompt, system_prompt)
        return SentimentAnalysisResult.model_validate_json(raw)
```

---

## 4. Prompt A/B Testing & Dynamic Router Engine

The testing engine directs users to different prompt versions (e.g. A vs B) to compare performance.

```python
# app/intelligence/prompt_testing/router.py
import hashlib
from typing import Optional
from app.intelligence.feedback.feedback_models import PromptVersion


class NexaABPromptRouter:
    async def get_target_prompt(self, agent_name: str, user_id: str) -> Optional[PromptVersion]:
        """Dynamically route user to prompt versions based on a deterministic hash of their user_id."""
        active_versions = await PromptVersion.find(
            PromptVersion.agent_name == agent_name,
            PromptVersion.is_active == True
        ).to_list()

        if not active_versions:
            return None

        # Sort to ensure stable hashing order
        active_versions = sorted(active_versions, key=lambda v: v.version_tag)
        
        # Consistent mapping allocation using SHA-256
        hash_val = int(hashlib.sha256(user_id.encode()).hexdigest(), 16)
        target_index = hash_val % len(active_versions)
        
        selected = active_versions[target_index]
        await selected.update({"$inc": {"usage_count": 1}})
        return selected
```

---

## 5. Prometheus Metrics Registrar & OpenTelemetry Mapping

Provides metric counters to export monitoring parameters to Prometheus.

```python
# app/intelligence/metrics/prometheus_client.py
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST
from fastapi import Response

# ── API Counters ──────────────────────────────────
API_REQUEST_COUNTER = Counter(
    "nexa_api_requests_total",
    "Total incoming API requests",
    ["method", "endpoint", "status"]
)

# ── Latency Histograms ────────────────────────────
AI_LATENCY_HISTOGRAM = Histogram(
    "nexa_ai_latency_seconds",
    "AI response generation latency in seconds",
    ["agent_name", "provider"]
)


def get_prometheus_metrics_payload() -> Response:
    """Exports metrics values in Prometheus format."""
    return Response(
        content=generate_latest(),
        media_type=CONTENT_TYPE_LATEST
    )
```

---

## 6. GDPR & Data Protection Sanitization Policies

Ensures operational metrics and diagnostic logs do not contain personal user details.

```python
# app/intelligence/monitoring/sanitizer.py
from typing import Any


def sanitize_system_metric_log(payload: dict[str, Any]) -> dict[str, Any]:
    """Filters sensitive parameters out of diagnostic records."""
    clean_log = payload.copy()
    
    # Prune user metadata to anonymize the logs
    keys_to_remove = ["email", "username", "ip_address", "client_secrets"]
    for key in keys_to_remove:
        clean_log.pop(key, None)
        
    return clean_log
```

---

## 7. API Route Catalog & Feedback Endpoints

```python
# app/intelligence/feedback_api.py
from fastapi import APIRouter
from app.core.dependencies import CurrentUser
from app.intelligence.feedback.feedback_models import FeedbackItem
from app.intelligence.feedback.evaluator import NexaFeedbackEvaluator
from app.schemas.common import APIResponse
from app.intelligence.metrics.prometheus_client import get_prometheus_metrics_payload

router = APIRouter(prefix="/intelligence", tags=["System Intelligence OS"])


@router.post("/feedback", response_model=APIResponse[dict])
async def submit_interaction_feedback(
    interaction_id: str,
    rating: int,
    comment: str,
    current_user: CurrentUser
):
    """Submits user feedback, runs sentiment checks, and saves details in MongoDB."""
    evaluator = NexaFeedbackEvaluator()
    analysis = await evaluator.analyze_sentiment(comment)

    item = FeedbackItem(
        user_id=str(current_user.id),
        interaction_id=interaction_id,
        rating=rating,
        comment=comment,
        sentiment=analysis.sentiment,
        metadata={
            "urgency": analysis.urgency,
            "polarity_score": analysis.score
        }
    )
    await item.insert()

    return APIResponse.ok(data={
        "feedback_id": str(item.id),
        "sentiment": item.sentiment.value,
        "urgency_flag": analysis.urgency
    })


@router.get("/metrics")
def expose_prometheus_metrics():
    """Endpoint consumed by Prometheus scrapers to collect system performance data."""
    return get_prometheus_metrics_payload()
```

---

## 8. Folder Structure Configuration

```
backend/app/intelligence/
├── __init__.py
├── feedback/
│   ├── __init__.py
│   ├── feedback_models.py      # User feedback Beanie schemas
│   └── evaluator.py            # Comment sentiment checker logic
├── analytics/
├── evaluation/
├── monitoring/
│   ├── __init__.py
│   └── sanitizer.py            # Log sanitization helpers
├── dashboards/
├── alerts/
├── metrics/
│   ├── __init__.py
│   └── prometheus_client.py    # Metric registrar counters
├── prompt_testing/
│   ├── __init__.py
│   └── router.py               # Deterministic A/B version router
├── quality/
└── feedback_api.py            # Router controller endpoints
```

---

## 9. Performance SLA Benchmarks

To avoid overhead, analytics operations are designed to match strict latency limits:

| Metric Step | SLA Target | Verification Target |
| :--- | :--- | :--- |
| **Sentiment Analysis** | LLM processing | Target: ≤ 1500 ms |
| **A/B Routing Hash** | User assignment | Target: ≤ 10 ms |
| **Metrics Registration** | Local counter updates| Target: ≤ 5 ms |
| **Prometheus Metrics Export**| String payload serialization| Target: ≤ 80 ms |
| **Feedback Log Write** | MongoDB save duration| Target: ≤ 120 ms |

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

---

> **Phase 19 Complete** — Feedback collection and system intelligence metrics defined.
>
> **Next: Phase 20 — Production Deployment, DevOps, Docker & Enterprise Operations**
> Dockerfiles, compose parameters, Nginx configuration, CI/CD pipelines, SSL checks, database backup steps, and scaling limits.

---

*NEXA AI Phase 19 — AI Intelligence | Version 1.0 | July 2026*
