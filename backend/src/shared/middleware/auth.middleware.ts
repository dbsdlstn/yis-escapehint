import { Request, Response, NextFunction } from "express";
import { AuthService } from "../../modules/auth/auth.service";

const authService = new AuthService();

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: "인증 토큰이 필요합니다." });
  }

  try {
    const isValid = await authService.verifyToken(token);
    if (!isValid) {
      return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
    }
    next();
    return; // Explicitly return after calling next
  } catch (_error) {
    return res.status(401).json({ message: "인증 토큰이 유효하지 않습니다." });
  }
};
