import prisma from "../../config/prisma.js";

/**
 * Persist a Style Engine recommendation request and its recommendations.
 *
 * The ML service remains responsible for generating/ranking recommendations.
 * This service is responsible only for durable database persistence.
 */
export async function persistStyleRecommendationResult({
  userId = null,
  requestContext = null,
  visionContext = null,
  trendContext = null,
  candidateCount,
  topK,
  modelName,
  modelVersion = null,
  recommendations = [],
}) {
  if (!Number.isInteger(candidateCount) || candidateCount < 0) {
    throw new Error("candidateCount must be a non-negative integer.");
  }

  if (!Number.isInteger(topK) || topK < 1) {
    throw new Error("topK must be a positive integer.");
  }

  if (!modelName || typeof modelName !== "string") {
    throw new Error("modelName is required.");
  }

  if (!Array.isArray(recommendations)) {
    throw new Error("recommendations must be an array.");
  }

  return prisma.$transaction(async (tx) => {
    const request = await tx.styleRecommendationRequest.create({
      data: {
        userId,
        requestContext,
        visionContext,
        trendContext,
        candidateCount,
        topK,
        modelName,
        modelVersion,
      },
    });

    if (recommendations.length === 0) {
      return {
        request,
        recommendations: [],
      };
    }

    const recommendationRows = recommendations.map((recommendation, index) => {
      const rank =
        Number.isInteger(recommendation.rank) && recommendation.rank > 0
          ? recommendation.rank
          : index + 1;

      const score = Number(recommendation.score);

      if (!Number.isFinite(score)) {
        throw new Error(
          `Invalid recommendation score at index ${index}.`,
        );
      }

      if (
        !recommendation.candidateId ||
        typeof recommendation.candidateId !== "string"
      ) {
        throw new Error(
          `Missing candidateId at recommendation index ${index}.`,
        );
      }

      if (
        !recommendation.candidateName ||
        typeof recommendation.candidateName !== "string"
      ) {
        throw new Error(
          `Missing candidateName at recommendation index ${index}.`,
        );
      }

      return {
        requestId: request.id,
        candidateId: recommendation.candidateId,
        candidateName: recommendation.candidateName,
        score,
        confidence: recommendation.confidence ?? "medium",
        scoreBreakdown: recommendation.scoreBreakdown ?? null,
        reasons: recommendation.reasons ?? null,
        trendAlignment: recommendation.trendAlignment ?? null,
        rank,
      };
    });

    await tx.styleRecommendation.createMany({
      data: recommendationRows,
    });

    const savedRecommendations = await tx.styleRecommendation.findMany({
      where: {
        requestId: request.id,
      },
      orderBy: {
        rank: "asc",
      },
    });

    return {
      request,
      recommendations: savedRecommendations,
    };
  });
}