import axios from "axios";
import fs from "fs/promises";
import path from "path";
import FormData from "form-data";

import { prisma } from "../../config/prisma.js";
import { env } from "../../config/env.js";

const VISION_MODEL_NAME = "fashnova-vision";
const VISION_MODEL_VERSION = "0.1.0";

const uploadDirectory = path.resolve(
  process.cwd(),
  "uploads",
  "vision"
);

export const createVisionAnalysis = async ({
  fashionImageId,
}) => {
  const fashionImage = await prisma.fashionImage.findUnique({
    where: {
      id: fashionImageId,
    },
    select: {
      id: true,
      storageKey: true,
      mimeType: true,
      fileSize: true,
    },
  });

  if (!fashionImage) {
    const error = new Error("Fashion image not found.");
    error.statusCode = 404;
    error.code = "FASHION_IMAGE_NOT_FOUND";
    throw error;
  }

  const imagePath = path.join(
    uploadDirectory,
    fashionImage.storageKey
  );

  const analysis = await prisma.visionAnalysis.create({
    data: {
      fashionImageId: fashionImage.id,
      status: "PENDING",
      modelName: VISION_MODEL_NAME,
      modelVersion: VISION_MODEL_VERSION,
    },
  });

  try {
    await prisma.visionAnalysis.update({
      where: {
        id: analysis.id,
      },
      data: {
        status: "PROCESSING",
        startedAt: new Date(),
      },
    });

    await fs.access(imagePath);

    const form = new FormData();

    form.append(
      "file",
      await fs.readFile(imagePath),
      {
        filename: fashionImage.storageKey,
        contentType: fashionImage.mimeType,
        knownLength: fashionImage.fileSize ?? undefined,
      }
    );

    const response = await axios.post(
      `${env.VISION_ML_URL}/analyze`,
      form,
      {
        headers: form.getHeaders(),
        maxContentLength: 20 * 1024 * 1024,
        maxBodyLength: 20 * 1024 * 1024,
        timeout: 120000,
      }
    );

    const result = response.data?.data;

    if (!result?.predictions) {
      throw new Error(
        "Vision ML service returned an invalid response."
      );
    }

    const predictions = result.predictions;

    const completedAnalysis = await prisma.visionAnalysis.update({
      where: {
        id: analysis.id,
      },
      data: {
        status: "COMPLETED",
        category:
          predictions.subCategory?.label === "Dress"
            ? "DRESS"
            : undefined,
        season: predictions.season?.label?.toUpperCase(),
        dominantColor: predictions.baseColour?.label,
        confidence:
          predictions.articleType?.confidence ?? null,
        attributes: {
          gender: predictions.gender,
          masterCategory: predictions.masterCategory,
          subCategory: predictions.subCategory,
          articleType: predictions.articleType,
          baseColour: predictions.baseColour,
          season: predictions.season,
          usage: predictions.usage,
        },
        completedAt: new Date(),
        errorMessage: null,
      },
    });

    return completedAnalysis;
  } catch (error) {
    const message =
      error.response?.data?.detail ||
      error.message ||
      "Vision inference failed.";

    console.error("Vision ML service error:", message);

    await prisma.visionAnalysis.update({
      where: {
        id: analysis.id,
      },
      data: {
        status: "FAILED",
        errorMessage: message,
        completedAt: new Date(),
      },
    });

    const serviceError = new Error(
      "Vision analysis failed."
    );

    serviceError.statusCode = 502;
    serviceError.code = "VISION_ML_ERROR";
    serviceError.cause = error;

    throw serviceError;
  }
};