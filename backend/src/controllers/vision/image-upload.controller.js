import { prisma } from "../../config/prisma.js";

export const uploadVisionImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VISION_IMAGE_REQUIRED",
          message: "A fashion image is required.",
        },
      });
    }

    const { category } = req.body;

    const fashionItem = await prisma.fashionItem.create({
      data: {
        ownerId: req.user?.id ?? null,
        category,
        source: "vision-upload",
      },
    });

    const fashionImage = await prisma.fashionImage.create({
      data: {
        fashionItemId: fashionItem.id,
        storageKey: req.file.filename,
        imageUrl: `/uploads/vision/${req.file.filename}`,
        mimeType: req.file.mimetype,
        fileSize: req.file.size,
      },
    });

    return res.status(201).json({
      success: true,
      data: {
        fashionItem: {
          id: fashionItem.id,
          category: fashionItem.category,
        },
        fashionImage: {
          id: fashionImage.id,
          storageKey: fashionImage.storageKey,
          imageUrl: fashionImage.imageUrl,
          mimeType: fashionImage.mimeType,
          fileSize: fashionImage.fileSize,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};