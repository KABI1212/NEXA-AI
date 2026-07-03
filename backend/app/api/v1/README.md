# NEXA AI Directory Specification: `backend/app/api/v1`

## 1. Purpose
REST API route endpoints definition and request schema validation checks.

## 2. Expected Files
- `auth.py (Login, register, refresh tokens)`
- `resume.py (Resume upload & ATS checks)`
- `learning.py (LMS course details & quiz submission routing)`
- `coding.py (Monaco execution endpoint hooks)`

## 3. Responsibilities
Parse HTTP requests, check header tokens, enforce role access, and structure JSON responses.

## 4. Dependencies
- `fastapi`
- `app.services`
- `app.core.dependencies`
