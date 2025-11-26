import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { ValidationError } from "../errors/AppError";
import logger from "../utils/logger.util";

/**
 * Zod 스키마를 사용하여 요청을 검증하는 미들웨어
 *
 * @param schema - Zod 스키마 객체
 * @returns Express 미들웨어 함수
 *
 * @example
 * ```typescript
 * router.post("/", validate(createThemeSchema), async (req, res) => {
 *   // req.body는 이미 검증되었음
 * });
 * ```
 */
export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 요청의 body, query, params를 검증
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Zod 에러를 사용자 친화적인 메시지로 변환
        const errorMessages = error.issues.map((err: any) => {
          const path = err.path.join(".").replace(/^(body|query|params)\./, "");
          return `${path}: ${err.message}`;
        });

        const message = `유효하지 않은 요청입니다: ${errorMessages.join(", ")}`;

        logger.warn("검증 실패", {
          url: req.url,
          method: req.method,
          errors: errorMessages,
        });

        next(new ValidationError(message));
      } else {
        next(error);
      }
    }
  };
};

/**
 * body만 검증하는 간소화된 미들웨어
 *
 * @param schema - Zod 스키마 객체 (body 부분만)
 * @returns Express 미들웨어 함수
 */
export const validateBody = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((err: any) => {
          const path = err.path.join(".");
          return `${path}: ${err.message}`;
        });

        const message = `유효하지 않은 요청 본문입니다: ${errorMessages.join(", ")}`;

        logger.warn("검증 실패 (body)", {
          url: req.url,
          method: req.method,
          errors: errorMessages,
        });

        next(new ValidationError(message));
      } else {
        next(error);
      }
    }
  };
};

/**
 * query만 검증하는 간소화된 미들웨어
 *
 * @param schema - Zod 스키마 객체 (query 부분만)
 * @returns Express 미들웨어 함수
 */
export const validateQuery = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((err: any) => {
          const path = err.path.join(".");
          return `${path}: ${err.message}`;
        });

        const message = `유효하지 않은 쿼리 파라미터입니다: ${errorMessages.join(", ")}`;

        logger.warn("검증 실패 (query)", {
          url: req.url,
          method: req.method,
          errors: errorMessages,
        });

        next(new ValidationError(message));
      } else {
        next(error);
      }
    }
  };
};

/**
 * params만 검증하는 간소화된 미들웨어
 *
 * @param schema - Zod 스키마 객체 (params 부분만)
 * @returns Express 미들웨어 함수
 */
export const validateParams = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((err: any) => {
          const path = err.path.join(".");
          return `${path}: ${err.message}`;
        });

        const message = `유효하지 않은 경로 파라미터입니다: ${errorMessages.join(", ")}`;

        logger.warn("검증 실패 (params)", {
          url: req.url,
          method: req.method,
          errors: errorMessages,
        });

        next(new ValidationError(message));
      } else {
        next(error);
      }
    }
  };
};
