import axios from "axios";
import { prisma } from "../../config/prisma.js";
import { env } from "../../config/env.js";

const VISION_MODEL_NAME = "fashnova-vision";
const VISION_MODEL_VERSION = "0.1.0";

export const createVisionAnalysis = async ({
  fashionImageId,
}) => {
  const fashionImage = await prisma.fashionImage.findUnique({
    where: {
      id: fashionImageId,
    },
    select: {
      id: true,
      imageUrl: true,
    },
  });

  if (!fashionImage) {
    const error = new Error("Fashion image not found.");
    error.statusCode = 404;
    error.code = "FASHION_IMAGE_NOT_FOUND";
    throw error;
  }

  const analysis = await prisma.visionAnalysis.create({
    data: {
      fashionImageId: fashionImage.id,
      status: "PENDING",
      modelName: VISION_MODEL_NAME,
      modelVersion: VISION_MODEL_VERSION,
    },
  });

  try {
    await axios.post(`${env.VISION_ML_URL}/analyze`, {
      fashionImageId: fashionImage.id,
      imageUrl: fashionImage.imageUrl,
    });
  } catch (error) {
    console.error("Vision ML service error:", error.message);
  }

  return analysis;
};