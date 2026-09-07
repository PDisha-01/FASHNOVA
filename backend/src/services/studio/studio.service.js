import axios from "axios";
import { env } from "../../config/env.js";

const STUDIO_ML_URL = env.STUDIO_ML_URL || "http://127.0.0.1:8002";

const STUDIO_REQUEST_TIMEOUT = 120000;

export const generateStudio = async (payload) => {
  try {
    const response = await axios.post(
      `${STUDIO_ML_URL}/generate`,
       payload,
      {
        timeout: STUDIO_REQUEST_TIMEOUT,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = response.data;

    if (!result || !result.status) {
      throw new Error(
        "Studio ML service returned an invalid response."
      );
    }

    return result;
  } catch (error) {
    const message =
      error.response?.data?.detail ||
      error.message ||
      "Studio generation failed.";

    console.error("Studio ML service error:", message);

    const serviceError = new Error("Studio generation failed.");

    serviceError.statusCode = 502;
    serviceError.code = "STUDIO_ML_ERROR";
    serviceError.cause = error;

    throw serviceError;
  }
};