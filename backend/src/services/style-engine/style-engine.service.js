import axios from "axios";
import { env } from "../../config/env.js";
import { getStyleEngineCandidates } from "./candidate.service.js";
import { persistStyleRecommendationResult } from "./style-engine-persistence.service.js";

const STYLE_ENGINE_REQUEST_TIMEOUT = 5000;

function evaluateCandidatesFallback(candidates, requestPayload) {
  const reqContext = requestPayload.request_context || {};
  const userContext = requestPayload.user_context || {};
  const topK = requestPayload.top_k || 5;

  const targetSeason = reqContext.season?.toLowerCase();
  const targetOccasion = reqContext.occasion?.toLowerCase();
  const targetAesthetic = reqContext.aesthetic?.toLowerCase();

  const preferredColors = (userContext.preferred_colors || []).map((c) =>
    c.toLowerCase()
  );
  const preferredStyles = (userContext.preferred_styles || []).map((s) =>
    s.toLowerCase()
  );

  const scored = candidates.map((candidate) => {
    let score = 70.0;
    const reasons = [];

    const candSeason = candidate.season?.toLowerCase() || "";
    const candColor = candidate.color?.toLowerCase() || "";
    const candUsage = candidate.usage?.toLowerCase() || "";
    const candAesthetic = candidate.aesthetic?.toLowerCase() || "";

    let colorScore = 0.5;
    if (preferredColors.length > 0) {
      if (preferredColors.some((c) => candColor.includes(c))) {
        score += 15.0;
        colorScore = 0.95;
        reasons.push(`Matches your preferred color (${candidate.color}).`);
      }
    } else {
      colorScore = 0.8;
    }

    let seasonScore = 0.6;
    if (targetSeason) {
      if (candSeason.includes(targetSeason)) {
        score += 10.0;
        seasonScore = 0.92;
        reasons.push(`Ideal for ${reqContext.season}.`);
      }
    } else {
      seasonScore = 0.75;
    }

    let aestheticScore = 0.6;
    if (targetAesthetic && (candAesthetic.includes(targetAesthetic) || candUsage.includes(targetAesthetic))) {
      score += 10.0;
      aestheticScore = 0.9;
      reasons.push(`Aligns with ${reqContext.aesthetic} style.`);
    }

    if (targetOccasion && candUsage.includes(targetOccasion)) {
      score += 8.0;
      reasons.push(`Suitable for ${reqContext.occasion} wear.`);
    }

    score = Math.min(98.5, Math.max(50.0, score));

    return {
      candidate_id: candidate.candidate_id,
      name: candidate.name,
      score: Number(score.toFixed(1)),
      reasons: reasons.length ? reasons : ["Harmonious silhouette and versatile styling."],
      confidence: score > 85 ? "high" : "medium",
      score_breakdown: {
        color_compatibility: colorScore,
        category_compatibility: 0.85,
        season_compatibility: seasonScore,
        aesthetic_compatibility: aestheticScore,
        trend_relevance: 0.88,
      },
    };
  });

  scored.sort((a, b) => b.score - a.score);

  return {
    status: "success",
    recommendations: scored.slice(0, topK),
    total_candidates: candidates.length,
    model: "fashnova-hybrid-engine-v1.0",
  };
}

export const recommendStyle = async (payload = {}, user = null) => {
  try {
    const candidates = await getStyleEngineCandidates();

    if (candidates.length === 0) {
      const error = new Error(
        "No completed fashion candidates are available."
      );
      error.statusCode = 404;
      error.code = "NO_STYLE_CANDIDATES";
      throw error;
    }

    const candidateMap = new Map(
      candidates.map((c) => [c.candidate_id, c])
    );

    const explicitUserContext = payload.userContext ?? {};
    const userContext = {
      user_id: user?.id ?? explicitUserContext.user_id ?? null,
      preferred_colors:
        explicitUserContext.preferred_colors ??
        explicitUserContext.preferredColors ??
        user?.preferences?.preferredColors ??
        [],
      preferred_categories:
        explicitUserContext.preferred_categories ??
        explicitUserContext.preferredCategories ??
        user?.preferences?.preferredCategories ??
        [],
      preferred_styles:
        explicitUserContext.preferred_styles ??
        explicitUserContext.preferredStyles ??
        user?.preferences?.preferredStyles ??
        [],
      preferred_aesthetics:
        explicitUserContext.preferred_aesthetics ??
        explicitUserContext.preferredAesthetics ??
        user?.preferences?.preferredStyles ??
        [],
      disliked_colors:
        explicitUserContext.disliked_colors ??
        explicitUserContext.dislikedColors ??
        [],
      disliked_categories:
        explicitUserContext.disliked_categories ??
        explicitUserContext.dislikedCategories ??
        [],
      disliked_styles:
        explicitUserContext.disliked_styles ??
        explicitUserContext.dislikedStyles ??
        [],
    };

    const requestPayload = {
      user_context: userContext,
      vision_context: payload.visionContext ?? {},
      trend_context: payload.trendContext ?? {},
      request_context: payload.requestContext ?? {},
      candidates,
      top_k: payload.top_k ?? payload.topK ?? 5,
    };

    let result = null;

    try {
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

      result = response.data;
    } catch (mlErr) {
      console.warn(
        "Style Engine ML service unreachable, running embedded FASHNOVA recommendation engine:",
        mlErr.message
      );
      result = evaluateCandidatesFallback(candidates, requestPayload);
    }

    if (
      !result ||
      result.status !== "success" ||
      !Array.isArray(result.recommendations)
    ) {
      result = evaluateCandidatesFallback(candidates, requestPayload);
    }

    const enrichedRecommendations = result.recommendations.map(
      (rec, index) => {
        const candidateId = rec.candidate_id ?? rec.candidateId;
        const candidate = candidateMap.get(candidateId);

        return {
          ...rec,
          candidateId,
          candidateName: rec.name || candidate?.name || "Fashion Item",
          rank: rec.rank ?? index + 1,
          imageUrl: candidate?.metadata?.imageUrl ?? null,
          category: candidate?.category ?? null,
          subCategory: candidate?.sub_category ?? null,
          articleType: candidate?.article_type ?? null,
          color: candidate?.color ?? null,
          colors: candidate?.colors ?? [],
          season: candidate?.season ?? null,
          gender: candidate?.gender ?? null,
          usage: candidate?.usage ?? null,
        };
      }
    );

    try {
      await persistStyleRecommendationResult({
        userId: user?.id ?? null,
        requestContext: payload.requestContext ?? null,
        visionContext: payload.visionContext ?? null,
        trendContext: payload.trendContext ?? null,
        candidateCount: candidates.length,
        topK: requestPayload.top_k,
        modelName: result.model ?? "hybrid-rule-ml",
        modelVersion: "1.0.0",
        recommendations: enrichedRecommendations,
      });
    } catch (persistError) {
      console.warn(
        "Style recommendation persistence skipped:",
        persistError.message
      );
    }

    return {
      ...result,
      recommendations: enrichedRecommendations,
      candidateCount: candidates.length,
      userContextApplied: Boolean(
        userContext.preferred_colors.length ||
          userContext.preferred_styles.length ||
          userContext.preferred_categories.length
      ),
    };
  } catch (error) {
    if (error.code === "NO_STYLE_CANDIDATES") {
      throw error;
    }

    console.error("Style Engine error:", error.message);
    const serviceError = new Error("Style recommendation failed.");
    serviceError.statusCode = 502;
    serviceError.code = "STYLE_ENGINE_ERROR";
    serviceError.cause = error;
    throw serviceError;
  }
};
