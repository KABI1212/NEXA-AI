# backend/app/modules/identity/router.py
from fastapi import APIRouter

router = APIRouter(prefix="/auth", tags=["Identity"])

@router.get("/session-stub")
async def session_stub():
    return {"status": "stub"}
