# NEXA AI — AI Multi-Agent System Architecture (AMSA)
## Phase 10 — Implementation Blueprint

---

| Field              | Details                                                  |
|--------------------|----------------------------------------------------------|
| **Document**       | AI Multi-Agent System Architecture (AMSA)                |
| **Phase**          | 10 of 30                                                 |
| **Version**        | 1.0                                                      |
| **Orchestrator**   | LangGraph + LangChain                                    |
| **Storage Layers** | MongoDB Atlas (Long-term) + Redis (Short-term & Locks)   |
| **Vector DB**      | Qdrant (Semantic Search & RAG)                            |
| **Target Python**  | Python 3.13+                                             |
| **Status**         | ✅ Complete — Implementation Ready                      |

---

## Table of Contents

1. [Orchestrator Architecture & State Design](#1-orchestrator-architecture--state-design)
2. [Multi-Agent Workflows & Collaboration](#2-multi-agent-workflows--collaboration)
3. [Agent Schema Standard](#3-agent-schema-standard)
4. [AI Gateway Service](#4-ai-gateway-service)
5. [Agent Dispatcher](#5-agent-dispatcher)
6. [Shared AI Services: Memory & RAG](#6-shared-ai-services-memory--rag)
7. [The 16 Specialized Agents Catalog](#7-the-16-specialized-agents-catalog)
8. [Response Validation Filter](#8-response-validation-filter)
9. [Error & Fallback Handling](#9-error--fallback-handling)
10. [Folder Structure Details](#10-folder-structure-details)
11. [Performance & Verification Matrix](#11-performance--verification-matrix)

---

## 1. Orchestrator Architecture & State Design

NEXA AI leverages a state-centric multi-agent orchestrator built on **LangGraph**. The state is passed from node to node, containing the conversation history, parsed user intent, routing metadata, user profile data, and results collected from various specialized agents during a single execution run.

```
                          ┌──────────────────────────┐
                          │    User Request Input    │
                          └─────────────┬────────────┘
                                        │
                                        ▼
                          ┌──────────────────────────┐
                          │   Node: Intent_Analyzer  │
                          └─────────────┬────────────┘
                                        │
                                        ▼
                          ┌──────────────────────────┐
                          │  Node: Context_Builder   │
                          └─────────────┬────────────┘
                                        │
                                        ▼
                                 Route Decision
                                ╱              ╲
                   [Workflow: Career]        [Workflow: Resume]
                              ╱                  ╲
             ┌──────────────────────────┐      ┌──────────────────────────┐
             │ Node: Career_Agent       │      │ Node: Resume_Agent       │
             └────────────┬─────────────┘      └────────────┬─────────────┘
                          │                                 │
                          ▼                                 ▼
             ┌──────────────────────────┐      ┌──────────────────────────┐
             │ Node: Skill_Gap_Agent    │      │ Node: ATS_Agent          │
             └────────────┬─────────────┘      └────────────┬─────────────┘
                          │                                 │
                          ▼                                 ▼
             ┌──────────────────────────┐      ┌──────────────────────────┐
             │ Node: Roadmap_Agent      │      │ Node: Portfolio_Agent    │
             └────────────┬─────────────┘      └────────────┬─────────────┘
                          │                                 │
                          └────────────────┬────────────────┘
                                           │
                                           ▼
                          ┌──────────────────────────┐
                          │ Node: Response_Validator │
                          └─────────────┬────────────┘
                                        │
                                        ▼
                          ┌──────────────────────────┐
                          │    Node: Memory_Saver    │
                          └─────────────┬────────────┘
                                        │
                                        ▼
                          ┌──────────────────────────┐
                          │      Return to User      │
                          └──────────────────────────┘
```

### 1.1 State Schema definition

```python
# app/ai/orchestrator/state.py
from typing import Annotated, Any, Optional
from typing_extensions import TypedDict
from pydantic import BaseModel, Field


def merge_agent_results(left: dict[str, Any], right: dict[str, Any]) -> dict[str, Any]:
    """Reducer function to merge results dictionary in LangGraph State."""
    merged = left.copy()
    for key, value in right.items():
        if isinstance(value, list) and key in merged:
            merged[key] = merged[key] + value
        elif isinstance(value, dict) and key in merged:
            merged[key] = merge_agent_results(merged[key], value)
        else:
            merged[key] = value
    return merged


class UserContext(BaseModel):
    user_id:      str
    role:         str
    skills:       list[str] = []
    interests:    list[str] = []
    experience:   list[dict] = []
    roadmap_id:   Optional[str] = None
    has_resume:   bool = False


class AgentState(TypedDict):
    # ── Input & Session Metadata ──────────────────────
    user_id:         str
    session_id:      str
    user_message:    str
    history:         list[dict[str, Any]]
    
    # ── Extracted Profile Context ─────────────────────
    context:         UserContext
    
    # ── Orchestrator Metadata ─────────────────────────
    intent:          Optional[str]                      # e.g., "career_roadmap", "resume_review"
    required_agents: list[str]
    next_node:       str
    
    # ── Shared Agent Data Storage ──────────────────────
    # Merged incrementally by the custom reducer
    agent_results:   Annotated[dict[str, Any], merge_agent_results]
    
    # ── Final Output ──────────────────────────────────
    final_response:  Optional[str]
    validation_status: Optional[str]                    # "passed", "failed_retry", "failed_fallback"
```

---

## 2. Multi-Agent Workflows & Collaboration

Instead of ad-hoc interactions, NEXA AI defines clear DAG (Directed Acyclic Graph) workflows using LangGraph nodes. This structure makes execution highly predictable and trace-friendly for analytics and debugging.

### 2.1 Career Planning Workflow
Used when the user requests transition advice, roadmap creation, or job alignment.
* **Flow**: `Intent_Analyzer` ➜ `Context_Builder` ➜ `Career_Agent` ➜ `Skill_Gap_Agent` ➜ `Roadmap_Agent` ➜ `Recommendation_Agent` ➜ `Response_Generator` ➜ `Response_Validator` ➜ `Memory_Saver`.

### 2.2 Resume Improvement Workflow
Triggered when the user uploads a resume, requests scoring, or requests optimization.
* **Flow**: `Intent_Analyzer` ➜ `Context_Builder` ➜ `Resume_Agent` ➜ `ATS_Agent` ➜ `Portfolio_Agent` ➜ `Response_Generator` ➜ `Response_Validator` ➜ `Memory_Saver`.

### 2.3 Placement Preparation Workflow
Used when preparing for a specific company or target role.
* **Flow**: `Intent_Analyzer` ➜ `Context_Builder` ➜ `Company_Preparation_Agent` ➜ `Interview_Agent` ➜ `Feedback_Agent` ➜ `Response_Generator` ➜ `Response_Validator` ➜ `Memory_Saver`.

---

## 3. Agent Schema Standard

Every agent in the NEXA AI system must conform to a standardized protocol, ensuring the orchestrator and dispatcher can safely load, validate inputs, execute, and monitor outputs.

```python
# app/ai/agents/base.py
from abc import ABC, abstractmethod
from typing import Any, Type
from pydantic import BaseModel


class AgentOutput(BaseModel):
    success:          bool
    confidence_score: float
    data:             dict[str, Any]
    error_message:    Optional[str] = None


class BaseNexaAgent(ABC):
    @property
    @abstractmethod
    def name(self) -> str:
        """The identifier of the agent."""
        pass

    @property
    @abstractmethod
    def description(self) -> str:
        """Detailed description of the agent's capability (used for LLM routing)."""
        pass

    @property
    @abstractmethod
    def input_schema(self) -> Type[BaseModel]:
        """Pydantic model representing expected input parameters."""
        pass

    @property
    @abstractmethod
    def output_schema(self) -> Type[BaseModel]:
        """Pydantic model representing expected output data structure."""
        pass

    @abstractmethod
    async def execute(self, inputs: BaseModel, state: dict[str, Any]) -> AgentOutput:
        """Asynchronous execution routine of the agent."""
        pass
```

---

## 4. AI Gateway Service

The `AIGatewayService` is the central orchestration wrapper accessed by FastAPI controllers. It manages database transaction lifecycle, initial Redis checks, rate limiting constraints, provider selection, and response parsing.

```python
# app/ai/gateway/gateway.py
import time
from typing import Any, Optional
from fastapi import Request
from app.ai.orchestrator.graph import NexaOrchestratorGraph
from app.api.v1.auth.repository import AuthRepository
from app.core.redis_client import get_redis
from app.models.audit_log import AuditLog, AuditAction


class AIGatewayService:
    def __init__(self):
        self.auth_repo = AuthRepository()
        self.graph = NexaOrchestratorGraph().compile()

    async def process_message(
        self,
        user_id: str,
        session_id: str,
        message: str,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
    ) -> dict[str, Any]:
        start_time = time.time()
        
        # 1. Fetch User details for context
        user = await self.auth_repo.find_user_by_id(user_id)
        if not user:
            raise ValueError("User profile not found")

        # 2. Redis-based check for concurrent AI requests (distributed locks)
        redis = await get_redis()
        lock_key = f"ai:lock:{user_id}"
        is_locked = await redis.set(lock_key, "processing", ex=30, nx=True)
        if not is_locked:
            return {
                "success": False,
                "error": "CONCURRENT_REQUEST_LIMIT",
                "message": "AI is already processing a request from this account. Please wait."
            }

        try:
            # 3. Formulate the LangGraph State
            initial_state = {
                "user_id": user_id,
                "session_id": session_id,
                "user_message": message,
                "history": [],  # Fetched internally by memory node
                "context": {
                    "user_id": user_id,
                    "role": user.role.value,
                    "skills": user.permissions,  # placeholder
                    "interests": [],
                    "experience": [],
                    "has_resume": user.is_verified,
                },
                "required_agents": [],
                "agent_results": {},
                "final_response": None,
                "validation_status": None,
            }

            # 4. Invoke the LangGraph workflow graph
            result_state = await self.graph.ainvoke(initial_state)

            latency_ms = int((time.time() - start_time) * 1000)

            # 5. Record Usage Metrics
            audit = AuditLog(
                user_id=user_id,
                action=AuditAction.OAUTH_LOGIN,  # Placeholder for AI usage action
                ip_address=ip_address,
                user_agent=user_agent,
                metadata={
                    "session_id": session_id,
                    "intent": result_state.get("intent"),
                    "latency_ms": latency_ms,
                    "agents_used": result_state.get("required_agents", []),
                }
            )
            await audit.insert()

            return {
                "success": True,
                "response": result_state.get("final_response"),
                "intent": result_state.get("intent"),
                "latency_ms": latency_ms
            }

        finally:
            # Release lock
            await redis.delete(lock_key)
```

---

## 5. Agent Dispatcher

The dispatcher manages the async execution of the selected agents. When parallel nodes are encountered, it splits execution paths, runs agents using `asyncio.gather` within a sandboxed context, and wraps error events without terminating the orchestrator.

```python
# app/ai/gateway/dispatcher.py
import asyncio
from typing import Any
from app.ai.agents.base import BaseNexaAgent, AgentOutput
from app.core.exceptions import BaseNexaException


class AgentDispatcher:
    def __init__(self, agents_list: list[BaseNexaAgent]):
        self.agents_map = {agent.name: agent for agent in agents_list}

    async def dispatch_parallel(
        self, 
        agent_names: list[str], 
        state_inputs: dict[str, Any]
    ) -> dict[str, Any]:
        """Dispatches multiple specialized agents in parallel and gathers results."""
        tasks = []
        for name in agent_names:
            agent = self.agents_map.get(name)
            if agent:
                tasks.append(self._run_sandboxed_agent(agent, state_inputs))
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        merged_results = {}
        for name, res in zip(agent_names, results):
            if isinstance(res, Exception):
                merged_results[name] = {
                    "success": False,
                    "error": str(res)
                }
            elif isinstance(res, AgentOutput):
                merged_results[name] = {
                    "success": res.success,
                    "confidence": res.confidence_score,
                    "data": res.data,
                    "error": res.error_message
                }
        return merged_results

    async def _run_sandboxed_agent(self, agent: BaseNexaAgent, state: dict[str, Any]) -> AgentOutput:
        try:
            # Dynamically parse inputs based on target schemas
            inputs = agent.input_schema(**state.get("agent_results", {}))
            return await agent.execute(inputs, state)
        except Exception as e:
            return AgentOutput(
                success=False,
                confidence_score=0.0,
                data={},
                error_message=f"Execution error on agent {agent.name}: {str(e)}"
            )
```

---

## 6. Shared AI Services: Memory & RAG

### 6.1 Memory Service (Redis Semantic Memory Store)
Integrates a short-term conversational context engine stored in Redis alongside structural summaries of previous sessions synced with MongoDB.

```python
# app/ai/memory/memory_service.py
import json
from typing import Any, Optional
from app.core.redis_client import get_redis


class NexaMemoryService:
    def __init__(self):
        self.session_ttl = 3600 * 2  # 2 Hours active memory

    async def get_chat_history(self, session_id: str, limit: int = 10) -> list[dict[str, Any]]:
        redis = await get_redis()
        history_key = f"chat:history:{session_id}"
        items = await redis.lrange(history_key, 0, limit - 1)
        return [json.loads(item) for item in items]

    async def append_message(self, session_id: str, role: str, message: str) -> None:
        redis = await get_redis()
        history_key = f"chat:history:{session_id}"
        payload = {"role": role, "content": message, "timestamp": time.time()}
        await redis.lpush(history_key, json.dumps(payload))
        await redis.ltrim(history_key, 0, 49)  # Keep last 50 messages
        await redis.expire(history_key, self.session_ttl)
```

### 6.2 Vector Search Service (Qdrant RAG Service)
Handles document searching over course syllabus, curriculum maps, job templates, and matching guides.

```python
# app/ai/rag/retriever.py
from qdrant_client import AsyncQdrantClient
from app.config import settings


class NexaRAGRetriever:
    def __init__(self):
        self.client = AsyncQdrantClient(
            url=settings.QDRANT_URL,
            api_key=settings.QDRANT_API_KEY
        )
        self.collection = "nexa_knowledge"

    async def retrieve_relevant_content(self, query_vector: list[float], limit: int = 3) -> list[dict]:
        results = await self.client.search(
            collection_name=self.collection,
            query_vector=query_vector,
            limit=limit
        )
        return [
            {
                "id": hit.id,
                "score": hit.score,
                "payload": hit.payload
            } for hit in results
        ]
```

---

## 7. The 16 Specialized Agents Catalog

Every agent maps to a specific folder within `backend/app/ai/agents/`.

```
                    ┌────────────────────────────┐
                    │       Specialized Agents   │
                    └─────────────┬──────────────┘
         ┌────────────────────────┼────────────────────────┐
         ▼                        ▼                        ▼
[Career Intelligence]   [Learning Intelligence]  [Placement Intelligence]
 - Career Agent          - Learning Agent         - Interview Agent
 - Skill Gap Agent       - Quiz Agent             - Company Prep Agent
 - Roadmap Agent         - Assignment Agent       - HR Interview Agent
 - Recommendation Agent  - Certification Agent    - Coding Interview Agent
         │                        │                        │
         ├────────────────────────┴────────────────────────┤
         ▼
[System Intelligence]
 - Memory Agent
 - Feedback Agent
 - Analytics Agent
 - Notification Agent
```

### 1. Career Agent
* **Input Schema**: `target_domain: str`, `experience_years: int`, `skills: list[str]`.
* **Output Schema**: `suitable_roles: list[str]`, `suitability_match: float`, `market_demand: str`.

### 2. Resume Agent
* **Input Schema**: `resume_text: str`, `role_target: str`.
* **Output Schema**: `parsed_sections: dict`, `overall_score: int`, `improvements: list[str]`.

### 3. ATS Agent
* **Input Schema**: `resume_parsed_data: dict`, `job_description: str`.
* **Output Schema**: `ats_score: int`, `missing_keywords: list[str]`, `format_warnings: list[str]`.

### 4. Learning Agent
* **Input Schema**: `topic: str`, `difficulty_level: str`, `available_hours: int`.
* **Output Schema**: `modules: list[dict]`, `recommended_resources: list[str]`.

### 5. Skill Gap Agent
* **Input Schema**: `current_skills: list[str]`, `target_role_skills: list[str]`.
* **Output Schema**: `missing_skills: list[str]`, `critical_gaps: list[str]`.

### 6. Roadmap Agent
* **Input Schema**: `learning_topics: list[str]`, `duration_weeks: int`.
* **Output Schema**: `weekly_milestones: list[dict]`, `suggested_projects: list[str]`.

### 7. Coding Agent
* **Input Schema**: `problem_description: str`, `language: str`, `user_code: Optional[str]`.
* **Output Schema**: `solution_code: str`, `complexity: str`, `test_cases: list[dict]`.

### 8. Interview Agent
* **Input Schema**: `role: str`, `difficulty: str`, `question_index: int`.
* **Output Schema**: `next_question: str`, `expected_points: list[str]`.

### 9. Recommendation Agent
* **Input Schema**: `skills: list[str]`, `preferences: dict`.
* **Output Schema**: `recommended_jobs: list[str]`, `recommended_courses: list[str]`.

### 10. Mentor Agent
* **Input Schema**: `student_query: str`, `session_history: list[dict]`.
* **Output Schema**: `advice_text: str`, `action_items: list[str]`.

### 11. Feedback Agent
* **Input Schema**: `interaction_id: str`, `user_rating: int`, `comments: str`.
* **Output Schema**: `sentiment_score: float`, `system_improvements: list[str]`.

### 12. Analytics Agent
* **Input Schema**: `user_id: str`, `activity_logs: list[dict]`.
* **Output Schema**: `readiness_score: int`, `weekly_progress_percentage: float`.

### 13. Notification Agent
* **Input Schema**: `user_id: str`, `pending_tasks: list[dict]`.
* **Output Schema**: `scheduled_notifications: list[dict]`.

### 14. Company Preparation Agent
* **Input Schema**: `target_company: str`, `role: str`.
* **Output Schema**: `rounds: list[dict]`, `focus_areas: list[str]`, `historical_questions: list[str]`.

### 15. Internship Agent
* **Input Schema**: `education: str`, `skills: list[str]`.
* **Output Schema**: `internship_openings: list[dict]`, `application_roadmap: list[dict]`.

### 16. Portfolio Agent
* **Input Schema**: `github_username: Optional[str]`, `project_links: list[str]`.
* **Output Schema**: `readiness_rating: int`, `architectural_feedback: list[str]`.

---

## 8. Response Validation Filter

A response validator node checks LLM outputs to detect errors, format mismatches, or unsupported claims before sending the data to the client.

```python
# app/ai/orchestrator/validator.py
from typing import Any
import json
import re


class NexaResponseValidator:
    async def validate(self, response_text: str, intent: str) -> tuple[bool, str]:
        """
        Validates structure and checks for placeholders.
        Returns (is_valid, validation_error_message).
        """
        # 1. Check for placeholders
        placeholders = ["TODO", "[insert here]", "<insert", "lorem ipsum"]
        for ph in placeholders:
            if ph.lower() in response_text.lower():
                return False, f"Output contains placeholder element: {ph}"

        # 2. Intent-specific structural verification
        if intent == "career_roadmap":
            # Roadmaps must contain Markdown list structure representing weekly blocks
            pattern = re.compile(r"(week \d|phase \d)", re.IGNORECASE)
            if not pattern.search(response_text):
                return False, "Roadmap response lacks weekly/phased milestone divisions."

        # 3. Check for incomplete sentence at termination
        cleaned = response_text.strip()
        if cleaned and cleaned[-1] not in [".", "!", "?", "}", "]", "`"]:
            return False, "Response terminated abruptly with incomplete punctuation."

        return True, ""
```

---

## 9. Error & Fallback Handling

To prevent graph execution failure when third-party services fail (e.g. rate limit on OpenAI), NEXA AI implements structural fallbacks at the Provider Layer.

```
                          ┌──────────────────────────┐
                          │    Attempt Provider 1    │
                          │      (e.g., Claude)      │
                          └─────────────┬────────────┘
                                        │
                                     Failed?
                                     ╱      ╲
                                   [No]     [Yes]
                                   ╱          ╲
                      ┌───────────┴─┐      ┌───▼──────────────────────┐
                      │ Use Output  │      │    Attempt Provider 2    │
                      └─────────────┘      │     (e.g., DeepSeek)     │
                                           └────────────┬─────────────┘
                                                        │
                                                     Failed?
                                                     ╱      ╲
                                                   [No]     [Yes]
                                                   ╱          ╲
                                      ┌───────────┴─┐      ┌───▼──────────────────────┐
                                      │ Use Output  │      │   Activate Hardcoded     │
                                      └─────────────┘      │   Rule-Based Response    │
                                                           └──────────────────────────┘
```

```python
# app/ai/providers/provider_manager.py
from typing import Any
from app.config import settings
from app.ai.providers.openai import OpenAIProvider
from app.ai.providers.claude import ClaudeProvider
from app.ai.providers.deepseek import DeepSeekProvider


class NexaProviderManager:
    def __init__(self):
        self.providers = {
            "claude": ClaudeProvider(),
            "openai": OpenAIProvider(),
            "deepseek": DeepSeekProvider()
        }
        self.default_order = ["claude", "openai", "deepseek"]

    async def generate_with_fallback(self, prompt: str, system_prompt: str) -> str:
        errors = []
        for provider_name in self.default_order:
            provider = self.providers.get(provider_name)
            if not provider:
                continue
            try:
                return await provider.generate(prompt, system_prompt)
            except Exception as e:
                errors.append(f"{provider_name}: {str(e)}")
        
        # Fallback response
        raise RuntimeError(f"All AI Providers failed. Context errors: {', '.join(errors)}")
```

---

## 10. Folder Structure Details

```
backend/app/ai/
├── __init__.py
├── gateway/
│   ├── __init__.py
│   ├── gateway.py            # AI gateway service class
│   ├── dispatcher.py         # Async orchestrator dispatcher
│   └── provider_manager.py   # Multi-provider lifecycle and fallback
├── orchestrator/
│   ├── __init__.py
│   ├── graph.py              # LangGraph definition
│   ├── state.py              # Schema classes
│   └── validator.py          # Output check
├── memory/
│   ├── __init__.py
│   └── memory_service.py     # Redis session & summary helper
├── RAG/
│   ├── __init__.py
│   └── retriever.py          # Qdrant client connection wrapper
├── providers/
│   ├── __init__.py
│   ├── base.py
│   ├── openai.py
│   ├── claude.py
│   ├── deepseek.py
│   └── ollama.py
└── agents/
    ├── __init__.py
    ├── base.py
    ├── career/
    ├── resume/
    ├── learning/
    ├── roadmap/
    ├── coding/
    └── interview/
```

---

## 11. Performance & Verification Matrix

To ensure production stability, performance is measured and logged using the following KPIs:

| Operation | Metric | Verification Metric |
| :--- | :--- | :--- |
| **Simple Dispatch** | Match Intent | Intent Match validation accuracy ≥ 95% |
| **Simple Latency** | ≤ 3.5 seconds | Async processing timer tests |
| **Parallel Dispatch** | Parallel Exec | Processing limit validation tests |
| **Orchestrated Latency**| ≤ 12.0 seconds | High throughput traffic testing |
| **RAG Queries** | Search Response| Retrieval times match benchmark metrics (≤ 600 ms) |
| **Memory Updates** | Sync Latency | Execution updates complete ≤ 200 ms |

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

---

> **Phase 10 Complete** — Multi-Agent AI system architecture fully designed and implementation-ready.
> Standard schemas, state mappings, orchestrators, dispatcher routines, and agent divisions are documented.
>
> **Next: Phase 11 — LangGraph Orchestrator & Workflow Engine**
> StateGraph compilation, node logic, routing logic, parallel flow mechanics, checkpointing state, and human-in-the-loop validation configurations.

---

*NEXA AI Phase 10 — Multi-Agent AI Architecture | Version 1.0 | July 2026*
