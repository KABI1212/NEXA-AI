# NEXA AI Directory Specification: `backend/app/modules/learning`

## 1. Purpose
Courses catalog, lessons, adaptive quizzes, and certificate issuances.

## 2. Expected Files
- `router.py (Courses & quiz submissions router)`
- `service.py (Calculates LMS progress scores and builds certificate verification records)`
- `models.py (Beanie Course, Lesson, and Certificate document definitions)`

## 3. Responsibilities
Grade quiz questions, track user streaks, and generate verified certificate PDFs.

## 4. Dependencies
- `app.shared`
- `app.core.database`
- `reportlab`
