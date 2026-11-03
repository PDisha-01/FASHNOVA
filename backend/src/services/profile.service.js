import { prisma } from "../config/prisma.js";

export async function getUserProfile(userId) {
  const [user, styleRequestsCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        preferences: true,
        _count: {
          select: {
            fashionItems: true,
            studioGenerations: true,
          },
        },
      },
    }),
    prisma.styleRecommendationRequest.count({
      where: { userId },
    }),
  ]);

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
    counts: {
      fashionItems: user._count?.fashionItems ?? 0,
      studioGenerations: user._count?.studioGenerations ?? 0,
      styleRecommendationRequests: styleRequestsCount ?? 0,
    },
  };
}

export async function updateUserProfile(userId, { firstName, lastName, bio, avatarUrl }) {
  const updated = await prisma.userProfile.upsert({
    where: { userId },
    update: {
      ...(firstName !== undefined ? { firstName: firstName?.trim() || null } : {}),
      ...(lastName !== undefined ? { lastName: lastName?.trim() || null } : {}),
      ...(bio !== undefined ? { bio: bio?.trim() || null } : {}),
      ...(avatarUrl !== undefined ? { avatarUrl: avatarUrl?.trim() || null } : {}),
    },
    create: {
      userId,
      firstName: firstName?.trim() || null,
      lastName: lastName?.trim() || null,
      bio: bio?.trim() || null,
      avatarUrl: avatarUrl?.trim() || null,
    },
  });

  return updated;
}
