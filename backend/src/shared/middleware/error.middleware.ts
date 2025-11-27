import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import logger from "../utils/logger.util";
import { createErrorResponse } from "../utils/response/api-response.util";

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    logger.error(err.message, { statusCode: err.statusCode, stack: err.stack, url: req.url, method: req.method });
    const errorResponse = createErrorResponse(err.message, err.statusCode);
    return res.status(err.statusCode).json(errorResponse);
  }

  // Log the full error for debugging
  logger.error("Unexpected error", {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  // Don't expose internal error details to the client
  const errorResponse = createErrorResponse("서버 오류가 발생했습니다.", 500);
  return res.status(500).json(errorResponse);
}
