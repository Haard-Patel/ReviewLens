from fastapi import APIRouter

from backend.app.analytics.sentiment import build_sentiment_analysis


router = APIRouter(
    prefix="/api",
    tags=["Sentiment"],
)


@router.get("/sentiment")
def get_sentiment():
    """Return sentiment analytics for the ReviewLens dashboard."""

    return build_sentiment_analysis()