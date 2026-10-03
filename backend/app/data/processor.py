from pathlib import Path

import numpy as np
import pandas as pd

from backend.app.data.loader import load_reviews


PROJECT_ROOT = Path(__file__).resolve().parents[3]
PROCESSED_DIR = PROJECT_ROOT / "data" / "processed"
PROCESSED_FILE = PROCESSED_DIR / "reviews_processed.csv"


def process_reviews() -> pd.DataFrame:
    """Clean and enrich the raw review dataset."""

    df = load_reviews().copy()

    # Convert rating to numeric.
    df["review/score"] = pd.to_numeric(
        df["review/score"],
        errors="coerce"
    )

    # Convert Unix timestamp to datetime.
    df["review/time"] = pd.to_datetime(
        pd.to_numeric(df["review/time"], errors="coerce"),
        unit="s"
    )

    # Split helpfulness values such as "3/5".
    helpfulness_split = df["review/helpfulness"].str.split(
        "/",
        expand=True
    )

    df["helpful_votes"] = pd.to_numeric(
        helpfulness_split[0],
        errors="coerce"
    )

    df["total_votes"] = pd.to_numeric(
        helpfulness_split[1],
        errors="coerce"
    )

    # Identify invalid helpfulness records.
    invalid_helpfulness = (
        (df["helpful_votes"] < 0)
        | (df["total_votes"] < 0)
        | (df["helpful_votes"] > df["total_votes"])
    )

    # Preserve the reviews but invalidate the problematic vote values.
    df.loc[
        invalid_helpfulness,
        ["helpful_votes", "total_votes"]
    ] = np.nan

    # Remove exact duplicate reviews.
    df = df.drop_duplicates().reset_index(drop=True)

    # Calculate helpfulness rate.
    df["helpfulness_rate"] = np.where(
        df["total_votes"] > 0,
        df["helpful_votes"] / df["total_votes"],
        np.nan
    )

    # Calculate review word count.
    df["review_word_count"] = (
        df["review/text"]
        .fillna("")
        .str.split()
        .str.len()
    )

    # Add convenient year field.
    df["review_year"] = df["review/time"].dt.year

    return df


def save_processed_reviews() -> pd.DataFrame:
    """Process reviews and save the result locally."""

    df = process_reviews()

    PROCESSED_DIR.mkdir(
        parents=True,
        exist_ok=True
    )

    df.to_csv(
        PROCESSED_FILE,
        index=False
    )

    return df


def load_processed_reviews() -> pd.DataFrame:
    """Load the processed dataset, creating it if necessary."""

    if not PROCESSED_FILE.exists():
        return save_processed_reviews()

    return pd.read_csv(
        PROCESSED_FILE,
        parse_dates=["review/time"]
    )