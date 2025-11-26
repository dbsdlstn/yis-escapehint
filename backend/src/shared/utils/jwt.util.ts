import * as jwt from "jsonwebtoken";
import { env } from "../../config/env.config";

/**
 * JWT 토큰을 생성합니다.
 * @param payload - 토큰에 포함될 데이터
 * @param expiresIn - 토큰 만료 시간 (기본값: 환경변수 또는 15분)
 * @returns 생성된 JWT 토큰
 */
export const generateToken = (payload: object, expiresIn?: string): string => {
  const secret = env.JWT_SECRET;
  const expires = expiresIn || env.JWT_EXPIRES_IN;

  return jwt.sign(payload, secret, { expiresIn: expires } as jwt.SignOptions);
};

/**
 * JWT 토큰을 검증하고 페이로드를 반환합니다.
 * @param token - 검증할 JWT 토큰
 * @returns 디코딩된 페이로드
 * @throws 토큰이 만료되었거나 유효하지 않은 경우 에러 발생
 */
export const verifyToken = (token: string): any => {
  const secret = env.JWT_SECRET;

  try {
    return jwt.verify(token, secret);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("토큰이 만료되었습니다.");
    }
    throw new Error("유효하지 않은 토큰입니다.");
  }
};
