import axios from "axios";
import { env } from "../../config/env.js";
import { getStyleEngineCandidates } from "./candidate.service.js";

const STYLE_ENGINE_REQUEST_TIMEOUT = 120000;

export const recommendStyle = async (payload = {}) => {
  try {
    // --------------------------------------------------------------
    // 1. Load real fashion candidates from PostgreSQL
    // --------------------------------------------------------------

    const candidates = await getStyleEngineCandidates();

    if (candidates.length === 0) {
      const error = new Error(
        "No completed fashion candidates are available."
      );

      error.statusCode = 404;
      error.code = "NO_STYLE_CANDIDATES";

      throw error;
    }

    // --------------------------------------------------------------
    // 2. Map frontend request → Python Style Engine schema
    // --------------------------------------------------------------

    const requestPayload = {
      user_context: payload.userContext ?? {},
      vision_context: payload.visionContext ?? {},
      trend_context: payload.trendContext ?? {},
      request_context: payload.requestContext ?? {},
      candidates,
      top_k: payload.top_k ?? 5,
    };

    // --------------------------------------------------------------
    // 3. Debug: verify candidates and context being sent
    // --------------------------------------------------------------

    console.log(
      "STYLE ENGINE REQUEST:",
      JSON.stringify(requestPayload, null, 2)
    );

    console.log(
      "STYLE ENGINE CANDIDATES:",
      candidates.map((candidate) => ({
        id: candidate.candidate_id,
        name: candidate.name,
        category: candidate.category,
        article_type: candidate.article_type,
      }))
    );

    // --------------------------------------------------------------
    // 4. Call Python Style Engine
    // --------------------------------------------------------------

    const response = await axios.post(
      `${env.STYLE_ENGINE_ML_URL}/recommend`,
      requestPayload,
      {
        timeout: STYLE_ENGINE_REQUEST_TIMEOUT,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = response.data;

    // --------------------------------------------------------------
    // 5. Validate Python response
    // --------------------------------------------------------------

    if (
      !result ||
      result.status !== "success" ||
      !Array.isArray(result.recommendations)
    ) {
      throw new Error(
        "Style Engine ML service returned an invalid response."
      );
    }

    // --------------------------------------------------------------
    // 6. Return result to controller/frontend
    // --------------------------------------------------------------

    return {
      ...result,
      candidateCount: candidates.length,
    };
  } catch (error) {
    // Preserve known application errors
    if (
      error.code === "NO_STYLE_CANDIDATES" ||
      error.code === "STYLE_ENGINE_ML_ERROR"
    ) {
      throw error;
    }

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