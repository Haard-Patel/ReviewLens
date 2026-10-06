from backend.app.data.processor import load_processed_reviews


def build_ratings_analysis() -> dict:
    """Calculate rating analytics for the ReviewLens dashboard."""

    df = load_processed_reviews()

    # ---------------------------------------------------------
    # Rating distribution
    # ---------------------------------------------------------

    rating_distribution = (
        df["review/score"]
        .value_counts()
        .sort_index()
    )

    ratings = []

    for rating, count in rating_distribution.items():
        ratings.append(
            {
                "rating": int(rating),
                "review_count": int(count),
                "percentage": round(
                    float(count / len(df) * 100),
                    2,
                ),
            }
        )

    # ---------------------------------------------------------
    # Review length by rating
    # ---------------------------------------------------------

    review_length_by_rating = (
        df.groupby("review/score")["review_word_count"]
        .mean()
        .sort_index()
    )

    review_length = []

    for rating, average_length in review_length_by_rating.items():
        review_length.append(
            {
                "rating": int(rating),
                "average_review_length_words": round(
                    float(average_length),
                    2,
                ),
            }
        )

    # ---------------------------------------------------------
    # Helpfulness by rating
    # ---------------------------------------------------------

    helpfulness_by_rating = (
        df.groupby("review/score")["helpfulness_rate"]
        .mean()
        .sort_index()
    )

    helpfulness = []

    for rating, average_helpfulness in helpfulness_by_rating.items():
        helpfulness.append(
            {
                "rating": int(rating),
                "average_helpfulness_rate": round(
                    float(average_helpfulness),
                    4,
                ),
            }
        )

    return {
        "ratings": ratings,
        "review_length_by_rating": review_length,
        "helpfulness_by_rating": helpfulness,
    }