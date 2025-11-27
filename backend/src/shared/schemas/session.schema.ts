import { z } from "zod";

/**
 * Session 생성 요청 검증 스키마
 */
export const createSessionSchema = z.object({
  body: z.object({
    themeId: z.string({ message: "테마 ID는 문자열이어야 합니다" }).uuid("유효한 UUID 형식이어야 합니다"),
  }),
});

/**
 * Session ID 파라미터 검증 스키마
 */
export const sessionIdParamSchema = z.object({
  params: z.object({
    sessionId: z.string({ message: "세션 ID는 필수입니다" }).uuid("유효한 UUID 형식이어야 합니다"),
  }),
});

/**
 * Hint 사용 요청 검증 스키마
 */
export const useHintSchema = z.object({
  params: z.object({
    sessionId: z.string({ message: "세션 ID는 필수입니다" }).uuid("유효한 UUID 형식이어야 합니다"),
  }),
  body: z.object({
    code: z.string({ message: "힌트 코드는 문자열이어야 합니다" }).min(1, "힌트 코드는 비어있을 수 없습니다"),
  }),
});

/**
 * Session 조회 query 검증 스키마 (관리자용)
 */
export const getSessionsQuerySchema = z.object({
  query: z.object({
    status: z
      .union([z.literal("in_progress"), z.literal("completed"), z.literal("aborted")], {
        message: "status는 'in_progress', 'completed', 'aborted' 중 하나여야 합니다",
      })
      .optional(),
  }),
});

// 타입 추론을 위한 export
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type SessionIdParam = z.infer<typeof sessionIdParamSchema>;
export type UseHintInput = z.infer<typeof useHintSchema>;
export type GetSessionsQuery = z.infer<typeof getSessionsQuerySchema>;
