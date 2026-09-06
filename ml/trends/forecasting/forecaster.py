from __future__ import annotations

import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error


MIN_RELIABILITY = 0.70
MIN_HISTORY_POINTS = 5

FORECAST_HORIZON = 2

# A category must have a reasonably recent observation.
MAX_STALE_YEARS = 2

# Confidence thresholds.
HIGH_CONFIDENCE = 70
MEDIUM_CONFIDENCE = 40

# Minimum meaningful share movement used for direction.
DIRECTION_THRESHOLD = 0.001


def get_latest_reliable_year(
    feature_df: pd.DataFrame,
) -> int | None:
    """Return the latest year with sufficient data reliability."""

    reliable = feature_df[
        feature_df["reliability"] >= MIN_RELIABILITY
    ]

    if reliable.empty:
        return None

    return int(reliable["year"].max())


def classify_confidence(
    confidence: float,
) -> str:
    """Convert numerical confidence into a readable level."""

    if confidence >= HIGH_CONFIDENCE:
        return "HIGH"

    if confidence >= MEDIUM_CONFIDENCE:
        return "MEDIUM"

    return "LOW"


def calculate_direction(
    current_share: float,
    forecast_share: float,
) -> str:
    """
    Determine future direction using the change between the
    latest observed share and the final forecast share.
    """

    change = forecast_share - current_share

    if change > DIRECTION_THRESHOLD:
        return "RISING"

    if change < -DIRECTION_THRESHOLD:
        return "DECLINING"

    return "STABLE"


def calculate_backtest_metrics(
    group: pd.DataFrame,
) -> tuple[float | None, float | None]:
    """
    Perform a simple time-based validation.

    The final historical observation is held out as validation
    data. Earlier observations are used to train the model.

    This prevents future observations from leaking into model
    evaluation.
    """

    if len(group) < MIN_HISTORY_POINTS:
        return None, None

    train = group.iloc[:-1]
    validation = group.iloc[-1:]

    if len(train) < 3:
        return None, None

    X_train = train[["year"]].values
    y_train = train["share"].values

    X_validation = validation[["year"]].values
    y_validation = validation["share"].values

    model = LinearRegression()

    model.fit(
        X_train,
        y_train,
    )

    prediction = model.predict(
        X_validation
    )

    prediction = np.clip(
        prediction,
        0.0,
        1.0,
    )

    mae = float(
        mean_absolute_error(
            y_validation,
            prediction,
        )
    )

    rmse = float(
        np.sqrt(
            mean_squared_error(
                y_validation,
                prediction,
            )
        )
    )

    return mae, rmse


def calculate_model_fit(
    model: LinearRegression,
    X: np.ndarray,
    y: np.ndarray,
) -> float:
    """Calculate bounded historical R²."""

    r_squared = float(
        model.score(X, y)
    )

    return max(
        0.0,
        min(1.0, r_squared),
    )


def calculate_forecast_confidence(
    r_squared: float,
    history_points: int,
    validation_mae: float | None,
    validation_rmse: float | None,
    current_reliability: float,
) -> float:
    """
    Calculate forecast confidence from multiple signals.

    Components:

        Historical model fit       35%
        History length             20%
        Validation performance     30%
        Current data reliability   15%

    This is deliberately NOT based on R² alone.
    """

    # Historical fit.
    fit_score = r_squared

    # More historical observations provide more stability.
    history_score = min(
        history_points / 10.0,
        1.0,
    )

    # Validation score.
    #
    # Lower MAE/RMSE means better predictive performance.
    if validation_mae is None or validation_rmse is None:
        validation_score = 0.0
    else:
        validation_error = (
            0.5 * validation_mae
            + 0.5 * validation_rmse
        )

        validation_score = max(
            0.0,
            1.0 - (
                validation_error / 0.10
            ),
        )

        validation_score = min(
            validation_score,
            1.0,
        )

    reliability_score = max(
        0.0,
        min(1.0, current_reliability),
    )

    confidence = (
        fit_score * 0.35
        + history_score * 0.20
        + validation_score * 0.30
        + reliability_score * 0.15
    )

    return round(
        confidence * 100,
        2,
    )


