import { getUserProfile } from "../services/profile.service.js";

export async function getProfile(req, res, next) {
  try {
    const profile = await getUserProfile(req.user.id);

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
}