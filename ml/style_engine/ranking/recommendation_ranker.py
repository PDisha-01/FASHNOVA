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
    It evaluates, orders, and diversifies candidates
    supplied by the Style Engine.
    """

    def rank(
        self,
        candidates: list[FashionCandidate],
        context: dict[str, Any],
        top_k: int = 10,
    ) -> list[Recommendation]:
        scored_recommendations: list[Recommendation] = []

        # --------------------------------------------------------------
        # 1. Score every candidate
        # --------------------------------------------------------------

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

        # --------------------------------------------------------------
        # 2. Sort by recommendation score
        # --------------------------------------------------------------

        scored_recommendations.sort(
            key=lambda recommendation: recommendation.score,
            reverse=True,
        )

        # --------------------------------------------------------------
        # 3. Diversity-aware selection
        #
        # Prefer different fashion types in the first pass.
        # This prevents:
        #
        # Jackets
        # Jackets
        # Jackets
        # Free Gifts
        # Free Gifts
        #
        # from becoming the Top 5.
        # --------------------------------------------------------------

        selected: list[Recommendation] = []
        used_names: set[str] = set()

        for recommendation in scored_recommendations:
            normalized_name = self._normalize(
                recommendation.name
            )

            if not normalized_name:
                normalized_name = "fashion-item"

            if normalized_name in used_names:
                continue

            selected.append(recommendation)
            used_names.add(normalized_name)

            if len(selected) >= top_k:
                break

        # --------------------------------------------------------------
        # 4. Fill remaining positions if unique types are insufficient
        # --------------------------------------------------------------

        if len(selected) < top_k:
            selected_ids = {
                recommendation.candidate_id
                for recommendation in selected
            }

            for recommendation in scored_recommendations:
                if recommendation.candidate_id in selected_ids:
                    continue

                selected.append(recommendation)

                if len(selected) >= top_k:
                    break

        # --------------------------------------------------------------
        # 5. Debug output
        # --------------------------------------------------------------

        print(
            "STYLE ENGINE FINAL RANKING:",
            [
                {
                    "id": recommendation.candidate_id,
                    "name": recommendation.name,
                    "score": recommendation.score,
                }
                for recommendation in selected
            ],
        )

        return selected

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
                "Matches the requested color palette.",
            ),
            (
                breakdown.category_compatibility,
                "Matches the requested fashion category.",
            ),
            (
                breakdown.season_compatibility,
                "Suitable for the requested season.",
            ),
            (
                breakdown.aesthetic_compatibility,
                "Aligns with the requested or preferred aesthetic.",
            ),
            (
                breakdown.trend_relevance,
                "Aligns with current FASHNOVA trend signals.",
            ),
            (
                breakdown.preference_match,
                "Matches your saved style preferences.",
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

            if not normalized_trend:
                continue

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
    # Candidate helpers
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