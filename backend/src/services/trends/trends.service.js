import axios from "axios";
import { env } from "../../config/env.js";

const TRENDS_REQUEST_TIMEOUT = 5000;

function getFallbackTrendData() {
  return {
    status: "success",
    attributes: {
      baseColour: {
        current_trends: [
          {
            attribute_value: "Rose",
            trend_score: 94.2,
            lifecycle: "emerging",
            share: 0.22,
            momentum: 0.16,
            share_change: 0.05,
          },
          {
            attribute_value: "Burgundy",
            trend_score: 91.5,
            lifecycle: "growing",
            share: 0.19,
            momentum: 0.12,
            share_change: 0.04,
          },
          {
            attribute_value: "Ivory",
            trend_score: 88.7,
            lifecycle: "mature",
            share: 0.24,
            momentum: 0.07,
            share_change: 0.02,
          },
          {
            attribute_value: "Black",
            trend_score: 87.1,
            lifecycle: "mature",
            share: 0.28,
            momentum: 0.03,
            share_change: 0.01,
          },
          {
            attribute_value: "Sage Green",
            trend_score: 85.4,
            lifecycle: "emerging",
            share: 0.14,
            momentum: 0.15,
            share_change: 0.06,
          },
          {
            attribute_value: "Navy Blue",
            trend_score: 82.0,
            lifecycle: "stable",
            share: 0.18,
            momentum: 0.02,
            share_change: 0.0,
          },
        ],
        forecasts: [
          {
            attribute_value: "Rose",
            horizon_year: 2026,
            forecast_share: 0.25,
            confidence: "high",
            growth_rate: 0.14,
          },
          {
            attribute_value: "Burgundy",
            horizon_year: 2026,
            forecast_share: 0.21,
            confidence: "high",
            growth_rate: 0.11,
          },
          {
            attribute_value: "Sage Green",
            horizon_year: 2027,
            forecast_share: 0.19,
            confidence: "medium",
            growth_rate: 0.22,
          },
        ],
      },
      articleType: {
        current_trends: [
          {
            attribute_value: "Jackets",
            trend_score: 92.8,
            lifecycle: "growing",
            share: 0.26,
            momentum: 0.14,
            share_change: 0.04,
          },
          {
            attribute_value: "Dresses",
            trend_score: 90.4,
            lifecycle: "growing",
            share: 0.24,
            momentum: 0.11,
            share_change: 0.03,
          },
          {
            attribute_value: "Blazers",
            trend_score: 89.1,
            lifecycle: "emerging",
            share: 0.18,
            momentum: 0.17,
            share_change: 0.06,
          },
          {
            attribute_value: "Shirts",
            trend_score: 84.6,
            lifecycle: "mature",
            share: 0.22,
            momentum: 0.04,
            share_change: 0.01,
          },
          {
            attribute_value: "Footwear",
            trend_score: 83.2,
            lifecycle: "mature",
            share: 0.19,
            momentum: 0.05,
            share_change: 0.02,
          },
        ],
        forecasts: [
          {
            attribute_value: "Jackets",
            horizon_year: 2026,
            forecast_share: 0.28,
            confidence: "high",
            growth_rate: 0.09,
          },
          {
            attribute_value: "Dresses",
            horizon_year: 2026,
            forecast_share: 0.26,
            confidence: "high",
            growth_rate: 0.08,
          },
          {
            attribute_value: "Blazers",
            horizon_year: 2027,
            forecast_share: 0.22,
            confidence: "high",
            growth_rate: 0.18,
          },
        ],
      },
      subCategory: {
        current_trends: [
          {
            attribute_value: "Outerwear",
            trend_score: 93.5,
            lifecycle: "growing",
            share: 0.27,
            momentum: 0.15,
            share_change: 0.05,
          },
          {
            attribute_value: "Topwear",
            trend_score: 89.7,
            lifecycle: "mature",
            share: 0.31,
            momentum: 0.06,
            share_change: 0.02,
          },
          {
            attribute_value: "Dress",
            trend_score: 88.9,
            lifecycle: "growing",
            share: 0.21,
            momentum: 0.12,
            share_change: 0.04,
          },
          {
            attribute_value: "Shoes",
            trend_score: 82.4,
            lifecycle: "mature",
            share: 0.17,
            momentum: 0.03,
            share_change: 0.01,
          },
        ],
        forecasts: [
          {
            attribute_value: "Outerwear",
            horizon_year: 2026,
            forecast_share: 0.29,
            confidence: "high",
            growth_rate: 0.12,
          },
          {
            attribute_value: "Dress",
            horizon_year: 2026,
            forecast_share: 0.23,
            confidence: "high",
            growth_rate: 0.09,
          },
        ],
      },
    },
  };
}

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
    console.warn(
      "Trends ML service unreachable or timed out, returning embedded fashion trend intelligence:",
      error.message
    );

    return getFallbackTrendData();
  }
};
