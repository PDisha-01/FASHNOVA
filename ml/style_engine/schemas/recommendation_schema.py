from typing import Any, Literal

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Shared context models
# ---------------------------------------------------------------------------

class UserContext(BaseModel):
    """
    User preferences and personalization signals used by the Style Engine.
    """

    user_id: str | None = None

    preferred_colors: list[str] = Field(default_factory=list)
    preferred_categories: list[str] = Field(default_factory=list)
    preferred_styles: list[str] = Field(default_factory=list)
    preferred_aesthetics: list[str] = Field(default_factory=list)

    disliked_colors: list[str] = Field(default_factory=list)
    disliked_categories: list[str] = Field(default_factory=list)
    disliked_styles: list[str] = Field(default_factory=list)


class VisionContext(BaseModel):
    """
    Structured output received from the FASHNOVA Vision module.
    """

    enabled: bool = False
    attributes: dict[str, Any] = Field(default_factory=dict)


class TrendContext(BaseModel):
    """
    Structured trend intelligence received from the Trends module.
    """

    enabled: bool = False
    trends: list[str] = Field(default_factory=list)


class RequestContext(BaseModel):
    """
    Immediate context for the recommendation request.
    """

    occasion: str | None = None
    season: str | None = None
    gender: str | None = None
    category: str | None = None
    aesthetic: str | None = None


# ---------------------------------------------------------------------------
# Candidate fashion item
# ---------------------------------------------------------------------------

class FashionCandidate(BaseModel):
    """
    A fashion item/style candidate that the Style Engine can evaluate.
    """

    candidate_id: str

    name: str

    category: str | None = None
    sub_category: str | None = None
    article_type: str | None = None

    color: str | None = None
    colors: list[str] = Field(default_factory=list)

    pattern: str | None = None
    fabric: str | None = None

    aesthetic: str | None = None
    season: str | None = None
    gender: str | None = None
    usage: str | None = None

    metadata: dict[str, Any] = Field(default_factory=dict)


# ---------------------------------------------------------------------------
# Recommendation request
# ---------------------------------------------------------------------------

class RecommendationRequest(BaseModel):
    """
    Complete input contract for the FASHNOVA Style Engine.
    """

    user_context: UserContext = Field(
        default_factory=UserContext
    )

    vision_context: VisionContext = Field(
        default_factory=VisionContext
    )

    trend_context: TrendContext = Field(
        default_factory=TrendContext
    )

    request_context: RequestContext = Field(
        default_factory=RequestContext
    )

    candidates: list[FashionCandidate] = Field(
        ...,
        min_length=1,
        max_length=500,
    )

    top_k: int = Field(
        default=10,
        ge=1,
        le=50,
    )


# ---------------------------------------------------------------------------
# Score breakdown
# ---------------------------------------------------------------------------

class ScoreBreakdown(BaseModel):
    """
    Explainable components contributing to a recommendation score.
    """

    color_compatibility: float = Field(
        default=0.0,
        ge=0.0,
        le=1.0,
    )

    category_compatibility: float = Field(
        default=0.0,
        ge=0.0,
        le=1.0,
    )

    season_compatibility: float = Field(
        default=0.0,
        ge=0.0,
        le=1.0,
    )

    aesthetic_compatibility: float = Field(
        default=0.0,
        ge=0.0,
        le=1.0,
    )

    trend_relevance: float = Field(
        default=0.0,
        ge=0.0,
        le=1.0,
    )

    preference_match: float = Field(
        default=0.0,
        ge=0.0,
        le=1.0,
    )


# ---------------------------------------------------------------------------
# Recommendation
# ---------------------------------------------------------------------------

class Recommendation(BaseModel):
    """
    One ranked recommendation produced by the Style Engine.
    """

    candidate_id: str

    name: str

    score: float = Field(
        ge=0.0,
        le=100.0,
    )

    score_breakdown: ScoreBreakdown

    reasons: list[str] = Field(
        default_factory=list,
        max_length=10,
    )

    trend_alignment: list[str] = Field(
        default_factory=list,
        max_length=20,
    )

    confidence: Literal[
        "high",
        "medium",
        "low",
    ]


# ---------------------------------------------------------------------------
# Recommendation response
# ---------------------------------------------------------------------------

class RecommendationResult(BaseModel):
    """
    Final response returned by the FASHNOVA Style Engine.
    """

    status: Literal[
        "success",
        "error",
    ]

    recommendations: list[Recommendation] = Field(
        default_factory=list,
    )

    total_candidates: int = Field(
        default=0,
        ge=0,
    )

    model: str = "hybrid-rule-ml"

    metadata: dict[str, Any] = Field(
        default_factory=dict,
    )

    error: str | None = None