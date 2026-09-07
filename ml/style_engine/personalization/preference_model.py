from typing import Any


class PreferenceModel:
    """
    Represents explicit user preference signals for the
    FASHNOVA Style Engine.

    This initial version uses declared preferences.
    Behavioral learning will be added through the feedback layer.
    """

    PREFERENCE_FIELDS = {
        "colors": "preferred_colors",
        "categories": "preferred_categories",
        "styles": "preferred_styles",
        "aesthetics": "preferred_aesthetics",
    }

    DISLIKE_FIELDS = {
        "colors": "disliked_colors",
        "categories": "disliked_categories",
        "styles": "disliked_styles",
    }

    def build_preference_signals(
        self,
        context: dict[str, Any],
    ) -> dict[str, Any]:
        user = context.get("user", {})

        return {
            "preferred": {
                key: self._normalize_list(
                    user.get(field, [])
                )
                for key, field in self.PREFERENCE_FIELDS.items()
            },
            "disliked": {
                key: self._normalize_list(
                    user.get(field, [])
                )
                for key, field in self.DISLIKE_FIELDS.items()
            },
        }

    def preference_strength(
        self,
        preference_signals: dict[str, Any],
    ) -> float:
        """
        Estimates how much explicit preference information
        is available for the current user.

        Returns a value between 0 and 1.
        """

        preferred = preference_signals.get(
            "preferred",
            {},
        )

        disliked = preference_signals.get(
            "disliked",
            {},
        )

        total_possible_fields = (
            len(self.PREFERENCE_FIELDS)
            + len(self.DISLIKE_FIELDS)
        )

        populated_fields = 0

        for values in preferred.values():
            if values:
                populated_fields += 1

        for values in disliked.values():
            if values:
                populated_fields += 1

        if total_possible_fields == 0:
            return 0.0

        return round(
            populated_fields / total_possible_fields,
            3,
        )

    @staticmethod
    def matches_preference(
        value: str | None,
        preferred_values: list[str],
    ) -> bool:
        if not value:
            return False

        normalized_value = value.strip().lower()

        return normalized_value in preferred_values

    @staticmethod
    def matches_dislike(
        value: str | None,
        disliked_values: list[str],
    ) -> bool:
        if not value:
            return False

        normalized_value = value.strip().lower()

        return normalized_value in disliked_values

    @staticmethod
    def _normalize_list(
        values: list[str] | None,
    ) -> list[str]:
        if not values:
            return []

        normalized = []

        for value in values:
            if not isinstance(value, str):
                continue

            cleaned = value.strip().lower()

            if cleaned and cleaned not in normalized:
                normalized.append(cleaned)

        return normalized


preference_model = PreferenceModel()