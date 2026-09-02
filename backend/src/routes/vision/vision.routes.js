import { Router } from "express";
import { analyzeVision } from "../../controllers/vision/vision.controller.js";
import { uploadVisionImage } from "../../controllers/vision/image-upload.controller.js";
import { validate } from "../../middleware/validate.js";
import { uploadVisionImage as upload } from "../../middleware/upload.js";
import { visionAnalyzeSchema } from "../../validators/vision/vision.validator.js";
import { visionImageUploadSchema } from "../../validators/vision/image-upload.validator.js";

const router = Router();

router.post(
  "/images",
  upload.single("image"),
  validate(visionImageUploadSchema),
  uploadVisionImage
);

router.post(
  "/analyze",
  validate(visionAnalyzeSchema),
  analyzeVision
);

export default router;