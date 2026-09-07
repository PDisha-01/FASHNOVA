from fastapi import FastAPI, HTTPException

from studio.schemas.generation_schema import (
    GenerationRequest,
)
from studio.services.studio_service import studio_service


app = FastAPI(
    title="FASHNOVA Studio",
    description="GenAI fashion generation service",
    version="1.0.0",
)


@app.get("/health")
def health():
    return {
        "status": "success",
        "service": "fashnova-studio",
        "message": "Studio service is running.",
    }


@app.post("/generate")
def generate(request: GenerationRequest):
    result = studio_service.generate(request)

    if result.status == "error":
        raise HTTPException(
            status_code=502,
            detail=result.error,
        )

@app.post("/generate/preview")
def generate_preview(request: GenerationRequest):
    from studio.prompting.prompt_builder import prompt_builder

    prompt = prompt_builder.build(request)

    return {
        "status": "success",
        "generation_type": request.generation_type,
        "prompt": prompt,
        "model": "gemini",
        "message": "Generation request validated successfully.",
    }
    return result