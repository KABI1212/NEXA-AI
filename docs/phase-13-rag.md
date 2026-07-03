# NEXA AI — RAG & Knowledge Base Architecture
## Phase 13 — Implementation Blueprint

---

| Field              | Details                                                  |
|--------------------|----------------------------------------------------------|
| **Document**       | RAG & Knowledge Base Architecture                        |
| **Phase**          | 13 of 30                                                 |
| **Version**        | 1.0                                                      |
| **Vector DB**      | Qdrant                                                   |
| **Embedding Model**| `text-embedding-3-small` (1536-dim)                     |
| **Rerank Model**   | `cohere-rerank-v3`                                      |
| **Target Python**  | Python 3.13+                                             |
| **Status**         | ✅ Complete — Implementation Ready                      |

---

## Table of Contents

1. [RAG Data Ingestion & Retrieval Pipeline](#1-rag-data-ingestion--retrieval-pipeline)
2. [MongoDB Metadata & Governance Models](#2-mongodb-metadata--governance-models)
3. [Text Chunking & Embedding Generation Service](#3-text-chunking--embedding-generation-service)
4. [Qdrant Hybrid Vector Store & Index Configuration](#4-qdrant-hybrid-vector-store--index-configuration)
5. [Retrieve & Re-Rank Orchestration Layer](#5-retrieve--re-rank-orchestration-layer)
6. [Citation Parsing & Grounding Filters](#6-citation-parsing--grounding-filters)
7. [GDPR & Document Access Control Schemes](#7-gdpr--document-access-control-schemes)
8. [Folder Structure Configuration](#8-folder-structure-configuration)
9. [Performance & latency Budget](#9-performance--latency-budget)

---

## 1. RAG Data Ingestion & Retrieval Pipeline

NEXA AI uses a hybrid retrieval pipeline combining semantic vector similarity with keyword search (BM25) over targeted Qdrant indices, re-ranked using a cross-encoder model to return grounding contexts.

```
                      ┌─────────────────────────────────┐
                      │      Raw Ingestion Files        │
                      │  (PDF, DOCX, Markdown, CSV)     │
                      └────────────────┬────────────────┘
                                       │
                                       ▼
                      ┌─────────────────────────────────┐
                      │    Recursive Semantic Splitter  │
                      │     - 500-token target size     │
                      │     - 10% structural overlap    │
                      └────────────────┬────────────────┘
                                       │
                                       ▼
                      ┌─────────────────────────────────┐
                      │    OpenAI Vector Embeddings     │
                      │   - text-embedding-3-small      │
                      │   - 1536 dimensions             │
                      └────────────────┬────────────────┘
                                       │
                         Ingested Points & Metadata
                                       │
         ┌─────────────────────────────┴─────────────────────────────┐
         ▼                                                           ▼
┌──────────────────┐                                        ┌──────────────────┐
│  MongoDB Store   │                                        │   Qdrant Index   │
│ - Document tags  │                                        │ - Vector points  │
│ - Access rules   │                                        │ - Payload filters│
│ - Chunk indexes  │                                        │ - Payload indices│
└──────────────────┘                                        └──────────────────┘
```

---

## 2. MongoDB Metadata & Governance Models

We use MongoDB documents to track the ingestion state, validation signatures, and ownership rights of uploaded documentation.

```python
# app/ai/rag/knowledge/document_models.py
from datetime import datetime
from enum import Enum
from typing import Optional, Any
from beanie import Document, Indexed
from pydantic import Field


class IngestionStatus(str, Enum):
    PENDING     = "pending"
    PROCESSING  = "processing"
    COMPLETED   = "completed"
    FAILED      = "failed"


class KnowledgeDomain(str, Enum):
    CAREER         = "career"
    LEARNING       = "learning"
    RESUME         = "resume"
    INTERVIEW      = "interview"
    COMPANY        = "company"
    CERTIFICATION  = "certification"


class NexaDocument(Document):
    title:         str
    filename:      str
    domain:        Indexed(KnowledgeDomain)
    file_size:     int
    mime_type:     str
    sha256_hash:   Indexed(str, unique=True)
    status:        IngestedStatus = IngestionStatus.PENDING
    
    # ── Governance ────────────────────────────────────
    version:       str = "1.0"
    is_active:     bool = True
    owner_id:      Optional[str] = None
    created_at:    datetime = Field(default_factory=datetime.utcnow)
    updated_at:    datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "nexa_documents"
        indexes = [
            "domain",
            "sha256_hash",
            "created_at"
        ]
```

---

## 3. Text Chunking & Embedding Generation Service

Documents are parsed and split recursively to maintain context structure, preserving lists and code formatting blocks.

```python
# app/ai/rag/ingestion/chunker.py
from typing import list
import re


class RecursiveSemanticSplitter:
    def __init__(self, chunk_size: int = 500, overlap: int = 50):
        self.chunk_size = chunk_size
        self.overlap = overlap

    def split_text(self, text: str) -> list[str]:
        """Splits markdown and text recursively based on structural semantic boundaries."""
        # Split on headers first, then paragraphs, then sentences
        separators = ["\n## ", "\n### ", "\n\n", "\n", ". ", " "]
        return self._split(text, separators)

    def _split(self, text: str, separators: list[str]) -> list[str]:
        if len(text.split()) <= self.chunk_size:
            return [text]

        if not separators:
            # Fallback split
            words = text.split()
            chunks = []
            for i in range(0, len(words), self.chunk_size - self.overlap):
                chunks.append(" ".join(words[i:i + self.chunk_size]))
            return chunks

        sep = separators[0]
        parts = text.split(sep)
        chunks = []
        current_chunk = []
        current_size = 0

        for part in parts:
            part_len = len(part.split())
            if current_size + part_len <= self.chunk_size:
                current_chunk.append(part)
                current_size += part_len
            else:
                if current_chunk:
                    chunks.append(sep.join(current_chunk))
                # Recursively split the part if it exceeds size
                if part_len > self.chunk_size:
                    chunks.extend(self._split(part, separators[1:]))
                    current_chunk = []
                    current_size = 0
                else:
                    current_chunk = [part]
                    current_size = part_len

        if current_chunk:
            chunks.append(sep.join(current_chunk))

        return chunks
```

---

## 4. Qdrant Hybrid Vector Store & Index Configuration

Qdrant vectors are created inside domain-specific collections, using HNSW indices on the payload values to optimize high-performance filtered searches.

```python
# app/ai/rag/qdrant/collections.py
from qdrant_client import AsyncQdrantClient
from qdrant_client.http import models as qmodels
from app.config import settings


class QdrantIndexManager:
    def __init__(self):
        self.client = AsyncQdrantClient(
            url=settings.QDRANT_URL,
            api_key=settings.QDRANT_API_KEY
        )

    async def initialize_domain_collection(self, domain_name: str) -> None:
        """Initializes a collection in Qdrant with HNSW indexes and payload search fields."""
        collection_exists = await self.client.collection_exists(domain_name)
        if not collection_exists:
            await self.client.create_collection(
                collection_name=domain_name,
                vectors_config=qmodels.VectorParams(
                    size=1536,  # 1536 for OpenAI text-embedding-3-small
                    distance=qmodels.Distance.COSINE
                ),
                hnsw_config=qmodels.HnswConfigDiff(
                    m=16,
                    ef_construct=100
                )
            )
            # Create payload index for document source routing
            await self.client.create_payload_index(
                collection_name=domain_name,
                field_name="document_id",
                field_schema=qmodels.PayloadSchemaType.KEYWORD
            )
```

---

## 5. Retrieve & Re-Rank Orchestration Layer

The retriever executes hybrid searches against the Qdrant index, then runs a second-stage cross-encoder re-ranking pass to narrow down inputs.

```python
# app/ai/rag/retrieval/reranker.py
import httpx
from typing import Any
from app.config import settings


class CohereRerankClient:
    def __init__(self):
        self.api_url = "https://api.cohere.com/v1/rerank"
        self.api_key = settings.COHERE_API_KEY
        self.model = "rerank-english-v3.0"

    async def rerank(self, query: str, documents: list[dict[str, Any]], top_n: int = 5) -> list[dict[str, Any]]:
        """Re-ranks candidate chunks using the Cohere v3 cross-encoder API."""
        if not documents:
            return []

        formatted_docs = [doc["content"] for doc in documents]
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": self.model,
            "query": query,
            "documents": formatted_docs,
            "top_n": top_n
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(self.api_url, json=payload, headers=headers)
            if response.status_code != 200:
                # Fallback to returning original top_n un-reranked on error
                return documents[:top_n]
            
            result = response.json()
            
        reranked_docs = []
        for item in result["results"]:
            index = item["index"]
            original_doc = documents[index]
            original_doc["rerank_score"] = item["relevance_score"]
            reranked_docs.append(original_doc)
            
        return reranked_docs
```

---

## 6. Citation Parsing & Grounding Filters

The context builder maps chunk metadata (like section and document title) to structural citations, grounding model responses.

```python
# app/ai/rag/retrieval/context_builder.py
from typing import Any


class NexaRAGContextBuilder:
    def build_grounded_prompt(self, query: str, reranked_chunks: list[dict[str, Any]]) -> tuple[str, str]:
        """
        Structures the system context block and provides citations reference mappings.
        Returns (context_prompt, citation_footer).
        """
        citations = []
        context_parts = []

        for idx, chunk in enumerate(reranked_chunks):
            doc_id = chunk.get("document_id", "Unknown")
            title = chunk.get("title", "Reference Doc")
            section = chunk.get("section", "General")
            
            cite_key = f"[{idx + 1}]"
            citations.append(f"{cite_key} {title} - Section: {section} (Source: {doc_id})")
            
            context_parts.append(
                f"Source citation: {cite_key}\n"
                f"Document Title: {title}\n"
                f"Content Chunk:\n{chunk['content']}"
            )

        citation_footer = "\n".join(citations)
        system_context_block = (
            "You are a grounded Career Mentor. Use the following context documents to answer "
            "the user's query. If the context does not contain sufficient details, state that you "
            "don't know rather than hallucinating facts. Cite your sources in the text using "
            "the matching brackets matching the context IDs (e.g. [1]).\n\n"
            "=== Context Documents ===\n" + "\n\n".join(context_parts)
        )
        
        return system_context_block, citation_footer
```

---

## 7. GDPR & Document Access Control Schemes

To enforce security isolation, RAG queries include payload conditions to filter out documents that the user does not have permission to view.

```python
# app/ai/rag/qdrant/filters.py
from qdrant_client.http import models as qmodels


def build_user_access_filter(user_role: str, user_id: str) -> qmodels.Filter:
    """Builds access checks based on document metadata flags."""
    # Admins can access all documents
    if user_role in ["admin", "super_admin"]:
        return qmodels.Filter(
            must=[]
        )
        
    # Standard students can only access public documents or documents assigned to them
    return qmodels.Filter(
        must=[
            qmodels.FieldCondition(
                key="is_public",
                match=qmodels.MatchValue(value=True)
            )
        ],
        should=[
            qmodels.FieldCondition(
                key="shared_user_ids",
                match=qmodels.MatchValue(value=user_id)
            )
        ]
    )
```

---

## 8. Folder Structure Configuration

```
backend/app/ai/rag/
├── __init__.py
├── ingestion/
│   ├── __init__.py
│   ├── loader.py
│   ├── parser.py
│   ├── chunker.py            # Recursive semantic text chunk splitter
│   └── metadata.py
├── embeddings/
│   ├── __init__.py
│   └── embedding_service.py  # Dimensionality mappings
├── retrieval/
│   ├── __init__.py
│   ├── retriever.py          # Dual retrieval client
│   ├── reranker.py           # Cohere cross-encoder API client
│   └── context_builder.py    # Grounded prompt context constructor
├── knowledge/
│   ├── __init__.py
│   └── document_models.py    # MongoDB metadata document structures
├── qdrant/
│   ├── __init__.py
│   ├── client.py
│   └── collections.py        # Qdrant collection schemas
└── api/
    └── rag_router.py         # Document upload API endpoints
```

---

## 9. Performance & Latency Budget

To maintain a fast interface, execution durations are monitored against targeted latency values:

| Ingestion Step | Metric Metric | Verification Target |
| :--- | :--- | :--- |
| **Token Ingestion Chunks** | Process Speed | Target: ≤ 800 ms per MB |
| **Embedding Generation** | Vectors Vector | Target: ≤ 120 ms per chunk |
| **Qdrant Indexes Lookup** | Query Similarity| Target: ≤ 250 ms latency |
| **Rerank Sorting Stage** | Cross-Encoder | Target: ≤ 320 ms latency |
| **Context Generation** | String assembly | Target: ≤ 100 ms latency |

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

---

> **Phase 13 Complete** — RAG architecture and knowledge retrieval schemas defined.
>
> **Next: Phase 14 — AI Career Recommendation Engine**
> Algorithm definitions, skill mapping vectors, matching metrics, placement score models, and roadmap planning patterns.

---

*NEXA AI Phase 13 — RAG & Knowledge Base | Version 1.0 | July 2026*
