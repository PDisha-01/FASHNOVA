import { analyzeTrends as runTrendAnalysis } from "../../services/trends/trends.service.js";

export const analyzeTrends = async (req, res, next) => {
  try {
    const {
      attributes,
      horizon = 2,
    } = req.body;

    const result = await runTrendAnalysis({
      attributes,
      horizon,
    });

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};