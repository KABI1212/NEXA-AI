# NEXA AI Directory Specification: `backend/app/workers/analytics`

## 1. Purpose
Celery worker updating dashboard data.

## 2. Expected Files
- `tasks.py (Periodic metrics update tasks)`

## 3. Responsibilities
Aggregate performance metrics in background workers.

## 4. Dependencies
- `celery`
- `beanie`
