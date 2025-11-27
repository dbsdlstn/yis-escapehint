import { z } from "zod";

/**
 * Theme 생성 요청 검증 스키마
 */
export const createThemeSchema = z.object({
  body: z.object({
    name: z
      .string({ message: "테마 이름은 문자열이어야 합니다" })
      .max(50, "테마 이름은 최대 50자까지 가능합니다")
      .min(1, "테마 이름은 비어있을 수 없습니다"),
    playTime: z
      .number({ message: "플레이 시간은 숫자여야 합니다" })
      .int("플레이 시간은 정수여야 합니다")
      .min(10, "플레이 시간은 최소 10분 이상이어야 합니다")
      .max(180, "플레이 시간은 최대 180분까지 가능합니다"),
    description: z.string().optional().nullable(),
    isActive: z.boolean({ message: "활성화 상태는 boolean이어야 합니다" }).default(true).optional(),
    difficulty: z.string().optional().nullable(),
  }),
});

/**
 * Theme 수정 요청 검증 스키마
 */
export const updateThemeSchema = z.object({
  params: z.object({
    themeId: z.string({ message: "테마 ID는 필수입니다" }).uuid("유효한 UUID 형식이어야 합니다"),
  }),
  body: z.object({
    name: z
      .string()
      .max(50, "테마 이름은 최대 50자까지 가능합니다")
      .min(1, "테마 이름은 비어있을 수 없습니다")
      .optional(),
    playTime: z
      .number()
      .int("플레이 시간은 정수여야 합니다")
      .min(10, "플레이 시간은 최소 10분 이상이어야 합니다")
      .max(180, "플레이 시간은 최대 180분까지 가능합니다")
      .optional(),
    description: z.string().optional().nullable(),
    isActive: z.boolean().optional(),
    difficulty: z.string().optional().nullable(),
  }),
});

/**
 * Theme ID 파라미터 검증 스키마
 */
export const themeIdParamSchema = z.object({
  params: z.object({
    themeId: z.string({ message: "테마 ID는 필수입니다" }).uuid("유효한 UUID 형식이어야 합니다"),
  }),
});

/**
 * Theme 조회 query 검증 스키마
 */
export const getThemesQuerySchema = z.object({
  query: z.object({
    status: z
      .literal("active", { message: "status는 'active'만 허용됩니다" })
      .default("active" as const)
      .optional(),
  }),
});

// 타입 추론을 위한 export
export type CreateThemeInput = z.infer<typeof createThemeSchema>;
export type UpdateThemeInput = z.infer<typeof updateThemeSchema>;
export type ThemeIdParam = z.infer<typeof themeIdParamSchema>;
export type GetThemesQuery = z.infer<typeof getThemesQuerySchema>;
