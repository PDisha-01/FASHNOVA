import { prisma } from "../../config/prisma.js";

function normalizeEnum(value) {
  if (typeof value !== "string") {
    return value;
  }

  return value.trim().toUpperCase().replace(/[\s-]+/g, "_");
}

function normalizeEnumArray(values, fieldName) {
  if (values == null) {
    return [];
  }

  if (!Array.isArray(values)) {
    const error = new Error(`${fieldName} must be an array.`);
    error.statusCode = 400;
    error.code = "INVALID_PREFERENCE_FORMAT";
    throw error;
  }

  return values
    .filter((value) => value !== null && value !== undefined && value !== "")
    .map(normalizeEnum);
}

function normalizeCategory(value) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = normalizeEnum(value);

  const aliases = {
    TOPS: "TOP",
    TOP: "TOP",

    BOTTOMS: "BOTTOM",
    BOTTOM: "BOTTOM",

    DRESSES: "DRESS",
    DRESS: "DRESS",

    OUTERWEARS: "OUTERWEAR",
    OUTERWEAR: "OUTERWEAR",

    FOOTWEAR: "FOOTWEAR",

    ACCESSORIES: "ACCESSORY",
    ACCESSORY: "ACCESSORY",

    FULL_OUTFITS: "FULL_OUTFIT",
    FULL_OUTFIT: "FULL_OUTFIT",
  };

  return aliases[normalized] ?? null;
}
function normalizePreferences(data) {
  return {
    preferredStyles: normalizeEnumArray(
      data.preferredStyles,
      "preferredStyles"
    ),

    preferredColors: normalizeEnumArray(
      data.preferredColors,
      "preferredColors"
    ),

    preferredSeasons: normalizeEnumArray(
      data.preferredSeasons,
      "preferredSeasons"
    ),

    preferredCategories: (data.preferredCategories ?? [])
  .map(normalizeCategory)
  .filter(Boolean),

    preferredFits: normalizeEnumArray(
      data.preferredFits,
      "preferredFits"
    ),

    favoriteBrands: Array.isArray(data.favoriteBrands)
      ? data.favoriteBrands
          .filter(
            (value) =>
              value !== null &&
              value !== undefined &&
              value !== ""
          )
          .map((value) => String(value).trim())
          .filter(Boolean)
      : [],

    budgetMin:
      data.budgetMin === null ||
      data.budgetMin === undefined ||
      data.budgetMin === ""
        ? null
        : Number(data.budgetMin),

    budgetMax:
      data.budgetMax === null ||
      data.budgetMax === undefined ||
      data.budgetMax === ""
        ? null
        : Number(data.budgetMax),
  };
}

export async function updateUserPreferences(userId, data) {
  const preferences = normalizePreferences(data);

  return prisma.userPreference.upsert({
    where: {
      userId,
    },

    create: {
      userId,
      ...preferences,
    },

    update: {
      ...preferences,
    },
  });
}