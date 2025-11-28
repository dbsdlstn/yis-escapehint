-- 테이블 생성 스크립트 - EscapeHint 프로젝트
-- Theme 테이블 생성
CREATE TABLE IF NOT EXISTS "Theme" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT UNIQUE NOT NULL,
    "description" TEXT,
    "playTime" INTEGER DEFAULT 60,
    "isActive" BOOLEAN DEFAULT true,
    "difficulty" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hint 테이블 생성
CREATE TABLE IF NOT EXISTS "Hint" (
    "id" TEXT PRIMARY KEY,
    "themeId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "answer" TEXT,
    "progressRate" INTEGER DEFAULT 0,
    "order" INTEGER DEFAULT 0,
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY ("themeId") REFERENCES "Theme"("id") ON DELETE CASCADE
);

-- GameSession 테이블 생성
CREATE TABLE IF NOT EXISTS "GameSession" (
    "id" TEXT PRIMARY KEY,
    "themeId" TEXT NOT NULL,
    "startTime" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "endTime" TIMESTAMP WITH TIME ZONE,
    "usedHintCount" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "status" TEXT DEFAULT 'in_progress',
    FOREIGN KEY ("themeId") REFERENCES "Theme"("id")
);

-- HintUsage 테이블 생성
CREATE TABLE IF NOT EXISTS "HintUsage" (
    "id" TEXT PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "hintId" TEXT NOT NULL,
    "usedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY ("sessionId") REFERENCES "GameSession"("id") ON DELETE CASCADE,
    FOREIGN KEY ("hintId") REFERENCES "Hint"("id") ON DELETE CASCADE,
    UNIQUE ("sessionId", "hintId")
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS theme_isActive_idx ON "Theme" ("isActive");
CREATE INDEX IF NOT EXISTS hint_themeId_code_idx ON "Hint" ("themeId", "code");
CREATE INDEX IF NOT EXISTS gameSession_themeId_status_idx ON "GameSession" ("themeId", "status");
CREATE INDEX IF NOT EXISTS hintUsage_sessionId_idx ON "HintUsage" ("sessionId");