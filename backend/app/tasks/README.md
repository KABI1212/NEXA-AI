# NEXA AI Directory Specification: `backend/app/tasks`

## 1. Purpose
Asynchronous background task processing using Celery.

## 2. Expected Files
- `celery_app.py (Celery config details)`
- `resume_tasks.py (Async resume text parsing tasks)`
- `cert_tasks.py (Generates verified certificate PDFs)`

## 3. Responsibilities
Run resource-intensive operations in background workers.

## 4. Dependencies
- `celery`
- `redis`
- `app.services`
