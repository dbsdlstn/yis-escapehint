// src/app.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import logger from "./shared/utils/logger.util";
import { errorHandler } from "./shared/middleware/error.middleware";
import { router as themeRouter } from "./modules/theme/theme.controller";
import { router as sessionRouter } from "./modules/session/session.controller";
import { router as hintRouter } from "./modules/hint/hint.controller";
import { router as authRouter } from "./modules/auth/auth.controller";

const app = express();

// 보안 미들웨어
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        fontSrc: ["'self'", "https:", "data:"],
        connectSrc: ["'self'", "https://*.supabase.co"], // Supabase connection
        frameSrc: ["'self'"],
        objectSrc: ["'none'"],
      },
    },
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
    referrerPolicy: {
      policy: "strict-origin-when-cross-origin",
    },
  })
);

// CORS 설정
app.use(cors());

// JSON 파싱 미들웨어
app.use(express.json());

// URL 인코딩 파싱 미들웨어
app.use(express.urlencoded({ extended: true }));

// 루트 경로 테스트
app.get("/", (req, res) => {
  logger.info("Root endpoint accessed");
  res.json({ message: "EscapeHint API 서버에 오신 것을 환영합니다!" });
});

// 간단한 테스트 엔드포인트
app.get("/api/health", (req, res) => {
  logger.debug("Health check endpoint accessed");
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// 플레이어용 API 라우터 등록
app.use("/themes", themeRouter);
app.use("/sessions", sessionRouter);

// 관리자용 API 라우터 등록
app.use("/admin/auth", authRouter);
app.use("/admin/themes", themeRouter);
app.use("/admin/hints", hintRouter);
app.use("/admin/sessions", sessionRouter);

// 404 핸들러 - 이 부분을 커스텀 에러로 변경
app.use((req, res, next) => {
  logger.warn(`404 - Requested path not found: ${req.path}`);
  const error = new Error(`요청하신 경로를 찾을 수 없습니다: ${req.path}`) as any;
  error.statusCode = 404;
  next(error);
});

// 전역 에러 핸들러 (에러 미들웨어)
app.use(errorHandler);

// 포트 설정
const PORT = process.env.PORT || 3000;

// 서버 시작
if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`서버가 ${PORT} 포트에서 실행 중입니다.`);
  });
}

export default app;
