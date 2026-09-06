from __future__ import annotations

import pandas as pd

from ml.trends.data.loader import load_fashion_data
from ml.trends.data.processor import clean_fashion_data
from ml.trends.features.engineering import build_trend_features
from ml.trends.detection.trend_detector import detect_trends
from ml.trends.scoring.trend_score import calculate_trend_score, rank_trends
from ml.trends.forecasting.forecaster import forecast_all_attributes


DEFAULT_ATTRIBUTES = [
    "baseColour",
    "articleType",
    "subCategory",
]


class TrendService:
    """
    Orchestrates the complete FASHNOVA Trends ML pipeline.

    Pipeline:

        Raw Fashion Data
            ↓
        Cleaning
            ↓
        Feature Engineering
            ↓
        Trend Detection
            ↓
        Trend Scoring
            ↓
        Forecasting
    """

    def __init__(
        self,
        attributes: list[str] | None = None,
    ):
        self.attributes = (
            attributes
            if attributes is not None
            else DEFAULT_ATTRIBUTES.copy()
        )

    def load_data(self) -> pd.DataFrame:
        """Load and clean the fashion dataset."""

        raw_data = load_fashion_data()

        clean_data = clean_fashion_data(
            raw_data
        )

        return clean_data

    def build_features(
        self,
        data: pd.DataFrame,
    ) -> dict[str, pd.DataFrame]:
        """Build trend features for configured attributes."""

        return build_trend_features(
            data,
            attributes=self.attributes,
        )

    def detect(
        self,
        features: dict[str, pd.DataFrame],
    ) -> dict[str, pd.DataFrame]:
        """Detect lifecycle states for each attribute."""

        detected = {}

        for attribute, feature_df in features.items():

            detected[attribute] = detect_trends(
                feature_df,
                attribute,
            )

        return detected

    def score(
        self,
        detected: dict[str, pd.DataFrame],
    ) -> dict[str, pd.DataFrame]:
        """Calculate and rank current trend scores."""

        scored = {}

        for attribute, detected_df in detected.items():

            scored_df = calculate_trend_score(
                detected_df
            )

            scored[attribute] = rank_trends(
                scored_df,
                attribute,
            )

        return scored

    def forecast(
        self,
        features: dict[str, pd.DataFrame],
        horizon: int = 2,
    ) -> dict[str, pd.DataFrame]:
        """Generate future trend forecasts."""

        return forecast_all_attributes(
            features,
            horizon=horizon,
        )

    def run(
        self,
        horizon: int = 2,
    ) -> dict:
        """
        Execute the complete Trends ML pipeline.

        Returns a structured result containing:

            data
            features
            detected
            scored
            forecasts
        """

        # --------------------------------------------------
        # 1. Load and clean data
        # --------------------------------------------------

        data = self.load_data()

        # --------------------------------------------------
        # 2. Feature engineering
        # --------------------------------------------------

        features = self.build_features(
            data
        )

        # --------------------------------------------------
        # 3. Trend lifecycle detection
        # --------------------------------------------------

        detected = self.detect(
            features
        )

        # --------------------------------------------------
        # 4. Trend scoring
        # --------------------------------------------------

        scored = self.score(
            detected
        )

        # --------------------------------------------------
        # 5. Future forecasting
        # --------------------------------------------------

        forecasts = self.forecast(
            features,
            horizon=horizon,
        )

        return {
            "data": data,
            "features": features,
            "detected": detected,
            "scored": scored,
            "forecasts": forecasts,
        }


def create_trend_service(
    attributes: list[str] | None = None,
) -> TrendService:
    """Create a configured TrendService instance."""

    return TrendService(
        attributes=attributes
    )


if __name__ == "__main__":

    print("=== FASHNOVA TREND SERVICE ===")

    service = create_trend_service()

    result = service.run(
        horizon=2
    )

    data = result["data"]
    detected = result["detected"]
    scored = result["scored"]
    forecasts = result["forecasts"]

    print(
        f"\nClean dataset rows: {len(data):,}"
    )

    for attribute in service.attributes:

        print(
            f"\n--- {attribute} ---"
        )

        detected_df = detected[
            attribute
        ]

        scored_df = scored[
            attribute
        ]

        forecast_df = forecasts[
            attribute
        ]

        print(
            f"Detected observations: "
            f"{len(detected_df):,}"
        )

        print(
            f"Scored observations: "
            f"{len(scored_df):,}"
        )

        print(
            f"Forecast observations: "
            f"{len(forecast_df):,}"
        )

        if not scored_df.empty:

            print("\nTop current trends:")

            print(
                scored_df[
                    [
                        attribute,
                        "year",
                        "lifecycle",
                        "trend_score",
                    ]
                ]
                .head(5)
                .to_string(index=False)
            )

        if not forecast_df.empty:

            print("\nTop forecasts:")

            print(
                forecast_df[
                    [
                        attribute,
                        "forecast_origin_year",
                        "forecast_direction",
                        "forecast_confidence",
                        "confidence_level",
                        "forecast_year",
                        "forecast_share",
                    ]
                ]
                .head(5)
                .to_string(index=False)
            )