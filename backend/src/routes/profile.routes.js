import { Router } from "express";
import { getProfile } from "../controllers/profile.controller.js";
import { updatePreferences } from "../controllers/profile/preferences.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { updatePreferencesSchema } from "../validators/profile/preferences.validator.js";

const router = Router();

router.get("/", requireAuth, getProfile);

router.patch(
  "/preferences",
  requireAuth,
  validate(updatePreferencesSchema),
  updatePreferences
);

export default router;