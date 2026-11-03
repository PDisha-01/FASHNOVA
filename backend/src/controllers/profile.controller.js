import {
  getUserProfile,
  updateUserProfile,
} from "../services/profile.service.js";

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

export async function updateProfileInfo(req, res, next) {
  try {
    const updated = await updateUserProfile(req.user.id, req.body);

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}
