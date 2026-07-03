# NEXA AI Directory Specification: `backend/app/ai_os/providers`

## 1. Purpose
LLM client configuration and failovers.

## 2. Expected Files
- `manager.py (Client selector client)`

## 3. Responsibilities
Configure LLM clients and handle failover routing.

## 4. Dependencies
- `openai`
- `google-genai`
- `anthropic`
