import winston from "winston";
import path from "path";
import fs from "fs";
import { env } from "../../config/env.config";

// 로그 디렉토리 생성
const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// 환경 변수 또는 기본값으로 로그 레벨 설정
const logLevel = env.LOG_LEVEL;

// 로그 포맷 정의
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Winston 로거 인스턴스 생성
const logger = winston.createLogger({
  level: logLevel,
  format: logFormat,
  transports: [
    // 파일로 로그 전송 (에러 로그)
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // 파일로 로그 전송 (전체 로그)
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// 개발 환경에서는 콘솔에도 로그 출력
if (env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    })
  );
}

export default logger;
