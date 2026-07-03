# NEXA AI Directory Specification: `backend/app/middleware`

## 1. Purpose
FastAPI HTTP middleware filters intercepting incoming requests.

## 2. Expected Files
- `request_id.py (Injects trace UUID headers)`
- `logging.py (Formats execution duration JSON logs)`
- `cors.py (CORS origin validation checks)`
- `security.py (Injects security protection headers)`
- `rate_limit.py (Rate limits using Redis keys)`

## 3. Responsibilities
Trace connections, validate headers, and block denial-of-service attempts.

## 4. Dependencies
- `fastapi`
- `redis`
