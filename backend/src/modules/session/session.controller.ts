// src/modules/session/session.controller.ts
import { Router, Request, Response } from "express";
import { SessionService } from "./session.service";
import { authenticateToken } from "../../shared/middleware/auth.middleware";

const sessionService = new SessionService();
export const router = Router();

// 세션 생성 (플레이어용)
router.post("/", async (req: Request, res: Response) => {
  try {
    const { themeId } = req.body;
    const session = await sessionService.createSession(themeId);
    res.status(201).json(session);
    return;
  } catch (_error) {
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
    return;
  }
});

// 세션 조회 (플레이어용)
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const session = await sessionService.getSession(id);

    if (!session) {
      return res.status(404).json({ message: "세션을 찾을 수 없습니다." });
    }

    res.json(session);
    return;
  } catch (_error) {
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
    return;
  }
});

// 힌트 사용 (플레이어용)
router.post("/:id/hints", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { code } = req.body;

    const result = await sessionService.submitHint(id, code);

    if (!result) {
      return res.status(404).json({ message: "힌트를 찾을 수 없습니다." });
    }

    res.json(result);
    return;
  } catch (_error) {
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
    return;
  }
});

// 관리자용: 세션 모니터링
router.get("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string;
    const sessions = await sessionService.getSessions(status ? { status } : undefined);
    res.json(sessions);
    return;
  } catch (_error) {
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
    return;
  }
});

// 관리자용: 세션 강제 종료
router.delete("/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await sessionService.endSession(id);

    if (!result) {
      return res.status(404).json({ message: "세션을 찾을 수 없습니다." });
    }

    res.status(204).send();
    return;
  } catch (_error) {
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
    return;
  }
});

export class SessionController {
  // Session 컨트롤러 로직 구현
}
