/**
 * Zod 검증 스키마 모음
 *
 * 이 파일은 모든 검증 스키마를 한 곳에서 export하여
 * 다른 모듈에서 쉽게 import할 수 있도록 합니다.
 */

// Theme 스키마
export {
  createThemeSchema,
  updateThemeSchema,
  themeIdParamSchema,
  getThemesQuerySchema,
  type CreateThemeInput,
  type UpdateThemeInput,
  type ThemeIdParam,
  type GetThemesQuery,
} from "./theme.schema";

// Hint 스키마
export {
  createHintSchema,
  updateHintSchema,
  updateHintOrderSchema,
  hintIdParamSchema,
  getHintsParamSchema,
  type CreateHintInput,
  type UpdateHintInput,
  type UpdateHintOrderInput,
  type HintIdParam,
  type GetHintsParam,
} from "./hint.schema";

// Session 스키마
export {
  createSessionSchema,
  sessionIdParamSchema,
  useHintSchema,
  getSessionsQuerySchema,
  type CreateSessionInput,
  type SessionIdParam,
  type UseHintInput,
  type GetSessionsQuery,
} from "./session.schema";

// Auth 스키마
export { adminLoginSchema, type AdminLoginInput } from "./auth.schema";
