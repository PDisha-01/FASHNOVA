import axios from "axios";

import { env } from "../../config/env.js";

const TRENDS_REQUEST_TIMEOUT = 120000;

export const analyzeTrends = async ({
  attributes = undefined,
  horizon = 2,
} = {}) => {
  try {
    const response = await axios.post(
      `${env.TRENDS_ML_URL}/analyze`,
      {
        ...(attributes ? { attributes } : {}),
        horizon,
      },
      {
        timeout: TRENDS_REQUEST_TIMEOUT,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = response.data;

    if (
      !result ||
      result.status !== "success" ||
      !result.attributes
    ) {
      throw new Error(
        "Trends ML service returned an invalid response."
      );
    }

    return result;
  } catch (error) {
    const message =
      error.response?.data?.detail ||
      error.message ||
      "Trends inference failed.";

    console.error(
      "Trends ML service error:",
      message
    );

    const serviceError = new Error(
      "Trend analysis failed."
    );

    serviceError.statusCode = 502;
    serviceError.code = "TRENDS_ML_ERROR";
    serviceError.cause = error;

    throw serviceError;
  }
};