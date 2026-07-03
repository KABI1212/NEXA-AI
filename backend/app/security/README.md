# NEXA AI Directory Specification: `backend/app/security`

## 1. Purpose
Cryptographic authentication helpers.

## 2. Expected Files
- `jwt.py (RS256 JWT encoding and decoding)`
- `password.py (Argon2id password hashing)`
- `oauth.py (OAuth integration flows)`
- `csrf.py (CSRF validation checks)`

## 3. Responsibilities
Secure password data, manage JWT tokens, and prevent cross-site request forgery.

## 4. Dependencies
- `cryptography`
- `passlib`
- `jwt`
