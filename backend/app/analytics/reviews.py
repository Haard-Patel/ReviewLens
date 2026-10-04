from backend.app.data.processor import load_processed_reviews


def get_reviews(
    page: int = 1,
    page_size: int = 20,
    search: str | None = None,
    rating: int | None = None,
    sentiment: str | None = None,
) -> dict:
    """Return filtered and paginated customer reviews."""

    df = load_processed_reviews()

    # ---------------------------------------------------------
    # Apply search filter
    # ---------------------------------------------------------

    if search:
        search_term = search.strip().lower()

        if search_term:
            df = df[
                df["review/text"]
                .fillna("")
                .str.lower()
                .str.contains(
                    search_term,
                    regex=False
                )
            ]

    # ---------------------------------------------------------
    # Apply rating filter
    # ---------------------------------------------------------

    if rating is not None:
        df = df[df["review/score"] == rating]

    # ---------------------------------------------------------
    # Apply sentiment filter
    # ---------------------------------------------------------

    if sentiment:
        df = df[
            df["sentiment"].str.lower()
            == sentiment.strip().lower()
        ]

    # ---------------------------------------------------------
    # Count matching reviews before pagination
    # ---------------------------------------------------------

    total_reviews = len(df)

    # ---------------------------------------------------------
    # Calculate pagination boundaries
    # ---------------------------------------------------------

    start = (page - 1) * page_size
    end = start + page_size

    paginated_reviews = df.iloc[start:end]

    # ---------------------------------------------------------
    # Convert reviews into API-friendly dictionaries
    # ---------------------------------------------------------

    reviews = []

    for _, row in paginated_reviews.iterrows():
        reviews.append(
            {
                "product_id": row["product/productId"],
                "rating": int(row["review/score"]),
                "review_date": row["review/time"].strftime(
                    "%Y-%m-%d"
                ),
                "summary": row["review/summary"],
                "text": row["review/text"],
                "sentiment": row["sentiment"],
                "helpful_votes": (
                    int(row["helpful_votes"])
                    if row["helpful_votes"] == row["helpful_votes"]
                    else None
                ),
                "total_votes": (
                    int(row["total_votes"])
                    if row["total_votes"] == row["total_votes"]
                    else None
                ),
                "helpfulness_rate": (
                    round(
                        float(row["helpfulness_rate"]),
                        4
                    )
                    if row["helpfulness_rate"]
                    == row["helpfulness_rate"]
                    else None
                ),
                "review_word_count": int(
                    row["review_word_count"]
                ),
            }
        )

    return {
        "page": page,
        "page_size": page_size,
        "total_reviews": total_reviews,
        "reviews": reviews,
    }