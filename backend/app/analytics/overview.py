import pandas as pd
from backend.app.data.processor import load_processed_reviews


def build_overview() -> dict:
    """Calculate the core ReviewLens dashboard metrics."""

    df = load_processed_reviews()

    # Convert rating to numeric.
    df["review/score"] = pd.to_numeric(
        df["review/score"],
        errors="coerce"
    )

    # Remove rows without a valid rating.
    df = df.dropna(subset=["review/score"])

    total_reviews = len(df)
    average_rating = df["review/score"].mean()

    rating_distribution = (
        df["review/score"]
        .value_counts()
        .sort_index()
        .to_dict()
    )

    return {
        "total_reviews": total_reviews,
        "average_rating": round(float(average_rating), 2),
        "rating_distribution": {
            str(int(rating)): count
            for rating, count in rating_distribution.items()
        },
    }
