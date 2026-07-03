# NEXA AI Directory Specification: `backend/app/modules/interview`

## 1. Purpose
STAR-based mock interviews and performance feedback.

## 2. Expected Files
- `router.py (Interview session setup endpoints)`
- `service.py (Evaluates behavioral responses against STAR targets)`
- `models.py (Beanie InterviewSession document definitions)`

## 3. Responsibilities
Grade behavioral responses and generate mock performance reports.

## 4. Dependencies
- `app.shared`
- `app.ai_os`
