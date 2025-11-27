// src/modules/hint/hint.controller.ts
import { Router, Request, Response } from "express";
import { HintService } from "./hint.service";
import { authenticateToken } from "../../shared/middleware/auth.middleware";
import { AppError } from "../../shared/errors/AppError";
import { sendResponse, sendErrorResponse } from "../../shared/utils/response/api-response.util";

const hintService = new HintService();
export const router = Router();
export const hintRouter = router;

// 관리자용: 테마별 힌트 목록 조회
router.get("/themes/:themeId/hints", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { themeId } = req.params;
    console.log("Received request to get hints for themeId:", themeId); // 디버깅 로그
    const hints = await hintService.getHintsByTheme(themeId);
    console.log("Successfully retrieved hints:", hints.length); // 디버깅 로그
    sendResponse(res, hints, "Hints retrieved successfully", 200);
    return;
  } catch (error) {
    console.error("Error in get hints endpoint:", error); // 디버깅 로그
    if (error instanceof AppError) {
      // Error handling is done by the global error middleware
      throw error;
    }

    sendErrorResponse(res, "서버 오류가 발생했습니다.", 500);
    return;
  }
});

// 관리자용: 힌트 생성
router.post("/themes/:themeId/hints", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { themeId } = req.params;
    const { code, content, answer, progressRate, order, isActive } = req.body;

    const hint = await hintService.createHint({
      themeId,
      code,
      content,
      answer,
      progressRate,
      order,
      isActive,
    });

    sendResponse(res, hint, "Hint created successfully", 201);
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

// 관리자용: 힌트 수정
router.put("/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { code, content, answer, progressRate, order, isActive } = req.body;

    const hint = await hintService.updateHint(id, {
      code,
      content,
      answer,
      progressRate,
      order,
      isActive,
    });

    sendResponse(res, hint, "Hint updated successfully", 200);
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

// 관리자용: 힌트 삭제
router.delete("/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await hintService.deleteHint(id);

    if (!result) {
      return sendErrorResponse(res, "힌트를 찾을 수 없습니다.", 404);
    }

    sendResponse(res, null, "Hint deleted successfully", 200);
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

// 관리자용: 힌트 순서 변경
router.patch("/:id/order", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { order } = req.body;

    const result = await hintService.updateHintOrder(id, order);

    if (!result) {
      return sendErrorResponse(res, "힌트를 찾을 수 없습니다.", 404);
    }

    sendResponse(res, { message: "힌트 순서가 업데이트되었습니다." }, "Hint order updated successfully", 200);
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

export class HintController {
  // Hint 컨트롤러 로직 구현
}
