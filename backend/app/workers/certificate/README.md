# NEXA AI Directory Specification: `backend/app/workers/certificate`

## 1. Purpose
Celery worker building certificates.

## 2. Expected Files
- `tasks.py (Asynchronous certificate generation tasks)`

## 3. Responsibilities
Compile PDFs in background threads.

## 4. Dependencies
- `celery`
- `reportlab`
