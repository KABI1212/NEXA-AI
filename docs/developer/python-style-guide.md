# NEXA AI Developer Guide: Python Style Guide

---

## 1. Code Formatting Standards

*   **Conformance:** Strictly follow **PEP 8** specifications.
*   **Target Engine:** **Python 3.12** core capabilities.
*   **Formatter:** Enforce configurations with **Ruff** for linting and formatting.

---

## 2. Type Annotations & Hints

All function signatures and class properties must declare explicit type annotations.

*   **Correct:**
    ```python
    def calculate_score(user_id: str, skills: list[str]) -> float:
        return 100.0
    ```
*   **Incorrect:**
    ```python
    def calculate_score(user_id, skills):
        return 100.0
    ```

---

## 3. Exception Handling & Logging

*   Never use bare `except:` blocks. Always catch specific exceptions.
*   Log errors using structured logging parameters. Include `user_id` and trace variables where available.

```python
import logging

logger = logging.getLogger("nexa.auth")

try:
    user = await user_repository.get_by_id(user_id)
except DBConnectionError as exc:
    logger.error(f"Database connection lost during user fetch | UserID: {user_id}", exc_info=True)
    raise ServiceUnavailableException("Database connection error.")
```
