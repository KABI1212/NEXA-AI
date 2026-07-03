# NEXA AI Directory Specification: `frontend/src/features/auth`

## 1. Purpose
User onboarding, registration, and login screens.

## 2. Expected Files
- `pages/LoginPage.tsx (Credential validation controls)`
- `components/ProtectedRoute.tsx (Role-based route guard shields)`

## 3. Responsibilities
Authenticate users and manage token storage.

## 4. Dependencies
- `react-hook-form`
- `zod`
- `@/shared/store/authStore`
