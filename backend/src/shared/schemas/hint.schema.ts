import { z } from "zod";

/**
 * Hint 생성 요청 검증 스키마
 */
export const createHintSchema = z.object({
  params: z.object({
    themeId: z
      .string({ message: "테마 ID는 필수입니다" })
      .uuid("유효한 UUID 형식이어야 합니다"),
  }),
  body: z.object({
    code: z
      .string({ message: "힌트 코드는 문자열이어야 합니다" })
      .max(20, "힌트 코드는 최대 20자까지 가능합니다")
      .min(1, "힌트 코드는 비어있을 수 없습니다"),
    content: z
      .string({ message: "힌트 내용은 문자열이어야 합니다" })
      .max(500, "힌트 내용은 최대 500자까지 가능합니다")
      .min(1, "힌트 내용은 비어있을 수 없습니다"),
    answer: z
      .string({ message: "정답은 문자열이어야 합니다" })
      .max(200, "정답은 최대 200자까지 가능합니다")
      .min(1, "정답은 비어있을 수 없습니다"),
    progressRate: z
      .number({ message: "진행률은 숫자여야 합니다" })
      .int("진행률은 정수여야 합니다")
      .min(0, "진행률은 최소 0 이상이어야 합니다")
      .max(100, "진행률은 최대 100까지 가능합니다"),
    order: z
      .number()
      .int("순서는 정수여야 합니다")
      .optional(),
    isActive: z
      .boolean({ message: "활성화 상태는 boolean이어야 합니다" })
      .default(true)
      .optional(),
  }),
});

/**
 * Hint 수정 요청 검증 스키마
 */
export const updateHintSchema = z.object({
  params: z.object({
    hintId: z
      .string({ message: "힌트 ID는 필수입니다" })
      .uuid("유효한 UUID 형식이어야 합니다"),
  }),
  body: z.object({
    code: z
      .string()
      .max(20, "힌트 코드는 최대 20자까지 가능합니다")
      .min(1, "힌트 코드는 비어있을 수 없습니다")
      .optional(),
    content: z
      .string()
      .max(500, "힌트 내용은 최대 500자까지 가능합니다")
      .min(1, "힌트 내용은 비어있을 수 없습니다")
      .optional(),
    answer: z
      .string()
      .max(200, "정답은 최대 200자까지 가능합니다")
      .min(1, "정답은 비어있을 수 없습니다")
      .optional(),
    progressRate: z
      .number()
      .int("진행률은 정수여야 합니다")
      .min(0, "진행률은 최소 0 이상이어야 합니다")
      .max(100, "진행률은 최대 100까지 가능합니다")
      .optional(),
    order: z
      .number()
      .int("순서는 정수여야 합니다")
      .optional(),
    isActive: z
      .boolean()
      .optional(),
  }),
});

/**
 * Hint 순서 변경 요청 검증 스키마
 */
export const updateHintOrderSchema = z.object({
  params: z.object({
    hintId: z
      .string({ message: "힌트 ID는 필수입니다" })
      .uuid("유효한 UUID 형식이어야 합니다"),
  }),
  body: z.object({
    order: z
      .number({ message: "순서는 숫자여야 합니다" })
      .int("순서는 정수여야 합니다"),
  }),
});

/**
 * Hint ID 파라미터 검증 스키마
 */
export const hintIdParamSchema = z.object({
  params: z.object({
    hintId: z
      .string({ message: "힌트 ID는 필수입니다" })
      .uuid("유효한 UUID 형식이어야 합니다"),
  }),
});

/**
 * Theme ID 파라미터 검증 스키마 (hints 조회용)
 */
export const getHintsParamSchema = z.object({
  params: z.object({
    themeId: z
      .string({ message: "테마 ID는 필수입니다" })
      .uuid("유효한 UUID 형식이어야 합니다"),
  }),
});

// 타입 추론을 위한 export
export type CreateHintInput = z.infer<typeof createHintSchema>;
export type UpdateHintInput = z.infer<typeof updateHintSchema>;
export type UpdateHintOrderInput = z.infer<typeof updateHintOrderSchema>;
export type HintIdParam = z.infer<typeof hintIdParamSchema>;
export type GetHintsParam = z.infer<typeof getHintsParamSchema>;
