# NEXA AI Directory Specification: `backend/app/modules/resume`

## 1. Purpose
Resume parsed PDF extraction, keyword audits, and ATS suggestions.

## 2. Expected Files
- `router.py (Uploader and optimizer endpoints)`
- `service.py (Orchestrates PDF blocks parsing and ATS grading)`
- `models.py (Beanie Resume and ATSReport document definitions)`

## 3. Responsibilities
Parse PDF sections, calculate ATS scores, and rewrite description bullet points.

## 4. Dependencies
- `app.shared`
- `pdfplumber`
- `app.ai_os`
