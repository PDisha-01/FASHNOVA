from typing import Any

from ml.style_engine.features.feature_engineering import (
    style_feature_engineer,
)
from ml.style_engine.schemas.recommendation_schema import (
    FashionCandidate,
    ScoreBreakdown,
)


class RecommendationScorer:
    """
    Calculates explainable recommendation scores.

    Each feature is normalized to [0, 1].
    The final score is returned on a 0-100 scale.
    """

    WEIGHTS = {
        "color_compatibility": 0.20,
        "category_compatibility": 0.15,
        "season_compatibility": 0.15,
        "aesthetic_compatibility": 0.15,
        "trend_relevance": 0.15,
        "preference_match": 0.20,
    }

    def score(
        self,
        candidate: FashionCandidate,
        context: dict[str, Any],
    ) -> tuple[float, ScoreBreakdown]:
        features = style_feature_engineer.build_features(
            candidate,
            context,
        )

        weighted_score = sum(
            features[name] * weight
            for name, weight in self.WEIGHTS.items()
        )

        final_score = round(
            weighted_score * 100,
            2,
        )

        breakdown = ScoreBreakdown(
            color_compatibility=features[
                "color_compatibility"
            ],
            category_compatibility=features[
                "category_compatibility"
            ],
            season_compatibility=features[
                "season_compatibility"
            ],
            aesthetic_compatibility=features[
                "aesthetic_compatibility"
            ],
            trend_relevance=features[
                "trend_relevance"
            ],
            preference_match=features[
                "preference_match"
            ],
        )

        return final_score, breakdown


recommendation_scorer = RecommendationScorer()