import { z } from "zod";

const userContextSchema = z.object({
  user_id: z.string().trim().max(100).optional(),

  preferred_colors: z
    .array(z.string().trim().min(1).max(50))
    .max(30)
    .default([]),

  preferred_categories: z
    .array(z.string().trim().min(1).max(100))
    .max(30)
    .default([]),

  preferred_styles: z
    .array(z.string().trim().min(1).max(100))
    .max(30)
    .default([]),

  preferred_aesthetics: z
    .array(z.string().trim().min(1).max(150))
    .max(30)
    .default([]),

  disliked_colors: z
    .array(z.string().trim().min(1).max(50))
    .max(30)
    .default([]),

  disliked_categories: z
    .array(z.string().trim().min(1).max(100))
    .max(30)
    .default([]),

  disliked_styles: z
    .array(z.string().trim().min(1).max(100))
    .max(30)
    .default([]),
});

const visionContextSchema = z.object({
  enabled: z.boolean().default(false),

  attributes: z
    .record(z.string(), z.any())
    .default({}),
});

const trendContextSchema = z.object({
  enabled: z.boolean().default(false),

  trends: z
    .array(z.string().trim().min(1).max(100))
    .max(50)
    .default([]),
});

const requestContextSchema = z.object({
  occasion: z.string().trim().max(100).optional(),

  season: z.string().trim().max(50).optional(),

  gender: z.string().trim().max(50).optional(),

  category: z.string().trim().max(100).optional(),

  aesthetic: z.string().trim().max(150).optional(),
});

const fashionCandidateSchema = z.object({
  candidate_id: z
    .string()
    .trim()
    .min(1)
    .max(150),

  name: z
    .string()
    .trim()
    .min(1)
    .max(250),

  category: z
    .string()
    .trim()
    .max(100)
    .optional(),

  sub_category: z
    .string()
    .trim()
    .max(100)
    .optional(),

  article_type: z
    .string()
    .trim()
    .max(150)
    .optional(),

  color: z
    .string()
    .trim()
    .max(50)
    .optional(),

  colors: z
    .array(z.string().trim().min(1).max(50))
    .max(20)
    .default([]),

  pattern: z
    .string()
    .trim()
    .max(150)
    .optional(),

  fabric: z
    .string()
    .trim()
    .max(100)
    .optional(),

  aesthetic: z
    .string()
    .trim()
    .max(150)
    .optional(),

  season: z
    .string()
    .trim()
    .max(50)
    .optional(),

  gender: z
    .string()
    .trim()
    .max(50)
    .optional(),

  usage: z
    .string()
    .trim()
    .max(100)
    .optional(),

  metadata: z
    .record(z.string(), z.any())
    .default({}),
});

export const styleEngineRecommendationSchema = z.object({
  user_context: userContextSchema.default({}),

  vision_context: visionContextSchema.default({}),

  trend_context: trendContextSchema.default({}),

  request_context: requestContextSchema.default({}),

  candidates: z
    .array(fashionCandidateSchema)
    .min(1, "At least one fashion candidate is required.")
    .max(500, "A maximum of 500 candidates is allowed."),

  top_k: z
    .number()
    .int()
    .min(1)
    .max(50)
    .default(10),
});