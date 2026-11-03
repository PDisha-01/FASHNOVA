import { verifyAccessToken } from "../utils/jwt.js";
import { prisma } from "../config/prisma.js";

export async function requireAuth(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      success: false,
      error: {
        code: "AUTH_TOKEN_MISSING",
        message: "Authentication token is required.",
      },
    });
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      success: false,
      error: {
        code: "AUTH_TOKEN_INVALID",
        message: "Invalid authentication header.",
      },
    });
  }

  try {
    const payload = verifyAccessToken(token);

    if (!payload.sub) {
      return res.status(401).json({
        success: false,
        error: {
          code: "AUTH_TOKEN_INVALID",
          message: "Invalid authentication token.",
        },
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        status: true,
        profile: true,
        preferences: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: "AUTH_USER_NOT_FOUND",
          message: "Authenticated user no longer exists.",
        },
      });
    }

    if (user.status !== "ACTIVE") {
      return res.status(403).json({
        success: false,
        error: {
          code: "ACCOUNT_NOT_ACTIVE",
          message: "This account is not active.",
        },
      });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({
      success: false,
      error: {
        code: "AUTH_TOKEN_INVALID",
        message: "Authentication token is invalid or expired.",
      },
    });
  }
}

export async function optionalAuth(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    req.user = null;
    return next();
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    req.user = null;
    return next();
  }

  try {
    const payload = verifyAccessToken(token);

    if (!payload.sub) {
      req.user = null;
      return next();
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        status: true,
        profile: true,
        preferences: true,
      },
    });

    if (user && user.status === "ACTIVE") {
      req.user = user;
    } else {
      req.user = null;
    }

    next();
  } catch {
    req.user = null;
    next();
  }
}
