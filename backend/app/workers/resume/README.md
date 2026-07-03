# NEXA AI Directory Specification: `backend/app/workers/resume`

## 1. Purpose
Celery worker processing resume analysis.

## 2. Expected Files
- `tasks.py (Asynchronous resume text parsing task details)`

## 3. Responsibilities
Parse uploaded resumes in background threads.

## 4. Dependencies
- `celery`
- `pdfplumber`
