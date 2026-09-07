from fastapi import FastAPI

from ml.style_engine.schemas.recommendation_schema import (
    RecommendationRequest,
)
from ml.style_engine.services.style_engine_service import (
    style_engine_service,
)


app = FastAPI(
    title="FASHNOVA Style Engine",
    description=(
        "Hybrid fashion recommendation and personalization "
        "service for FASHNOVA."
    ),
    version="1.0.0",
)


@app.get("/health")
def health():
    return {
        "status": "success",
        "service": "fashnova-style-engine",
        "message": "Style Engine service is running.",
    }


@app.post("/recommend")
def recommend(
    request: RecommendationRequest,
):
    return style_engine_service.recommend(
        request
    )