import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import logger from "../utils/logger.util";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    logger.error(err.message, { statusCode: err.statusCode, stack: err.stack, url: req.url, method: req.method });
    return res.status(err.statusCode).json({ message: err.message });
  }

  // Log the full error for debugging
  logger.error("Unexpected error", { 
    message: err.message, 
    stack: err.stack, 
    url: req.url, 
    method: req.method,
    ip: req.ip
  });
  
  // Don't expose internal error details to the client
  return res.status(500).json({ message: "서버 오류가 발생했습니다." });
}