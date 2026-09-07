-- CreateEnum
CREATE TYPE "RecommendationFeedbackType" AS ENUM ('LIKE', 'DISLIKE', 'SAVE', 'SKIP');

-- CreateTable
CREATE TABLE "style_recommendation_requests" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "request_context" JSONB,
    "vision_context" JSONB,
    "trend_context" JSONB,
    "candidate_count" INTEGER NOT NULL,
    "top_k" INTEGER NOT NULL,
    "model_name" VARCHAR(150) NOT NULL,
    "model_version" VARCHAR(50),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "style_recommendation_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "style_recommendations" (
    "id" UUID NOT NULL,
    "request_id" UUID NOT NULL,
    "candidate_id" VARCHAR(150) NOT NULL,
    "candidate_name" VARCHAR(250) NOT NULL,
    "score" DECIMAL(6,2) NOT NULL,
    "confidence" VARCHAR(20) NOT NULL,
    "score_breakdown" JSONB,
    "reasons" JSONB,
    "trend_alignment" JSONB,
    "rank" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "style_recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "style_recommendation_feedback" (
    "id" UUID NOT NULL,
    "recommendation_id" UUID NOT NULL,
    "user_id" UUID,
    "feedback_type" "RecommendationFeedbackType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "style_recommendation_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "style_recommendation_requests_user_id_idx" ON "style_recommendation_requests"("user_id");

-- CreateIndex
CREATE INDEX "style_recommendation_requests_created_at_idx" ON "style_recommendation_requests"("created_at");

-- CreateIndex
CREATE INDEX "style_recommendations_request_id_idx" ON "style_recommendations"("request_id");

-- CreateIndex
CREATE INDEX "style_recommendations_candidate_id_idx" ON "style_recommendations"("candidate_id");

-- CreateIndex
CREATE INDEX "style_recommendations_score_idx" ON "style_recommendations"("score");

-- CreateIndex
CREATE INDEX "style_recommendation_feedback_recommendation_id_idx" ON "style_recommendation_feedback"("recommendation_id");

-- CreateIndex
CREATE INDEX "style_recommendation_feedback_user_id_idx" ON "style_recommendation_feedback"("user_id");

-- CreateIndex
CREATE INDEX "style_recommendation_feedback_feedback_type_idx" ON "style_recommendation_feedback"("feedback_type");

-- CreateIndex
CREATE INDEX "style_recommendation_feedback_created_at_idx" ON "style_recommendation_feedback"("created_at");

-- AddForeignKey
ALTER TABLE "style_recommendation_requests" ADD CONSTRAINT "style_recommendation_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "style_recommendations" ADD CONSTRAINT "style_recommendations_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "style_recommendation_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "style_recommendation_feedback" ADD CONSTRAINT "style_recommendation_feedback_recommendation_id_fkey" FOREIGN KEY ("recommendation_id") REFERENCES "style_recommendations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "style_recommendation_feedback" ADD CONSTRAINT "style_recommendation_feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
