import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const JWT_EXPIRES_IN = "7d";

export function generateAccessToken(userId) {
  return jwt.sign(
    {
      sub: userId,
    },
    env.JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.JWT_SECRET);
}