import { prisma } from "../../config/prisma.js";

export async function updateUserPreferences(userId, data) {
  return prisma.userPreference.upsert({
    where: {
      userId,
    },

    create: {
      userId,
      preferredStyles: data.preferredStyles ?? [],
      preferredColors: data.preferredColors ?? [],
      preferredSeasons: data.preferredSeasons ?? [],
      preferredCategories: data.preferredCategories ?? [],
      preferredFits: data.preferredFits ?? [],
      favoriteBrands: data.favoriteBrands ?? [],
      budgetMin: data.budgetMin ?? null,
      budgetMax: data.budgetMax ?? null,
    },

    update: {
      preferredStyles: data.preferredStyles ?? [],
      preferredColors: data.preferredColors ?? [],
      preferredSeasons: data.preferredSeasons ?? [],
      preferredCategories: data.preferredCategories ?? [],
      preferredFits: data.preferredFits ?? [],
      favoriteBrands: data.favoriteBrands ?? [],
      budgetMin: data.budgetMin ?? null,
      budgetMax: data.budgetMax ?? null,
    },
  });
}
