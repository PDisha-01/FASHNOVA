from pathlib import Path

import pandas as pd


PROJECT_ROOT = Path(__file__).resolve().parents[3]

DATASET_PATH = (
    PROJECT_ROOT
    / "ml"
    / "trends"
    / "data"
    / "raw"
    / "fashion_product_images"
    / "styles.csv"
)


REQUIRED_COLUMNS = [
    "id",
    "gender",
    "masterCategory",
    "subCategory",
    "articleType",
    "baseColour",
    "season",
    "year",
    "usage",
    "productDisplayName",
]


def load_fashion_data() -> pd.DataFrame:
    """Load and validate the raw fashion product metadata."""

    if not DATASET_PATH.exists():
        raise FileNotFoundError(
            f"Fashion dataset not found at: {DATASET_PATH}"
        )

    rows = []

    with DATASET_PATH.open(
        "r",
        encoding="utf-8",
        errors="replace",
    ) as file:
        header = file.readline().strip().split(",")

        if header != REQUIRED_COLUMNS:
            raise ValueError(
                "Unexpected dataset columns.\n"
                f"Expected: {REQUIRED_COLUMNS}\n"
                f"Found: {header}"
            )

        for line_number, line in enumerate(file, start=2):
            line = line.rstrip("\n\r")

            if not line.strip():
                continue

            # The dataset contains occasional commas inside
            # productDisplayName. The first 9 fields are fixed,
            # so split only on the first 9 commas.
            fields = line.split(",", 9)

            if len(fields) != 10:
                raise ValueError(
                    f"Malformed row at line {line_number}: "
                    f"expected 10 fields, found {len(fields)}"
                )

            rows.append(fields)

    df = pd.DataFrame(rows, columns=REQUIRED_COLUMNS)

    # Convert numeric fields to their appropriate types.
    df["id"] = pd.to_numeric(df["id"], errors="coerce")
    df["year"] = pd.to_numeric(df["year"], errors="coerce")

    # Remove rows where essential identifiers are invalid.
    df = df.dropna(subset=["id", "year"]).copy()

    df["id"] = df["id"].astype("int64")
    df["year"] = df["year"].astype("int64")

    return df


if __name__ == "__main__":
    data = load_fashion_data()

    print("Dataset loaded successfully.")
    print(f"Rows: {len(data):,}")
    print(f"Columns: {len(data.columns)}")

    print("\nColumns:")
    print(data.columns.tolist())

    print("\nFirst 5 rows:")
    print(data.head().to_string(index=False))