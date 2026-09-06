from __future__ import annotations

import math

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from ml.trends.services.trend_service import (
    create_trend_service,
)


app = FastAPI(
    title="FASHNOVA Trends ML API",
    description=(
        "Machine-learning trend intelligence service "
        "for FASHNOVA."
    ),
    version="1.0.0",
)


class TrendRequest(BaseModel):
    attributes: list[str] | None = Field(
        default=None,
        description=(
            "Fashion attributes to analyze. "
            "Defaults to baseColour, articleType, "
            "and subCategory."
        ),
    )

    horizon: int = Field(
        default=2,
        ge=1,
        le=5,
        description="Number of future years to forecast.",
    )


def make_json_safe(value):
    """
    Convert values produced by pandas/numpy into
    JSON-compatible Python values.

    NaN and infinity cannot be represented in standard JSON,
    so they are returned as None.
    """

    if isinstance(value, float):
        if not math.isfinite(value):
            return None

    return value


def records_to_json_safe(df, limit: int = 20):
    """
    Convert a DataFrame to JSON-safe records.
    """

    if df is None or df.empty:
        return []

    records = (
        df.head(limit)
        .to_dict(orient="records")
    )

    return [
        {
            key: make_json_safe(value)
            for key, value in record.items()
        }
        for record in records
    ]


@app.get("/health")
def health():
    """Health check for the Trends ML service."""

    return {
        "status": "ok",
        "service": "fashnova-trends-ml",
        "version": "1.0.0",
    }


@app.post("/analyze")
def analyze_trends(request: TrendRequest):
    """
    Execute the complete Trends ML pipeline.

    The endpoint returns current trend intelligence,
    trend scores, lifecycle states, and forecasts.
    """

    try:
        service = create_trend_service(
            attributes=request.attributes
        )

        result = service.run(
            horizon=request.horizon
        )

        response = {
            "status": "success",
            "attributes": {},
        }

        for attribute in service.attributes:

            scored_df = result["scored"].get(
                attribute
            )

            forecast_df = result["forecasts"].get(
                attribute
            )

            current_trends = records_to_json_safe(
                scored_df
            )

            forecasts = records_to_json_safe(
                forecast_df
            )

            response["attributes"][attribute] = {
                "current_trends": current_trends,
                "forecasts": forecasts,
            }

        return response

    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc

    except FileNotFoundError as exc:

        raise HTTPException(
            status_code=503,
            detail=str(exc),
        ) from exc

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail="Trend analysis failed.",
        ) from exc


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "ml.trends.app.main:app",
        host="127.0.0.1",
        port=8001,
        reload=False,
    )