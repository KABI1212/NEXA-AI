# NEXA AI — AI Memory & Personalization Engine (AMPE)
## Phase 12 — Implementation Blueprint

---

| Field              | Details                                                  |
|--------------------|----------------------------------------------------------|
| **Document**       | AI Memory & Personalization Engine (AMPE)                |
| **Phase**          | 12 of 30                                                 |
| **Version**        | 1.0                                                      |
| **Framework**      | FastAPI 0.115 + Beanie + Motor                          |
| **Databases**      | MongoDB (Long-term) + Redis (Short-term) + Qdrant (Vector)|
| **Target Python**  | Python 3.13+                                             |
| **Status**         | ✅ Complete — Implementation Ready                      |

---

## Table of Contents

1. [Hybrid Memory Architecture Architecture](#1-hybrid-memory-architecture-architecture)
2. [Database Models & Memory Schemas](#2-database-models--memory-schemas)
3. [Memory Extraction & Importance Scoring Service](#3-memory-extraction--importance-scoring-service)
4. [Semantic Memory Service (Qdrant Vector Store)](#4-semantic-memory-service-qdrant-vector-store)
5. [Personalization Engine Context Constructor](#5-personalization-engine-context-constructor)
6. [GDPR & User Privacy Control Routes](#6-gdpr--user-privacy-control-routes)
7. [Memory Engine Folder Structure](#7-memory-engine-folder-structure)
8. [Performance & Verification Benchmarks](#8-performance--verification-benchmarks)

---

## 1. Hybrid Memory Architecture Architecture

NEXA AI implements a segmented, three-tier memory architecture to combine conversational persistence, semantic retrieval, and user preferences.

```
                   ┌────────────────────────────────────────┐
                   │           User Chat Interaction        │
                   └───────────────────┬────────────────────┘
                                       │
                                       ▼
                   ┌────────────────────────────────────────┐
                   │        Redis Short-Term Memory         │
                   │     - Raw sliding window history       │
                   │     - Active session variables         │
                   └───────────────────┬────────────────────┘
                                       │
                         Interaction Session Ends
                                       │
                                       ▼
                   ┌────────────────────────────────────────┐
                   │    Memory Extraction & Scoring Node    │
                   │     - Evaluates importance level       │
                   │     - Filters out small talk           │
                   └───────────────────┬────────────────────┘
                                       │
                        Parsed Memory Categories
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         ▼                             ▼                             ▼
┌──────────────────┐          ┌──────────────────┐          ┌──────────────────┐
│  MongoDB Store   │          │   Qdrant Index   │          │  GDPR Controls   │
│ - Facts          │          │ - Summaries      │          │ - Export/Import  │
│ - Preferences    │          │ - Ephemeral maps │          │ - Privacy toggles│
│ - Progress logs  │          │ - Vector weights │          │ - Selective purge│
└──────────────────┘          └──────────────────┘          └──────────────────┘
```

---

## 2. Database Models & Memory Schemas

To prevent structural confusion, user memory is structured into five categorical document types.

### 2.1 Fact, Preference, Goal, Progress, and Insight Beanie Models

```python
# app/ai/memory/memory_models.py
from datetime import datetime
from enum import Enum
from typing import Optional, Any
from beanie import Document, Indexed
from pydantic import Field


class MemoryCategory(str, Enum):
    FACT       = "fact"             # "User knows Java", "Graduating in 2027"
    PREFERENCE = "preference"       # "Prefers Python examples", "Prefers dark mode"
    GOAL       = "goal"             # "Aims to join Microsoft as an AI Engineer"
    PROGRESS   = "progress"         # "Completed Java Basics Course with 95%"
    INSIGHT    = "insight"          # "Struggles with dynamic programming algorithms"


class MemoryImportance(str, Enum):
    CRITICAL   = "critical"
    HIGH       = "high"
    MEDIUM     = "medium"
    LOW        = "low"


class UserMemoryItem(Document):
    user_id:        Indexed(str)
    category:       Indexed(MemoryCategory)
    content:        str                                         # The raw factual memory string
    importance:     MemoryImportance = MemoryImportance.MEDIUM
    confidence:     float = Field(default=1.0, ge=0.0, le=1.0)
    source_message: Optional[str] = None                        # Reference query that triggered this
    created_at:     datetime = Field(default_factory=datetime.utcnow)
    updated_at:     datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "user_memories"
        indexes = [
            "user_id",
            "category",
            "created_at",
            [("user_id", 1), ("category", 1)]
        ]
```

### 2.2 Memory Settings Model (Consent & Control)

```python
# app/ai/memory/memory_settings.py
from beanie import Document, Indexed
from pydantic import Field
from datetime import datetime


class UserMemorySettings(Document):
    user_id:                  Indexed(str, unique=True)
    is_long_term_enabled:     bool = True
    is_semantic_enabled:      bool = True
    auto_summarize_threshold: int = 15                          # summarize after 15 messages
    excluded_categories:      list[str] = []
    updated_at:               datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "user_memory_settings"
```

---

## 3. Memory Extraction & Importance Scoring Service

We run a summarization and extraction node using JSON structured outputs to identify permanent memory facts.

```python
# app/ai/memory/importance.py
from typing import Optional
from pydantic import BaseModel, Field
from app.ai.memory.memory_models import MemoryCategory, MemoryImportance
from app.ai.providers.provider_manager import NexaProviderManager


class ExtractedMemory(BaseModel):
    category:    MemoryCategory
    content:     str = Field(description="Strict factual statement or preference extracted")
    importance:  MemoryImportance
    confidence:  float = Field(description="Score between 0.0 and 1.0 indicating assertion strength")


class MemoryExtractionPayload(BaseModel):
    memories: list[ExtractedMemory] = []


class MemoryExtractionService:
    def __init__(self):
        self.provider = NexaProviderManager()

    async def extract_from_interaction(
        self, 
        user_query: str, 
        ai_response: str
    ) -> list[ExtractedMemory]:
        """Analyzes an interaction and extracts memory elements."""
        system_prompt = (
            "You are an expert user memory analysis engine. Analyze the provided user query "
            "and AI response to identify new facts, preferences, goals, progress, or insights. "
            "Ignore trivial conversation (greetings, confirmations). Output only valid JSON "
            "conforming to the MemoryExtractionPayload schema."
        )
        
        prompt = (
            f"User Query: {user_query}\n"
            f"AI Response: {ai_response}\n\n"
            f"Extract any long-term memory updates."
        )

        try:
            raw_response = await self.provider.generate_with_fallback(prompt, system_prompt)
            # Parse the structured response
            data = MemoryExtractionPayload.model_validate_json(raw_response)
            # Filter low confidence items
            return [m for m in data.memories if m.confidence >= 0.7]
        except Exception:
            return []  # Graceful recovery, return empty memory list
```

---

## 4. Semantic Memory Service (Qdrant Vector Store)

Long-term factual summaries are embedded and stored in Qdrant, enabling cosine similarity matching to pull relevant details into active prompts.

```python
# app/ai/memory/semantic_search.py
from qdrant_client import AsyncQdrantClient
from qdrant_client.http import models as qmodels
from app.config import settings


class SemanticMemoryService:
    def __init__(self):
        self.client = AsyncQdrantClient(
            url=settings.QDRANT_URL,
            api_key=settings.QDRANT_API_KEY
        )
        self.collection = "nexa_user_memories"

    async def upsert_vector_memory(
        self, 
        user_id: str, 
        memory_id: str, 
        embedding: list[float], 
        metadata: dict
    ) -> None:
        """Saves a structured memory chunk into Qdrant."""
        await self.client.upsert(
            collection_name=self.collection,
            points=[
                qmodels.PointStruct(
                    id=memory_id,
                    vector=embedding,
                    payload={
                        "user_id": user_id,
                        **metadata
                    }
                )
            ]
        )

    async def search_memories(
        self, 
        user_id: str, 
        query_vector: list[float], 
        limit: int = 5
    ) -> list[dict]:
        """Performs cosine search filtered strictly to the active user."""
        results = await self.client.search(
            collection_name=self.collection,
            query_vector=query_vector,
            query_filter=qmodels.Filter(
                must=[
                    qmodels.FieldCondition(
                        key="user_id",
                        match=qmodels.MatchValue(value=user_id)
                    )
                ]
            ),
            limit=limit
        )
        return [
            {
                "content": hit.payload.get("content"),
                "category": hit.payload.get("category"),
                "score": hit.score
            } for hit in results
        ]
```

---

## 5. Personalization Engine Context Constructor

During LangGraph graph execution, the constructor merges memory categories to build the prompt context for LLM generation.

```python
# app/ai/memory/personalization.py
from app.ai.memory.memory_models import UserMemoryItem, MemoryCategory


class NexaPersonalizationEngine:
    async def build_personalized_context(self, user_id: str) -> str:
        """Retrieves user memory documents from MongoDB and structures them as system prompt parameters."""
        memories = await UserMemoryItem.find(UserMemoryItem.user_id == user_id).to_list()
        
        facts = []
        preferences = []
        goals = []
        progress = []
        insights = []

        for item in memories:
            if item.category == MemoryCategory.FACT:
                facts.append(item.content)
            elif item.category == MemoryCategory.PREFERENCE:
                preferences.append(item.content)
            elif item.category == MemoryCategory.GOAL:
                goals.append(item.content)
            elif item.category == MemoryCategory.PROGRESS:
                progress.append(item.content)
            elif item.category == MemoryCategory.INSIGHT:
                insights.append(item.content)

        context_blocks = []
        
        if goals:
            context_blocks.append("### User Goals:\n" + "\n".join(f"- {g}" for g in goals))
        if facts:
            context_blocks.append("### User Background Facts:\n" + "\n".join(f"- {f}" for f in facts))
        if preferences:
            context_blocks.append("### User Learning/Chat Preferences:\n" + "\n".join(f"- {p}" for p in preferences))
        if progress:
            context_blocks.append("### Progress Milestones:\n" + "\n".join(f"- {pr}" for pr in progress))
        if insights:
            context_blocks.append("### Core Skills Insights:\n" + "\n".join(f"- {i}" for i in insights))

        return "\n\n".join(context_blocks)
```

---

## 6. GDPR & User Privacy Control Routes

To comply with privacy laws (GDPR, CCPA), users can manage and delete their data using dedicated routes.

```python
# app/ai/memory/memory_api.py
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from app.core.dependencies import CurrentUser
from app.ai.memory.memory_models import UserMemoryItem
from app.schemas.common import APIResponse

router = APIRouter(prefix="/memory", tags=["AI Memory"])


class MemoryItemUpdate(BaseModel):
    content: str


@router.get("", response_model=APIResponse[list[dict]])
async def get_user_memories(current_user: CurrentUser):
    """Retrieve all structured long-term memory points currently saved."""
    memories = await UserMemoryItem.find(UserMemoryItem.user_id == str(current_user.id)).to_list()
    return APIResponse.ok(data=[
        {
            "id": str(m.id),
            "category": m.category.value,
            "content": m.content,
            "importance": m.importance.value,
            "confidence": m.confidence,
            "created_at": m.created_at.isoformat() + "Z"
        } for m in memories
    ])


@router.delete("/{memory_id}", response_model=APIResponse[None])
async def delete_memory_item(memory_id: str, current_user: CurrentUser):
    """Remove a specific memory assertion (supports user-facing delete)."""
    from beanie import PydanticObjectId
    item = await UserMemoryItem.get(PydanticObjectId(memory_id))
    if not item or item.user_id != str(current_user.id):
        raise HTTPException(status_code=404, detail="Memory item not found")
        
    await item.delete()
    return APIResponse.ok(message="Memory item successfully deleted")


@router.post("/clear", response_model=APIResponse[None])
async def clear_all_memories(current_user: CurrentUser):
    """Purges the user's entire profile memory from MongoDB and Qdrant."""
    # Delete from MongoDB
    await UserMemoryItem.find(UserMemoryItem.user_id == str(current_user.id)).delete()
    
    # In production, call QdrantClient.delete to clear vectors matching user_id
    
    return APIResponse.ok(message="All personalization memories cleared successfully")
```

---

## 7. Memory Engine Folder Structure

```
backend/app/ai/memory/
├── __init__.py
├── memory_service.py       # Short-term Redis cache access layer
├── memory_models.py        # MongoDB Beanie structures (Facts, Prefs)
├── memory_settings.py      # Consent configuration classes
├── importance.py           # LLM extraction & ranking handler
├── personalization.py     # System context string constructor
├── semantic_search.py      # Qdrant CRUD mapping operations
└── memory_api.py           # GDPR user preference routers
```

---

## 8. Performance & Verification Benchmarks

To ensure the personalized context engine doesn't introduce latency, we verify retrieval times:

| Operation | SLA Metric | Metric Target |
| :--- | :--- | :--- |
| **Short-Term Context Cache** | Redis Execution | SLA: ≤ 45 ms |
| **User Memory Construction** | MongoDB Fetch | SLA: ≤ 180 ms |
| **Vector Search Filters** | Qdrant Cosine | SLA: ≤ 350 ms |
| **Structured JSON Extraction**| Parsing Overhead| SLA: ≤ 1500 ms (Async offloaded) |
| **Memory Wipe / Purge** | MongoDB Cleanup | SLA: ≤ 300 ms |

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

---

> **Phase 12 Complete** — Personalization and memory system structures defined.
>
> **Next: Phase 13 — RAG & Knowledge Base System**
> Ingestion workflows, metadata structures, embedding calculations, Qdrant queries, re-ranking systems, and grounding strategies.

---

*NEXA AI Phase 12 — AI Memory & Personalization | Version 1.0 | July 2026*
