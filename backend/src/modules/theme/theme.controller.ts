// src/modules/theme/theme.controller.ts
import { Router, Request, Response } from "express";
import { ThemeService } from "./theme.service";
import { authenticateToken } from "../../shared/middleware/auth.middleware";

const themeService = new ThemeService();
export const router = Router();

// 플레이어용: 활성화된 테마 목록 조회
router.get("/", async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string;
    // 플레이어는 active 상태의 테마만 조회 가능
    if (status && status !== "active") {
      return res.status(400).json({ message: "Invalid status parameter for player endpoint" });
    }

    const themes = await themeService.getPlayableThemes();
    res.json(themes);
    return;
  } catch (_error) {
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
    return;
  }
});

// 관리자용: 모든 테마 조회 (인증 필요) - Use different route
router.get("/all", authenticateToken, async (req: Request, res: Response) => {
  try {
    const themes = await themeService.getAllThemes();
    res.json(themes);
    return;
  } catch (_error) {
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
    return;
  }
});

// 관리자용: 테마 생성
router.post("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { name, description, playTime, isActive, difficulty } = req.body;
    const theme = await themeService.createTheme({
      name,
      description,
      playTime,
      isActive,
      difficulty,
    });
    res.status(201).json(theme);
    return;
  } catch (_error) {
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
    return;
  }
});

// 관리자용: 테마 수정
router.put("/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, playTime, isActive, difficulty } = req.body;

    const theme = await themeService.updateTheme(id, {
      name,
      description,
      playTime,
      isActive,
      difficulty,
    });

    if (!theme) {
      return res.status(404).json({ message: "테마를 찾을 수 없습니다." });
    }

    res.json(theme);
    return;
  } catch (_error) {
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
    return;
  }
});

// 관리자용: 테마 삭제
router.delete("/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await themeService.deleteTheme(id);

    if (!result) {
      return res.status(404).json({ message: "테마를 찾을 수 없습니다." });
    }

    res.status(204).send();
    return;
  } catch (_error) {
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
    return;
  }
});

export class ThemeController {
  // Theme 컨트롤러 로직 구현
}
