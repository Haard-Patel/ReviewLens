from pathlib import Path
import pandas as pd


RAW_FILE = Path(__file__).resolve().parent.parent / "data" / "raw" / "Reviews.csv"


def parse_reviews(file_path):
    """Parse the Amazon Fine Food Reviews text-format dataset."""

    reviews = []
    current_review = {}

    with open(file_path, "r", encoding="latin-1") as file:

        for line in file:
            line = line.rstrip("\n")

            # Blank line means the current review is complete.
            if not line.strip():
                if current_review:
                    reviews.append(current_review)
                    current_review = {}
                continue

            # Split only at the first ': ' because review text
            # itself can contain colons.
            if ": " not in line:
                continue

            field, value = line.split(": ", 1)

            current_review[field] = value

        # Handle the final review if the file doesn't end with
        # a blank line.
        if current_review:
            reviews.append(current_review)

    return pd.DataFrame(reviews)


if __name__ == "__main__":
    df = parse_reviews(RAW_FILE)

    print("Dataset parsed successfully.")
    print(f"Rows: {len(df):,}")
    print(f"Columns: {len(df.columns)}")
    print("\nColumns:")
    print(df.columns.tolist())

    print("\nFirst review:")
    print(df.iloc[0])