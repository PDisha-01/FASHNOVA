import { verifyAccessToken } from "../utils/jwt.js";

export function requireAuth(req, res, next) {
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

    req.user = {
      id: payload.sub,
    };

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