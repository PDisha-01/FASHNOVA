import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { env } from "./config/env.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middleware/errorHandler.js";

import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import visionRoutes from "./routes/vision/vision.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
  })
);

app.use(express.json());

// Serve uploaded Vision images
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    service: "FASHNOVA Backend",
    status: "healthy",
    environment: env.NODE_ENV,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/vision", visionRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`FASHNOVA backend running on port ${env.PORT}`);
});