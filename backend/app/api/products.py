from fastapi import APIRouter

from backend.app.analytics.products import get_products


router = APIRouter(
    prefix="/api",
    tags=["Products"],
)


@router.get("/products")
def products_endpoint(
    page: int = 1,
    page_size: int = 20,
    search: str | None = None,
    sort: str = "reviews",
):
    """Return product-level analytics with sorting and pagination."""

    return get_products(
        page=page,
        page_size=page_size,
        search=search,
        sort=sort,
    )