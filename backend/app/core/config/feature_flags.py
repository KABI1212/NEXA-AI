# backend/app/core/config/feature_flags.py
"""NEXA AI Feature Flags configurations.

Controls runtime behaviors of experimental or dynamic features.
"""

from typing import Dict
from pydantic import BaseModel, Field

class NexaFeatureFlags(BaseModel):
    # ── AI ENGINE CONTROLS ───────────────────────────────────────
    ENABLE_AI_MEMORY_SUMMARIES: bool = Field(
        default=True, 
        description="Toggle for compiling message summaries in Redis context."
    )
    ENABLE_COHERE_RERANKING: bool = Field(
        default=True,
        description="Toggle for using Cohere to rerank search results."
    )
    ENABLE_SANDBOX_COMPILING: bool = Field(
        default=True,
        description="Toggle for running code compilation inside isolated containers."
    )
    
    # ── DEBUGGING & TRACING CONTROLS ─────────────────────────────
    VERBOSE_AGENT_LOGGING: bool = Field(
        default=False,
        description="Toggle for verbose logs showing internal LangGraph decisions."
    )
    MOCK_AI_RESPONSES: bool = Field(
        default=False,
        description="Toggle for intercepting LLM calls and returning fake responses for tests."
    )

# Static feature flags instance
feature_flags = NexaFeatureFlags()
