# NEXA AI Directory Specification: `backend/app/modules/career`

## 1. Purpose
Student career goals, skill gap audits, and roadmap generations.

## 2. Expected Files
- `router.py (Goals & roadmaps endpoints router)`
- `service.py (Orchestrates goals calculations and roadmap generation steps)`
- `repository.py (Goals & roadmap collections lookups)`
- `schemas.py (Match response payloads definitions)`
- `models.py (Beanie CareerGoal and Skill document definitions)`

## 3. Responsibilities
Generate roadmaps, calculate match levels, and audit skill gaps.

## 4. Dependencies
- `app.shared`
- `app.ai_os`
