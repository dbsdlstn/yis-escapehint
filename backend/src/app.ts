// src/app.ts
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors, { CorsOptions } from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "../../swagger/swagger.json";
import logger from "./shared/utils/logger.util";
import { errorHandler } from "./shared/middleware/error.middleware";
import { performanceMiddleware } from "./shared/middleware/performance.middleware";
import { apiLimiter, loginLimiter } from "./shared/middleware/rate-limit.middleware";
import { themeRouter, adminThemeRouter } from "./modules/theme/theme.controller";
import { sessionRouter } from "./modules/session/session.controller";
import { hintRouter } from "./modules/hint/hint.controller";
import { authRouter } from "./modules/auth/auth.controller";
import { authMiddleware } from "./shared/middleware/auth.middleware";
import { env } from "./config/env.config";

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

// CORS 설정 - 환경 변수에서 허용된 origin 목록 가져오기
const corsOrigin = env.CORS_ORIGIN;
const corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    // 개발 환경에서는 origin이 undefined일 수 있음
    if (env.NODE_ENV === 'development' && !origin) {
      callback(null, true);
      return;
    }

    // origin이 없거나 CORS_ORIGIN이 *이면 모든 origin 허용
    if (!origin || corsOrigin === '*') {
      callback(null, true);
      return;
    }

    // 환경 변수에 설정된 origin 목록에 포함되어 있는지 확인
    const allowedOrigins = corsOrigin.split(',').map(o => o.trim());
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      // 와일드카드(*) 지원 (예: https://*.vercel.app)
      if (allowedOrigin.includes('*')) {
        const regexPattern = allowedOrigin.replace(/\*/g, '.*');
        return new RegExp(`^${regexPattern}$`).test(origin);
      }
      return origin === allowedOrigin;
    });

    callback(null, isAllowed);
  },
  credentials: true, // 쿠키를 포함한 요청 허용
};

app.use(cors(corsOptions));

// JSON 파싱 미들웨어
app.use(express.json({
  limit: '10mb',
  type: ['application/json', 'text/plain']
}));

// URL 인코딩 파싱 미들웨어
app.use(express.urlencoded({
  extended: true,
  limit: '10mb'
}));

// Performance measurement middleware
app.use(performanceMiddleware);

// Rate Limiting 미들웨어 (모든 API 라우트에 적용)
app.use(apiLimiter);

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

// Swagger UI 설정
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 플레이어용 API 라우터 등록
app.use("/api/themes", themeRouter);
app.use("/api/sessions", sessionRouter);

// 관리자용 API 라우터 등록 (인증 필요)
app.use("/api/admin/auth", authRouter);
app.use("/api/admin/themes", adminThemeRouter);
app.use("/api/admin/hints", authMiddleware, hintRouter);
app.use("/api/admin/sessions", authMiddleware, sessionRouter);

// 404 핸들러
app.use((req, res, next) => {
  logger.warn(`404 - Requested path not found: ${req.path}`);
  res.status(404).json({ message: `요청하신 경로를 찾을 수 없습니다: ${req.path}` });
});

// 전역 에러 핸들러 (에러 미들웨어)
app.use(errorHandler);

// 포트 설정
const PORT = env.PORT;

// 서버 시작
if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`서버가 ${PORT} 포트에서 실행 중입니다.`);
  });
}

export default app;
