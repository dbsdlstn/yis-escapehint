// src/modules/hint/hint.controller.ts
import { Router, Request, Response } from "express";
import { HintService } from "./hint.service";
import { authenticateToken } from "../../shared/middleware/auth.middleware";

const hintService = new HintService();
export const router = Router();

// 관리자용: 테마별 힌트 목록 조회
router.get("/themes/:themeId/hints", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { themeId } = req.params;
    const hints = await hintService.getHintsByTheme(themeId);
    res.json(hints);
    return;
  } catch (_error) {
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
    return;
  }
});

// 관리자용: 힌트 생성
router.post("/themes/:themeId", authenticateToken, async (req: Request, res: Response) => {
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

    res.status(201).json(hint);
    return;
  } catch (_error) {
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
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

    if (!hint) {
      return res.status(404).json({ message: "힌트를 찾을 수 없습니다." });
    }

    res.json(hint);
    return;
  } catch (_error) {
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
    return;
  }
});

// 관리자용: 힌트 삭제
router.delete("/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await hintService.deleteHint(id);

    if (!result) {
      return res.status(404).json({ message: "힌트를 찾을 수 없습니다." });
    }

    res.status(204).send();
    return;
  } catch (_error) {
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
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
      return res.status(404).json({ message: "힌트를 찾을 수 없습니다." });
    }

    res.json({ message: "힌트 순서가 업데이트되었습니다." });
    return;
  } catch (_error) {
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
    return;
  }
});

export class HintController {
  // Hint 컨트롤러 로직 구현
}
