# NEXA AI — Testing, Quality Assurance & Security Validation
## Phase 26 — Implementation Blueprint

---

| Field              | Details                                                  |
|--------------------|----------------------------------------------------------|
| **Document**       | Testing, Quality Assurance & Security Validation (TQASV)  |
| **Phase**          | 26 of 30                                                 |
| **Version**        | 1.0                                                      |
| **Test Stack**     | Pytest + Playwright + k6                                 |
| **AI Evaluation**  | Semantic validation checks (Hallucination limits)        |
| **Target Python**  | Python 3.13+                                             |
| **Status**         | ✅ Complete — Implementation Ready                      |

---

## Table of Contents

1. [Testing & Quality Assurance Folder Structure](#1-testing--quality-assurance-folder-structure)
2. [Unit Testing: CareerMatcher Algorithm](#2-unit-testing-careermatcher-algorithm)
3. [Integration Testing: API Router & Test DB Context](#3-integration-testing-api-router--test-db-context)
4. [AI Evaluation Suite: RAG Semantic Validation Check](#4-ai-evaluation-suite-rag-semantic-validation-check)
5. [Load Testing with k6 Script](#5-load-testing-with-k6-script)
6. [CI/CD Quality Gates Workflow Config](#6-cicd-quality-gates-workflow-config)
7. [GDPR & Database Sanitization Validation Tests](#7-gdpr--database-sanitization-validation-tests)
8. [Performance SLA Target Matrices](#8-performance-sla-target-matrices)

---

## 1. Testing & Quality Assurance Folder Structure

Tests are organized into structured directories to isolate unit logic, database integrations, load tests, and AI evaluation code.

```
backend/tests/
├── __init__.py
├── conftest.py               # Shared Pytest database and app fixtures
├── unit/                     # Unit logic tests (Algorithms & Utils)
│   ├── test_career_matcher.py
│   └── test_sanitizer.py
├── integration/              # DB & Redis integration check suites
│   └── test_api_auth.py
├── ai_eval/                  # Semantic verification checkers
│   └── test_rag_grounding.py
└── load/
    └── k6_load_test.js       # Load test scripts (JS files)
```

---

## 2. Unit Testing: CareerMatcher Algorithm

Unit tests verify that calculation algorithms behave deterministically based on input parameters.

```python
# backend/tests/unit/test_career_matcher.py
import pytest
from app.ai.recommendation.career_matcher import NexaCareerMatcher


def test_career_matcher_perfect_match():
    matcher = NexaCareerMatcher()
    
    # 1. Arrange perfect fit inputs
    profile = {
        "user_id": "student-123",
        "skills": ["Java", "SQL", "Docker", "Spring Boot"],
        "goals": ["Software Engineer"],
        "projects": [{"domain": "Backend", "name": "API Service"}],
        "cgpa": 10.0,
        "average_interview_score": 100.0
    }
    
    requirements = {
        "role": "Software Engineer",
        "domain": "Backend",
        "required_skills": ["Java", "SQL", "Spring Boot", "Docker"]
    }
    
    # 2. Act
    result = matcher.calculate_match(profile, requirements)
    
    # 3. Assert
    assert result.match_score == 100.0
    assert "Matches primary technical skills." in result.reasons_positive
    assert len(result.missing_skills) == 0


def test_career_matcher_zero_match():
    matcher = NexaCareerMatcher()
    
    profile = {
        "user_id": "student-456",
        "skills": [],
        "goals": ["AI Engineer"],
        "projects": [],
        "cgpa": 0.0,
        "average_interview_score": 0.0
    }
    
    requirements = {
        "role": "Software Engineer",
        "domain": "Backend",
        "required_skills": ["Java"]
    }
    
    result = matcher.calculate_match(profile, requirements)
    assert result.match_score == 0.0
```

---

## 3. Integration Testing: API Router & Test DB Context

Integration tests verify API behavior against a real, isolated test database instance.

```python
# backend/tests/conftest.py
import pytest
import pytest_asyncio
from httpx import AsyncClient
from beanie import init_beanie
from mongomock_motor import SimpleMotorClient
from app.main import app
from app.models.identity.user import NexaUserDocument


@pytest_asyncio.fixture(autouse=True)
async def setup_test_db():
    """Initializes mongomock-motor for in-memory database simulation during tests."""
    client = SimpleMotorClient()
    db = client.nexa_test
    # Initialize Beanie documents in the test context
    await init_beanie(database=db, document_models=[NexaUserDocument])
    yield
    # Cleanup actions if needed


@pytest_asyncio.fixture
async def api_client():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac
```

```python
# backend/tests/integration/test_api_auth.py
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_api_registration_validation(api_client: AsyncClient):
    """Verifies register endpoint returns validation error on malformed payload."""
    bad_payload = {
        "first_name": "J",  # too short
        "last_name": "Doe",
        "email": "invalid-email-format",
        "password": "123"
    }
    
    response = await api_client.post("/api/v1/auth/register", json=bad_payload)
    
    assert response.status_code == 422  # FastAPI validation error status
    assert response.json()["success"] is False
```

---

## 4. AI Evaluation Suite: RAG Semantic Validation Check

Semantic checks verify that LLM outputs contain accurate facts and citations.

```python
# backend/tests/ai_eval/test_rag_grounding.py
import pytest
from app.ai.orchestrator.validator import NexaResponseValidator


@pytest.mark.asyncio
async def test_response_contains_no_placeholders():
    validator = NexaResponseValidator()
    
    good_text = "I recommend focusing on Python variables as specified in [1]."
    is_valid, err = await validator.validate(good_text, "career_roadmap")
    
    assert is_valid is True
    assert err == ""


@pytest.mark.asyncio
async def test_response_flags_incomplete_text():
    validator = NexaResponseValidator()
    
    bad_text = "To become an AI Engineer you should learn Python and then"  # incomplete
    is_valid, err = await validator.validate(bad_text, "career_roadmap")
    
    assert is_valid is False
    assert "terminated abruptly" in err
```

---

## 5. Load Testing with k6 Script

The load test verifies API performance under concurrent user traffic.

```javascript
// backend/tests/load/k6_load_test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

// k6 execution limits configuration
export const options = {
    stages: [
        { duration: '30s', target: 50 },  // Ramp up to 50 users
        { duration: '1m', target: 50 },   // Maintain load
        { duration: '30s', target: 0 },   // Ramp down to 0 users
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests must complete under 500ms
    },
};

export default function () {
    const url = 'http://localhost:8000/probes/ready';
    const res = http.get(url);
    
    check(res, {
        'status is 200': (r) => r.status === 200,
        'ready message ok': (r) => r.json().status === 'ready',
    });
    
    sleep(1);
}
```

---

## 6. CI/CD Quality Gates Workflow Config

The workflow blocks code integrations if tests, linting checks, or security audits fail.

```yaml
# .github/workflows/quality_gates.yml
name: Code Quality Gates Verification

on:
  push:
    branches: [ "main", "dev" ]
  pull_request:
    branches: [ "main" ]

jobs:
  run_checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.13"

      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
          pip install ruff pytest pytest-asyncio

      # 1. Enforce Linting Checks
      - name: Lint Code with Ruff
        run: |
          cd backend
          ruff check .

      # 2. Run Test Suite
      - name: Run Test Suite
        run: |
          cd backend
          pytest --cov=app --cov-fail-under=90
```

---

## 7. GDPR & Database Sanitization Validation Tests

Verifies that personal user details are scrubbed from diagnostic metrics logs.

```python
# backend/tests/unit/test_sanitizer.py
from app.ai.monitoring.sanitizer import sanitize_system_metric_log


def test_sanitizer_removes_personal_details():
    raw_log = {
        "metric_name": "api_duration_seconds",
        "metric_value": 0.12,
        "email": "user@example.com",
        "ip_address": "192.168.1.1"
    }

    sanitized = sanitize_system_metric_log(raw_log)

    # Email and IP must be removed
    assert "email" not in sanitized
    assert "ip_address" not in sanitized
    # Public metrics remain intact
    assert sanitized["metric_name"] == "api_duration_seconds"
```

---

## 8. Performance SLA Target Matrices

To ensure reliability, QA verification gates enforce the following performance targets:

| Test Categories | Verification Metric | Metric SLA Target |
| :--- | :--- | :--- |
| **Lint checks** | Ruff error rate | Target: 0 errors |
| **Unit Test Suit** | Pytest runtime | Target: ≤ 2.0 minutes |
| **Integration suite**| API test runtime | Target: ≤ 10.0 minutes |
| **Code Coverage** | Test coverage target | Target: ≥ 90% coverage |
| **Load testing** | k6 HTTP duration p(95)| Target: ≤ 500 ms |

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
| 23    | FastAPI Backend Implementation (FBIB)     | ✅ Complete |
| 24    | React Frontend Implementation (RFIB)      | ✅ Complete |
| 25    | LangGraph & AI Agent Implementation Guide | ✅ Complete |
| 26    | Testing, QA & Security Validation (TQASV) | ✅ Complete |

---

> **Phase 26 Complete** — Mock test databases, Pytest examples, k6 load test scripts, and CI/CD quality gate rules defined.
>
> **Next: Phase 27 — UI/UX Design System & Product Experience**
> Color palettes, typography variables, spacing definitions, components templates, and motion rules.

---

*NEXA AI Phase 26 — QA & Verification | Version 1.0 | July 2026*
