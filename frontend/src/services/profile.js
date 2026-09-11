import { apiRequest } from "./api";
import { getToken } from "./auth";

export async function getProfile() {
  const token = getToken();

  if (!token) {
    const error = new Error("Authentication is required.");
    error.code = "AUTH_TOKEN_MISSING";
    error.status = 401;
    throw error;
  }

  const response = await apiRequest("/profile", {
    method: "GET",
    token,
  });

  return response.data;
}

export async function updateProfilePreferences(preferences) {
  const token = getToken();

  if (!token) {
    const error = new Error("Authentication is required.");
    error.code = "AUTH_TOKEN_MISSING";
    error.status = 401;
    throw error;
  }

  const response = await apiRequest("/profile/preferences", {
    method: "PATCH",
    token,
    body: preferences,
  });

  return response.data;
}