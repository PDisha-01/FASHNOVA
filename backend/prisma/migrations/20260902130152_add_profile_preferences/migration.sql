-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "FashionCategory" AS ENUM ('TOP', 'BOTTOM', 'DRESS', 'OUTERWEAR', 'FOOTWEAR', 'ACCESSORY', 'FULL_OUTFIT');

-- CreateEnum
CREATE TYPE "PatternType" AS ENUM ('SOLID', 'STRIPED', 'CHECKED', 'PLAID', 'FLORAL', 'POLKA_DOT', 'GEOMETRIC', 'ABSTRACT', 'PRINTED', 'GRAPHIC', 'ANIMAL_PRINT', 'CAMOUFLAGE', 'TEXTURED', 'OTHER');

-- CreateEnum
CREATE TYPE "FitType" AS ENUM ('SLIM', 'REGULAR', 'RELAXED', 'OVERSIZED', 'LOOSE', 'TAILORED', 'BODYCON', 'OTHER');

-- CreateEnum
CREATE TYPE "StyleType" AS ENUM ('CASUAL', 'FORMAL', 'BUSINESS_CASUAL', 'STREETWEAR', 'SPORTSWEAR', 'PARTY', 'ETHNIC', 'MINIMAL', 'VINTAGE', 'BOHEMIAN', 'PREPPY', 'Y2K', 'LUXURY', 'OTHER');

-- CreateEnum
CREATE TYPE "SeasonType" AS ENUM ('SPRING', 'SUMMER', 'AUTUMN', 'WINTER', 'ALL_SEASON');

-- CreateEnum
CREATE TYPE "VisionAnalysisStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "TrendStatus" AS ENUM ('EMERGING', 'GROWING', 'PEAK', 'DECLINING', 'STABLE');

-- CreateEnum
CREATE TYPE "TrendSourceType" AS ENUM ('SOCIAL_MEDIA', 'FASHION_CATALOG', 'RUNWAY', 'SEARCH_DATA', 'USER_BEHAVIOR', 'CURATED', 'OTHER');

-- CreateEnum
CREATE TYPE "ForecastHorizon" AS ENUM ('SHORT_TERM', 'MEDIUM_TERM', 'LONG_TERM');

