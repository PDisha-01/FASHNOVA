import { Router } from "express";
import { recommendStyleController } from "../../controllers/style-engine/style-engine.controller.js";
import { optionalAuth } from "../../middleware/auth.js";

const router = Router();

router.post(
  "/recommend",
  optionalAuth,
  recommendStyleController
);

export default router;
