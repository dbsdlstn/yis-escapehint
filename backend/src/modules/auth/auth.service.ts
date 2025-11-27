// src/modules/auth/auth.service.ts
import { hashPassword, comparePassword } from "../../shared/utils/bcrypt.util";
import { generateToken, verifyToken } from "../../shared/utils/jwt.util";
import logger from "../../shared/utils/logger.util";
import { UnauthorizedError } from "../../shared/errors/AppError";
import { env } from "../../config/env.config";

export class AuthService {
  private storedHashedPassword: string;

  constructor() {
    // 기본 비밀번호를 미리 해싱하여 초기화 (동기 방식 유지)
    const defaultPassword = env.ADMIN_PASSWORD;
    const bcrypt = require("bcrypt");
    this.storedHashedPassword = bcrypt.hashSync(defaultPassword, 10);
  }

  /**
   * 로그인을 처리하고 JWT 토큰을 반환합니다.
   * @param password - 입력된 비밀번호
   * @returns JWT 토큰
   * @throws UnauthorizedError - 잘못된 비밀번호일 경우
   */
  async login(password: string): Promise<string> {
    try {
      if (!password) {
        logger.warn("Login attempt without password provided");
        throw new UnauthorizedError("비밀번호가 필요합니다");
      }

      const isPasswordValid = await comparePassword(password, this.storedHashedPassword);

      if (!isPasswordValid) {
        logger.warn("Login attempt with invalid password");
        throw new UnauthorizedError("비밀번호가 잘못되었습니다.");
      }

      // JWT 토큰 생성
      logger.debug("Creating JWT token for admin user");
      const token = generateToken(
        {
          userId: "admin",
          role: "admin",
        },
        env.JWT_EXPIRES_IN
      );
      logger.debug(`Generated token: ${token.substring(0, 20)}...`); // 처음 20자만 로그로 남김 (보안상)

      logger.info("Admin login successful");
      return token;
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        throw error; // UnauthorizedError는 그대로 던집니다.
      }

      logger.error("Error during login:", error);
      throw error;
    }
  }

  /**
   * JWT 토큰을 검증합니다.
   * @param token - 검증할 JWT 토큰
   * @returns 디코딩된 토큰 페이로드
   * @throws Error - 토큰이 유효하지 않거나 만료된 경우
   */
  async verifyToken(token: string): Promise<any> {
    try {
      logger.debug("Verifying auth token");
      const decoded = verifyToken(token);
      logger.debug("Token verification successful");
      return decoded;
    } catch (error) {
      logger.warn("Token verification failed:", error);
      throw new UnauthorizedError("유효하지 않은 토큰입니다.");
    }
  }
}
