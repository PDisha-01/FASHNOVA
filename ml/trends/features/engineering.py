from __future__ import annotations

import numpy as np
import pandas as pd


# Controls how strongly small yearly samples are down-weighted.
RELIABILITY_PRIOR = 100


def build_yearly_attribute_share(
    df: pd.DataFrame,
    attribute: str,
) -> pd.DataFrame:
    """
    Build a complete year-by-attribute time series.

    Missing category/year combinations are represented as zero
    only when the dataset contains observations for that year.
    """

    if attribute not in df.columns:
        raise ValueError(
            f"Unknown attribute: {attribute}"
        )

    # All years represented in the dataset.
    years = sorted(df["year"].unique())

    # All values represented by the attribute.
    values = sorted(df[attribute].dropna().unique())

    # Count products for every year/category combination.
    counts = (
        df.groupby(["year", attribute])
        .size()
        .rename("product_count")
        .reset_index()
    )

    # Total number of products in each year.
    yearly_total = (
        df.groupby("year")
        .size()
        .rename("year_total")
        .reset_index()
    )

    # Complete year × attribute grid.
    grid = pd.MultiIndex.from_product(
        [years, values],
        names=["year", attribute],
    ).to_frame(index=False)

    result = grid.merge(
        counts,
        on=["year", attribute],
        how="left",
    )

    result = result.merge(
        yearly_total,
        on="year",
        how="left",
    )

    result["product_count"] = (
        result["product_count"]
        .fillna(0)
        .astype(int)
    )

    # Normalized share within the year.
    result["share"] = (
        result["product_count"]
        / result["year_total"]
    )

    # Reliability reflects how much data exists for that year.
    #
    # 2 products   -> ~0.02
    # 100 products -> 0.50
    # 1,000        -> ~0.91
    # 10,000       -> ~0.99
    result["reliability"] = (
        result["year_total"]
        / (
            result["year_total"]
            + RELIABILITY_PRIOR
        )
    )

    result["is_reliable_year"] = (
        result["year_total"]
        >= RELIABILITY_PRIOR
    )

    return result.sort_values(
        ["year", attribute]
    ).reset_index(drop=True)


def add_growth_features(
    df: pd.DataFrame,
    group_column: str,
) -> pd.DataFrame:
    """
    Add year-over-year trend signals.

    Because the input now contains every year/category
    combination, shift(1) always represents the previous
    calendar year.
    """

    result = df.copy()

    grouped = result.groupby(
        group_column,
        sort=False,
    )

    # Absolute change in market share.
    result["share_change"] = (
        grouped["share"]
        .diff()
        .fillna(0.0)
    )

    # Relative growth.
    #
    # We use a small denominator floor to avoid enormous
    # percentages when a category moves from a tiny share.
    previous_share = grouped["share"].shift(1)

    denominator = previous_share.abs().clip(
        lower=0.001
    )

    result["growth"] = (
        result["share_change"]
        / denominator
    )

    # A category appearing for the first time should not
    # automatically be interpreted as a strong growth signal.
    first_observation = previous_share.isna()

    result.loc[first_observation, "growth"] = 0.0

    result["growth"] = (
        result["growth"]
        .replace(
            [np.inf, -np.inf],
            np.nan,
        )
        .fillna(0.0)
    )

    # Keep extreme mathematical ratios from dominating
    # downstream models.
    result["growth"] = result["growth"].clip(
        lower=-2.0,
        upper=2.0,
    )

    # Three-year rolling average of share change.
    result["momentum"] = (
        grouped["share_change"]
        .transform(
            lambda series: series
            .rolling(
                window=3,
                min_periods=2,
            )
            .mean()
        )
        .fillna(0.0)
    )

    # Change in momentum = acceleration/deceleration.
    result["acceleration"] = (
        result.groupby(group_column)["momentum"]
        .diff()
        .fillna(0.0)
    )

    # Three-year share average.
    result["share_rolling_3y"] = (
        grouped["share"]
        .transform(
            lambda series: series
            .rolling(
                window=3,
                min_periods=1,
            )
            .mean()
        )
    )

    # Rolling volatility.
    result["volatility_3y"] = (
        grouped["share_change"]
        .transform(
            lambda series: series
            .rolling(
                window=3,
                min_periods=2,
            )
            .std()
        )
        .fillna(0.0)
    )

    return result


def add_reliability_weighting(
    df: pd.DataFrame,
) -> pd.DataFrame:
    """Create reliability-weighted trend signals."""

    result = df.copy()

    result["weighted_growth"] = (
        result["growth"]
        * result["reliability"]
    )

    result["weighted_momentum"] = (
        result["momentum"]
        * result["reliability"]
    )

    result["weighted_acceleration"] = (
        result["acceleration"]
        * result["reliability"]
    )

    return result


def add_yearly_rank(
    df: pd.DataFrame,
    group_column: str,
) -> pd.DataFrame:
    """Rank observed attribute values by yearly share."""

    result = df.copy()

    result["share_rank"] = np.nan

    observed = result["share"] > 0

    result.loc[observed, "share_rank"] = (
        result.loc[observed]
        .groupby("year")["share"]
        .rank(
            method="min",
            ascending=False,
        )
    )

    return result
def build_trend_features(
    df: pd.DataFrame,
    attributes: list[str] | None = None,
) -> dict[str, pd.DataFrame]:
    """
    Build the complete feature set for FASHNOVA Trends.
    """

    if attributes is None:
        attributes = [
            "baseColour",
            "articleType",
            "subCategory",
            "season",
            "usage",
        ]

    features = {}

    for attribute in attributes:

        yearly = build_yearly_attribute_share(
            df,
            attribute,
        )

        yearly = add_growth_features(
            yearly,
            attribute,
        )

        yearly = add_reliability_weighting(
            yearly,
        )

        yearly = add_yearly_rank(
            yearly,
            attribute,
        )

        features[attribute] = yearly

    return features


if __name__ == "__main__":
    from ml.trends.data.loader import load_fashion_data
    from ml.trends.data.processor import clean_fashion_data

    print("Loading dataset...")

    data = load_fashion_data()
    data = clean_fashion_data(data)

    print(f"Clean rows: {len(data):,}")

    features = build_trend_features(
        data,
        attributes=[
            "baseColour",
            "articleType",
            "subCategory",
        ],
    )

    print("\n=== CORRECTED TREND FEATURE ENGINEERING ===")

    for attribute, result in features.items():

        print(f"\n--- {attribute} ---")

        print(
            result[
                [
                    "year",
                    attribute,
                    "product_count",
                    "year_total",
                    "share",
                    "reliability",
                    "share_change",
                    "growth",
                    "momentum",
                    "acceleration",
                    "weighted_growth",
                    "weighted_momentum",
                    "share_rank",
                ]
            ]
            .head(20)
            .to_string(index=False)
        )