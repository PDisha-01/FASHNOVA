from typing import Literal

from pydantic import BaseModel, Field


GenerationType = Literal[
    "concept",
    "design",
    "variation",
    "pattern",
]


class FashionContext(BaseModel):
    garment: str | None = None
    category: str | None = None
    aesthetic: str | None = None
    season: str | None = None
    colors: list[str] = Field(default_factory=list)
    pattern: str | None = None
    fabric: str | None = None


class TrendContext(BaseModel):
    enabled: bool = False
    trends: list[str] = Field(default_factory=list)


class VisionContext(BaseModel):
    enabled: bool = False
    attributes: dict = Field(default_factory=dict)


class GenerationRequest(BaseModel):
    generation_type: GenerationType = "design"

    prompt: str = Field(
        ...,
        min_length=3,
        max_length=2000,
    )

    fashion_context: FashionContext = Field(
        default_factory=FashionContext
    )

    trend_context: TrendContext = Field(
        default_factory=TrendContext
    )

    vision_context: VisionContext = Field(
        default_factory=VisionContext
    )

    aspect_ratio: str = "3:4"

    image_size: Literal[
        "0.5K",
        "1K",
        "2K",
        "4K",
    ] = "1K"


class GenerationResult(BaseModel):
    status: Literal["success", "error"]

    generation_type: GenerationType

    prompt: str

    image_data: str | None = None

    model: str | None = None

    metadata: dict = Field(
        default_factory=dict
    )

    error: str | None = None