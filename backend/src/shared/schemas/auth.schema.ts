import { z } from "zod";

/**
 * 관리자 로그인 요청 검증 스키마
 */
export const adminLoginSchema = z.object({
  body: z.object({
    password: z.string({ message: "비밀번호는 문자열이어야 합니다" }).min(1, "비밀번호는 비어있을 수 없습니다"),
  }),
});

// 타입 추론을 위한 export
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
