from fastapi import APIRouter

from backend.app.analytics.ratings import build_ratings_analysis


router = APIRouter(
    prefix="/api",
    tags=["Ratings"],
)


@router.get("/ratings")
def get_ratings():
    """Return rating analytics for the ReviewLens dashboard."""

    return build_ratings_analysis()