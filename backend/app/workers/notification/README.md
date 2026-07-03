# NEXA AI Directory Specification: `backend/app/workers/notification`

## 1. Purpose
Celery worker sending notifications.

## 2. Expected Files
- `tasks.py (Email and alert dispatch tasks)`

## 3. Responsibilities
Send emails and system notifications in background workers.

## 4. Dependencies
- `celery`
- `aiosmtplib`
