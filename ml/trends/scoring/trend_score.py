from __future__ import annotations

import pandas as pd


# Minimum reliability required for a trend observation
# to participate in the current scoring snapshot.
MIN_RELIABILITY = 0.70


# Signal weights.
#
# The score measures strength of the observed catalog trend
# signal. It does NOT represent sales, revenue, or real-world
# popularity.
WEIGHTS = {
    "share": 0.25,
    "share_change": 0.25,
    "momentum": 0.25,
    "acceleration": 0.10,
    "reliability": 0.15,
}


def min_max_normalize(
    series: pd.Series,
) -> pd.Series:
    """
    Normalize a numerical series to the range 0–1.

    If all values are identical, return 0.5 for every
    observation because there is no relative difference
    to exploit.
    """

    minimum = series.min()
    maximum = series.max()

    if pd.isna(minimum) or pd.isna(maximum):
        return pd.Series(
            0.5,
            index=series.index,
            dtype=float,
        )

    if maximum == minimum:
        return pd.Series(
            0.5,
            index=series.index,
            dtype=float,
        )

    return (
        (series - minimum)
        / (maximum - minimum)
    )


def get_latest_reliable_snapshot(
    feature_df: pd.DataFrame,
    min_reliability: float = MIN_RELIABILITY,
) -> pd.DataFrame:
    """
    Return the latest year for which the dataset has
    sufficient reliability.

    This is deliberately done BEFORE scoring so that
    historical observations do not influence the current
    trend ranking.
    """

    required_columns = {
        "year",
        "reliability",
    }

    missing = (
        required_columns
        - set(feature_df.columns)
    )

    if missing:
        raise ValueError(
            "Missing required snapshot columns: "
            f"{sorted(missing)}"
        )

    reliable = feature_df[
        feature_df["reliability"] >= min_reliability
    ].copy()

    if reliable.empty:
        return reliable

    latest_year = reliable["year"].max()

    snapshot = reliable[
        reliable["year"] == latest_year
    ].copy()

    return snapshot.reset_index(drop=True)


def calculate_trend_score(
    feature_df: pd.DataFrame,
) -> pd.DataFrame:
    """
    Calculate a 0–100 trend score for the latest
    reliable fashion snapshot.

    Scoring signals:

        Current share       25%
        Share change        25%
        Momentum            25%
        Acceleration        10%
        Reliability         15%

    The score is relative to other observations in the
    same latest reliable snapshot.

    It does NOT represent:
        - sales
        - revenue
        - search volume
        - social popularity
        - market size

    It represents the strength of the observable
    catalog-based trend signal.
    """

    required_columns = {
        "year",
        "share",
        "share_change",
        "momentum",
        "acceleration",
        "reliability",
    }

    missing = (
        required_columns
        - set(feature_df.columns)
    )

    if missing:
        raise ValueError(
            "Missing required scoring columns: "
            f"{sorted(missing)}"
        )

    snapshot = get_latest_reliable_snapshot(
        feature_df
    )

    if snapshot.empty:
        return snapshot

    result = snapshot.copy()

    # Normalize signals ONLY within the current
    # reliable snapshot.
    result["share_signal"] = min_max_normalize(
        result["share"]
    )

    result["share_change_signal"] = (
        min_max_normalize(
            result["share_change"]
        )
    )

    result["momentum_signal"] = min_max_normalize(
        result["momentum"]
    )

    result["acceleration_signal"] = (
        min_max_normalize(
            result["acceleration"]
        )
    )

    # Reliability is already represented on a 0–1 scale.
    result["reliability_signal"] = (
        result["reliability"]
        .clip(0.0, 1.0)
    )

    # Weighted composite score.
    result["trend_score"] = (
        result["share_signal"]
        * WEIGHTS["share"]
        +
        result["share_change_signal"]
        * WEIGHTS["share_change"]
        +
        result["momentum_signal"]
        * WEIGHTS["momentum"]
        +
        result["acceleration_signal"]
        * WEIGHTS["acceleration"]
        +
        result["reliability_signal"]
        * WEIGHTS["reliability"]
    ) * 100

    result["trend_score"] = (
        result["trend_score"]
        .clip(0.0, 100.0)
        .round(2)
    )

    return result


def rank_trends(
    scored_df: pd.DataFrame,
    attribute: str,
) -> pd.DataFrame:
    """
    Rank trends inside the already-selected latest
    reliable snapshot.
    """

    if attribute not in scored_df.columns:
        raise ValueError(
            f"Unknown attribute: {attribute}"
        )

    if scored_df.empty:
        return scored_df

    return (
        scored_df
        .sort_values(
            [
                "trend_score",
                "share",
            ],
            ascending=[
                False,
                False,
            ],
        )
        .reset_index(drop=True)
    )


if __name__ == "__main__":
    from ml.trends.data.loader import (
        load_fashion_data,
    )
    from ml.trends.data.processor import (
        clean_fashion_data,
    )
    from ml.trends.features.engineering import (
        build_trend_features,
    )
    from ml.trends.detection.trend_detector import (
        detect_trends,
    )

    print("Loading dataset...")

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

    print("\n=== TREND SCORING ===")

    for attribute, feature_df in features.items():

        detected = detect_trends(
            feature_df,
            attribute,
        )

        scored = calculate_trend_score(
            detected
        )

        ranked = rank_trends(
            scored,
            attribute,
        )

        print(f"\n--- {attribute} ---")

        if ranked.empty:
            print(
                "No reliable trend observations found."
            )
            continue

        print(
            ranked[
                [
                    attribute,
                    "year",
                    "share",
                    "share_change",
                    "momentum",
                    "acceleration",
                    "reliability",
                    "lifecycle",
                    "trend_score",
                ]
            ]
            .head(15)
            .to_string(index=False)
        )