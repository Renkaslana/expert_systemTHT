-- CreateEnum
CREATE TYPE "SymptomCategory" AS ENUM ('telinga', 'hidung', 'tenggorokan', 'umum');

-- CreateEnum
CREATE TYPE "BodyArea" AS ENUM ('ear', 'nose', 'throat', 'head', 'general');

-- CreateEnum
CREATE TYPE "SymptomSeverity" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "DiseaseSeverity" AS ENUM ('mild', 'moderate', 'severe');

-- CreateEnum
CREATE TYPE "DiseaseIconKey" AS ENUM ('ear', 'nose', 'throat', 'sinus', 'general');

-- CreateTable
CREATE TABLE "symptoms" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "category" "SymptomCategory" NOT NULL,
    "bodyArea" "BodyArea" NOT NULL,
    "severity" "SymptomSeverity" NOT NULL,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "symptoms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diseases" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameShort" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "severity" "DiseaseSeverity" NOT NULL,
    "icdCode" TEXT NOT NULL,
    "iconKey" "DiseaseIconKey" NOT NULL,
    "description" TEXT NOT NULL,
    "causes" TEXT[],
    "generalSymptoms" TEXT[],
    "treatmentAdvice" TEXT[],
    "relatedDiseases" TEXT[],
    "whenToSeeDoctor" TEXT NOT NULL,
    "expertSource" TEXT NOT NULL DEFAULT 'dr. M. Agus Sugicharto, Sp.THT-KL',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "diseases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cf_rules" (
    "id" TEXT NOT NULL,
    "diseaseId" TEXT NOT NULL,
    "symptomId" TEXT NOT NULL,
    "expertWeight" DOUBLE PRECISION NOT NULL,
    "rationale" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cf_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultation_sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "inputSymptoms" JSONB NOT NULL,
    "rawResults" JSONB NOT NULL,
    "durationMs" INTEGER,
    "ipHash" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consultation_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultation_results" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "diseaseId" TEXT NOT NULL,
    "cfValue" DOUBLE PRECISION NOT NULL,
    "rank" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consultation_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "symptoms_code_key" ON "symptoms"("code");

-- CreateIndex
CREATE INDEX "symptoms_category_idx" ON "symptoms"("category");

-- CreateIndex
CREATE INDEX "symptoms_isActive_idx" ON "symptoms"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "diseases_code_key" ON "diseases"("code");

-- CreateIndex
CREATE INDEX "diseases_category_idx" ON "diseases"("category");

-- CreateIndex
CREATE INDEX "diseases_isActive_idx" ON "diseases"("isActive");

-- CreateIndex
CREATE INDEX "cf_rules_diseaseId_idx" ON "cf_rules"("diseaseId");

-- CreateIndex
CREATE INDEX "cf_rules_symptomId_idx" ON "cf_rules"("symptomId");

-- CreateIndex
CREATE INDEX "cf_rules_isActive_idx" ON "cf_rules"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "cf_rules_diseaseId_symptomId_key" ON "cf_rules"("diseaseId", "symptomId");

-- CreateIndex
CREATE UNIQUE INDEX "consultation_sessions_sessionToken_key" ON "consultation_sessions"("sessionToken");

-- CreateIndex
CREATE INDEX "consultation_sessions_sessionToken_idx" ON "consultation_sessions"("sessionToken");

-- CreateIndex
CREATE INDEX "consultation_sessions_createdAt_idx" ON "consultation_sessions"("createdAt");

-- CreateIndex
CREATE INDEX "consultation_results_sessionId_idx" ON "consultation_results"("sessionId");

-- CreateIndex
CREATE INDEX "consultation_results_diseaseId_idx" ON "consultation_results"("diseaseId");

-- CreateIndex
CREATE INDEX "consultation_results_rank_idx" ON "consultation_results"("rank");

-- AddForeignKey
ALTER TABLE "cf_rules" ADD CONSTRAINT "cf_rules_diseaseId_fkey" FOREIGN KEY ("diseaseId") REFERENCES "diseases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cf_rules" ADD CONSTRAINT "cf_rules_symptomId_fkey" FOREIGN KEY ("symptomId") REFERENCES "symptoms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultation_results" ADD CONSTRAINT "consultation_results_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "consultation_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultation_results" ADD CONSTRAINT "consultation_results_diseaseId_fkey" FOREIGN KEY ("diseaseId") REFERENCES "diseases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
