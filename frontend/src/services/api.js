import API_BASE_URL from "../config/api";
import { getToken, removeToken, setToken } from "./auth";

export async function apiRequest(
  endpoint,
  { method = "GET", body, token, isFormData = false } = {}
) {
  const authToken = token || getToken();
  const headers = {};

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  let response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
    });
  } catch (networkError) {
    const error = new Error(
      "Unable to connect to FASHNOVA backend server on port 5000. Please start the backend service."
    );
    error.code = "SERVER_UNREACHABLE";
    error.cause = networkError;
    throw error;
  }

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    if (response.status === 401) {
      removeToken();
    }

    const error = new Error(
      data?.error?.message || data?.detail || data?.message || "Something went wrong."
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

export async function getCurrentUser() {
  const response = await apiRequest("/auth/me", {
    method: "GET",
  });

  return response.data;
}

export async function uploadVisionImageFile(formData) {
  const response = await apiRequest("/vision/images", {
    method: "POST",
    body: formData,
    isFormData: true,
  });

  return response.data;
}

export async function analyzeVisionImage(fashionImageId) {
  const response = await apiRequest("/vision/analyze", {
    method: "POST",
    body: { fashionImageId },
  });

  return response.data;
}

export async function fetchTrends(horizon = 2) {
  const response = await apiRequest("/trends/analyze", {
    method: "POST",
    body: { horizon },
  });

  return response;
}

export async function generateStudioDesign(payload) {
  const response = await apiRequest("/studio/generate", {
    method: "POST",
    body: payload,
  });

  return response;
}

export async function getStyleRecommendations(payload) {
  const response = await apiRequest("/style-engine/recommend", {
    method: "POST",
    body: payload,
  });

  return response;
}
