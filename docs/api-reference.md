# NEXA AI — API Reference Spec (OpenAPI)
## Platform Endpoint Specifications & REST Guide

---

| Field              | Details                                                  |
|--------------------|----------------------------------------------------------|
| **Document**       | API Reference Specification                              |
| **Version**        | 1.0                                                      |
| **Format**         | RESTful API (JSON Payload formats)                       |
| **Authentication** | JWT RS256 Bearer Token / Refresh Cookie                 |
| **Status**         | ✅ Complete — Implementation Ready                      |

---

## 1. Global Response Standards

### 1.1 Success Payload Structure
```json
{
  "success": true,
  "message": "Request completed successfully",
  "data": {},
  "metadata": {
    "timestamp": "2026-07-03T11:22:00Z"
  }
}
```

### 1.2 Error Payload Structure
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Input validation checks failed",
    "details": [
      {
        "field": "email",
        "issue": "Must be a valid email format."
      }
    ]
  }
}
```

---

## 2. API Endpoint Catalog

### 2.1 Identity Domain

#### 2.1.1 Register Account
*   **Method:** `POST`
*   **URL:** `/api/v1/auth/register`
*   **Authentication:** None.
*   **Permissions:** Public.
*   **Request Schema:**
    ```json
    {
      "first_name": "John",
      "last_name": "Doe",
      "email": "student@college.edu",
      "password": "SecurePassword123!"
    }
    ```
*   **Response Schema (201 Created):**
    ```json
    {
      "success": true,
      "message": "User registered successfully.",
      "data": {
        "user_id": "usr_9k2j1m4p",
        "email": "student@college.edu",
        "role": "student",
        "is_verified": false
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request` (Email already registered)
    *   `422 Unprocessable Entity` (Password does not meet complexity requirements)

#### 2.1.2 Authenticate Session
*   **Method:** `POST`
*   **URL:** `/api/v1/auth/login`
*   **Authentication:** None.
*   **Request Schema:**
    ```json
    {
      "email": "student@college.edu",
      "password": "SecurePassword123!"
    }
    ```
*   **Response Schema (200 OK):**
    ```json
    {
      "success": true,
      "message": "Authentication successful.",
      "data": {
        "access_token": "eyJhbGciOiJSUzI1Ni...",
        "token_type": "Bearer",
        "user": {
          "user_id": "usr_9k2j1m4p",
          "role": "student"
        }
      }
    }
    ```
*   **Error Responses:**
    *   `401 Unauthorized` (Incorrect password or locked account)

---

### 2.2 Career Domain

#### 2.2.1 Calculate Career Match
*   **Method:** `POST`
*   **URL:** `/api/v1/recommend/career`
*   **Authentication:** JWT Bearer Access Token.
*   **Permissions:** Student, Admin.
*   **Request Schema:** None (Matches based on active user session).
*   **Response Schema (200 OK):**
    ```json
    {
      "success": true,
      "message": "Career recommendations generated.",
      "data": {
        "match_score": 85.5,
        "target_role": "Software Engineer",
        "matched_skills": ["Python", "SQL"],
        "missing_skills": ["Docker", "Kubernetes"]
      }
    }
    ```
*   **Error Responses:**
    *   `401 Unauthorized` (Invalid JWT Token)
    *   `404 Not Found` (Profile document not found)

---

### 2.3 Learning Domain

#### 2.3.1 Submit Coding Challenge
*   **Method:** `POST`
*   **URL:** `/api/v1/coding/submit`
*   **Authentication:** JWT Bearer Access Token.
*   **Permissions:** Student, Admin.
*   **Request Schema:**
    ```json
    {
      "problem_id": "prob_4p0z7x",
      "language": "python",
      "code": "def solution():\n    return True"
    }
    ```
*   **Response Schema (200 OK):**
    ```json
    {
      "success": true,
      "message": "Code submission graded.",
      "data": {
        "passed": true,
        "runtime_ms": 120.5,
        "memory_bytes": 1048576,
        "score": 100
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request` (Sandbox compilation timeout)

---

## 3. Operational Performance SLA Targets

To ensure a responsive interface, API endpoints are designed to match strict latency targets:

| Endpoint | Target Latency | Metric SLA Target |
| :--- | :--- | :--- |
| **`POST /auth/login`** | Authentication checks | Target: ≤ 100 ms |
| **`GET /courses`** | Paginated catalog query| Target: ≤ 80 ms |
| **`POST /resume/upload`** | Parsing & text extract | Target: ≤ 2500 ms |
| **`POST /coding/submit`**| Isolated compiler sandbox| Target: ≤ 2900 ms |
| **`GET /probes/ready`** | DB & Redis ping checks | Target: ≤ 120 ms |

---

*NEXA AI API Reference | Version 1.0 | July 2026*
