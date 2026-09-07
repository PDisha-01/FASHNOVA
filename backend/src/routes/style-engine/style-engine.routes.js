import { Router } from "express";
import { recommendStyleController } from "../../controllers/style-engine/style-engine.controller.js";

const router = Router();

router.post(
  "/recommend",
  recommendStyleController
);

export default router;