# NEXA AI Directory Specification: `backend/app/workers/learning`

## 1. Purpose
Celery worker monitoring compilation runtimes.

## 2. Expected Files
- `tasks.py (Timeout monitors tasks)`

## 3. Responsibilities
Monitor sandbox containers to prevent infinite loops.

## 4. Dependencies
- `celery`
- `docker`
