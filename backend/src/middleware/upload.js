import multer from "multer";
import path from "path";
import crypto from "crypto";

const uploadStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/vision");
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${crypto.randomUUID()}${extension}`;

    cb(null, uniqueName);
  },
});

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const fileFilter = (req, file, cb) => {
  if (!allowedMimeTypes.has(file.mimetype)) {
    return cb(
      new Error("Only JPEG, PNG, and WebP images are allowed.")
    );
  }

  cb(null, true);
};

export const uploadVisionImage = multer({
  storage: uploadStorage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});