# NEXA AI — AI Operating System Architecture (AI-OS)
## Core System Design & Multi-Agent Collaboration Blueprint

---

| Field              | Details                                                  |
|--------------------|----------------------------------------------------------|
| **Document**       | AI Operating System Architecture (AI-OS)                 |
| **Version**        | 1.0                                                      |
| **Orchestrator**   | LangGraph 0.1+ + LangChain                               |
| **Database**       | MongoDB + Redis + Qdrant (Vector Index)                  |
| **Status**         | ✅ Complete — Implementation Ready                      |

---

## 1. High-Level AI-OS Architecture

The AI Engine acts as a modular Operating System. Individual agents do not communicate directly. Instead, they interact through the orchestrator graph, which passes the state from node to node.

```
                         ┌──────────────────────────┐
                         │       User Request       │
                         └─────────────┬────────────┘
                                       │
                                       ▼
                         ┌──────────────────────────┐
                         │    AI Gateway Service    │
                         │    - Auths  - Limits     │
                         └─────────────┬────────────┘
                                       │
                                       ▼
                         ┌──────────────────────────┐
                         │   LangGraph Orchestrator │
                         │    - Manages Graph State │
                         └─────────────┬────────────┘
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         ▼                             ▼                             ▼
┌──────────────────┐          ┌──────────────────┐          ┌──────────────────┐
│  Memory Engine   │          │ Knowledge Engine │          │  Agent Registry  │
│ - Redis Cache    │          │ - Qdrant (RAG)   │          │ - Skill checks   │
│ - Fact lists     │          │ - Cohere Rerank  │          │ - Resume reviews │
└──────────────────┘          └──────────────────┘          └──────────────────┘
```

---

## 2. Dynamic Agent Communication & Registry

Agents are registered dynamically, allowing the orchestrator to route tasks without hardcoding.

```python
# app/ai/registry.py (Dynamic Agent registration)
from typing import dict
from app.ai.agents.base import BaseNexaAgent


class NexaAgentRegistry:
    def __init__(self):
        self._agents: dict[str, BaseNexaAgent] = {}

    def register_agent(self, agent: BaseNexaAgent) -> None:
        self._agents[agent.name] = agent

    def get_agent(self, name: str) -> BaseNexaAgent:
        return self._agents[name]
```

### 2.1 Communication Protocol
Agents communicate strictly by writing updates to the global `NexaAgentState`. The orchestrator passes the state from node to node, resolving execution conflicts.

---

## 3. Workflow Execution & State Management

The orchestrator compiles workflow steps into nodes and conditional edges using LangGraph.

```
START ──► load_profile ──► load_memory ──► detect_intent
                                                 │
                                         Conditional Route
                                       /         │         \
                                (Career)     (Resume)     (Coding)
                                  /              │              \
                             run_career      run_resume      run_coding
                                  \              │              /
                                   ▼             ▼             ▼
                                         validate_response
                                                 │
                                              Passed?
                                             /       \
                                          [Yes]      [No] ──► detect_intent (Retry)
                                           /
                                          ▼
                                     save_memory ──► END
```

---

## 4. Grounded Context Building & Prompt Management

### 4.1 Context Construction Pipeline
1.  **Identity:** Load profile details (CGPA, department, graduation year) from MongoDB.
2.  **Memory:** Pull conversation context and saved facts from Redis.
3.  **Knowledge:** Query relevant documents from Qdrant and re-rank them using Cohere.
4.  **Formatting:** Format the context parameters into prompt templates.

### 4.2 Prompt Management
Prompts are saved as external markdown files in `app/ai/prompts/` and loaded dynamically.

```python
# app/ai/prompts/manager.py
from pathlib import Path


class NexaPromptManager:
    def __init__(self):
        self.directory = Path(__file__).parent

    def get_formatted_prompt(self, name: str, **kwargs) -> str:
        template = (self.directory / f"{name}.md").read_text(encoding="utf-8")
        return template.format(**kwargs)
```

---

## 5. Multi-Provider Management & Fallback Selection

To handle API failures, the provider manager falls back to secondary models if the primary provider fails.

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
                      │ Return Resp │      │    Attempt Provider 2    │
                      └─────────────┘      │     (e.g., OpenAI)       │
                                           └────────────┬─────────────┘
                                                        │
                                                     Failed?
                                                     ╱      ╲
                                                   [No]     [Yes]
                                                   ╱          ╲
                                      ┌───────────┴─┐      ┌───▼──────────────────────┐
                                      │ Return Resp │      │   Rule-based Fallback    │
                                      └─────────────┘      └──────────────────────────┘
```

---

## 6. Response Validation & Edge Correction

The validator node checks responses for placeholders, format consistency, and incomplete sentences before returning the output.

```python
# app/ai/orchestrator/validator.py
class NexaResponseValidator:
    def validate_response(self, text: str, intent: str) -> tuple[bool, str]:
        # Block incomplete sentences
        if text.strip()[-1] not in [".", "!", "?", "}", "]"]:
            return False, "Response terminated abruptly."
            
        # Block leftover placeholder tags
        if "[insert" in text.lower():
            return False, "Response contains placeholder tags."
            
        return True, ""
```

If validation fails, the orchestrator triggers a retry step. If retries fail, it falls back to a rule-based response.

---

## 7. Operational SLA Performance Budgets

To keep latency low, AI-OS components must run within strict performance budgets:

| AI-OS Pipeline Stage | SLA Limit | Performance Target |
| :--- | :--- | :--- |
| **Intent Detection** | Query classification | Target: ≤ 100 ms |
| **Memory Lookup** | Redis + Qdrant scan | Target: ≤ 350 ms |
| **Vector Search RAG** | Qdrant + Cohere Rerank | Target: ≤ 570 ms |
| **Sandbox Execution** | Container run latency | Target: ≤ 2900 ms |
| **Stream Token Publish**| Token push overhead | Target: ≤ 30 ms per token |

---

*NEXA AI AI-OS Architecture | Version 1.0 | July 2026*
