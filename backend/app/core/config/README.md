# NEXA AI Directory Specification: `backend/app/core/config`

## 1. Purpose
Multi-environment settings loaders.

## 2. Expected Files
- `base.py (Global settings loader class)`
- `development.py (Local dev variables override)`
- `production.py (Prod credentials and secure variables)`
- `testing.py (Testing overrides using in-memory databases)`
- `settings.py (Runtime instance selector)`

## 3. Responsibilities
Load and validate environment variables dynamically.

## 4. Dependencies
- `pydantic-settings`
