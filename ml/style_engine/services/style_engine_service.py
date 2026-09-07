from ml.style_engine.context.context_builder import (
    style_context_builder,
)
from ml.style_engine.ranking.recommendation_ranker import (
    recommendation_ranker,
)
from ml.style_engine.schemas.recommendation_schema import (
    RecommendationRequest,
    RecommendationResult,
)


class StyleEngineService:
    """
    Main orchestration service for the FASHNOVA Style Engine.

    Responsibilities:
    1. Build unified context.
    2. Rank supplied fashion candidates.
    3. Return a validated recommendation result.
    """

    def recommend(
        self,
        request: RecommendationRequest,
    ) -> RecommendationResult:
        context = style_context_builder.build(
            request
        )

        recommendations = recommendation_ranker.rank(
            candidates=request.candidates,
            context=context,
            top_k=request.top_k,
        )

        return RecommendationResult(
            status="success",
            recommendations=recommendations,
            total_candidates=len(
                request.candidates
            ),
            model="hybrid-rule-ml",
            metadata={
                "top_k": request.top_k,
                "personalization": {
                    "explicit_preferences": bool(
                        request.user_context.preferred_colors
                        or request.user_context.preferred_categories
                        or request.user_context.preferred_styles
                        or request.user_context.preferred_aesthetics
                    ),
                    "behavioral_feedback": False,
                },
                "vision_context": request.vision_context.enabled,
                "trend_context": request.trend_context.enabled,
            },
        )


style_engine_service = StyleEngineService()