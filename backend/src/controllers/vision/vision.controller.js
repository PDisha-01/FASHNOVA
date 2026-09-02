import { createVisionAnalysis } from "../../services/vision/vision.service.js";

export const analyzeVision = async (req, res, next) => {
  try {
    const analysis = await createVisionAnalysis({
      fashionImageId: req.body.fashionImageId,
    });

    return res.status(201).json({
      success: true,
      data: {
        analysis,
      },
    });
  } catch (error) {
    next(error);
  }
};