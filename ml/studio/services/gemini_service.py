import base64
import os
from pathlib import Path

from dotenv import load_dotenv
from google import genai


STUDIO_ROOT = Path(__file__).resolve().parents[1]
ENV_FILE = STUDIO_ROOT / ".env"

load_dotenv(ENV_FILE)


class GeminiStudioService:
    """Handles communication with the Gemini image-generation API."""

    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")

        self.model = os.getenv(
            "STUDIO_MODEL",
            "gemini-3.1-flash-image",
        )

        if not self.api_key:
            raise RuntimeError(
                "GEMINI_API_KEY is not configured."
            )

        self.client = genai.Client(
            api_key=self.api_key
        )

    def generate_image(self, prompt: str) -> bytes:
        if not prompt or not prompt.strip():
            raise ValueError(
                "Generation prompt cannot be empty."
            )

        response = self.client.interactions.create(
            model=self.model,
            input=prompt,
            response_format={
                "type": "image",
                "aspect_ratio": "3:4",
                "image_size": "1K",
            },
        )

        if not response.output_image:
            raise RuntimeError(
                "Gemini did not return an image."
            )

        return base64.b64decode(
            response.output_image.data
        )


gemini_studio_service = GeminiStudioService()