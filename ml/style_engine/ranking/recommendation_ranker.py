from typing import Any

from ml.style_engine.scoring.recommendation_scorer import (
    recommendation_scorer,
)
from ml.style_engine.schemas.recommendation_schema import (
    FashionCandidate,
    Recommendation,
)


class RecommendationRanker:
    """
    Scores, ranks, and explains fashion candidates.

    The ranker does not generate candidates.
    It only evaluates and orders candidates supplied to it.
    """

    def rank(
        self,
        candidates: list[FashionCandidate],
        context: dict[str, Any],
        top_k: int = 10,
    ) -> list[Recommendation]:
        scored_recommendations = []

        for candidate in candidates:
            score, breakdown = recommendation_scorer.score(
                candidate,
                context,
            )

            reasons = self._build_reasons(
                candidate,
                breakdown,
                context,
            )

            trend_alignment = self._build_trend_alignment(
                candidate,
                context,
            )

            confidence = self._calculate_confidence(
                score,
                breakdown,
            )

            scored_recommendations.append(
                Recommendation(
                    candidate_id=candidate.candidate_id,
                    name=candidate.name,
                    score=score,
                    score_breakdown=breakdown,
                    reasons=reasons,
                    trend_alignment=trend_alignment,
                    confidence=confidence,
                )
            )

        scored_recommendations.sort(
            key=lambda recommendation: recommendation.score,
            reverse=True,
        )

        return scored_recommendations[:top_k]

    # ------------------------------------------------------------------
    # Recommendation explanations
    # ------------------------------------------------------------------

    @staticmethod
    def _build_reasons(
        candidate: FashionCandidate,
        breakdown,
        context: dict[str, Any],
    ) -> list[str]:
        reasons = []

        feature_messages = [
            (
                breakdown.color_compatibility,
                "Strong color compatibility with your preferences."
            ),
            (
                breakdown.category_compatibility,
                "Matches the requested fashion category."
            ),
            (
                breakdown.season_compatibility,
                "Suitable for the requested season."
            ),
            (
                breakdown.aesthetic_compatibility,
                "Aligns with the requested or preferred aesthetic."
            ),
            (
                breakdown.trend_relevance,
                "Aligns with current FASHNOVA trend signals."
            ),
            (
                breakdown.preference_match,
                "Matches your saved style preferences."
            ),
        ]

        for score, message in feature_messages:
            if score >= 0.75:
                reasons.append(message)

        if not reasons:
            reasons.append(
                "Recommended based on the overall Style Engine score."
            )

        return reasons[:10]

    # ------------------------------------------------------------------
    # Trend alignment
    # ------------------------------------------------------------------

    @staticmethod
    def _build_trend_alignment(
        candidate: FashionCandidate,
        context: dict[str, Any],
    ) -> list[str]:
        trends = context["trends"]

        if not trends["enabled"]:
            return []

        active_trends = trends["trends"]

        if not active_trends:
            return []

        candidate_values = (
            RecommendationRanker._candidate_values(candidate)
        )

        matched = []

        for trend in active_trends:
            normalized_trend = (
                RecommendationRanker._normalize(trend)
            )

            if any(
                normalized_trend in value
                or value in normalized_trend
                for value in candidate_values
            ):
                matched.append(trend)

        return matched[:20]

    # ------------------------------------------------------------------
    # Confidence
    # ------------------------------------------------------------------

    @staticmethod
    def _calculate_confidence(
        score: float,
        breakdown,
    ) -> str:
        values = [
            breakdown.color_compatibility,
            breakdown.category_compatibility,
            breakdown.season_compatibility,
            breakdown.aesthetic_compatibility,
            breakdown.trend_relevance,
            breakdown.preference_match,
        ]

        strong_signals = sum(
            value >= 0.70
            for value in values
        )

        if score >= 80 and strong_signals >= 4:
            return "high"

        if score >= 60 and strong_signals >= 2:
            return "medium"

        return "low"

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _candidate_values(
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

        return RecommendationRanker._normalize_list(
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
            value = RecommendationRanker._normalize(
                value
            )

            if value and value not in normalized:
                normalized.append(value)

        return normalized


recommendation_ranker = RecommendationRanker()