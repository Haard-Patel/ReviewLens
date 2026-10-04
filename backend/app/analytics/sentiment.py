import pandas as pd
from backend.app.data.processor import load_processed_reviews


def build_sentiment_analysis() -> dict:
    """Calculate sentiment analytics for the ReviewLens dashboard."""

    df = load_processed_reviews()

    # ---------------------------------------------------------
    # Overall sentiment distribution
    # ---------------------------------------------------------

    sentiment_distribution = (
        df["sentiment"]
        .value_counts()
        .to_dict()
    )

    # ---------------------------------------------------------
    # Sentiment by rating
    # ---------------------------------------------------------

    sentiment_by_rating = (
        pd.crosstab(
            df["review/score"],
            df["sentiment"]
        )
        .reindex(
            index=[1, 2, 3, 4, 5],
            columns=["Negative", "Neutral", "Positive"],
            fill_value=0,
        )
    )

    # ---------------------------------------------------------
    # Convert sentiment-by-rating counts into API records
    # ---------------------------------------------------------

    sentiment_by_rating_records = []

    for rating, row in sentiment_by_rating.iterrows():
        sentiment_by_rating_records.append(
            {
                "rating": int(rating),
                "negative": int(row["Negative"]),
                "neutral": int(row["Neutral"]),
                "positive": int(row["Positive"]),
            }
        )

    # ---------------------------------------------------------
    # Sentiment percentages by rating
    # ---------------------------------------------------------

    sentiment_percentages = []

    for rating, row in sentiment_by_rating.iterrows():
        total = row.sum()

        sentiment_percentages.append(
            {
                "rating": int(rating),
                "negative": round(
                    float(row["Negative"] / total * 100),
                    2,
                ),
                "neutral": round(
                    float(row["Neutral"] / total * 100),
                    2,
                ),
                "positive": round(
                    float(row["Positive"] / total * 100),
                    2,
                ),
            }
        )

    return {
        "sentiment_distribution": {
            str(sentiment): int(count)
            for sentiment, count
            in sentiment_distribution.items()
        },
        "sentiment_by_rating": sentiment_by_rating_records,
        "sentiment_percentages_by_rating": sentiment_percentages,
    }