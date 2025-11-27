// src/modules/auth/auth.controller.ts
import { Router, Request, Response } from "express";
import { AuthService } from "./auth.service";
import { loginLimiter } from "../../shared/middleware/rate-limit.middleware";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import logger from "../../shared/utils/logger.util";
import { sendResponse, sendErrorResponse } from "../../shared/utils/response/api-response.util";

export const router = Router();
export const authRouter = router;

// 관리자 로그인 (더 엄격한 Rate Limiting 적용)
router.post("/login", loginLimiter, async (req: Request, res: Response) => {
  try {
    const { password } = req.body;

    if (!password) {
      return sendErrorResponse(res, "비밀번호가 필요합니다.", 400);
    }

    const authService = new AuthService();
    const token = await authService.login(password);

    sendResponse(res, { accessToken: token }, "Login successful", 200);
    return;
  } catch (error: any) {
    logger.error("Login error:", error);

    if (error.message.includes("비밀번호") || error.message.includes("필요합니다")) {
      return sendErrorResponse(res, error.message, 401);
    }

    return sendErrorResponse(res, "서버 오류가 발생했습니다.", 500);
  }
});

// 인증된 사용자 정보 조회
router.get("/me", authMiddleware, async (req: Request, res: Response) => {
  try {
    // authMiddleware에서 사용자 정보가 이미 req.user에 저장됨
    const user = (req as any).user;

    // 민감 정보 제외하고 필요한 사용자 정보만 반환
    sendResponse(
      res,
      {
        userId: user.userId,
        role: user.role,
      },
      "User info retrieved successfully",
      200
    );
  } catch (error) {
    logger.error("Get user info error:", error);
    sendErrorResponse(res, "서버 오류가 발생했습니다.", 500);
    return;
  }
});

export class AuthController {
  // Auth 컨트롤러 로직 구현
}
