import pandas as pd

from backend.app.data.processor import load_processed_reviews


def get_products(
    page: int = 1,
    page_size: int = 20,
    search: str | None = None,
) -> dict:
    """Return product-level analytics for ReviewLens."""

    df = load_processed_reviews()

    # ---------------------------------------------------------
    # Search products by product ID
    # ---------------------------------------------------------

    if search:
        search_term = search.strip().lower()

        if search_term:
            df = df[
                df["product/productId"]
                .fillna("")
                .str.lower()
                .str.contains(
                    search_term,
                    regex=False,
                )
            ]

    # ---------------------------------------------------------
    # Calculate product-level metrics
    # ---------------------------------------------------------

    products = (
        df.groupby("product/productId")
        .agg(
            review_count=("product/productId", "size"),
            average_rating=("review/score", "mean"),
            average_helpfulness=("helpfulness_rate", "mean"),
        )
        .reset_index()
    )

    # ---------------------------------------------------------
    # Calculate positive and negative review counts
    # ---------------------------------------------------------

    sentiment_counts = pd.crosstab(
        df["product/productId"],
        df["sentiment"],
    ).reindex(
        columns=["Negative", "Neutral", "Positive"],
        fill_value=0,
    )

    products = products.set_index("product/productId")

    products["negative_reviews"] = sentiment_counts["Negative"]
    products["neutral_reviews"] = sentiment_counts["Neutral"]
    products["positive_reviews"] = sentiment_counts["Positive"]

    products = products.reset_index()

    # ---------------------------------------------------------
    # Calculate sentiment percentages
    # ---------------------------------------------------------

    products["positive_percentage"] = (
        products["positive_reviews"]
        / products["review_count"]
        * 100
    )

    products["negative_percentage"] = (
        products["negative_reviews"]
        / products["review_count"]
        * 100
    )

    # ---------------------------------------------------------
    # Sort by review volume
    # ---------------------------------------------------------

    products = products.sort_values(
        "review_count",
        ascending=False,
    )

    # ---------------------------------------------------------
    # Count products before pagination
    # ---------------------------------------------------------

    total_products = len(products)

    # ---------------------------------------------------------
    # Apply pagination
    # ---------------------------------------------------------

    start = (page - 1) * page_size
    end = start + page_size

    products = products.iloc[start:end]

    # ---------------------------------------------------------
    # Convert to API-friendly records
    # ---------------------------------------------------------

    product_records = []

    for _, row in products.iterrows():
        product_records.append(
            {
                "product_id": row["product/productId"],
                "review_count": int(row["review_count"]),
                "average_rating": round(
                    float(row["average_rating"]),
                    2,
                ),
                "average_helpfulness": (
                    round(
                        float(row["average_helpfulness"]),
                        4,
                    )
                    if pd.notna(row["average_helpfulness"])
                    else None
                ),
                "positive_reviews": int(
                    row["positive_reviews"]
                ),
                "neutral_reviews": int(
                    row["neutral_reviews"]
                ),
                "negative_reviews": int(
                    row["negative_reviews"]
                ),
                "positive_percentage": round(
                    float(row["positive_percentage"]),
                    2,
                ),
                "negative_percentage": round(
                    float(row["negative_percentage"]),
                    2,
                ),
            }
        )

    return {
        "page": page,
        "page_size": page_size,
        "total_products": total_products,
        "products": product_records,
    }