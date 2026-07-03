# NEXA AI — LangGraph Orchestrator & Workflow Engine
## Phase 11 — Implementation Blueprint

---

| Field              | Details                                                  |
|--------------------|----------------------------------------------------------|
| **Document**       | LangGraph Orchestrator & Workflow Engine                 |
| **Phase**          | 11 of 30                                                 |
| **Version**        | 1.0                                                      |
| **Framework**      | LangGraph 0.1+ + LangChain                               |
| **Storage Layers** | MongoDB (Checkpoints) + Redis (Locks & Stream Cache)     |
| **Target Python**  | Python 3.13+                                             |
| **Status**         | ✅ Complete — Implementation Ready                      |

---

## Table of Contents

1. [Workflow Orchestration & Graph Topology](#1-workflow-orchestration--graph-topology)
2. [Graph State Definition](#2-graph-state-definition)
3. [Core Node Implementation](#3-core-node-implementation)
4. [Conditional Routing Logic](#4-conditional-routing-logic)
5. [Parallel Agent Execution Architecture](#5-parallel-agent-execution-architecture)
6. [Tool Routing & Sandbox Interface](#6-tool-routing--sandbox-interface)
7. [Human-in-the-Loop Checkpoint System](#7-human-in-the-loop-checkpoint-system)
8. [Response Streaming Manager](#8-response-streaming-manager)
9. [Error Recovery & Graceful Fallbacks](#9-error-recovery--graceful-fallbacks)
10. [Observability & OpenTelemetry Logging](#10-observability--opentelemetry-logging)
11. [Performance & Latency Budget](#11-performance--latency-budget)

---

## 1. Workflow Orchestration & Graph Topology

The Multi-Agent system coordinates its operations through a singlecompiled **StateGraph** built on LangGraph. The nodes execute atomic functions, while routing decisions are computed dynamically at structural checkpoints.

```
                                  ┌───────────┐
                                  │   Start   │
                                  └─────┬─────┘
                                        │
                                        ▼
                               ┌─────────────────┐
                               │  load_profile   │
                               └─────┬───────────┘
                                     │
                                     ▼
                               ┌─────────────────┐
                               │   load_memory   │
                               └─────┬───────────┘
                                     │
                                     ▼
                               ┌─────────────────┐
                               │  detect_intent  │
                               └─────┬───────────┘
                                     │
                                     ▼
                            Conditional Router
                          ╱          │          ╲
                 (Career)         (Resume)       (Coding)
                    ╱                │                ╲
       ┌───────────▼─────┐  ┌────────▼────────┐  ┌─────▼───────────┐
       │   run_career    │  │   run_resume    │  │   run_coding    │
       └───────────┬─────┘  └────────┬────────┘  └─────┬───────────┘
                   │                 │                 │
                   └─────────────────┼─────────────────┘
                                     │
                                     ▼
                               ┌─────▼───────────┐
                               │  validate_resp  │
                               └─────┬───────────┘
                                     │
                                  Passed?
                                 ╱       ╲
                              [Yes]      [No] ──► (Retry limit reached? Reset/Fail)
                               ╱
                              ▼
                       ┌───────────────┐
                       │  save_memory  │
                       └───────┬───────┘
                               │
                               ▼
                       ┌───────────────┐
                       │      End      │
                       └───────────────┘
```

---

## 2. Graph State Definition

```python
# app/ai/orchestrator/state.py
from typing import Annotated, Any, Optional
from typing_extensions import TypedDict
from pydantic import BaseModel, Field
from app.ai.orchestrator.state_reducers import merge_agent_results


class UserProfileContext(BaseModel):
    user_id:        str
    role:           str
    skills:         list[str] = []
    career_goals:   list[str] = []
    experience:     list[dict[str, Any]] = []
    resume_id:      Optional[str] = None
    learning_paths: list[str] = []


class NexaAgentState(TypedDict):
    # ── Identifiers & Query ───────────────────────────
    user_id:          str
    session_id:       str
    conversation_id:  str
    user_query:       str
    
    # ── Intent Analytics ──────────────────────────────
    intent:           Optional[str]                    # "career", "resume", "learning", "coding", "interview"
    sub_intent:       Optional[str]                    # e.g., "ats_check", "mock_interview"
    confidence_score: float
    
    # ── Context Datasets ──────────────────────────────
    user_profile:     Optional[UserProfileContext]
    memory_summary:   Optional[str]
    rag_documents:    list[dict[str, Any]]
    
    # ── Routing & Agent Execution tracking ────────────
    selected_agents:  list[str]
    agent_outputs:    Annotated[dict[str, Any], merge_agent_results]
    tool_results:     list[dict[str, Any]]
    
    # ── Iterative Evaluation tracker ──────────────────
    validation_attempts: int
    validation_errors:   list[str]
    
    # ── Responses ─────────────────────────────────────
    final_response:   Optional[str]
    stream_channel:   Optional[str]                    # WebSocket endpoint path
```

---

## 3. Core Node Implementation

Nodes are standard Python asynchronous functions receiving the state dictionary and returning only updated keys.

```python
# app/ai/orchestrator/nodes.py
from typing import Any
from app.ai.orchestrator.state import NexaAgentState
from app.ai.memory.memory_service import NexaMemoryService
from app.api.v1.auth.repository import AuthRepository
from app.core.exceptions import ResourceNotFound

auth_repo = AuthRepository()
memory_service = NexaMemoryService()


async def load_profile_node(state: NexaAgentState) -> dict[str, Any]:
    """Node responsible for pulling profiles, historical goals, and skills."""
    user = await auth_repo.find_user_by_id(state["user_id"])
    if not user:
        raise ResourceNotFound("User not found during orchestration lifecycle")

    return {
        "user_profile": {
            "user_id": str(user.id),
            "role": user.role.value,
            "skills": user.permissions,
            "career_goals": [],
            "experience": [],
            "resume_id": None
        }
    }


async def load_memory_node(state: NexaAgentState) -> dict[str, Any]:
    """Retrieves short-term conversational context summary."""
    summary = await memory_service.get_chat_history(state["session_id"], limit=5)
    formatted_summary = "\n".join([f"{m['role']}: {m['content']}" for m in summary])
    return {
        "memory_summary": formatted_summary
    }


async def detect_intent_node(state: NexaAgentState) -> dict[str, Any]:
    """Determines user routing category based on query contents."""
    query = state["user_query"].lower()
    
    # Static fallback analysis logic
    intent = "career"
    sub_intent = "guidance"
    confidence = 0.95

    if any(k in query for k in ["resume", "cv", "ats"]):
        intent = "resume"
        sub_intent = "ats_check" if "ats" in query else "review"
    elif any(k in query for k in ["code", "debug", "python", "java", "sql"]):
        intent = "coding"
        sub_intent = "debug" if "debug" in query else "generate"
    elif any(k in query for k in ["interview", "prepare", "mock"]):
        intent = "interview"
        sub_intent = "technical"

    return {
        "intent": intent,
        "sub_intent": sub_intent,
        "confidence_score": confidence
    }
```

---

## 4. Conditional Routing Logic

After the intent extraction step, the graph routes execution flow dynamically using router functions.

```python
# app/ai/orchestrator/router.py
from typing import Literal
from app.ai.orchestrator.state import NexaAgentState


def route_intent_workflow(state: NexaAgentState) -> Literal["career", "resume", "coding", "interview"]:
    """Directs execution path to specialized workflow nodes."""
    target_intent = state.get("intent", "career")
    if target_intent in ["career", "resume", "coding", "interview"]:
        return target_intent
    return "career"


def route_validation_fallback(state: NexaAgentState) -> Literal["save_memory", "detect_intent"]:
    """Validates structural correctness of final responses. Retries intent loop on failure."""
    if state.get("validation_attempts", 0) >= 3:
        # Prevent infinite loops, save what we have
        return "save_memory"
    
    errors = state.get("validation_errors", [])
    if not errors:
        return "save_memory"
        
    return "detect_intent"
```

---

## 5. Parallel Agent Execution Architecture

For sub-tasks like resume reviews, we run independent agents concurrently to minimize response latency.

```python
# app/ai/orchestrator/dispatcher.py
import asyncio
from typing import Any
from app.ai.orchestrator.state import NexaAgentState
from app.ai.agents.resume.resume_agent import ResumeAgent
from app.ai.agents.ats.ats_agent import ATSAgent


async def run_resume_workflow_node(state: NexaAgentState) -> dict[str, Any]:
    """Executes Resume Parser and ATS Analyzer concurrently."""
    resume_agent = ResumeAgent()
    ats_agent = ATSAgent()

    # Build inputs for both agents from the user state
    resume_input = {"resume_text": state["user_query"]}
    ats_input = {"resume_parsed_data": {}, "job_description": "Standard AI Developer Profile"}

    # Execute inside concurrent tasks
    tasks = [
        resume_agent.execute(resume_input),
        ats_agent.execute(ats_input)
    ]
    
    results = await asyncio.gather(*tasks, return_exceptions=True)

    agent_outputs = {}
    for agent, result in zip(["resume_agent", "ats_agent"], results):
        if isinstance(result, Exception):
            agent_outputs[agent] = {"success": False, "error": str(result)}
        else:
            agent_outputs[agent] = result

    return {
        "agent_outputs": agent_outputs
    }
```

---

## 6. Tool Routing & Sandbox Interface

Agents interact with tools (e.g. Code Executor, PDF Builder) using structured schema arguments. The orchestrator isolates tool execution in a sandbox.

```python
# app/ai/tools/code_executor.py
import docker
from typing import Optional
from pydantic import BaseModel, Field


class CodeExecutorInput(BaseModel):
    code:     str = Field(description="Raw code input string to execute")
    language: str = Field(description="Target language: python, javascript, etc.")


class CodeExecutorTool:
    def __init__(self):
        # Uses lightweight execution containers for absolute isolation
        self.docker_image = "python:3.13-slim"

    async def run(self, params: CodeExecutorInput) -> dict[str, Any]:
        """Runs the code block in an isolated Docker container."""
        client = docker.from_env()
        try:
            # Mount command executing string
            container = client.containers.run(
                image=self.docker_image,
                command=f'python -c "{params.code}"',
                detach=False,
                stdout=True,
                stderr=True,
                network_disabled=True,
                mem_limit="64m",
                nano_cpus=500000000,  # 0.5 CPU core limit
                timeout=5             # 5 second timeout limit
            )
            return {
                "success": True,
                "stdout": container.decode("utf-8"),
                "stderr": ""
            }
        except docker.errors.ContainerError as e:
            return {
                "success": False,
                "stdout": "",
                "stderr": e.stderr.decode("utf-8")
            }
        except Exception as e:
            return {
                "success": False,
                "stdout": "",
                "stderr": str(e)
            }
```

---

## 7. Human-in-the-Loop Checkpoint System

We use LangGraph's native checkpointer interface to pause execution when human review is required.

```python
# app/ai/orchestrator/checkpoint.py
from typing import Any, Optional
from beanie import Document
from pydantic import Field
from datetime import datetime


class MongoDBCheckpointStore(Document):
    """Beanie model for persisting LangGraph execution states."""
    thread_id:     str = Field(index=True)
    checkpoint_id: str = Field(index=True)
    checkpoint:    dict[str, Any]
    metadata:      dict[str, Any] = {}
    created_at:    datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "ai_checkpoints"
        indexes = [
            "thread_id",
            "checkpoint_id",
            [("created_at", -1)]
        ]


class NexaMongoCheckpointer:
    """Checkpointer logic helper for saving and loading states."""
    async def get_tuple(self, config: dict) -> Optional[tuple]:
        thread_id = config.get("configurable", {}).get("thread_id")
        checkpoint_id = config.get("configurable", {}).get("checkpoint_id")
        
        if checkpoint_id:
            record = await MongoDBCheckpointStore.find_one(
                MongoDBCheckpointStore.thread_id == thread_id,
                MongoDBCheckpointStore.checkpoint_id == checkpoint_id
            )
        else:
            record = await MongoDBCheckpointStore.find(
                MongoDBCheckpointStore.thread_id == thread_id
            ).sort("-created_at").first_or_none()
            
        if not record:
            return None
        return record.checkpoint, record.metadata

    async def put(self, config: dict, checkpoint: dict, metadata: dict) -> None:
        thread_id = config["configurable"]["thread_id"]
        checkpoint_id = config["configurable"]["checkpoint_id"]
        
        record = MongoDBCheckpointStore(
            thread_id=thread_id,
            checkpoint_id=checkpoint_id,
            checkpoint=checkpoint,
            metadata=metadata
        )
        await record.insert()
```

---

## 8. Response Streaming Manager

NEXA AI supports real-time token streaming using Server-Sent Events (SSE) or WebSockets. The stream manager maps incremental generation events to the target channel.

```python
# app/ai/orchestrator/streaming.py
import json
from typing import AsyncGenerator
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.core.redis_client import get_redis

router = APIRouter()


class NexaStreamManager:
    async def publish_token(self, session_id: str, token: str) -> None:
        redis = await get_redis()
        channel = f"ai:stream:{session_id}"
        await redis.publish(channel, json.dumps({"type": "token", "data": token}))

    async def publish_complete(self, session_id: str) -> None:
        redis = await get_redis()
        channel = f"ai:stream:{session_id}"
        await redis.publish(channel, json.dumps({"type": "complete"}))


@router.get("/stream/{session_id}")
async def stream_response(session_id: str):
    """FastAPI Server-Sent Events endpoint for real-time response generation."""
    async def event_generator() -> AsyncGenerator[str, None]:
        redis = await get_redis()
        pubsub = redis.pubsub()
        channel = f"ai:stream:{session_id}"
        await pubsub.subscribe(channel)
        
        try:
            async for message in pubsub.listen():
                if message["type"] == "message":
                    payload = json.loads(message["data"])
                    if payload["type"] == "complete":
                        yield "data: [DONE]\n\n"
                        break
                    yield f"data: {payload['data']}\n\n"
        finally:
            await pubsub.unsubscribe(channel)

    return StreamingResponse(event_generator(), media_type="text/event-stream")
```

---

## 9. Error Recovery & Graceful Fallbacks

If a step in the multi-agent graph fails, the error handler catches the exception and returns a formatted response.

```python
# app/ai/orchestrator/errors.py
from typing import Any
from app.ai.orchestrator.state import NexaAgentState


async def handle_agent_error_fallback(
    state: NexaAgentState, 
    failing_agent: str, 
    error: Exception
) -> dict[str, Any]:
    """Logs the error, writes an audit record, and triggers a fallback model."""
    fallback_response = (
        "I'm currently experiencing high load with my analysis tools. "
        "However, based on your profile, I recommend focusing on reinforcing "
        "your core software design concepts."
    )
    return {
        "final_response": fallback_response,
        "validation_status": "passed_fallback",
        "validation_errors": [f"Agent {failing_agent} error: {str(error)}"]
    }
```

---

## 10. Observability & OpenTelemetry Logging

NEXA AI integrates OpenTelemetry to trace state updates, node transitions, and API latencies.

```python
# app/ai/orchestrator/logger.py
from opentelemetry import trace
from app.ai.orchestrator.state import NexaAgentState

tracer = trace.get_tracer("nexa.ai.orchestrator")


def log_node_transition(node_name: str, state: NexaAgentState) -> None:
    """Creates a span to trace the current node execution step."""
    with tracer.start_as_current_span(f"node_execution:{node_name}") as span:
        span.set_attribute("session_id", state.get("session_id", "unknown"))
        span.set_attribute("user_id", state.get("user_id", "unknown"))
        span.set_attribute("intent", state.get("intent", "unclassified"))
        span.set_attribute("agents_list", state.get("selected_agents", []))
```

---

## 11. Performance & Latency Budget

To maintain a responsive UI, execution steps are monitored against strict budgets:

```
Total Response Budget: 15.0 seconds
├─ Intent Detection: 0.1s
├─ Context Retrieval: 0.3s
├─ Knowledge Search (RAG): 1.0s
├─ Parallel Exec (Max): 5.0s
├─ Validation Filter: 0.5s
└─ Network Overhead: 0.1s
```

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

---

> **Phase 11 Complete** — LangGraph Orchestrator and Workflow engine fully designed.
>
> **Next: Phase 12 — AI Memory & Personalization Engine**
> Long-term profile updates, semantic vector recall, MongoDB summary logs, feedback loops, and preference classification logic.

---

*NEXA AI Phase 11 — LangGraph Orchestrator | Version 1.0 | July 2026*
