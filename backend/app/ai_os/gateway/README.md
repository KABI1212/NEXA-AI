# NEXA AI Directory Specification: `backend/app/ai_os/gateway`

## 1. Purpose
Redacts PII and publishes streaming tokens.

## 2. Expected Files
- `anonymizer.py (PII filters)`
- `streaming.py (Redis publishers)`

## 3. Responsibilities
Scrub user inputs and stream tokens in real time.

## 4. Dependencies
- `redis`
- `re`
