import axios from "axios";
import { env } from "../../config/env.js";

const STYLE_ENGINE_REQUEST_TIMEOUT = 120000;

export const recommendStyle = async (payload) => {
  try {
    const response = await axios.post(
      `${env.STYLE_ENGINE_ML_URL}/recommend`,
      payload,
      {
        timeout: STYLE_ENGINE_REQUEST_TIMEOUT,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = response.data;

    if (
      !result ||
      result.status !== "success" ||
      !Array.isArray(result.recommendations)
    ) {
      throw new Error(
        "Style Engine ML service returned an invalid response."
      );
    }

    return result;
  } catch (error) {
    const message =
      error.response?.data?.detail ||
      error.message ||
      "Style recommendation failed.";

    console.error(
      "Style Engine ML service error:",
      message
    );

    const serviceError = new Error(
      "Style recommendation failed."
    );

    serviceError.statusCode = 502;
    serviceError.code = "STYLE_ENGINE_ML_ERROR";
    serviceError.cause = error;

    throw serviceError;
  }
};