import { recommendStyle } from "../../services/style-engine/style-engine.service.js";

export const recommendStyleController = async (
  req,
  res,
  next
) => {
  try {
    const result = await recommendStyle(req.body);

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};