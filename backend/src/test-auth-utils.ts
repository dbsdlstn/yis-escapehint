/**
 * BE-009, BE-010 테스트 스크립트
 * JWT 유틸리티, 인증 미들웨어, bcrypt 유틸리티 테스트
 */

import { generateToken, verifyToken } from "./shared/utils/jwt.util";
import { hashPassword, comparePassword } from "./shared/utils/bcrypt.util";
import { Request, Response, NextFunction } from "express";
import { authMiddleware } from "./shared/middleware/auth.middleware";
import { UnauthorizedError } from "./shared/errors/AppError";

// Request 타입 확장
interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
    [key: string]: any;
  };
}

// 테스트 결과 추적
let passedTests = 0;
let totalTests = 0;

function testCase(name: string, fn: () => Promise<void> | void) {
  totalTests++;
  return Promise.resolve(fn())
    .then(() => {
      passedTests++;
      console.log(`✓ ${name}`);
    })
    .catch((error) => {
      console.error(`✗ ${name}`);
      console.error(`  오류: ${error.message}`);
    });
}

async function runTests() {
  console.log("=== BE-009: JWT 유틸리티 테스트 ===\n");

  // JWT 토큰 생성 테스트
  await testCase("JWT 토큰 생성", () => {
    const payload = { userId: "test-user", role: "admin" };
    const token = generateToken(payload);

    if (!token || typeof token !== "string") {
      throw new Error("토큰이 생성되지 않았습니다.");
    }
  });

  // JWT 토큰 검증 테스트
  await testCase("JWT 토큰 검증 - 정상 토큰", () => {
    const payload = { userId: "test-user", role: "admin" };
    const token = generateToken(payload);
    const decoded = verifyToken(token);

    if (decoded.userId !== payload.userId || decoded.role !== payload.role) {
      throw new Error("페이로드가 일치하지 않습니다.");
    }
  });

  // JWT 만료 시간 커스텀 테스트
  await testCase("JWT 토큰 생성 - 커스텀 만료 시간", () => {
    const payload = { userId: "test-user" };
    const token = generateToken(payload, "1h");

    if (!token) {
      throw new Error("커스텀 만료 시간 토큰이 생성되지 않았습니다.");
    }
  });

  // JWT 잘못된 토큰 검증 테스트
  await testCase("JWT 토큰 검증 - 잘못된 토큰", () => {
    try {
      verifyToken("invalid.token.here");
      throw new Error("잘못된 토큰이 통과되었습니다.");
    } catch (error: any) {
      if (!error.message.includes("유효하지 않은")) {
        throw error;
      }
    }
  });

  console.log("\n=== BE-009: 인증 미들웨어 테스트 ===\n");

  // 미들웨어 - 토큰 없음
  await testCase("미들웨어 - 토큰 없음", async () => {
    const req = { headers: {} } as Request;
    const res = {} as Response;
    let errorCaught = false;

    const next: NextFunction = (error?: any) => {
      if (error instanceof UnauthorizedError) {
        errorCaught = true;
      }
    };

    authMiddleware(req, res, next);

    if (!errorCaught) {
      throw new Error("UnauthorizedError가 발생하지 않았습니다.");
    }
  });

  // 미들웨어 - 잘못된 형식
  await testCase("미들웨어 - 잘못된 토큰 형식", async () => {
    const req = {
      headers: { authorization: "InvalidFormat token123" },
    } as Request;
    const res = {} as Response;
    let errorCaught = false;

    const next: NextFunction = (error?: any) => {
      if (error instanceof UnauthorizedError) {
        errorCaught = true;
      }
    };

    authMiddleware(req, res, next);

    if (!errorCaught) {
      throw new Error("잘못된 형식에 대한 에러가 발생하지 않았습니다.");
    }
  });

  // 미들웨어 - 정상 토큰
  await testCase("미들웨어 - 정상 토큰", async () => {
    const payload = { userId: "test-user", role: "admin" };
    const token = generateToken(payload);
    const req = {
      headers: { authorization: `Bearer ${token}` },
    } as AuthRequest;
    const res = {} as Response;
    let nextCalled = false;
    let errorCaught = false;

    const next: NextFunction = (error?: any) => {
      if (error) {
        errorCaught = true;
      } else {
        nextCalled = true;
      }
    };

    authMiddleware(req, res, next);

    if (errorCaught) {
      throw new Error("정상 토큰에서 에러가 발생했습니다.");
    }
    if (!nextCalled) {
      throw new Error("next()가 호출되지 않았습니다.");
    }
    if (!req.user || req.user.userId !== payload.userId) {
      throw new Error("req.user가 올바르게 설정되지 않았습니다.");
    }
  });

  console.log("\n=== BE-010: bcrypt 유틸리티 테스트 ===\n");

  // 비밀번호 해싱 테스트
  await testCase("비밀번호 해싱", async () => {
    const password = "testPassword123!";
    const hashed = await hashPassword(password);

    if (!hashed || hashed === password) {
      throw new Error("비밀번호가 해싱되지 않았습니다.");
    }
    if (!hashed.startsWith("$2b$")) {
      throw new Error("bcrypt 형식이 아닙니다.");
    }
  });

  // 비밀번호 비교 - 일치
  await testCase("비밀번호 비교 - 일치", async () => {
    const password = "testPassword123!";
    const hashed = await hashPassword(password);
    const isMatch = await comparePassword(password, hashed);

    if (!isMatch) {
      throw new Error("동일한 비밀번호가 일치하지 않습니다.");
    }
  });

  // 비밀번호 비교 - 불일치
  await testCase("비밀번호 비교 - 불일치", async () => {
    const password = "testPassword123!";
    const wrongPassword = "wrongPassword456!";
    const hashed = await hashPassword(password);
    const isMatch = await comparePassword(wrongPassword, hashed);

    if (isMatch) {
      throw new Error("다른 비밀번호가 일치합니다.");
    }
  });

  console.log("\n=== 통합 테스트: 로그인 플로우 ===\n");

  // 전체 로그인 플로우 시뮬레이션
  await testCase("전체 로그인 플로우", async () => {
    // 1. 비밀번호 해싱 (회원가입 시)
    const originalPassword = "admin123";
    const hashedPassword = await hashPassword(originalPassword);

    // 2. 로그인 시 비밀번호 비교
    const isValid = await comparePassword(originalPassword, hashedPassword);
    if (!isValid) {
      throw new Error("로그인 비밀번호 검증 실패");
    }

    // 3. JWT 토큰 생성
    const token = generateToken({ userId: "admin", role: "admin" });

    // 4. 미들웨어로 토큰 검증
    const req = {
      headers: { authorization: `Bearer ${token}` },
    } as AuthRequest;
    const res = {} as Response;
    let success = false;

    const next: NextFunction = (error?: any) => {
      if (!error && req.user) {
        success = true;
      }
    };

    authMiddleware(req, res, next);

    if (!success) {
      throw new Error("전체 로그인 플로우 실패");
    }
  });

  // 결과 출력
  console.log("\n" + "=".repeat(50));
  console.log(`테스트 결과: ${passedTests}/${totalTests} 통과`);
  console.log("=".repeat(50) + "\n");

  if (passedTests === totalTests) {
    console.log("모든 테스트가 성공적으로 완료되었습니다!");
    process.exit(0);
  } else {
    console.log(`${totalTests - passedTests}개의 테스트가 실패했습니다.`);
    process.exit(1);
  }
}

// 테스트 실행
runTests().catch((error) => {
  console.error("테스트 실행 중 오류 발생:", error);
  process.exit(1);
});
