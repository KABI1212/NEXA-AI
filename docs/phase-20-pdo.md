# NEXA AI — Production Deployment, DevOps & Enterprise Operations (PDO)
## Phase 20 — Implementation Blueprint

---

| Field              | Details                                                  |
|--------------------|----------------------------------------------------------|
| **Document**       | Production Deployment, DevOps & Enterprise Operations    |
| **Phase**          | 20 of 30                                                 |
| **Version**        | 1.0                                                      |
| **Platform**       | Docker + Docker Compose (Kubernetes-Ready Design)        |
| **CI/CD**          | GitHub Actions                                           |
| **Reverse Proxy**  | Nginx + Let's Encrypt SSL                                |
| **Status**         | ✅ Complete — Implementation Ready                      |

---

## Table of Contents

1. [NEXA AI Platform OS Design](#1-nexa-ai-platform-os-design)
2. [Multi-Stage Dockerfiles](#2-multi-stage-dockerfiles)
3. [Production Docker Compose Configuration](#3-production-docker-compose-configuration)
4. [Nginx Reverse Proxy & SSL Configuration](#4-nginx-reverse-proxy--ssl-configuration)
5. [GitHub Actions CI/CD Pipelines](#5-github-actions-cicd-pipelines)
6. [Database Backup & Recovery Services](#6-database-backup--recovery-services)
7. [API Health Checkers & Readiness Probes](#7-api-health-checkers--readiness-probes)
8. [Folder Structure Configuration](#8-folder-structure-configuration)
9. [Operational Performance SLA Target Metrics](#9-operational-performance-sla-target-metrics)

---

## 1. NEXA AI Platform OS Design

NEXA AI is deployed as a coordinated set of isolated service containers. Traffic enters through Nginx, which acts as the SSL termination proxy and routes traffic to the static frontend or the API gateway.

```
                            Internet (Client)
                                   │
                                   ▼
                      ┌─────────────────────────┐
                      │    Nginx Reverse Proxy  │
                      │  - Terminate SSL        │
                      │  - Route public traffic │
                      └────────────┬────────────┘
                                   │
          ┌────────────────────────┴────────────────────────┐
          │                                                 │
          ▼                                                 ▼
┌──────────────────┐                               ┌──────────────────┐
│  Vite Frontend   │                               │   FastAPI API    │
│  - Static files  │                               │   - Gateway      │
│  - Port 80       │                               │   - Port 8000    │
└──────────────────┘                               └────────┬─────────┘
                                                            │
                                             ┌──────────────┴──────────────┐
                                             ▼                             ▼
                                   ┌──────────────────┐           ┌──────────────────┐
                                   │  Celery Workers  │           │   Databases      │
                                   │  - Background    │           │ - MongoDB        │
                                   │  - Scheduled jobs│           │ - Qdrant (Vector)│
                                   └──────────────────┘           │ - Redis (Cache)  │
                                                                  └──────────────────┘
```

---

## 2. Multi-Stage Dockerfiles

### 2.1 Backend Dockerfile (FastAPI + Celery)

Uses multi-stage builds to compile C extensions (e.g. for Argon2 or cryptography) in a builder stage, keeping the final runtime image lightweight.

```dockerfile
# backend/Dockerfile
# ── Stage 1: Build Dependencies ──────────────────────
FROM python:3.13-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# ── Stage 2: Runtime Image ──────────────────────────
FROM python:3.13-slim AS runner

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /root/.local /root/.local
COPY . .

ENV PATH=/root/.local/bin:$PATH
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

# Run development server as non-root user for security
RUN useradd -u 8888 nexauser && chown -R nexauser:nexauser /app
USER nexauser

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 2.2 Frontend Dockerfile (Vite + Nginx Static)

```dockerfile
# frontend/Dockerfile
# ── Stage 1: Build Static Assets ─────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Stage 2: Serve Files with Nginx ──────────────────
FROM nginx:1.27-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

---

## 3. Production Docker Compose Configuration

```yaml
# deployment/docker-compose.prod.yml
version: '3.8'

networks:
  nexa_net:
    driver: bridge

volumes:
  mongodb_data:
  qdrant_data:
  redis_data:

services:
  nginx:
    image: nginx:1.27-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/ssl/certs:ro
    networks:
      - nexa_net
    depends_on:
      - web
      - api

  web:
    build:
      context: ../frontend
      dockerfile: Dockerfile
    networks:
      - nexa_net
    restart: always

  api:
    build:
      context: ../backend
      dockerfile: Dockerfile
    environment:
      - MONGO_URL=mongodb://mongodb:27017/nexa
      - REDIS_URL=redis://redis:6379/0
      - QDRANT_URL=http://qdrant:6333
    networks:
      - nexa_net
    depends_on:
      - mongodb
      - redis
      - qdrant
    restart: always

  celery_worker:
    build:
      context: ../backend
      dockerfile: Dockerfile
    command: celery -A app.tasks.celery_app worker --loglevel=info
    environment:
      - MONGO_URL=mongodb://mongodb:27017/nexa
      - REDIS_URL=redis://redis:6379/0
    networks:
      - nexa_net
    depends_on:
      - redis
    restart: always

  mongodb:
    image: mongo:7.0
    volumes:
      - mongodb_data:/data/db
    networks:
      - nexa_net
    restart: always

  redis:
    image: redis:7.2-alpine
    volumes:
      - redis_data:/data
    networks:
      - nexa_net
    restart: always

  qdrant:
    image: qdrant/qdrant:v1.9.0
    volumes:
      - qdrant_data:/qdrant/storage
    networks:
      - nexa_net
    restart: always
```

---

## 4. Nginx Reverse Proxy & SSL Configuration

```nginx
# deployment/nginx/nginx.conf
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Rate limiting rule: 10 requests per second per IP
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

    server {
        listen 80;
        server_name nexa-ai.platform;

        # Redirect HTTP to HTTPS
        return 301 https://$host$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name nexa-ai.platform;

        ssl_certificate /etc/ssl/certs/nexa.crt;
        ssl_certificate_key /etc/ssl/certs/nexa.key;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        # Security Headers
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
        add_header X-Frame-Options "DENY" always;
        add_header X-Content-Type-Options "nosniff" always;

        location / {
            proxy_pass http://web:80;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        location /api/v1/ {
            limit_req zone=api_limit burst=20 nodelay;
            proxy_pass http://api:8000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        # WebSocket endpoint routing
        location /api/v1/ws/ {
            proxy_pass http://api:8000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "Upgrade";
            proxy_set_header Host $host;
        }
    }
}
```

---

## 5. GitHub Actions CI/CD Pipelines

Automates testing, image compilation, and deployment pipelines.

```yaml
# .github/workflows/ci-cd.yml
name: NEXA AI CI/CD Pipeline

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.13"

      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt

      - name: Run Backend Tests
        run: |
          cd backend
          pytest

  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4

      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_HUB_USERNAME }}
          password: ${{ secrets.DOCKER_HUB_ACCESS_TOKEN }}

      - name: Build and Push Backend Image
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          push: true
          tags: nexa/backend:latest
```

---

## 6. Database Backup & Recovery Services

```bash
# deployment/scripts/backup_mongodb.sh
#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="/var/backups/mongodb"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="nexa_backup_${TIMESTAMP}"

mkdir -p "${BACKUP_DIR}"

echo "Starting MongoDB backup..."
docker exec -t nexa-mongodb-1 mongodump --db=nexa --out="/data/db/${BACKUP_NAME}"

# Tar zip package snapshot
tar -czf "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz" -C "/var/lib/docker/volumes/deployment_mongodb_data/_data" "${BACKUP_NAME}"

# Clean raw folder dump
rm -rf "/var/lib/docker/volumes/deployment_mongodb_data/_data/${BACKUP_NAME}"

echo "Backup created: ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"
```

---

## 7. Health Checkers & Readiness Probes

The API server exposes specific check paths to verify that backend databases and caching layers are online.

```python
# app/api/v1/system/health.py
from fastapi import APIRouter
from app.core.redis_client import get_redis
from app.schemas.common import APIResponse
from beanie import db

router = APIRouter(prefix="/system", tags=["System Diagnostics"])


@router.get("/health", response_model=APIResponse[dict])
async def system_health_check():
    """Diagnostic endpoint checking MongoDB and Redis status."""
    status_db = "online"
    status_redis = "online"

    try:
        # Check MongoDB connection
        await db.command("ping")
    except Exception:
        status_db = "offline"

    try:
        # Check Redis connection
        redis = await get_redis()
        await redis.ping()
    except Exception:
        status_redis = "offline"

    overall_status = "healthy"
    if status_db == "offline" or status_redis == "offline":
        overall_status = "unhealthy"

    return APIResponse.ok(
        data={
            "status": overall_status,
            "components": {
                "mongodb": status_db,
                "redis": status_redis
            }
        }
    )
```

---

## 8. Folder Structure Configuration

```
deployment/
├── docker/
│   ├── dev.yml
│   └── prod.yml             # Main Docker Compose configuration
├── kubernetes/
├── scripts/
│   └── backup_mongodb.sh    # Database backup script
├── monitoring/
├── nginx/
│   └── nginx.conf           # Reverse proxy configuration
├── ssl/
├── logs/
└── ci/
    └── github_actions/      # GitHub Actions yaml pipelines
```

---

## 9. Performance SLA Target Metrics

To ensure production reliability, operational tasks are monitored against these target metrics:

| Operational Tasks | Target Metric | Metric SLA |
| :--- | :--- | :--- |
| **Request Rate Limits** | Limit threshold | Target: max 10 req/sec |
| **Metrics Scraping** | Prom Scraper Latency | Target: ≤ 80 ms |
| **API Health Check** | DB check duration | Target: ≤ 200 ms |
| **Database Backup** | Runtime execution | Target: ≤ 45 seconds |
| **Deployment Flow** | Pipeline build duration | Target: ≤ 5 minutes |

---

## Phase Summary

| Phase | Document                                  | Status     |
|-------|-------------------------------------------|------------|
| 1     | Software Requirements Spec (SRS)          | ✅ Complete |
| 2     | Functional Requirements (FRS)             | ✅ Complete |
| 3     | Non-Functional Requirements (NFR)         | ✅ Complete |
| 4     | System Architecture Design (SAD)          | ✅ Complete |
| 5     | Technology Stack & Dev Standards          | ✅ Complete |
| 6     | Database Design & MongoDB Arch (DDA)      | ✅ Complete |
| 7     | Backend Architecture & FastAPI (BAD)      | ✅ Complete |
| 8     | Frontend Architecture & UI/UX (FAD)       | ✅ Complete |
| 9     | Authentication & Authorization System     | ✅ Complete |
| 10    | AI Multi-Agent System Architecture (AMSA)  | ✅ Complete |
| 11    | LangGraph Orchestrator & Workflow Engine  | ✅ Complete |
| 12    | AI Memory & Personalization Engine (AMPE)  | ✅ Complete |
| 13    | RAG & Knowledge Base Architecture          | ✅ Complete |
| 14    | AI Career Recommendation Engine (ACRE)     | ✅ Complete |
| 15    | AI Career Guidance Agent (CGA)            | ✅ Complete |
| 16    | AI Resume Intelligence System (RAIOS)      | ✅ Complete |
| 17    | AI Interview Coach System (AICPPS)        | ✅ Complete |
| 18    | AI Learning Management System (AI-LMS)     | ✅ Complete |
| 19    | Feedback & System Intelligence (FCLSIP)   | ✅ Complete |
| 20    | Production Deployment & DevOps (PDO)      | ✅ Complete |

---

> **Phase 20 Complete** — Containerization, Nginx proxy, and deployment pipelines defined.
>
> **The structural architecture core (Phases 1-20) is complete.**
>
> **Next: Phase 21 — Complete OpenAPI Specification**
> Exhaustive parameters, request/response models, exact status headers, and mock examples.

---

*NEXA AI Phase 20 — Production & DevOps | Version 1.0 | July 2026*
