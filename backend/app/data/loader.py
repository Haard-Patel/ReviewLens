from pathlib import Path

import pandas as pd

from src.parse_reviews import parse_reviews


PROJECT_ROOT = Path(__file__).resolve().parents[3]
DATA_PATH = PROJECT_ROOT / "data" / "raw" / "Reviews.csv"


def load_reviews() -> pd.DataFrame:
    """Load the Amazon Fine Food Reviews dataset."""

    if not DATA_PATH.exists():
        raise FileNotFoundError(
            f"Dataset not found at: {DATA_PATH}"
        )

    return parse_reviews(DATA_PATH)