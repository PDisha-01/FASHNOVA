import API_BASE_URL from "../config/api";
import { setToken } from "./auth";

export async function apiRequest(
  endpoint,
  { method = "GET", body, token } = {}
) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(
      data?.error?.message || "Something went wrong."
    );

    error.code = data?.error?.code;
    error.status = response.status;
    error.details = data?.error?.details;

    throw error;
  }

  return data;
}
export async function loginUser(email, password) {
  const response = await apiRequest("/auth/login", {
    method: "POST",
    body: {
      email,
      password,
    },
  });

  setToken(response.data.accessToken);

  return response.data.user;
}

export async function registerUser({
  email,
  password,
  firstName,
  lastName,
}) {
  const response = await apiRequest("/auth/register", {
    method: "POST",
    body: {
      email,
      password,
      firstName,
      lastName,
    },
  });

  setToken(response.data.accessToken);

  return response.data.user;
}