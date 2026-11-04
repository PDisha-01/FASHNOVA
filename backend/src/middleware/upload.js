import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = path.resolve(process.cwd(), "uploads", "vision");

fs.mkdirSync(uploadDir, { recursive: true });

const uploadStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${crypto.randomUUID()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

export const uploadVisionImage = multer({
  storage: uploadStorage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});
