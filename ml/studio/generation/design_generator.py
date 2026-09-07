from studio.schemas.generation_schema import GenerationRequest
from studio.prompting.prompt_builder import prompt_builder
from studio.services.gemini_service import gemini_studio_service


class DesignGenerator:
    """Generates fashion design images from structured Studio requests."""

    def generate(self, request: GenerationRequest) -> bytes:
        prompt = prompt_builder.build(request)

        return gemini_studio_service.generate_image(
            prompt
        )


design_generator = DesignGenerator()