-- CreateEnum
CREATE TYPE "StudioGenerationStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "StudioOutputType" AS ENUM ('FASHION_CONCEPT', 'GRAPHIC_DESIGN', 'PATTERN', 'OUTFIT_VARIATION', 'STYLE_VARIATION', 'OTHER');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "first_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "avatar_url" TEXT,
    "bio" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "preferred_styles" "StyleType"[],
    "preferred_colors" TEXT[],
    "preferred_seasons" "SeasonType"[],
    "preferred_categories" "FashionCategory"[],
    "preferred_fits" "FitType"[],
    "favorite_brands" TEXT[],
    "budget_min" DECIMAL(10,2),
    "budget_max" DECIMAL(10,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fashion_items" (
    "id" UUID NOT NULL,
    "owner_id" UUID,
    "name" VARCHAR(200),
    "description" TEXT,
    "category" "FashionCategory" NOT NULL,
    "brand" VARCHAR(150),
    "pattern" "PatternType",
    "fit" "FitType",
    "style" "StyleType",
    "season" "SeasonType",
    "source" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fashion_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fashion_images" (
    "id" UUID NOT NULL,
    "fashion_item_id" UUID NOT NULL,
    "storage_key" VARCHAR(500) NOT NULL,
    "image_url" TEXT,
    "mimeType" VARCHAR(100) NOT NULL,
    "file_size" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fashion_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vision_analyses" (
    "id" UUID NOT NULL,
    "fashion_image_id" UUID NOT NULL,
    "status" "VisionAnalysisStatus" NOT NULL DEFAULT 'PENDING',
    "model_name" VARCHAR(150) NOT NULL,
    "model_version" VARCHAR(50) NOT NULL,
    "category" "FashionCategory",
    "pattern" "PatternType",
    "fit" "FitType",
    "style" "StyleType",
    "season" "SeasonType",
    "dominant_color" VARCHAR(100),
    "confidence" DECIMAL(5,4),
    "attributes" JSONB,
    "error_message" TEXT,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vision_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trends" (
    "id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "category" "FashionCategory",
    "style" "StyleType",
    "season" "SeasonType",
    "status" "TrendStatus" NOT NULL DEFAULT 'EMERGING',
    "score" DECIMAL(6,4),
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trends_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trend_observations" (
    "id" UUID NOT NULL,
    "trend_id" UUID NOT NULL,
    "source_type" "TrendSourceType" NOT NULL,
    "source" VARCHAR(200),
    "observation_date" TIMESTAMP(3) NOT NULL,
    "frequency" INTEGER,
    "engagement" DECIMAL(12,4),
    "score" DECIMAL(6,4),
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trend_observations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trend_forecasts" (
    "id" UUID NOT NULL,
    "trend_id" UUID NOT NULL,
    "model_name" VARCHAR(150) NOT NULL,
    "model_version" VARCHAR(50) NOT NULL,
    "horizon" "ForecastHorizon" NOT NULL,
    "forecast_date" TIMESTAMP(3) NOT NULL,
    "predicted_score" DECIMAL(6,4),
    "confidence" DECIMAL(5,4),
    "features" JSONB,
    "result" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trend_forecasts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "studio_generations" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "status" "StudioGenerationStatus" NOT NULL DEFAULT 'PENDING',
    "outputType" "StudioOutputType" NOT NULL,
    "prompt" TEXT NOT NULL,
    "negative_prompt" TEXT,
    "model_name" VARCHAR(150) NOT NULL,
    "model_version" VARCHAR(50) NOT NULL,
    "parameters" JSONB,
    "trend_context" JSONB,
    "error_message" TEXT,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "studio_generations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "studio_outputs" (
    "id" UUID NOT NULL,
    "generation_id" UUID NOT NULL,
    "outputType" "StudioOutputType" NOT NULL,
    "storage_key" VARCHAR(500) NOT NULL,
    "image_url" TEXT,
    "mimeType" VARCHAR(100) NOT NULL,
    "file_size" INTEGER,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "studio_outputs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_user_id_key" ON "user_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_user_id_key" ON "user_preferences"("user_id");

-- CreateIndex
CREATE INDEX "fashion_items_owner_id_idx" ON "fashion_items"("owner_id");

-- CreateIndex
CREATE INDEX "fashion_items_category_idx" ON "fashion_items"("category");

-- CreateIndex
CREATE INDEX "fashion_items_style_idx" ON "fashion_items"("style");

-- CreateIndex
CREATE INDEX "fashion_items_season_idx" ON "fashion_items"("season");

-- CreateIndex
CREATE UNIQUE INDEX "fashion_images_storage_key_key" ON "fashion_images"("storage_key");

-- CreateIndex
CREATE INDEX "fashion_images_fashion_item_id_idx" ON "fashion_images"("fashion_item_id");

-- CreateIndex
CREATE INDEX "vision_analyses_fashion_image_id_idx" ON "vision_analyses"("fashion_image_id");

-- CreateIndex
CREATE INDEX "vision_analyses_status_idx" ON "vision_analyses"("status");

-- CreateIndex
CREATE INDEX "vision_analyses_model_name_model_version_idx" ON "vision_analyses"("model_name", "model_version");

-- CreateIndex
CREATE INDEX "trends_category_idx" ON "trends"("category");

-- CreateIndex
CREATE INDEX "trends_style_idx" ON "trends"("style");

-- CreateIndex
CREATE INDEX "trends_season_idx" ON "trends"("season");

-- CreateIndex
CREATE INDEX "trends_status_idx" ON "trends"("status");

-- CreateIndex
CREATE INDEX "trend_observations_trend_id_idx" ON "trend_observations"("trend_id");

-- CreateIndex
CREATE INDEX "trend_observations_observation_date_idx" ON "trend_observations"("observation_date");

-- CreateIndex
CREATE INDEX "trend_observations_source_type_idx" ON "trend_observations"("source_type");

-- CreateIndex
CREATE INDEX "trend_forecasts_trend_id_idx" ON "trend_forecasts"("trend_id");

-- CreateIndex
CREATE INDEX "trend_forecasts_forecast_date_idx" ON "trend_forecasts"("forecast_date");

-- CreateIndex
CREATE INDEX "trend_forecasts_model_name_model_version_idx" ON "trend_forecasts"("model_name", "model_version");

-- CreateIndex
CREATE INDEX "studio_generations_user_id_idx" ON "studio_generations"("user_id");

-- CreateIndex
CREATE INDEX "studio_generations_status_idx" ON "studio_generations"("status");

-- CreateIndex
CREATE INDEX "studio_generations_outputType_idx" ON "studio_generations"("outputType");

-- CreateIndex
CREATE INDEX "studio_generations_model_name_model_version_idx" ON "studio_generations"("model_name", "model_version");

-- CreateIndex
CREATE UNIQUE INDEX "studio_outputs_storage_key_key" ON "studio_outputs"("storage_key");

-- CreateIndex
CREATE INDEX "studio_outputs_generation_id_idx" ON "studio_outputs"("generation_id");

-- CreateIndex
CREATE INDEX "studio_outputs_outputType_idx" ON "studio_outputs"("outputType");

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fashion_items" ADD CONSTRAINT "fashion_items_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fashion_images" ADD CONSTRAINT "fashion_images_fashion_item_id_fkey" FOREIGN KEY ("fashion_item_id") REFERENCES "fashion_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vision_analyses" ADD CONSTRAINT "vision_analyses_fashion_image_id_fkey" FOREIGN KEY ("fashion_image_id") REFERENCES "fashion_images"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trend_observations" ADD CONSTRAINT "trend_observations_trend_id_fkey" FOREIGN KEY ("trend_id") REFERENCES "trends"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trend_forecasts" ADD CONSTRAINT "trend_forecasts_trend_id_fkey" FOREIGN KEY ("trend_id") REFERENCES "trends"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studio_generations" ADD CONSTRAINT "studio_generations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studio_outputs" ADD CONSTRAINT "studio_outputs_generation_id_fkey" FOREIGN KEY ("generation_id") REFERENCES "studio_generations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
