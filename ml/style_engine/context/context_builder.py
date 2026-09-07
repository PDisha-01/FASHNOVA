from typing import Any

from ml.style_engine.schemas.recommendation_schema import (
    RecommendationRequest,
)


class StyleContextBuilder:
    """
    Builds a normalized context for the FASHNOVA Style Engine.

    The context builder does not score or rank candidates.
    Its responsibility is to combine Vision, Trends, Profile,
    and request-level information into a consistent structure.
    """

    def build(
        self,
        request: RecommendationRequest,
    ) -> dict[str, Any]:
        user = request.user_context
        vision = request.vision_context
        trends = request.trend_context
        request_context = request.request_context

        return {
            "user": self._build_user_context(user),
            "vision": self._build_vision_context(vision),
            "trends": self._build_trend_context(trends),
            "request": self._build_request_context(
                request_context
            ),
        }

    @staticmethod
    def _build_user_context(
        user,
    ) -> dict[str, Any]:
        return {
            "user_id": user.user_id,
            "preferred_colors": StyleContextBuilder._normalize_list(
                user.preferred_colors
            ),
            "preferred_categories": StyleContextBuilder._normalize_list(
                user.preferred_categories
            ),
            "preferred_styles": StyleContextBuilder._normalize_list(
                user.preferred_styles
            ),
            "preferred_aesthetics": StyleContextBuilder._normalize_list(
                user.preferred_aesthetics
            ),
            "disliked_colors": StyleContextBuilder._normalize_list(
                user.disliked_colors
            ),
            "disliked_categories": StyleContextBuilder._normalize_list(
                user.disliked_categories
            ),
            "disliked_styles": StyleContextBuilder._normalize_list(
                user.disliked_styles
            ),
        }

    @staticmethod
    def _build_vision_context(
        vision,
    ) -> dict[str, Any]:
        attributes = vision.attributes or {}

        return {
            "enabled": vision.enabled,
            "attributes": attributes,
        }

    @staticmethod
    def _build_trend_context(
        trends,
    ) -> dict[str, Any]:
        return {
            "enabled": trends.enabled,
            "trends": StyleContextBuilder._normalize_list(
                trends.trends
            ),
        }

    @staticmethod
    def _build_request_context(
        request_context,
    ) -> dict[str, Any]:
        return {
            "occasion": StyleContextBuilder._normalize_value(
                request_context.occasion
            ),
            "season": StyleContextBuilder._normalize_value(
                request_context.season
            ),
            "gender": StyleContextBuilder._normalize_value(
                request_context.gender
            ),
            "category": StyleContextBuilder._normalize_value(
                request_context.category
            ),
            "aesthetic": StyleContextBuilder._normalize_value(
                request_context.aesthetic
            ),
        }

    @staticmethod
    def _normalize_value(
        value: str | None,
    ) -> str | None:
        if value is None:
            return None

        cleaned = value.strip().lower()

        return cleaned or None

    @staticmethod
    def _normalize_list(
        values: list[str] | None,
    ) -> list[str]:
        if not values:
            return []

        normalized = []

        for value in values:
            cleaned = StyleContextBuilder._normalize_value(
                value
            )

            if cleaned and cleaned not in normalized:
                normalized.append(cleaned)

        return normalized


style_context_builder = StyleContextBuilder()