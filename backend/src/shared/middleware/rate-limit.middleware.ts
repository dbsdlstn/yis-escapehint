import rateLimit from "express-rate-limit";
import logger from "../utils/logger.util";
import { env } from "../../config/env.config";

/**
 * API Rate Limiter
 *
 * - 1분당 최대 100개의 요청을 허용
 * - 초과 시 429 Too Many Requests 응답
 * - 모든 /api/* 라우트에 적용
 *
 * @see https://github.com/express-rate-limit/express-rate-limit
 */
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1분
  max: 100, // 최대 100 요청
  message: "너무 많은 요청을 보냈습니다. 잠시 후 다시 시도하세요.",
  standardHeaders: true, // RateLimit-* 헤더 추가
  legacyHeaders: false, // X-RateLimit-* 헤더 제거

  // Rate limit 초과 시 로깅
  handler: (req, res) => {
    logger.warn("Rate limit exceeded", {
      ip: req.ip,
      url: req.url,
      method: req.method,
      userAgent: req.get("user-agent"),
    });

    res.status(429).json({
      message: "너무 많은 요청을 보냈습니다. 잠시 후 다시 시도하세요.",
    });
  },

  // 요청이 거부되기 전에 호출되는 함수 (선택적)
  skip: req => {
    // 특정 IP는 Rate Limiting에서 제외 (예: 개발 환경)
    if (env.NODE_ENV === "development") {
      // 개발 환경에서는 localhost는 제외
      if (req.ip === "::1" || req.ip === "127.0.0.1") {
        return false; // Rate limiting 적용 안 함
      }
    }
    return false;
  },
});

/**
 * 관리자 로그인 전용 Rate Limiter (더 엄격함)
 *
 * - 15분당 최대 5개의 로그인 시도 허용
 * - 브루트 포스 공격 방지
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 5, // 최대 5 요청
  message: "너무 많은 로그인 시도가 있었습니다. 15분 후에 다시 시도하세요.",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // 성공한 요청은 카운트하지 않음

  handler: (req, res) => {
    logger.warn("Login rate limit exceeded", {
      ip: req.ip,
      url: req.url,
      method: req.method,
    });

    res.status(429).json({
      message: "너무 많은 로그인 시도가 있었습니다. 15분 후에 다시 시도하세요.",
    });
  },
});
