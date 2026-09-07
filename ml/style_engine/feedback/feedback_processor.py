from typing import Any, Literal


FeedbackType = Literal[
    "like",
    "dislike",
    "save",
    "skip",
]


class FeedbackProcessor:
    """
    Processes user interactions with Style Engine recommendations.

    The initial implementation converts explicit feedback into
    preference signals. A learned personalization model can
    consume these signals once sufficient interaction data exists.
    """

    FEEDBACK_WEIGHTS = {
        "like": 1.0,
        "save": 1.0,
        "dislike": -1.0,
        "skip": -0.25,
    }

    def process(
        self,
        feedback_type: FeedbackType,
        candidate: dict[str, Any],
    ) -> dict[str, Any]:
        if feedback_type not in self.FEEDBACK_WEIGHTS:
            raise ValueError(
                f"Unsupported feedback type: {feedback_type}"
            )

        signal = self.FEEDBACK_WEIGHTS[
            feedback_type
        ]

        return {
            "feedback_type": feedback_type,
            "signal": signal,
            "candidate_id": candidate.get(
                "candidate_id"
            ),
            "features": self._extract_features(
                candidate
            ),
        }

    def aggregate(
        self,
        feedback_events: list[dict[str, Any]],
    ) -> dict[str, dict[str, float]]:
        """
        Aggregates feedback into feature-level preference signals.

        Positive interactions increase a feature's preference signal.
        Negative interactions decrease it.
        """

        totals: dict[str, float] = {}
        counts: dict[str, int] = {}

        for event in feedback_events:
            signal = float(
                event.get("signal", 0.0)
            )

            features = event.get(
                "features",
                {},
            )

            for feature_name, feature_value in features.items():
                if not isinstance(
                    feature_value,
                    (int, float),
                ):
                    continue

                contribution = (
                    float(feature_value)
                    * signal
                )

                totals[feature_name] = (
                    totals.get(feature_name, 0.0)
                    + contribution
                )

                counts[feature_name] = (
                    counts.get(feature_name, 0)
                    + 1
                )

        result = {}

        for feature_name, total in totals.items():
            count = counts[feature_name]

            average = total / count

            result[feature_name] = {
                "signal": round(
                    max(-1.0, min(1.0, average)),
                    4,
                ),
                "interactions": count,
            }

        return result

    @staticmethod
    def _extract_features(
        candidate: dict[str, Any],
    ) -> dict[str, float]:
        """
        Extracts numeric recommendation features from
        a scored candidate.
        """

        breakdown = candidate.get(
            "score_breakdown",
            {},
        )

        if hasattr(breakdown, "model_dump"):
            breakdown = breakdown.model_dump()

        if not isinstance(breakdown, dict):
            return {}

        feature_names = [
            "color_compatibility",
            "category_compatibility",
            "season_compatibility",
            "aesthetic_compatibility",
            "trend_relevance",
            "preference_match",
        ]

        features = {}

        for name in feature_names:
            value = breakdown.get(name)

            if isinstance(value, (int, float)):
                features[name] = float(value)

        return features


feedback_processor = FeedbackProcessor()