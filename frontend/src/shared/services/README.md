# NEXA AI Directory Specification: `frontend/src/shared/services`

## 1. Purpose
Axios clients configuration.

## 2. Expected Files
- `api.ts (Axios client with token refresh interceptors)`

## 3. Responsibilities
Manage API requests, intercept 401 errors, and refresh tokens silently.

## 4. Dependencies
- `axios`
- `@/shared/store/authStore`
