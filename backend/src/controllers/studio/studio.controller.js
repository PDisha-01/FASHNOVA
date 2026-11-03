import { generateStudio as runStudioGeneration } from "../../services/studio/studio.service.js";

export const generateStudio = async (req, res, next) => {
  try {
    const result = await runStudioGeneration(req.body, req.user);

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};
