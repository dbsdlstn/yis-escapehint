// src/modules/theme/theme.controller.ts
import { Router, Request, Response } from "express";
import { ThemeService } from "./theme.service";
import { SessionService } from "../session/session.service";
import { authenticateToken } from "../../shared/middleware/auth.middleware";
import { z } from "zod";
import logger from "../../shared/utils/logger.util";
import { sendResponse, sendErrorResponse } from "../../shared/utils/response/api-response.util";

const themeService = new ThemeService();
const sessionService = new SessionService();
const router = Router();

// Zod schemas for validation
const createThemeSchema = z.object({
  name: z.string().min(1, "Theme name is required").max(50, "Theme name must be less than 50 characters"),
  description: z.string().nullable().optional(),
  playTime: z.number().int().min(10, "Play time must be at least 10 minutes").max(180, "Play time must be at most 180 minutes"),
  isActive: z.boolean().default(true),
  difficulty: z.string().nullable().optional(),
});

const updateThemeSchema = z.object({
  name: z.string().min(1, "Theme name is required").max(50, "Theme name must be less than 50 characters").optional(),
  description: z.string().nullable().optional(),
  playTime: z.number().int().min(10, "Play time must be at least 10 minutes").max(180, "Play time must be at most 180 minutes").optional(),
  isActive: z.boolean().optional(),
  difficulty: z.string().nullable().optional(),
});

// 플레이어용: 활성화된 테마 목록 조회
router.get("/", async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string;
    // 플레이어는 active 상태의 테마만 조회 가능
    if (status && status !== "active") {
      return sendErrorResponse(res, "Invalid status parameter for player endpoint", 400);
    }

    const themes = await themeService.getPlayableThemes();
    sendResponse(res, themes, "Playable themes retrieved successfully", 200);
    return;
  } catch (error) {
    logger.error("Error in player get themes endpoint:", error);
    sendErrorResponse(res, "서버 오류가 발생했습니다.", 500);
    return;
  }
});

// 플레이어용: 단일 테마 조회 (게임 시작 시 테마 정보 필요)
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const theme = await themeService.getThemeById(id);

    if (!theme) {
      return sendErrorResponse(res, "테마를 찾을 수 없습니다.", 404);
    }

    sendResponse(res, theme, "Theme retrieved successfully", 200);
    return;
  } catch (error) {
    logger.error(`Error in player get theme by id endpoint for id ${req.params.id}:`, error);
    sendErrorResponse(res, "서버 오류가 발생했습니다.", 500);
    return;
  }
});

// 관리자용 라우터 생성
export const adminThemeRouter = Router();

// 관리자용: 모든 테마 조회
adminThemeRouter.get("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    const themes = await themeService.getAllThemes();
    sendResponse(res, themes, "All themes retrieved successfully", 200);
    return;
  } catch (error) {
    logger.error("Error in admin get all themes endpoint:", error);
    sendErrorResponse(res, "서버 오류가 발생했습니다.", 500);
    return;
  }
});

// 관리자용: 테마 생성
adminThemeRouter.post("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    // Validate request body using Zod
    const validationResult = createThemeSchema.safeParse(req.body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map(issue => issue.message);
      return sendErrorResponse(res, "Validation failed", 400, { errors });
    }

    const validatedData = validationResult.data;
    const theme = await themeService.createTheme({
      name: validatedData.name,
      description: validatedData.description,
      playTime: validatedData.playTime,
      isActive: validatedData.isActive,
      difficulty: validatedData.difficulty,
    });

    sendResponse(res, theme, "Theme created successfully", 201);
    return;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'A theme with this name already exists') {
        return sendErrorResponse(res, error.message, 409);
      }
      if (error.message.includes('Play time must be between')) {
        return sendErrorResponse(res, error.message, 400);
      }
    }

    logger.error("Error in create theme endpoint:", error);
    sendErrorResponse(res, "서버 오류가 발생했습니다.", 500);
    return;
  }
});

// 관리자용: 테마 수정
adminThemeRouter.put("/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate request body using Zod
    const validationResult = updateThemeSchema.safeParse(req.body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map(issue => issue.message);
      return sendErrorResponse(res, "Validation failed", 400, { errors });
    }

    const validatedData = validationResult.data;
    const theme = await themeService.updateTheme(id, {
      name: validatedData.name,
      description: validatedData.description,
      playTime: validatedData.playTime,
      isActive: validatedData.isActive,
      difficulty: validatedData.difficulty,
    });

    if (!theme) {
      return sendErrorResponse(res, "테마를 찾을 수 없습니다.", 404);
    }

    sendResponse(res, theme, "Theme updated successfully", 200);
    return;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'A theme with this name already exists') {
        return sendErrorResponse(res, error.message, 409);
      }
      if (error.message.includes('Play time must be between')) {
        return sendErrorResponse(res, error.message, 400);
      }
    }

    logger.error(`Error in update theme endpoint for id ${req.params.id}:`, error);
    sendErrorResponse(res, "서버 오류가 발생했습니다.", 500);
    return;
  }
});

// 관리자용: 테마 삭제
adminThemeRouter.delete("/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await themeService.deleteTheme(id);

    if (!result) {
      return sendErrorResponse(res, "테마를 찾을 수 없습니다.", 404);
    }

    sendResponse(res, null, "Theme deleted successfully", 200); // Changed to 200 with message since 204 doesn't have body
    return;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Cannot delete theme with in-progress game sessions') {
        return sendErrorResponse(res, error.message, 409);
      }
    }

    logger.error(`Error in delete theme endpoint for id ${req.params.id}:`, error);
    sendErrorResponse(res, "서버 오류가 발생했습니다.", 500);
    return;
  }
});

// 관리자용: 통계 대시보드
adminThemeRouter.get("/stats", authenticateToken, async (req: Request, res: Response) => {
  try {
    logger.info("Fetching dashboard stats");

    // 테마 수
    const themeCount = await themeService.getThemeCount();
    logger.info("Theme count:", themeCount);

    // 미리 생성된 세션 서비스를 사용하여 오늘 사용된 힌트 수를 계산
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 오늘 날짜의 힌트 사용 수를 계산
    const hintUsageCount = await sessionService.getTodaysHintUsageCount(today, tomorrow);
    logger.info("Hint usage count:", hintUsageCount);

    sendResponse(res, {
      themeCount,
      hintUsageCount
    }, "Dashboard stats retrieved successfully", 200);
    return;
  } catch (error) {
    logger.error("Error in dashboard stats endpoint:", error);
    sendErrorResponse(res, "서버 오류가 발생했습니다.", 500);
    return;
  }
});

export { router as themeRouter };
