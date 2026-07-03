# backend/tests/test_main.py
"""NEXA AI Unit Tests: Application Probes.

Verifies probe check responses (/health, /ready, /live) return expected status payloads.
"""

import pytest
from httpx import AsyncClient

pytestmark = pytest.mark.asyncio


async def test_health_probe(async_client: AsyncClient):
    """Verifies that the GET /health probe returns 200 OK."""
    response = await async_client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


async def test_ready_probe(async_client: AsyncClient):
    """Verifies that the GET /ready probe returns 200 OK."""
    response = await async_client.get("/ready")
    assert response.status_code == 200
    assert response.json()["status"] == "ready"


async def test_live_probe(async_client: AsyncClient):
    """Verifies that the GET /live probe returns 200 OK."""
    response = await async_client.get("/live")
    assert response.status_code == 200
    assert response.json()["status"] == "live"
