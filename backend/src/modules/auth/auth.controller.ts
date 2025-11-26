// src/modules/auth/auth.controller.ts
import { Router, Request, Response } from "express";
import { AuthService } from "./auth.service";

const authService = new AuthService();
export const router = Router();

// 관리자 로그인
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { password } = req.body;

    const token = await authService.login(password);

    if (!token) {
      return res.status(401).json({ message: "비밀번호가 잘못되었습니다." });
    }

    res.json({ accessToken: token });
    return;
  } catch (_error) {
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
    return;
  }
});

export class AuthController {
  // Auth 컨트롤러 로직 구현
}
