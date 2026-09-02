import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma.js";
import { generateAccessToken } from "../utils/jwt.js";

const SALT_ROUNDS = 12;

export async function registerUser({ email, password, firstName, lastName }) {
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (existingUser) {
    const error = new Error("An account with this email already exists.");
    error.statusCode = 409;
    error.code = "EMAIL_ALREADY_EXISTS";
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      passwordHash,
      profile: {
        create: {
          firstName: firstName?.trim() || null,
          lastName: lastName?.trim() || null,
        },
      },
      preferences: {
        create: {},
      },
    },
    include: {
      profile: true,
      preferences: true,
    },
  });

  const accessToken = generateAccessToken(user.id);

  return {
    accessToken,
    user: {
      id: user.id,
      email: user.email,
      status: user.status,
      profile: user.profile,
      preferences: user.preferences,
    },
  };
}

export async function loginUser({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
    include: {
      profile: true,
      preferences: true,
    },
  });

  if (!user) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  if (user.status !== "ACTIVE") {
    const error = new Error("This account is not active.");
    error.statusCode = 403;
    error.code = "ACCOUNT_NOT_ACTIVE";
    throw error;
  }

  const accessToken = generateAccessToken(user.id);

  return {
    accessToken,
    user: {
      id: user.id,
      email: user.email,
      status: user.status,
      profile: user.profile,
      preferences: user.preferences,
    },
  };
}
