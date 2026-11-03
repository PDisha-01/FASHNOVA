import { apiRequest } from "./api";

export async function getProfile() {
  const response = await apiRequest("/profile", {
    method: "GET",
  });

  return response.data;
}

export async function updateProfilePreferences(preferences) {
  const response = await apiRequest("/profile/preferences", {
    method: "PATCH",
    body: preferences,
  });

  return response.data;
}

export async function updateProfileInfo(info) {
  const response = await apiRequest("/profile/info", {
    method: "PATCH",
    body: info,
  });

  return response.data;
}
