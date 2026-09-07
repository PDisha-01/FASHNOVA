from studio.schemas.generation_schema import GenerationRequest


class StudioPromptBuilder:
    """Builds structured fashion-generation prompts for Studio."""

    def build(self, request: GenerationRequest) -> str:
        sections = []

        sections.append(
            "Create a high-quality fashion design visualization."
        )

        sections.append(
            f"Generation type: {request.generation_type}."
        )

        sections.append(
            f"Creative direction: {request.prompt.strip()}."
        )

        fashion = request.fashion_context

        if fashion.garment:
            sections.append(f"Garment: {fashion.garment}.")

        if fashion.category:
            sections.append(f"Category: {fashion.category}.")

        if fashion.aesthetic:
            sections.append(
                f"Aesthetic: {fashion.aesthetic}."
            )

        if fashion.season:
            sections.append(
                f"Season: {fashion.season}."
            )

        if fashion.colors:
            sections.append(
                "Color palette: "
                + ", ".join(fashion.colors)
                + "."
            )

        if fashion.pattern:
            sections.append(
                f"Pattern: {fashion.pattern}."
            )

        if fashion.fabric:
            sections.append(
                f"Fabric: {fashion.fabric}."
            )

        trend = request.trend_context

        if trend.enabled and trend.trends:
            sections.append(
                "Relevant fashion trends: "
                + ", ".join(trend.trends)
                + "."
            )

        vision = request.vision_context

        if vision.enabled and vision.attributes:
            sections.append(
                "Reference garment attributes: "
                + self._format_attributes(vision.attributes)
                + "."
            )

        sections.append(
            "Show the garment clearly with accurate proportions, "
            "realistic fabric texture, coherent construction, "
            "professional fashion presentation, and a clean "
            "editorial composition."
        )

        return "\n".join(sections)

    @staticmethod
    def _format_attributes(attributes: dict) -> str:
        formatted = []

        for key, value in attributes.items():
            if value is None:
                continue

            if isinstance(value, dict):
                value = value.get("label", value)

            formatted.append(
                f"{key.replace('_', ' ')}: {value}"
            )

        return ", ".join(formatted)


prompt_builder = StudioPromptBuilder()