def forecast_attribute(
    feature_df: pd.DataFrame,
    attribute: str,
    horizon: int = FORECAST_HORIZON,
) -> pd.DataFrame:
    """
    Forecast future normalized catalog share for one attribute.

    Forecasting procedure:

        1. Identify the latest reliable dataset year.
        2. Keep attributes with recent observations.
        3. Require sufficient historical observations.
        4. Train a linear regression model.
        5. Validate using a time-based holdout.
        6. Forecast the next two years.
        7. Calculate confidence from multiple signals.

    The forecast represents historical catalog-share movement.
    It does not represent sales, revenue, search volume,
    social-media popularity, or guaranteed market demand.
    """

    required_columns = {
        "year",
        attribute,
        "share",
        "reliability",
    }

    missing = (
        required_columns
        - set(feature_df.columns)
    )

    if missing:
        raise ValueError(
            "Missing required forecasting columns: "
            f"{sorted(missing)}"
        )

    latest_reliable_year = (
        get_latest_reliable_year(feature_df)
    )

    if latest_reliable_year is None:
        return pd.DataFrame()

    reliable = feature_df[
        feature_df["reliability"] >= MIN_RELIABILITY
    ].copy()

    results = []

    for value, group in reliable.groupby(attribute):

        group = (
            group
            .sort_values("year")
            .copy()
        )

        # Only positive observations are useful for modelling
        # an attribute's represented catalog share.
        group = group[
            group["share"] > 0
        ].copy()

        if group.empty:
            continue

        last_observed_year = int(
            group["year"].max()
        )

        # Do not forecast trends that disappeared too far
        # before the common forecast origin.
        if (
            latest_reliable_year
            - last_observed_year
            > MAX_STALE_YEARS
        ):
            continue

        if len(group) < MIN_HISTORY_POINTS:
            continue

        current_row = group[
            group["year"] == latest_reliable_year
        ]

        # The attribute must actually be represented in the
        # latest reliable year to be considered a current trend.
        if current_row.empty:
            continue

        current_share = float(
            current_row.iloc[0]["share"]
        )

        current_reliability = float(
            current_row.iloc[0]["reliability"]
        )

        X = group[
            ["year"]
        ].values

        y = group[
            "share"
        ].values

        # Time-based validation BEFORE fitting the final model.
        validation_mae, validation_rmse = (
            calculate_backtest_metrics(
                group
            )
        )

        # Final model uses all available reliable history.
        model = LinearRegression()

        model.fit(
            X,
            y,
        )

        r_squared = calculate_model_fit(
            model,
            X,
            y,
        )

        future_years = np.arange(
            latest_reliable_year + 1,
            latest_reliable_year + horizon + 1,
        )

        raw_predictions = model.predict(
            future_years.reshape(-1, 1)
        )

        raw_final_prediction = float(
            raw_predictions[-1]
        )

        # Share is mathematically bounded between 0 and 1.
        clipped_predictions = np.clip(
            raw_predictions,
            0.0,
            1.0,
        )

        final_prediction = float(
            clipped_predictions[-1]
        )

        clipped_to_zero = (
            raw_final_prediction < 0
        )

        clipped_to_one = (
            raw_final_prediction > 1
        )

        direction = calculate_direction(
            current_share=current_share,
            forecast_share=final_prediction,
        )

        confidence = calculate_forecast_confidence(
            r_squared=r_squared,
            history_points=len(group),
            validation_mae=validation_mae,
            validation_rmse=validation_rmse,
            current_reliability=current_reliability,
        )

        confidence_level = classify_confidence(
            confidence
        )

        results.append(
            {
                attribute: value,

                "forecast_origin_year": (
                    latest_reliable_year
                ),

                "history_start_year": int(
                    group["year"].min()
                ),

                "history_end_year": int(
                    group["year"].max()
                ),

                "history_points": len(group),

                "current_share": round(
                    current_share,
                    6,
                ),

                "slope": round(
                    float(model.coef_[0]),
                    6,
                ),

                "r_squared": round(
                    r_squared,
                    4,
                ),

                "validation_mae": (
                    None
                    if validation_mae is None
                    else round(
                        validation_mae,
                        6,
                    )
                ),

                "validation_rmse": (
                    None
                    if validation_rmse is None
                    else round(
                        validation_rmse,
                        6,
                    )
                ),

                "forecast_direction": direction,

                "forecast_confidence": confidence,

                "confidence_level": (
                    confidence_level
                ),

                "forecast_year": int(
                    future_years[-1]
                ),

                "forecast_share": round(
                    final_prediction,
                    6,
                ),

                "forecast_change": round(
                    final_prediction
                    - current_share,
                    6,
                ),

                "forecast_clipped_to_zero": (
                    clipped_to_zero
                ),

                "forecast_clipped_to_one": (
                    clipped_to_one
                ),
            }
        )

    if not results:
        return pd.DataFrame()

    return (
        pd.DataFrame(results)
        .sort_values(
            [
                "forecast_confidence",
                "forecast_change",
            ],
            ascending=[
                False,
                False,
            ],
        )
        .reset_index(drop=True)
    )


def forecast_all_attributes(
    features: dict[str, pd.DataFrame],
    horizon: int = FORECAST_HORIZON,
) -> dict[str, pd.DataFrame]:
    """Generate forecasts for all configured attributes."""

    forecasts = {}

    for attribute, feature_df in features.items():

        forecasts[attribute] = forecast_attribute(
            feature_df,
            attribute,
            horizon=horizon,
        )

    return forecasts


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

    print("\n=== FINAL TREND FORECASTING ===")

    forecasts = forecast_all_attributes(
        features,
        horizon=2,
    )

    for attribute, forecast_df in forecasts.items():

        print(f"\n--- {attribute} ---")

        if forecast_df.empty:
            print(
                "No current attributes have enough "
                "recent reliable history for forecasting."
            )
            continue

        print(
            forecast_df[
                [
                    attribute,
                    "forecast_origin_year",
                    "history_start_year",
                    "history_end_year",
                    "history_points",
                    "current_share",
                    "slope",
                    "r_squared",
                    "validation_mae",
                    "validation_rmse",
                    "forecast_direction",
                    "forecast_confidence",
                    "confidence_level",
                    "forecast_year",
                    "forecast_share",
                    "forecast_change",
                    "forecast_clipped_to_zero",
                ]
            ]
            .head(15)
            .to_string(index=False)
        )