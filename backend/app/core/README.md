# NEXA AI Directory Specification: `backend/app/core`

## 1. Purpose
Global configurations, database connection managers, and security providers.

## 2. Expected Files
- `config.py (Pydantic base settings)`
- `database.py (Beanie init & Redis client pool)`
- `security.py (Argon2id and JWT signing helpers)`
- `exceptions.py (Global exception base hierarchy)`

## 3. Responsibilities
Bootstrap application lifecycle configurations, database pools, and cryptographies.

## 4. Dependencies
- `pydantic-settings`
- `beanie`
- `redis`
- `passlib`
