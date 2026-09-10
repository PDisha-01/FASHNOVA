import { prisma } from "../../config/prisma.js";

export async function getStyleEngineCandidates() {
  const items = await prisma.fashionItem.findMany({
    include: {
      images: {
        include: {
          visionAnalyses: {
            where: {
              status: "COMPLETED",
            },
            orderBy: {
              completedAt: "desc",
            },
            take: 1,
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const candidates = [];

  for (const item of items) {
    // Use the latest completed Vision analysis from this fashion item.
    const imageWithAnalysis = item.images.find(
      (image) => image.visionAnalyses.length > 0
    );

    if (!imageWithAnalysis) {
      continue;
    }

    const analysis = imageWithAnalysis.visionAnalyses[0];
    const attributes = analysis.attributes ?? {};

    candidates.push({
      candidate_id: item.id,

      name:
        item.name ||
        attributes.articleType?.label ||
        attributes.subCategory?.label ||
        "Fashion Item",

      category: item.category ?? null,

      sub_category:
        attributes.subCategory?.label ?? null,

      article_type:
        attributes.articleType?.label ?? null,

      color:
        attributes.baseColour?.label ??
        analysis.dominantColor ??
        null,

      colors: attributes.baseColour?.label
        ? [attributes.baseColour.label]
        : analysis.dominantColor
          ? [analysis.dominantColor]
          : [],

      pattern: item.pattern ?? null,

      fabric: null,

      aesthetic: item.style ?? null,

      season:
        attributes.season?.label ??
        item.season ??
        null,

      gender:
        attributes.gender?.label ?? null,

      usage:
        attributes.usage?.label ?? null,

      metadata: {
        fashionItemId: item.id,
        imageId: imageWithAnalysis.id,
        imageUrl: imageWithAnalysis.imageUrl,
        visionAnalysisId: analysis.id,
        visionModel: analysis.modelName,
        visionModelVersion: analysis.modelVersion,
      },
    });
  }

  return candidates;
}