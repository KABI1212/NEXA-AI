# NEXA AI Developer Guide: Naming Conventions

---

## 1. Case Standards

| Asset Type | Case Pattern | Example |
| :--- | :--- | :--- |
| **Python Classes** | PascalCase | `NexaUserDocument` |
| **Python Functions** | snake_case | `decode_access_token` |
| **Python Variables** | snake_case | `user_id` |
| **React Components** | PascalCase | `NexaButton.tsx` |
| **TypeScript Types** | PascalCase | `UserSession` |
| **Env Variables** | UPPER_CASE | `MONGO_URL` |

---

## 2. Database Naming Conventions

*   **Collections:** Always use plural, lowercase snake_case (e.g., `users`, `career_goals`).
*   **Properties:** Always use lowercase snake_case (e.g., `is_deleted`, `ats_score`).
