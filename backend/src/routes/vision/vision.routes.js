import { Router } from "express";
import { analyzeVision } from "../../controllers/vision/vision.controller.js";
import { uploadVisionImage } from "../../controllers/vision/image-upload.controller.js";
import { optionalAuth } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { uploadVisionImage as upload } from "../../middleware/upload.js";
import { visionAnalyzeSchema } from "../../validators/vision/vision.validator.js";
import { visionImageUploadSchema } from "../../validators/vision/image-upload.validator.js";

const router = Router();

router.post(
  "/images",
  optionalAuth,
  upload.single("image"),
  validate(visionImageUploadSchema),
  uploadVisionImage
);

router.post(
  "/analyze",
  optionalAuth,
  validate(visionAnalyzeSchema),
  analyzeVision
);

export default router;
