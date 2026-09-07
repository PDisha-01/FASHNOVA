import base64

from studio.generation.design_generator import design_generator
from studio.schemas.generation_schema import (
    GenerationRequest,
    GenerationResult,
)


class StudioService:
    """Coordinates Studio generation workflows."""

    def generate(self, request: GenerationRequest) -> GenerationResult:
        try:
            if request.generation_type != "design":
                return GenerationResult(
                    status="error",
                    generation_type=request.generation_type,
                    prompt=request.prompt,
                    error=(
                        f"Generation type "
                        f"'{request.generation_type}' "
                        "is not implemented yet."
                    ),
                )

            image_bytes = design_generator.generate(request)

            return GenerationResult(
                status="success",
                generation_type=request.generation_type,
                prompt=request.prompt,
                image_data=base64.b64encode(image_bytes).decode("utf-8"),
                metadata={
                    "provider": "gemini",
                    "aspect_ratio": request.aspect_ratio,
                    "image_size": request.image_size,
                },
            )

        except Exception as error:
            return GenerationResult(
                status="error",
                generation_type=request.generation_type,
                prompt=request.prompt,
                error=str(error),
            )


studio_service = StudioService()