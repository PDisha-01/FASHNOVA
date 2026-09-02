import { z } from "zod";

export const visionImageUploadSchema = z.object({
  category: z.enum([
    "TOP",
    "BOTTOM",
    "DRESS",
    "OUTERWEAR",
    "FOOTWEAR",
    "ACCESSORY",
    "FULL_OUTFIT",
  ]),
});