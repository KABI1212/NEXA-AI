# NEXA AI Directory Specification: `backend/app/modules/coding`

## 1. Purpose
Coding lab workspaces and isolated compilers compiler runs.

## 2. Expected Files
- `router.py (Sandbox run execution endpoint hooks)`
- `service.py (Orchestrates container compiling and runtime monitor threads)`
- `models.py (Beanie CodingSubmission document definitions)`

## 3. Responsibilities
Compile user code safely inside isolated containers and enforce resource limits.

## 4. Dependencies
- `app.shared`
- `docker`
