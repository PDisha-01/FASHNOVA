from typing import Any

from ml.style_engine.schemas.recommendation_schema import (
    FashionCandidate,
)


class StyleFeatureEngineer:
    """
    Converts a fashion candidate and unified Style Engine context
    into normalized compatibility features.

    Every feature returned by this class is normalized to [0, 1].
    """

    def build_features(
        self,
        candidate: FashionCandidate,
        context: dict[str, Any],
    ) -> dict[str, float]:
        return {
            "color_compatibility": self.color_compatibility(
                candidate,
                context,
            ),
            "category_compatibility": self.category_compatibility(
                candidate,
                context,
            ),
            "season_compatibility": self.season_compatibility(
                candidate,
                context,
            ),
            "aesthetic_compatibility": self.aesthetic_compatibility(
                candidate,
                context,
            ),
            "trend_relevance": self.trend_relevance(
                candidate,
                context,
            ),
            "preference_match": self.preference_match(
                candidate,
                context,
            ),
        }

    # ------------------------------------------------------------------
    # Color
    # ------------------------------------------------------------------

    def color_compatibility(
        self,
        candidate: FashionCandidate,
        context: dict[str, Any],
    ) -> float:
        user = context["user"]

        preferred = user["preferred_colors"]
        disliked = user["disliked_colors"]

        candidate_colors = self._candidate_colors(candidate)

        if not candidate_colors:
            return 0.5

        if any(color in disliked for color in candidate_colors):
            return 0.0

        if not preferred:
            return 0.5

        matches = sum(
            color in preferred
            for color in candidate_colors
        )

        return self._clamp(
            matches / len(candidate_colors)
        )

    # ------------------------------------------------------------------
    # Category
    # ------------------------------------------------------------------

    def category_compatibility(
        self,
        candidate: FashionCandidate,
        context: dict[str, Any],
    ) -> float:
        user = context["user"]
        request = context["request"]

        preferred_categories = user[
            "preferred_categories"
        ]

        disliked_categories = user[
            "disliked_categories"
        ]

        candidate_categories = self._candidate_categories(
            candidate
        )

        if any(
            category in disliked_categories
            for category in candidate_categories
        ):
            return 0.0

        if request["category"]:
            if request["category"] in candidate_categories:
                return 1.0

            return 0.0

        if preferred_categories:
            if any(
                category in preferred_categories
                for category in candidate_categories
            ):
                return 1.0

            return 0.4

        return 0.5

    # ------------------------------------------------------------------
    # Season
    # ------------------------------------------------------------------

    def season_compatibility(
        self,
        candidate: FashionCandidate,
        context: dict[str, Any],
    ) -> float:
        request_season = context["request"]["season"]

        if not request_season:
            return 0.5

        candidate_season = self._normalize(
            candidate.season
        )

        if not candidate_season:
            return 0.5

        if candidate_season == request_season:
            return 1.0

        if candidate_season in {
            "all season",
            "all-season",
            "all",
        }:
            return 0.8

        return 0.2

    # ------------------------------------------------------------------
    # Aesthetic
    # ------------------------------------------------------------------

    def aesthetic_compatibility(
        self,
        candidate: FashionCandidate,
        context: dict[str, Any],
    ) -> float:
        user = context["user"]
        request = context["request"]

        candidate_aesthetic = self._normalize(
            candidate.aesthetic
        )

        if not candidate_aesthetic:
            return 0.5

        if request["aesthetic"]:
            if request["aesthetic"] == candidate_aesthetic:
                return 1.0

            return 0.3

        preferred = user[
            "preferred_aesthetics"
        ]

        if not preferred:
            return 0.5

        if candidate_aesthetic in preferred:
            return 1.0

        return 0.4

    # ------------------------------------------------------------------
    # Trends
    # ------------------------------------------------------------------

    def trend_relevance(
        self,
        candidate: FashionCandidate,
        context: dict[str, Any],
    ) -> float:
        trends = context["trends"]

        if not trends["enabled"]:
            return 0.0

        active_trends = trends["trends"]

        if not active_trends:
            return 0.0

        candidate_values = self._candidate_search_values(
            candidate
        )

        if not candidate_values:
            return 0.0

        matches = 0

        for trend in active_trends:
            normalized_trend = self._normalize(trend)

            if any(
                normalized_trend in value
                or value in normalized_trend
                for value in candidate_values
            ):
                matches += 1

        return self._clamp(
            matches / len(active_trends)
        )

    # ------------------------------------------------------------------
    # Overall preference match
    # ------------------------------------------------------------------

    def preference_match(
        self,
        candidate: FashionCandidate,
        context: dict[str, Any],
    ) -> float:
        user = context["user"]

        signals = []

        candidate_colors = self._candidate_colors(
            candidate
        )

        preferred_colors = user[
            "preferred_colors"
        ]

        if preferred_colors and candidate_colors:
            signals.append(
                1.0
                if any(
                    color in preferred_colors
                    for color in candidate_colors
                )
                else 0.0
            )

        candidate_categories = self._candidate_categories(
            candidate
        )

        preferred_categories = user[
            "preferred_categories"
        ]

        if preferred_categories and candidate_categories:
            signals.append(
                1.0
                if any(
                    category in preferred_categories
                    for category in candidate_categories
                )
                else 0.0
            )

        candidate_aesthetic = self._normalize(
            candidate.aesthetic
        )

        preferred_aesthetics = user[
            "preferred_aesthetics"
        ]

        if preferred_aesthetics and candidate_aesthetic:
            signals.append(
                1.0
                if candidate_aesthetic
                in preferred_aesthetics
                else 0.0
            )

        candidate_style = self._normalize(
            candidate.usage
        )

        preferred_styles = user[
            "preferred_styles"
        ]

        if preferred_styles and candidate_style:
            signals.append(
                1.0
                if candidate_style in preferred_styles
                else 0.0
            )

        if not signals:
            return 0.5

        return self._clamp(
            sum(signals) / len(signals)
        )

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _candidate_colors(
        candidate: FashionCandidate,
    ) -> list[str]:
        colors = list(candidate.colors)

        if candidate.color:
            colors.append(candidate.color)

        return StyleFeatureEngineer._normalize_list(
            colors
        )

    @staticmethod
    def _candidate_categories(
        candidate: FashionCandidate,
    ) -> list[str]:
        values = [
            candidate.category,
            candidate.sub_category,
            candidate.article_type,
        ]

        return StyleFeatureEngineer._normalize_list(
            values
        )

    @staticmethod
    def _candidate_search_values(
        candidate: FashionCandidate,
    ) -> list[str]:
        values = [
            candidate.name,
            candidate.category,
            candidate.sub_category,
            candidate.article_type,
            candidate.color,
            *candidate.colors,
            candidate.pattern,
            candidate.fabric,
            candidate.aesthetic,
            candidate.season,
            candidate.gender,
            candidate.usage,
        ]

        return StyleFeatureEngineer._normalize_list(
            values
        )

    @staticmethod
    def _normalize(
        value: str | None,
    ) -> str | None:
        if value is None:
            return None

        value = value.strip().lower()

        return value or None

    @staticmethod
    def _normalize_list(
        values: list[str | None],
    ) -> list[str]:
        normalized = []

        for value in values:
            value = StyleFeatureEngineer._normalize(
                value
            )

            if value and value not in normalized:
                normalized.append(value)

        return normalized

    @staticmethod
    def _clamp(
        value: float,
    ) -> float:
        return max(
            0.0,
            min(1.0, float(value)),
        )


style_feature_engineer = StyleFeatureEngineer()