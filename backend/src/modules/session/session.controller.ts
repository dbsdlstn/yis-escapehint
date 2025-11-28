// src/modules/session/session.controller.ts
import { Router, Request, Response } from "express";
import { SessionService } from "./session.service";
import { authenticateToken } from "../../shared/middleware/auth.middleware";
import { AppError } from "../../shared/errors/AppError";
import { sendResponse, sendErrorResponse } from "../../shared/utils/response/api-response.util";

const sessionService = new SessionService();
export const router = Router();
export const sessionRouter = router;

// 세션 생성 (플레이어용)
router.post("/", async (req: Request, res: Response) => {
  try {
    console.log('=== 세션 생성 요청 디버깅 ===');
    console.log('req.body:', req.body);
    console.log('URL:', req.url);
    console.log('원본 URL:', req.originalUrl);

    const { themeId } = req.body;

    console.log('추출된 테마 ID:', themeId);

    const session = await sessionService.createSession(themeId);
    console.log('생성된 세션:', session);

    sendResponse(res, session, "Session created successfully", 201);
    return;
  } catch (error) {
    console.error('세션 생성 에러:', error);
    if (error instanceof AppError) {
      // Error handling is done by the global error middleware
      throw error;
    }

    sendErrorResponse(res, "서버 오류가 발생했습니다.", 500);
    return;
  }
});

// 세션 조회 (플레이어용)
router.get("/:id", async (req: Request, res: Response) => {
  try {
    console.log('=== 세션 조회 요청 디버깅 ===');
    console.log('req.params:', req.params);
    console.log('URL:', req.url);
    console.log('원본 URL:', req.originalUrl);

    const { id } = req.params;

    console.log('추출된 세션 ID:', id);

    // ID 유효성 검사
    if (!id || id === 'undefined') {
      sendErrorResponse(res, "세션 ID가 제공되지 않았습니다.", 400);
      return;
    }

    const session = await sessionService.getSession(id);
    console.log('조회된 세션:', session);

    sendResponse(res, session, "Session retrieved successfully", 200);
    return;
  } catch (error) {
    console.error('세션 조회 에러:', error);
    if (error instanceof AppError) {
      // Error handling is done by the global error middleware
      throw error;
    }

    sendErrorResponse(res, "서버 오류가 발생했습니다.", 500);
    return;
  }
});

// 힌트 사용 (플레이어용)
router.post("/:id/hints", async (req: Request, res: Response) => {
  try {
    console.log('=== 힌트 제출 요청 디버깅 ===');
    console.log('req.params:', req.params);
    console.log('req.body:', req.body);
    console.log('URL:', req.url);
    console.log('원본 URL:', req.originalUrl);

    const { id } = req.params;
    const { code } = req.body;

    console.log('추출된 세션 ID:', id);
    console.log('추출된 코드:', code);

    const result = await sessionService.submitHint(id, code);

    sendResponse(res, result, "Hint submitted successfully", 200);
    return;
  } catch (error) {
    console.error('힌트 제출 에러:', error);
    if (error instanceof AppError) {
      // Error handling is done by the global error middleware
      throw error;
    }

    sendErrorResponse(res, "서버 오류가 발생했습니다.", 500);
    return;
  }
});

// 관리자용: 세션 모니터링
router.get("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string;
    const sessions = await sessionService.getSessions(status ? { status } : undefined);
    sendResponse(res, sessions, "Sessions retrieved successfully", 200);
    return;
  } catch (error) {
    if (error instanceof AppError) {
      // Error handling is done by the global error middleware
      throw error;
    }

    sendErrorResponse(res, "서버 오류가 발생했습니다.", 500);
    return;
  }
});

// 관리자용: 세션 강제 종료
router.delete("/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await sessionService.endSession(id);

    sendResponse(res, null, "Session ended successfully", 200);
    return;
  } catch (error) {
    if (error instanceof AppError) {
      // Error handling is done by the global error middleware
      throw error;
    }

    sendErrorResponse(res, "서버 오류가 발생했습니다.", 500);
    return;
  }
});

export class SessionController {
  // Session 컨트롤러 로직 구현
}
