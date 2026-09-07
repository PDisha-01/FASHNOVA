import { Router } from "express";
import { generateStudio } from "../../controllers/studio/studio.controller.js";
import { validate } from "../../middleware/validate.js";
import { studioGenerationSchema } from "../../validators/studio/studio.validator.js";

const router = Router();

router.post(
  "/generate",
  validate(studioGenerationSchema),
  generateStudio
);

export default router;