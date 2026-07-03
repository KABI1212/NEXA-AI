# NEXA AI Directory Specification: `backend/app/websocket`

## 1. Purpose
Real-time communication WebSocket routers.

## 2. Expected Files
- `chat.py (Streams AI conversation tokens)`
- `notification.py (Pushes real-time user alerts)`
- `progress.py (Pushes background compilation updates)`

## 3. Responsibilities
Manage persistent connections and authorize tokens.

## 4. Dependencies
- `fastapi`
- `app.core.security`
