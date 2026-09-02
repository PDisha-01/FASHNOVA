import { z } from "zod";

export const visionAnalyzeSchema = z.object({
  fashionImageId: z
    .string()
    .uuid("fashionImageId must be a valid UUID."),
});