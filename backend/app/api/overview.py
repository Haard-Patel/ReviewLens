from fastapi import APIRouter

from backend.app.analytics.overview import build_overview

router = APIRouter(
    prefix="/api",
    tags=["Overview"],
)


@router.get("/overview")
def get_overview():
    """Return the core ReviewLens dashboard metrics."""
    return build_overview()