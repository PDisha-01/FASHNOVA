from .loader import load_fashion_data


def clean_fashion_data(df):
    """Clean and standardize fashion product metadata."""

    data = df.copy()

    # Standardize text columns.
    text_columns = [
        "gender",
        "masterCategory",
        "subCategory",
        "articleType",
        "baseColour",
        "season",
        "usage",
        "productDisplayName",
    ]

    for column in text_columns:
        data[column] = data[column].astype(str).str.strip()

    # Remove invalid placeholder values from categorical fields.
    invalid_values = {
        "",
        "nan",
        "NaN",
        "NA",
        "N/A",
        "null",
        "None",
    }

    for column in text_columns:
        data = data[
            ~data[column].isin(invalid_values)
        ].copy()

    # Ensure year is numeric.
    data["year"] = data["year"].astype(int)

    # Ensure IDs are unique.
    data = data.drop_duplicates(subset=["id"])

    return data


def create_year_summary(df):
    """Create yearly dataset statistics."""

    yearly = (
        df.groupby("year")
        .size()
        .reset_index(name="product_count")
        .sort_values("year")
    )

    yearly["dataset_share"] = (
        yearly["product_count"]
        / yearly["product_count"].sum()
    )

    return yearly


def create_attribute_share(df, attribute):
    """
    Calculate the yearly normalized share of an attribute.

    Example:
        baseColour = Blue
        year = 2012

    share =
        blue products in 2012 /
        all products in 2012
    """

    counts = (
        df.groupby(["year", attribute])
        .size()
        .reset_index(name="product_count")
    )

    yearly_totals = (
        df.groupby("year")
        .size()
        .reset_index(name="year_total")
    )

    result = counts.merge(
        yearly_totals,
        on="year",
        how="left",
    )

    result["share"] = (
        result["product_count"]
        / result["year_total"]
    )

    return result.sort_values(
        ["year", "share"],
        ascending=[True, False],
    )


if __name__ == "__main__":
    data = load_fashion_data()

    print("Loading dataset...")
    print(f"Raw rows: {len(data):,}")

    data = clean_fashion_data(data)

    print(f"Clean rows: {len(data):,}")

    print("\n=== YEAR SUMMARY ===")

    yearly = create_year_summary(data)
    print(yearly.to_string(index=False))

    print("\n=== COLOR SHARE SAMPLE ===")

    color_share = create_attribute_share(
        data,
        "baseColour",
    )

    print(
        color_share.head(20).to_string(index=False)
    )

    print("\n=== CATEGORY SHARE SAMPLE ===")

    category_share = create_attribute_share(
        data,
        "articleType",
    )

    print(
        category_share.head(20).to_string(index=False)
    )