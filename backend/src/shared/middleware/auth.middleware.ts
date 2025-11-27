import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.util";
import { UnauthorizedError } from "../errors/AppError";

// Request 타입 확장 (타입 정의 파일도 있지만 명시적으로 선언)
// eslint-disable-next-line @typescript-eslint/no-namespace
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
        [key: string]: any;
      };
    }
  }
}

/**
 * JWT 인증 미들웨어
 * Authorization 헤더에서 Bearer 토큰을 추출하고 검증합니다.
 * 검증 성공 시 req.user에 디코딩된 페이로드를 저장합니다.
 */
export const authMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    // Authorization 헤더 추출
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedError("인증 토큰이 필요합니다.");
    }

    // Bearer 토큰 형식 확인
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      throw new UnauthorizedError("잘못된 토큰 형식입니다.");
    }

    const token = parts[1];
    console.log("Received token:", token.substring(0, 20) + "..."); // 토큰의 처음 20자만 출력

    // 토큰 검증
    const payload = verifyToken(token);

    // req.user에 페이로드 저장
    req.user = payload;

    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      next(error);
    } else if (error instanceof Error) {
      // JWT 검증 에러를 UnauthorizedError로 변환
      next(new UnauthorizedError(error.message));
    } else {
      next(new UnauthorizedError("인증에 실패했습니다."));
    }
  }
};

// 기존 코드와의 호환성을 위해 alias 제공
export const authenticateToken = authMiddleware;
