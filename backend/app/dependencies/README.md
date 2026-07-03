# NEXA AI Directory Specification: `backend/app/dependencies`

## 1. Purpose
FastAPI Dependency Injection helpers.

## 2. Expected Files
- `auth.py (Decodes authorization bearer tokens)`
- `database.py (Active Beanie database session connections)`
- `current_user.py (Extracts active user documents)`
- `permissions.py (Role permission checks)`

## 3. Responsibilities
Extract and inject runtime credentials safely.

## 4. Dependencies
- `fastapi`
- `app.core.security`
