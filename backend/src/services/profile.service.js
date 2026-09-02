import { prisma } from "../config/prisma.js";

export async function getUserProfile(userId) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      profile: true,
      preferences: true,
    },
  });

  if (!user) {
    const error = new Error("User profile was not found.");
    error.statusCode = 404;
    error.code = "PROFILE_NOT_FOUND";
    throw error;
  }

  return {
    id: user.id,
    email: user.email,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    profile: user.profile,
    preferences: user.preferences,
  };
}