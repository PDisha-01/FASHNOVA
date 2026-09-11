import { updateUserPreferences } from "../../services/profile/preferences.service.js";

export async function updatePreferences(req, res, next) {
  try {
    const preferences = await updateUserPreferences(
      req.user.id,
      req.body
    );

    res.status(200).json({
      success: true,
      data: preferences,
    });
  } catch (error) {
    next(error);
  }
}
