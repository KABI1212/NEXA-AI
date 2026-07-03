# NEXA AI — LangGraph & AI Agent Implementation Guide (LGAIG)
## Phase 25 — Implementation Blueprint

---

| Field              | Details                                                  |
|--------------------|----------------------------------------------------------|
| **Document**       | LangGraph & AI Agent Implementation Guide                |
| **Phase**          | 25 of 30                                                 |
| **Version**        | 1.0                                                      |
| **Framework**      | LangGraph 0.1+ + LangChain                               |
| **Pattern**        | Modular AI OS (Domain-Based Registry Interface)          |
| **Target Python**  | Python 3.13+                                             |
| **Status**         | ✅ Complete — Implementation Ready                      |

---

## Table of Contents

1. [Modular AI-OS System Folder Structure](#1-modular-ai-os-system-folder-structure)
2. [LangGraph StateGraph Schema & Compilation](#2-langgraph-stategraph-schema--compilation)
3. [Agent Registry & Interface Service](#3-agent-registry--interface-service)
4. [Prompt Template Manager & Loader](#4-prompt-template-manager--loader)
5. [Token Streaming & Publisher Service](#5-token-streaming--publisher-service)
6. [Response Validation & Fallback Router Nodes](#6-response-validation--fallback-router-nodes)
7. [GDPR Data Protection & Consent Filter Checks](#7-gdpr-data-protection--consent-filter-checks)
8. [API Route Catalog & Conversation Gateway](#8-api-route-catalog--conversation-gateway)
9. [Operational SLA Targets Matrix](#9-operational-sla-targets-matrix)

---

## 1. Modular AI-OS System Folder Structure

The AI Engine operates as a structured AI Operating System (AI-OS). Prompts, tools, and vector retrievers are isolated from the core application layer.

```
backend/app/ai/
├── __init__.py
├── state.py                  # Core LangGraph TypedDict state schema
├── graph.py                  # StateGraph compiler nodes & routing edges
├── registry.py               # Dynamic Agent Registry service class
├── prompts/                  # Markdown Prompt Template templates
│   ├── career.md
│   └── resume.md
├── agents/                   # Domain specialized sub-agents
│   ├── base.py               # Standard BaseAgent interface class
│   ├── career.py
│   └── resume.py
└── tools/                    # Tool modules sandbox (Dockers/CLI)
```

---

## 2. LangGraph StateGraph Schema & Compilation

Below is the implementation-ready blueprint for the core LangGraph state graph orchestrator. It compiles nodes and routes decisions based on user intent.

```python
# app/ai/graph.py
from typing import Literal
from langgraph.graph import StateGraph, START, END
from app.ai.state import NexaAgentState
from app.ai.orchestrator.nodes import (
    load_profile_node,
    load_memory_node,
    detect_intent_node,
    validate_response_node,
    save_memory_node
)
from app.ai.orchestrator.router import route_intent_workflow, route_validation_fallback
from app.ai.orchestrator.dispatcher import run_resume_workflow_node


class NexaOrchestratorGraph:
    def __init__(self):
        self.builder = StateGraph(NexaAgentState)
        self._register_nodes()
        self._register_edges()

    def _register_nodes(self) -> None:
        """Mounts functional execution nodes into the builder graph."""
        self.builder.add_node("load_profile", load_profile_node)
        self.builder.add_node("load_memory", load_memory_node)
        self.builder.add_node("detect_intent", detect_intent_node)
        
        # Specialized workflows nodes
        self.builder.add_node("run_resume", run_resume_workflow_node)
        
        # Quality evaluations nodes
        self.builder.add_node("validate_response", validate_response_node)
        self.builder.add_node("save_memory", save_memory_node)

    def _register_edges(self) -> None:
        """Declares execution pathways and conditional edge routes."""
        # 1. Base initialization pathway
        self.builder.add_edge(START, "load_profile")
        self.builder.add_edge("load_profile", "load_memory")
        self.builder.add_edge("load_memory", "detect_intent")

        # 2. Dynamic Workflow Routing Edge
        self.builder.add_conditional_edges(
            "detect_intent",
            route_intent_workflow,
            {
                "resume": "run_resume",
                "career": "validate_response"  # default fallback bypass
            }
        )

        # 3. Post-execution workflows points must route to validator
        self.builder.add_edge("run_resume", "validate_response")

        # 4. Response validator fallback path check edge
        self.builder.add_conditional_edges(
            "validate_response",
            route_validation_fallback,
            {
                "save_memory": "save_memory",
                "detect_intent": "detect_intent"  # Retry loop on validation failure
            }
        )

        self.builder.add_edge("save_memory", END)

    def compile(self):
        """Compiles the StateGraph builder into an executable graph."""
        return self.builder.compile()
```

---

## 3. Agent Registry & Interface Service

The Agent Registry dynamically instantiates, stores, and validates agent classes.

```python
# app/ai/registry.py
from typing import Optional, dict
from app.ai.agents.base import BaseNexaAgent
from app.core.exceptions import ResourceNotFound


class NexaAgentRegistry:
    def __init__(self):
        self._agents: dict[str, BaseNexaAgent] = {}

    def register_agent(self, agent: BaseNexaAgent) -> None:
        """Registers a new specialized agent instance."""
        self._agents[agent.name] = agent

    def get_agent(self, name: str) -> BaseNexaAgent:
        """Retrieves a registered agent instance or raises an error."""
        agent = self._agents.get(name)
        if not agent:
            raise ResourceNotFound(f"AI Agent: {name}")
        return agent

    def list_agents(self) -> list[str]:
        return list(self._agents.keys())
```

---

## 4. Prompt Template Manager & Loader

Prompts are stored as markdown files in `app/ai/prompts/` and loaded dynamically into memory.

```python
# app/ai/prompts/manager.py
from pathlib import Path
from typing import Any
from app.core.exceptions import BaseNexaException


class NexaPromptManager:
    def __init__(self):
        self.prompts_dir = Path(__file__).parent

    def load_prompt_template(self, prompt_name: str, **kwargs: Any) -> str:
        """Loads and formats a prompt template from a markdown file."""
        file_path = self.prompts_dir / f"{prompt_name}.md"
        if not file_path.exists():
            raise BaseNexaException(
                status_code=500,
                error_code="PROMPT_LOAD_ERROR",
                message=f"System prompt file template '{prompt_name}.md' not found."
            )

        template = file_path.read_text(encoding="utf-8")
        try:
            return template.format(**kwargs)
        except KeyError as e:
            raise BaseNexaException(
                status_code=500,
                error_code="PROMPT_FORMAT_ERROR",
                message=f"Missing key in prompt format mapping: {str(e)}"
            )
```

---

## 5. Token Streaming & Publisher Service

Streams tokens in real time to the React UI using Server-Sent Events (SSE) backed by Redis pub-sub channels.

```python
# app/ai/gateway/streaming.py
import json
from app.core.database import get_redis_client


class NexaStreamPublisher:
    def __init__(self, session_id: str):
        self.redis = get_redis_client()
        self.channel = f"ai:stream:{session_id}"

    async def publish_token(self, token: str) -> None:
        """Publishes an incremental token chunk to the Redis pub-sub channel."""
        payload = {"type": "token", "data": token}
        await self.redis.publish(self.channel, json.dumps(payload))

    async def publish_completion(self) -> None:
        """Publishes a completion signal to close the client connection."""
        payload = {"type": "complete"}
        await self.redis.publish(self.channel, json.dumps(payload))
```

---

## 6. Response Validation & Fallback Router Nodes

Validates LLM responses and falls back to secondary providers if errors occur.

```python
# app/ai/orchestrator/nodes.py (Response validator block)
from typing import Any
from app.ai.state import NexaAgentState


async def validate_response_node(state: NexaAgentState) -> dict[str, Any]:
    """Validates structural correctness of final responses. Retries intent loop on failure."""
    response_text = state.get("final_response", "")
    validation_errors = []

    # 1. Structural Validation (check for empty responses)
    if not response_text.strip():
        validation_errors.append("Response is empty.")

    # 2. Check for leftover placeholder tags
    if "[insert" in response_text.lower() or "<insert" in response_text.lower():
        validation_errors.append("Response contains placeholder tags.")

    # Update attempt tracker
    current_attempts = state.get("validation_attempts", 0) + 1

    return {
        "validation_attempts": current_attempts,
        "validation_errors": validation_errors
    }
```

---

## 7. GDPR Data Protection & Consent Filter Checks

Anonymizes input payloads to strip out personally identifiable information (PII) before sending data to AI providers.

```python
# app/ai/gateway/anonymizer.py
import re
from typing import Any


class NexaGDPRAnonymizer:
    def sanitize_payload(self, raw_input: str) -> str:
        """Anonymizes PII details like email and phone numbers from resume texts."""
        # Simple email and phone regex
        email_pattern = re.compile(r"[\w\.-]+@[\w\.-]+\.\w+")
        phone_pattern = re.compile(r"\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}")

        sanitized = email_pattern.sub("[EMAIL_REDACTED]", raw_input)
        sanitized = phone_pattern.sub("[PHONE_REDACTED]", sanitized)
        
        return sanitized
```

---

## 8. API Route Catalog & Conversation Gateway

```python
# app/ai/gateway/chat_api.py
from fastapi import APIRouter
from app.core.dependencies import CurrentUser
from app.ai.gateway.gateway import AIGatewayService
from app.schemas.common import APIResponse

router = APIRouter(prefix="/chat", tags=["AI OS Chat Engine"])


@router.post("", response_model=APIResponse[dict])
async def execute_chat_query(
    message: str,
    session_id: str,
    current_user: CurrentUser
):
    """Entry point for AI queries. Runs the query through the LangGraph orchestrator."""
    gateway = AIGatewayService()
    result = await gateway.process_message(
        user_id=str(current_user.id),
        session_id=session_id,
        message=message
    )
    
    return APIResponse.ok(data=result)
```

---

## 9. Operational SLA Targets Matrix

To ensure a responsive user experience, AI operations are designed to match strict latency targets:

| Execution Stage | Target Metric | Metric SLA |
| :--- | :--- | :--- |
| **Anonymization filter**| PII stripping speed | Target: ≤ 25 ms |
| **Prompt Template load**| Loading template files | Target: ≤ 10 ms |
| **Agent Registry lookup**| Accessing agent registry| Target: ≤ 5 ms |
| **Token Streaming push**| Redis publishing latency| Target: ≤ 30 ms |
| **Lifespan State compile**| LangGraph invoke runtime| Target: ≤ 7500 ms |

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

---

> **Phase 25 Complete** — StateGraph compiler files, dynamic registries, prompt loaders, token streams, and fallback nodes defined.
>
> **Next: Phase 26 — Testing, Quality Assurance & Security Validation**
> Unit testing setups, mock databases, coverage targets, load tests, and security scanning tools.

---

*NEXA AI Phase 25 — LangGraph & Agents | Version 1.0 | July 2026*
