import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger.util";

export const performanceMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    // Log response time for each request
    logger.http(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`, {
      method: req.method,
      url: req.path,
      statusCode: res.statusCode,
      duration: duration,
      userAgent: req.get("user-agent"),
      ip: req.ip,
    });

    // Log warning if response time exceeds 200ms (P95 target)
    if (duration > 200) {
      logger.warn(`Slow response detected: ${req.method} ${req.path} took ${duration}ms`, {
        method: req.method,
        url: req.path,
        statusCode: res.statusCode,
        duration: duration,
      });
    }
  });

  next();
};
