import { Router } from "express";

import { analyzeTrends } from "../../controllers/trends/trends.controller.js";

const router = Router();

router.post(
  "/analyze",
  analyzeTrends
);

export default router;