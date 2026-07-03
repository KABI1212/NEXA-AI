# NEXA AI Directory Specification: `backend/tests/ai_eval`

## 1. Purpose
Semantic checks for RAG pipelines and LLM responses.

## 2. Expected Files
- `test_rag_grounding.py (Response quality checks)`
- `test_hallucinations.py (Hallucination detection checks)`

## 3. Responsibilities
Validate that LLM responses do not contain placeholders or formatting errors.

## 4. Dependencies
- `pytest`
- `app.ai.orchestrator`
