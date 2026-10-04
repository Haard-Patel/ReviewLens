import pandas as pd
from backend.app.data.processor import load_processed_reviews

def build_overview() -> dict:
    """Calculate the core ReviewLens dashboard metrics."""

    df = load_processed_reviews()

    # ---------------------------------------------------------
    # Core review metrics
    # ---------------------------------------------------------

    total_reviews = len(df)

    average_rating = df["review/score"].mean()

    # ---------------------------------------------------------
    # Rating distribution
    # ---------------------------------------------------------

    rating_distribution = (
        df["review/score"]
        .value_counts()
        .sort_index()
        .to_dict()
    )

    # ---------------------------------------------------------
    # Sentiment distribution
    # ---------------------------------------------------------

    sentiment_distribution = (
        df["sentiment"]
        .value_counts()
        .to_dict()
    )

    # ---------------------------------------------------------
    # Review activity by year
    # ---------------------------------------------------------

    reviews_by_year = (
        df["review_year"]
        .value_counts()
        .sort_index()
        .to_dict()
    )

        # ---------------------------------------------------------
    # Top products by review volume
    # ---------------------------------------------------------

    top_products = (
        df.groupby("product/productId")
        .agg(
            review_count=("product/productId", "size"),
            average_rating=("review/score", "mean"),
        )
        .sort_values(
            "review_count",
            ascending=False
        )
        .head(10)
        .reset_index()
    )
    top_products = [
        {
            "product_id": row["product/productId"],
            "review_count": int(row["review_count"]),
            "average_rating": round(
                float(row["average_rating"]),
                2
            ),
        }
        for _, row in top_products.iterrows()
    ]

        # ---------------------------------------------------------
    # Review engagement metrics
    # ---------------------------------------------------------

    average_review_length = df["review_word_count"].mean()

    valid_helpfulness = df["helpfulness_rate"].dropna()

    average_helpfulness_rate = valid_helpfulness.mean()

    reviews_with_helpfulness = len(valid_helpfulness)

    total_helpful_votes = df["helpful_votes"].sum()

    total_votes = df["total_votes"].sum()

    # ---------------------------------------------------------
    # Return API response
    # ---------------------------------------------------------

    return {
        "total_reviews": total_reviews,
        "average_rating": round(float(average_rating), 2),

        "rating_distribution": {
            str(int(rating)): int(count)
            for rating, count in rating_distribution.items()
        },

        "sentiment_distribution": {
            str(sentiment): int(count)
            for sentiment, count in sentiment_distribution.items()
        },

        "reviews_by_year": {
            str(int(year)): int(count)
            for year, count in reviews_by_year.items()
        },
                "top_products": top_products,

                "engagement": {
            "average_review_length_words": round(
                float(average_review_length),
                2
            ),
            "average_helpfulness_rate(x100 = %)": round(
                float(average_helpfulness_rate),
                4
            ),
            "reviews_with_helpfulness": int(
                reviews_with_helpfulness
            ),
            "total_helpful_votes": int(
                total_helpful_votes
            ),
            "total_votes": int(
                total_votes
            ),
        },
        
    }