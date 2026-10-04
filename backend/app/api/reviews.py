from fastapi import APIRouter, Depends
from backend.app.analytics.reviews import get_reviews


router = APIRouter(
    prefix="/api",
    tags=["Reviews"],
)


@router.get("/reviews")
def reviews_endpoint(
    page: int = 1,
    page_size: int = 20,
    search: str | None = None,
    rating: int | None = None,
    sentiment: str | None = None,
):
    """Return filtered and paginated customer reviews."""

    return get_reviews(
        page=page,
        page_size=page_size,
        search=search,
        rating=rating,
        sentiment=sentiment,
    )