from __future__ import annotations

import pandas as pd


# Minimum conditions for a trend classification.
MIN_RELIABILITY = 0.70
MIN_SHARE = 0.005
MIN_GROWTH_FOR_EMERGING = 0.10
MIN_GROWTH_FOR_RISING = 0.05
MIN_GROWTH_FOR_DECLINING = -0.05


def classify_lifecycle(
    share: float,
    growth: float,
    momentum: float,
    reliability: float,
) -> str:
    """
    Classify the current lifecycle state of a fashion attribute.

    Classification is based on:
    - current normalized share
    - year-over-year growth
    - momentum
    - reliability of the yearly sample
    """

    # The yearly sample is too small to make a reliable
    # trend judgement.
    if reliability < MIN_RELIABILITY:
        return "INSUFFICIENT_DATA"

    # A category/color/etc. with no current representation
    # is not an active trend.
    if share <= 0:
        return "FADING"

    # EMERGING:
    # Small but meaningful current presence with positive
    # growth and positive momentum.
    if (
        share < 0.03
        and growth >= MIN_GROWTH_FOR_EMERGING
        and momentum > 0
    ):
        return "EMERGING"

    # RISING:
    # Established presence with continued positive movement.
    if (
        growth >= MIN_GROWTH_FOR_RISING
        and momentum > 0
    ):
        return "RISING"

    # DECLINING:
    # Meaningful presence with negative movement.
    if (
        growth <= MIN_GROWTH_FOR_DECLINING
        and momentum < 0
    ):
        return "DECLINING"

    # PEAK:
    # Large established share, but momentum has turned negative.
    if (
        share >= 0.03
        and growth < MIN_GROWTH_FOR_RISING
        and momentum < 0
    ):
        return "PEAK"

    return "STABLE"

    # RISING:
    # Established presence with continued positive movement.
    if growth > 0.08 and momentum >= 0:
        return "RISING"

    # PEAK:
    # Strong presence, but growth is beginning to slow
    # or reverse after a strong upward period.
    if (
        share >= 0.03
        and growth <= 0.08
        and momentum < 0
    ):
        return "PEAK"

    # DECLINING:
    # Meaningful presence with sustained negative movement.
    if growth < -0.08 and momentum <= 0:
        return "DECLINING"

    return "STABLE"


def detect_trends(
    feature_df: pd.DataFrame,
    attribute: str,
) -> pd.DataFrame:
    """
    Detect trend lifecycle states for one fashion attribute.

    Expected columns:
        year
        <attribute>
        product_count
        year_total
        share
        reliability
        growth
        momentum
        weighted_growth
        weighted_momentum
    """

    required_columns = {
        "year",
        attribute,
        "product_count",
        "year_total",
        "share",
        "reliability",
        "growth",
        "momentum",
        "weighted_growth",
        "weighted_momentum",
    }

    missing = required_columns - set(feature_df.columns)

    if missing:
        raise ValueError(
            "Missing required feature columns: "
            f"{sorted(missing)}"
        )

    result = feature_df.copy()

    result["lifecycle"] = result.apply(
    lambda row: classify_lifecycle(
        share=row["share"],
        growth=row["growth"],
        momentum=row["momentum"],
        reliability=row["reliability"],
    ),
    axis=1,
)

    return result


def get_latest_trends(
    trend_df: pd.DataFrame,
    attribute: str,
) -> pd.DataFrame:
    """
    Return the latest reliable observation for each
    attribute value.
    """

    reliable = trend_df[
        trend_df["reliability"] >= MIN_RELIABILITY
    ].copy()

    if reliable.empty:
        return reliable

    latest = (
        reliable
        .sort_values("year")
        .groupby(attribute, as_index=False)
        .tail(1)
        .sort_values(
            ["weighted_growth", "share"],
            ascending=False,
        )
        .reset_index(drop=True)
    )

    return latest


if __name__ == "__main__":
    from ml.trends.data.loader import load_fashion_data
    from ml.trends.data.processor import clean_fashion_data
    from ml.trends.features.engineering import (
        build_trend_features,
    )

    data = load_fashion_data()
    data = clean_fashion_data(data)

    features = build_trend_features(
        data,
        attributes=[
            "baseColour",
            "articleType",
            "subCategory",
        ],
    )

    print("=== TREND DETECTION ===")

    for attribute, feature_df in features.items():

        detected = detect_trends(
            feature_df,
            attribute,
        )

        latest = get_latest_trends(
            detected,
            attribute,
        )

        print(f"\n--- {attribute} ---")

        print(
            latest[
                [
                    attribute,
                    "year",
                    "share",
                    "reliability",
                    "weighted_growth",
                    "weighted_momentum",
                    "lifecycle",
                ]
            ]
            .head(15)
            .to_string(index=False)
        )

        print("\nLifecycle distribution:")

        print(
            latest["lifecycle"]
            .value_counts()
            .to_string()
        )