import { z } from "zod";

const fashionContextSchema = z.object({
  garment: z.string().trim().max(100).optional(),
  category: z.string().trim().max(100).optional(),
  aesthetic: z.string().trim().max(150).optional(),
  season: z.string().trim().max(50).optional(),
  colors: z.array(z.string().trim().min(1).max(50)).max(10).default([]),
  pattern: z.string().trim().max(150).optional(),
  fabric: z.string().trim().max(100).optional(),
});

const trendContextSchema = z.object({
  enabled: z.boolean().default(false),
  trends: z.array(z.string().trim().min(1).max(100)).max(20).default([]),
});

const visionContextSchema = z.object({
  enabled: z.boolean().default(false),
  attributes: z.record(z.string(), z.any()).default({}),
});

export const studioGenerationSchema = z.object({
  generation_type: z
    .enum(["concept", "design", "variation", "pattern"])
    .default("design"),

  prompt: z
    .string()
    .trim()
    .min(3, "Generation prompt must contain at least 3 characters.")
    .max(2000, "Generation prompt cannot exceed 2000 characters."),

  fashion_context: fashionContextSchema.default({}),

  trend_context: trendContextSchema.default({}),

  vision_context: visionContextSchema.default({}),

  aspect_ratio: z
    .string()
    .regex(
      /^\d+:\d+$/,
      "Aspect ratio must use the format width:height."
    )
    .default("3:4"),

  image_size: z
    .enum(["0.5K", "1K", "2K", "4K"])
    .default("1K"),
});