import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Please provide a valid email address.")
  .max(255, "Email must not exceed 255 characters.");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long.")
  .max(128, "Password must not exceed 128 characters.");

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z
    .string()
    .trim()
    .min(1, "First name cannot be empty.")
    .max(100, "First name must not exceed 100 characters.")
    .optional(),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name cannot be empty.")
    .max(100, "Last name must not exceed 100 characters.")
    .optional(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});