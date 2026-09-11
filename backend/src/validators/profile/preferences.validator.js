import { z } from "zod";

export const updatePreferencesSchema = z.object({
  preferredStyles: z.array(z.string()).default([]),
  preferredColors: z.array(z.string()).default([]),
  preferredSeasons: z.array(z.string()).default([]),
  preferredCategories: z.array(z.string()).default([]),
  preferredFits: z.array(z.string()).default([]),
  favoriteBrands: z.array(z.string()).default([]),

  budgetMin: z.union([
    z.number().nonnegative(),
    z.string(),
  ]).nullable().optional(),

  budgetMax: z.union([
    z.number().nonnegative(),
    z.string(),
  ]).nullable().optional(),
});
