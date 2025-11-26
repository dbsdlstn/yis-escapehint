-- CreateTable
CREATE TABLE "Theme" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "playTime" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Theme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hint" (
    "id" TEXT NOT NULL,
    "themeId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "progressRate" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameSession" (
    "id" TEXT NOT NULL,
    "themeId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "usedHintCount" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HintUsage" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "hintId" TEXT NOT NULL,
    "usedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HintUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Theme_name_key" ON "Theme"("name");

-- CreateIndex
CREATE INDEX "Theme_isActive_idx" ON "Theme"("isActive");

-- CreateIndex
CREATE INDEX "Hint_themeId_code_idx" ON "Hint"("themeId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "Hint_themeId_code_key" ON "Hint"("themeId", "code");

-- CreateIndex
CREATE INDEX "GameSession_themeId_status_idx" ON "GameSession"("themeId", "status");

-- CreateIndex
CREATE INDEX "HintUsage_sessionId_idx" ON "HintUsage"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "HintUsage_sessionId_hintId_key" ON "HintUsage"("sessionId", "hintId");

-- AddForeignKey
ALTER TABLE "Hint" ADD CONSTRAINT "Hint_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "Theme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameSession" ADD CONSTRAINT "GameSession_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "Theme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HintUsage" ADD CONSTRAINT "HintUsage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "GameSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HintUsage" ADD CONSTRAINT "HintUsage_hintId_fkey" FOREIGN KEY ("hintId") REFERENCES "Hint"("id") ON DELETE CASCADE ON UPDATE CASCADE;
