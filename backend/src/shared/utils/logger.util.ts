import { env } from "../../config/env.config";

// 환경 변수 또는 기본값으로 로그 레벨 설정
const logLevel = env.LOG_LEVEL;

// 로그 레벨 확인 함수
const shouldLog = (level: string): boolean => {
  if (env.NODE_ENV === "production") {
    return level === "error"; // 프로덕션 환경에서는 에러 로그만 출력
  }
  // 개발 환경에서는 모든 로그 레벨 출력 (info, warn, error 등)
  const levels = ["error", "warn", "info", "debug"];
  const logIndex = levels.indexOf(level);
  const currentLogLevelIndex = levels.indexOf(logLevel || "info");
  return logIndex >= 0 && currentLogLevelIndex >= 0 ? logIndex <= currentLogLevelIndex : false;
};

// 로깅 함수 정의
const logger = {
  error: (...args: any[]) => {
    if (shouldLog("error")) {
      console.error("[ERROR]", new Date().toISOString(), ...args);
    }
  },
  warn: (...args: any[]) => {
    if (shouldLog("warn")) {
      console.warn("[WARN]", new Date().toISOString(), ...args);
    }
  },
  info: (...args: any[]) => {
    if (shouldLog("info")) {
      console.log("[INFO]", new Date().toISOString(), ...args);
    }
  },
  debug: (...args: any[]) => {
    if (shouldLog("debug")) {
      console.debug("[DEBUG]", new Date().toISOString(), ...args);
    }
  },
  http: (...args: any[]) => {
    if (shouldLog("info")) {
      console.log("[HTTP]", new Date().toISOString(), ...args);
    }
  },
  log: (...args: any[]) => {
    // 기본적으로 info 레벨처럼 처리
    if (shouldLog("info")) {
      console.log("[LOG]", new Date().toISOString(), ...args);
    }
  }
};

export default logger;
