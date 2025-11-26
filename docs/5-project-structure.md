# YIS EscapeHint - 프로젝트 구조 설계 원칙

## 문서 정보

| 항목          | 내용                                                                                                     |
| ------------- | -------------------------------------------------------------------------------------------------------- |
| **문서 버전** | 1.0                                                                                                      |
| **작성일**    | 2025-11-26                                                                                               |
| **작성자**    | Architecture Reviewer                                                                                    |
| **승인자**    | 윤인수                                                                                                   |
| **문서 상태** | 최종 승인                                                                                                |
| **관련 문서** | [도메인 정의서](./1-domain-definition.md), [PRD](./3-prd.md), [아키텍처 다이어그램](./5-arch-diagram.md) |

---

## 1. 최상위 원칙 (Top-level Principles)

### 1.1 전체 아키텍처 철학

**핵심 원칙: 단순성과 확장성의 균형**

EscapeHint는 다음 세 가지 핵심 가치를 중심으로 설계됩니다:

1. **단순성 우선 (Simplicity First)**

   - MVP는 최소한의 기술 스택으로 빠르게 구현
   - 복잡한 마이크로서비스 대신 모놀리식 아키텍처
   - 명확한 계층 분리로 코드 이해도 향상

2. **점진적 확장 (Progressive Enhancement)**

   - 초기에는 텍스트 힌트만 지원
   - 2차 버전에서 이미지/비디오 힌트 추가
   - 3차 버전에서 PWA, 다국어 지원 확장

3. **사용자 중심 설계 (User-Centric Design)**
   - 플레이어: 게임 몰입도를 해치지 않는 UI
   - 관리자: 5분 내 힌트 등록 가능한 간편한 인터페이스
   - 어두운 방 환경 고려 (큰 글자, 다크 모드 기본)

---

### 1.2 디자인 패턴 및 모범 사례

#### 백엔드 패턴

**3-Tier Layered Architecture**

```
Routes (라우팅 및 요청 검증)
   ↓
Controllers (비즈니스 로직 조율)
   ↓
Services (핵심 비즈니스 로직 및 데이터 접근)
   ↓
Prisma ORM (데이터베이스 쿼리)
```

**적용 이유:**

- 각 계층의 책임 명확히 분리
- 테스트 용이성 향상 (Service 계층 단위 테스트)
- 향후 비즈니스 로직 변경 시 영향 범위 최소화

**예시:**

```typescript
// routes/theme.routes.ts - 라우팅
router.get('/themes', themeController.getActiveThemes);

// controllers/theme.controller.ts - 요청/응답 처리
async getActiveThemes(req, res) {
  const themes = await themeService.findActiveThemes();
  res.json(themes);
}

// services/theme.service.ts - 비즈니스 로직
async findActiveThemes() {
  return prisma.theme.findMany({ where: { isActive: true } });
}
```

---

#### 프론트엔드 패턴

**Component-Based Architecture (컴포넌트 기반)**

```
Pages (페이지 레벨 컴포넌트)
   ↓
Features (기능별 컴포넌트 그룹)
   ↓
Components (재사용 가능한 UI 컴포넌트)
   ↓
Hooks (비즈니스 로직 및 상태 관리)
```

**Container/Presentational Pattern**

- **Container 컴포넌트**: 상태 관리, API 호출, 비즈니스 로직
- **Presentational 컴포넌트**: 순수한 UI 렌더링 (props만 사용)

**예시:**

```typescript
// features/game/GamePlayContainer.tsx - Container
export const GamePlayContainer = () => {
  const { session, submitHint } = useGameSession();
  return <GamePlayView session={session} onSubmitHint={submitHint} />;
};

// components/game/GamePlayView.tsx - Presentational
export const GamePlayView = ({ session, onSubmitHint }) => {
  return <div>...</div>;
};
```

---

### 1.3 코드 품질 기준

#### 1.3.1 TypeScript 타입 안전성

**원칙: 모든 함수는 명시적 타입 정의 필수**

```typescript
// ✅ 좋은 예
interface CreateThemeDto {
  name: string;
  description?: string;
  playTime: number;
  isActive: boolean;
}

async function createTheme(data: CreateThemeDto): Promise<Theme> {
  return prisma.theme.create({ data });
}

// ❌ 나쁜 예
async function createTheme(data: any): Promise<any> {
  return prisma.theme.create({ data });
}
```

**규칙:**

- `any` 타입 사용 금지 (정말 필요한 경우 `unknown` 사용 후 타입 검증)
- 모든 API 응답/요청은 명시적 인터페이스 정의
- Prisma 생성 타입 최대한 활용

---

#### 1.3.2 함수 설계 원칙

**단일 책임 원칙 (Single Responsibility)**

```typescript
// ✅ 좋은 예 - 각 함수는 하나의 책임
async function validateHintCode(
  code: string,
  themeId: string
): Promise<boolean> {
  const hint = await prisma.hint.findFirst({
    where: { code, themeId, isActive: true },
  });
  return hint !== null;
}

async function recordHintUsage(
  sessionId: string,
  hintId: string
): Promise<void> {
  await prisma.hintUsage.create({
    data: { sessionId, hintId, usedAt: new Date() },
  });
}

// ❌ 나쁜 예 - 여러 책임을 가진 함수
async function submitHintAndUpdateSession(sessionId, code, themeId) {
  const hint = await findHint(code, themeId);
  if (!hint) throw new Error("Not found");
  await updateSession(sessionId, hint.id);
  await recordUsage(sessionId, hint.id);
  return hint;
}
```

**규칙:**

- 함수는 한 가지 일만 수행
- 함수 이름은 동사로 시작 (get, create, update, delete, validate 등)
- 함수 길이는 최대 50줄 이내 권장

---

#### 1.3.3 에러 처리 원칙

**명시적 에러 처리 및 사용자 친화적 메시지**

```typescript
// ✅ 좋은 예
class HintNotFoundError extends Error {
  constructor(code: string) {
    super(`힌트를 찾을 수 없습니다: ${code}`);
    this.name = "HintNotFoundError";
  }
}

async function getHint(code: string, themeId: string): Promise<Hint> {
  const hint = await prisma.hint.findFirst({
    where: { code, themeId, isActive: true },
  });

  if (!hint) {
    throw new HintNotFoundError(code);
  }

  return hint;
}

// Controller에서 에러 처리
try {
  const hint = await hintService.getHint(code, themeId);
  res.json(hint);
} catch (error) {
  if (error instanceof HintNotFoundError) {
    return res.status(404).json({ message: error.message });
  }
  // 기타 예외 처리
  res.status(500).json({ message: "서버 오류가 발생했습니다." });
}
```

**규칙:**

- 커스텀 에러 클래스 정의 (HintNotFoundError, InvalidCodeError 등)
- 에러 메시지는 사용자 친화적으로 작성
- 에러 로깅은 Winston으로 구조화

---

### 1.4 주석 및 문서화

**원칙: 코드는 자체 설명력을 가져야 하며, 복잡한 로직에만 주석 추가**

```typescript
// ✅ 좋은 예 - 복잡한 비즈니스 로직에 주석
/**
 * 세션의 진행률을 계산합니다.
 *
 * 진행률은 사용한 힌트 중 가장 높은 progressRate 값을 기준으로 합니다.
 * 예: 힌트1(10%), 힌트2(30%) 사용 시 → 진행률 30%
 *
 * @param sessionId - 게임 세션 ID
 * @returns 현재 진행률 (0-100)
 */
async function calculateSessionProgress(sessionId: string): Promise<number> {
  const usages = await prisma.hintUsage.findMany({
    where: { sessionId },
    include: { hint: true },
  });

  if (usages.length === 0) return 0;

  return Math.max(...usages.map((u) => u.hint.progressRate));
}

// ❌ 나쁜 예 - 불필요한 주석
// 테마 목록을 가져옵니다
async function getThemes() {
  // 데이터베이스에서 조회
  return prisma.theme.findMany();
}
```

**규칙:**

- JSDoc 형식으로 주석 작성 (`/** ... */`)
- 함수의 목적, 파라미터, 반환값, 예외 상황 명시
- 명확한 변수/함수명으로 주석 최소화

---

## 2. 의존성 레이어 원칙 (Dependency Layer Principles)

### 2.1 계층 구조 규칙

**Layered Architecture with Dependency Inversion**

```
┌─────────────────────────────────────┐
│  Presentation Layer (Routes)        │  ← HTTP 요청/응답 처리
├─────────────────────────────────────┤
│  Application Layer (Controllers)    │  ← 비즈니스 로직 조율
├─────────────────────────────────────┤
│  Domain Layer (Services)            │  ← 핵심 비즈니스 로직
├─────────────────────────────────────┤
│  Data Access Layer (Prisma ORM)     │  ← 데이터베이스 접근
└─────────────────────────────────────┘
```

**의존성 방향 규칙:**

- **상위 계층 → 하위 계층 의존 가능**
- **하위 계층 → 상위 계층 의존 금지**
- **같은 계층 간 의존 최소화**

---

### 2.2 모듈 경계 및 인터페이스

**Domain-Driven Design (DDD) 원칙 적용**

```
backend/
├── modules/
│   ├── theme/           # 테마 도메인
│   │   ├── theme.routes.ts
│   │   ├── theme.controller.ts
│   │   ├── theme.service.ts
│   │   ├── theme.types.ts
│   │   └── theme.validation.ts
│   ├── hint/            # 힌트 도메인
│   ├── session/         # 세션 도메인
│   └── auth/            # 인증 도메인
└── shared/
    ├── interfaces/      # 공통 인터페이스
    ├── middlewares/     # 공통 미들웨어
    └── utils/           # 유틸리티 함수
```

**규칙:**

- 각 도메인은 독립적인 모듈로 분리
- 모듈 간 의존성은 명시적 인터페이스를 통해서만
- 순환 의존성(Circular Dependency) 금지

**예시:**

```typescript
// ✅ 좋은 예 - 인터페이스를 통한 의존성
// session.service.ts
import { IHintService } from "../hint/hint.interface";

class SessionService {
  constructor(private hintService: IHintService) {}

  async submitHint(sessionId: string, code: string) {
    const hint = await this.hintService.findByCode(code);
    // ...
  }
}

// ❌ 나쁜 예 - 직접 의존
import { HintService } from "../hint/hint.service"; // 강한 결합
```

---

### 2.3 공통 의존성 관리

**Shared 디렉토리 규칙**

```
shared/
├── interfaces/
│   ├── api-response.interface.ts    # 공통 API 응답 타입
│   ├── pagination.interface.ts      # 페이지네이션 타입
│   └── error.interface.ts           # 에러 타입
├── middlewares/
│   ├── auth.middleware.ts           # JWT 검증
│   ├── error.middleware.ts          # 에러 핸들러
│   └── validation.middleware.ts     # 요청 검증
├── utils/
│   ├── logger.util.ts               # Winston 로거
│   ├── password.util.ts             # bcrypt 유틸
│   └── time.util.ts                 # 시간 계산 유틸
└── constants/
    ├── error-messages.ts            # 에러 메시지 상수
    └── config.ts                    # 설정 상수
```

**규칙:**

- 2개 이상 모듈에서 사용하는 코드는 shared로 이동
- shared는 특정 도메인에 의존하지 않음
- 공통 상수는 constants에 중앙 관리

---

## 3. 코드 네이밍 원칙 (Code Naming Principles)

### 3.1 파일 네이밍 규칙

#### 백엔드 파일 네이밍

**규칙: `{entity}.{layer}.ts` 형식**

```
theme.routes.ts          # 라우트
theme.controller.ts      # 컨트롤러
theme.service.ts         # 서비스
theme.types.ts           # 타입 정의
theme.validation.ts      # 검증 스키마
theme.spec.ts            # 테스트 파일
```

**예외:**

- 미들웨어: `auth.middleware.ts`
- 유틸리티: `logger.util.ts`
- 설정: `database.config.ts`

---

#### 프론트엔드 파일 네이밍

**규칙: PascalCase (컴포넌트), camelCase (유틸리티)**

```
# 컴포넌트 (PascalCase)
ThemeSelectPage.tsx
GamePlayContainer.tsx
HintCard.tsx
Button.tsx

# Hooks (camelCase, use prefix)
useGameSession.ts
useTimer.ts
useAuth.ts

# 유틸리티 (camelCase)
apiClient.ts
storage.ts
formatTime.ts

# 스토어 (camelCase, store suffix)
sessionStore.ts
themeStore.ts
```

---

### 3.2 변수 및 함수 네이밍

#### 변수 네이밍

**규칙: camelCase, 의미 명확하게**

```typescript
// ✅ 좋은 예
const activeThemes = await getActiveThemes();
const usedHintCount = session.usedHintCount;
const isAuthenticated = checkAuth();

// ❌ 나쁜 예
const data = await getData(); // 너무 일반적
const cnt = session.cnt; // 축약 금지
const auth = checkAuth(); // 타입 불명확 (boolean? object?)
```

**규칙:**

- 단수/복수 명확히 구분 (theme vs themes)
- 불린 변수는 is/has/can 접두사 (isActive, hasPermission, canSubmit)
- 배열은 복수형 (themes, hints)
- 숫자는 명확한 단위 (count, index, length)

---

#### 함수 네이밍

**규칙: 동사 + 명사, camelCase**

```typescript
// ✅ 좋은 예 - CRUD 작업
async function getTheme(id: string): Promise<Theme>;
async function createTheme(data: CreateThemeDto): Promise<Theme>;
async function updateTheme(id: string, data: UpdateThemeDto): Promise<Theme>;
async function deleteTheme(id: string): Promise<void>;

// ✅ 좋은 예 - 비즈니스 로직
async function validateHintCode(code: string): Promise<boolean>;
async function calculateProgress(sessionId: string): Promise<number>;
async function submitHintToSession(sessionId, hintId): Promise<void>;

// ❌ 나쁜 예
async function theme(id: string); // 동사 없음
async function doStuff(); // 불명확
async function handleData(); // 너무 일반적
```

**규칙:**

- **get**: 데이터 조회 (DB 또는 상태)
- **find**: 조건부 조회 (없을 수 있음)
- **create**: 새 리소스 생성
- **update**: 기존 리소스 수정
- **delete/remove**: 리소스 삭제
- **validate**: 검증 (boolean 반환)
- **calculate**: 계산 (number 반환)
- **submit**: 제출/전송

---

### 3.3 클래스 및 인터페이스 네이밍

#### 클래스 네이밍

**규칙: PascalCase, 명사**

```typescript
// ✅ 좋은 예
class ThemeService {}
class SessionController {}
class HintNotFoundError extends Error {}

// ❌ 나쁜 예
class themeService {} // camelCase 금지
class DoTheme {} // 동사 금지
class Theme_Service {} // 언더스코어 금지
```

---

#### 인터페이스 네이밍

**규칙: PascalCase, I 접두사 또는 의미 명확한 이름**

```typescript
// ✅ 옵션 1: I 접두사 (전통적 방식)
interface IThemeService {
  getTheme(id: string): Promise<Theme>;
  createTheme(data: CreateThemeDto): Promise<Theme>;
}

// ✅ 옵션 2: Dto/Entity 접미사 (권장)
interface CreateThemeDto {
  name: string;
  playTime: number;
}

interface ThemeEntity {
  id: string;
  name: string;
  createdAt: Date;
}

// ❌ 나쁜 예
interface theme {} // camelCase 금지
interface ThemeType {} // 중복 표현
```

**규칙:**

- DTO (Data Transfer Object): CreateThemeDto, UpdateHintDto
- Entity (DB 모델): ThemeEntity (Prisma 생성 타입 사용 권장)
- 서비스 인터페이스: IThemeService 또는 ThemeServiceInterface

---

### 3.4 상수 네이밍

**규칙: UPPER_SNAKE_CASE**

```typescript
// ✅ 좋은 예
const MAX_HINT_COUNT = 20;
const SESSION_TIMEOUT_MS = 2 * 60 * 60 * 1000; // 2시간
const API_BASE_URL = process.env.API_URL || "http://localhost:3000";

const ERROR_MESSAGES = {
  HINT_NOT_FOUND: "힌트를 찾을 수 없습니다",
  INVALID_CODE: "잘못된 힌트 코드입니다",
  SESSION_EXPIRED: "세션이 만료되었습니다",
} as const;

// ❌ 나쁜 예
const maxHintCount = 20; // camelCase 금지
const SessionTimeout = 2000; // PascalCase 금지
```

---

### 3.5 환경 변수 네이밍

**규칙: UPPER_SNAKE_CASE, 의미 명확**

```bash
# ✅ 좋은 예 (.env 파일)
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=15m
PORT=3000
NODE_ENV=production

SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...

# ❌ 나쁜 예
db_url=...              # 소문자 금지
JwtSecret=...           # camelCase 금지
port=...                # 소문자 금지
```

---

## 4. 테스트 품질 원칙 (Test Quality Principles)

### 4.1 테스트 전략

**Test Pyramid 구조**

```
        /\
       /E2E\          10% - End-to-End (Playwright)
      /______\
     /Integration\    30% - Integration (API 테스트)
    /__________\
   /Unit  Tests  \   60% - Unit (Service, Util 테스트)
  /________________\
```

**우선순위:**

1. **Unit Tests (P0)**: 핵심 비즈니스 로직 (Service 계층)
2. **Integration Tests (P1)**: API 엔드포인트 테스트
3. **E2E Tests (P2)**: 주요 사용자 시나리오 (선택)

---

### 4.2 유닛 테스트 가이드라인

**파일 구조:**

```
src/
├── modules/
│   └── theme/
│       ├── theme.service.ts
│       ├── theme.service.spec.ts      # 유닛 테스트
│       ├── theme.controller.ts
│       └── theme.controller.spec.ts
```

**네이밍 규칙:**

- 테스트 파일: `{filename}.spec.ts`
- describe 블록: 테스트 대상 클래스/함수명
- it/test 블록: `should + 동작 + 조건`

**예시:**

```typescript
// theme.service.spec.ts
import { ThemeService } from "./theme.service";
import { prismaMock } from "../../../test/prisma-mock";

describe("ThemeService", () => {
  let service: ThemeService;

  beforeEach(() => {
    service = new ThemeService(prismaMock);
  });

  describe("findActiveThemes", () => {
    it("should return only active themes", async () => {
      // Arrange
      const mockThemes = [
        { id: "1", name: "Theme 1", isActive: true },
        { id: "2", name: "Theme 2", isActive: true },
      ];
      prismaMock.theme.findMany.mockResolvedValue(mockThemes);

      // Act
      const result = await service.findActiveThemes();

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].isActive).toBe(true);
    });

    it("should return empty array when no active themes exist", async () => {
      prismaMock.theme.findMany.mockResolvedValue([]);

      const result = await service.findActiveThemes();

      expect(result).toEqual([]);
    });
  });

  describe("createTheme", () => {
    it("should create theme with valid data", async () => {
      const input = { name: "New Theme", playTime: 60, isActive: true };
      const mockTheme = { id: "1", ...input, createdAt: new Date() };
      prismaMock.theme.create.mockResolvedValue(mockTheme);

      const result = await service.createTheme(input);

      expect(result.name).toBe("New Theme");
      expect(prismaMock.theme.create).toHaveBeenCalledWith({ data: input });
    });

    it("should throw error when duplicate theme name exists", async () => {
      const input = { name: "Duplicate", playTime: 60, isActive: true };
      prismaMock.theme.create.mockRejectedValue(
        new Error("Unique constraint failed")
      );

      await expect(service.createTheme(input)).rejects.toThrow();
    });
  });
});
```

**규칙:**

- **AAA 패턴**: Arrange (준비) → Act (실행) → Assert (검증)
- **하나의 it는 하나의 시나리오만 테스트**
- **Mock은 최소한으로** (Prisma만 Mock, Service는 실제 인스턴스)

---

### 4.3 통합 테스트 가이드라인

**API 통합 테스트 예시:**

```typescript
// theme.api.spec.ts
import request from "supertest";
import { app } from "../../../app";
import { prisma } from "../../../database";

describe("Theme API", () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  afterEach(async () => {
    await prisma.theme.deleteMany();
  });

  describe("GET /api/themes", () => {
    it("should return active themes only", async () => {
      // Arrange
      await prisma.theme.createMany({
        data: [
          { name: "Active 1", playTime: 60, isActive: true },
          { name: "Inactive", playTime: 60, isActive: false },
          { name: "Active 2", playTime: 90, isActive: true },
        ],
      });

      // Act
      const response = await request(app).get("/api/themes");

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].isActive).toBe(true);
    });
  });

  describe("POST /api/admin/themes", () => {
    it("should create theme with JWT authentication", async () => {
      const token = generateTestJWT(); // 테스트용 JWT
      const input = { name: "New Theme", playTime: 60, isActive: true };

      const response = await request(app)
        .post("/api/admin/themes")
        .set("Authorization", `Bearer ${token}`)
        .send(input);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe("New Theme");
    });

    it("should return 401 without authentication", async () => {
      const input = { name: "New Theme", playTime: 60, isActive: true };

      const response = await request(app).post("/api/admin/themes").send(input);

      expect(response.status).toBe(401);
    });
  });
});
```

**규칙:**

- **실제 DB 사용** (테스트 DB 또는 인메모리 DB)
- **각 테스트 후 DB 정리** (afterEach)
- **인증이 필요한 API는 테스트용 JWT 생성**

---

### 4.4 E2E 테스트 가이드라인 (선택)

**Playwright 시나리오 테스트:**

```typescript
// player-hint-flow.e2e.spec.ts
import { test, expect } from "@playwright/test";

test.describe("플레이어 힌트 조회 플로우", () => {
  test("should complete full game flow", async ({ page }) => {
    // 1. 테마 선택
    await page.goto("http://localhost:3000");
    await page.click('button:has-text("좀비 연구소")');

    // 2. 게임 시작 확인
    await expect(page.locator("h1")).toContainText("좀비 연구소");
    await expect(page.locator(".timer")).toContainText("60:00");

    // 3. 힌트 코드 입력
    await page.fill('input[placeholder="힌트 코드를 입력하세요"]', "HINT01");
    await page.click('button:has-text("확인")');

    // 4. 힌트 내용 확인
    await expect(page.locator(".hint-content")).toBeVisible();
    await expect(page.locator(".progress-rate")).toContainText("10%");

    // 5. 정답 확인
    await page.click('button:has-text("정답보기")');
    await page.click('button:has-text("예")'); // 확인 다이얼로그
    await expect(page.locator(".answer")).toBeVisible();
  });
});
```

**규칙:**

- **핵심 사용자 시나리오만 E2E 테스트**
- **플레이어/관리자 주요 플로우 각 1-2개씩**
- **실행 시간이 길므로 CI/CD에서는 선택적 실행**

---

### 4.5 테스트 커버리지 목표

**목표:**

- **Service 계층**: 80% 이상
- **Controller 계층**: 70% 이상
- **Utils/Helpers**: 90% 이상
- **전체 프로젝트**: 70% 이상

**측정 도구:**

- Vitest 내장 커버리지 리포트
- `npm run test:coverage` 명령어

---

## 5. 설정 보안 운영 원칙 (Configuration, Security, Operations)

### 5.1 환경 설정 관리

**원칙: 환경별 설정 분리, 민감 정보는 환경 변수**

**파일 구조:**

```
.env.example          # 템플릿 (Git 커밋)
.env                  # 로컬 개발 (Git 무시)
.env.production       # 프로덕션 (Vercel 환경변수)
```

**.env.example (템플릿):**

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/escapehint

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=development

# Supabase (Optional)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
```

**규칙:**

- `.env` 파일은 절대 Git에 커밋하지 않음
- `.env.example`은 모든 필요한 변수 나열 (값은 더미)
- Vercel 배포 시 환경변수는 대시보드에서 설정

---

### 5.2 보안 원칙

#### 5.2.1 인증 및 인가

**JWT 토큰 관리:**

```typescript
// auth.middleware.ts
import jwt from "jsonwebtoken";

export async function authenticateAdmin(req, res, next) {
  const token = req.cookies.accessToken; // HttpOnly 쿠키

  if (!token) {
    return res.status(401).json({ message: "인증이 필요합니다" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = payload; // 관리자 정보 첨부
    next();
  } catch (error) {
    return res.status(401).json({ message: "유효하지 않은 토큰입니다" });
  }
}
```

**규칙:**

- **Access Token**: 15분 만료, HttpOnly 쿠키에 저장
- **Refresh Token**: 7일 만료, HttpOnly 쿠키에 저장
- **관리자 비밀번호**: bcrypt로 해싱 (saltRounds: 10)

---

#### 5.2.2 XSS 및 CSRF 방지

**XSS 방지:**

```typescript
// DOMPurify 사용 (프론트엔드)
import DOMPurify from "dompurify";

function HintContent({ content }: { content: string }) {
  const sanitizedContent = DOMPurify.sanitize(content);
  return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />;
}
```

**CSRF 방지:**

```typescript
// helmet 미들웨어 사용 (백엔드)
import helmet from "helmet";

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
      },
    },
  })
);
```

---

#### 5.2.3 Rate Limiting

**API 남용 방지:**

```typescript
// rate-limit.middleware.ts
import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1분
  max: 100, // 최대 100 요청
  message: "너무 많은 요청을 보냈습니다. 잠시 후 다시 시도하세요.",
});

// 적용
app.use("/api/", apiLimiter);
```

---

### 5.3 배포 및 운영

#### 5.3.1 배포 전략

**Vercel 자동 배포:**

1. **Git Push → 자동 배포**

   - main 브랜치 푸시 시 프로덕션 배포
   - feature 브랜치 푸시 시 Preview 배포

2. **환경변수 설정**

   - Vercel 대시보드에서 환경변수 설정
   - DATABASE_URL, JWT_SECRET 등 민감 정보

3. **빌드 명령어**
   ```json
   {
     "scripts": {
       "build": "tsc && prisma generate && vite build",
       "start": "node dist/index.js"
     }
   }
   ```

---

#### 5.3.2 로깅 전략

**Winston 구조화된 로깅:**

```typescript
// logger.util.ts
import winston from "winston";

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

// 사용 예시
logger.info("Session created", { sessionId, themeId });
logger.error("Hint not found", { code, themeId, error });
```

**로그 레벨:**

- **error**: 에러 발생 (DB 오류, 인증 실패 등)
- **warn**: 경고 (세션 만료 임박 등)
- **info**: 정보 (세션 생성, 힌트 사용 등)
- **debug**: 디버그 (개발 환경에서만)

---

#### 5.3.3 모니터링 및 알림

**Vercel Analytics (선택):**

- API 응답 시간 모니터링
- 에러율 추적
- 트래픽 분석

**수동 모니터링 (MVP):**

- Winston 로그 파일 확인
- Supabase 대시보드에서 DB 성능 확인

**2차 버전 고려:**

- Sentry 에러 추적
- Uptime 모니터링 (UptimeRobot)

---

## 6. 프론트엔드 디렉토리 구조 (Frontend Directory Structure)

```
frontend/
├── public/                     # 정적 파일
│   ├── favicon.ico
│   └── robots.txt
│
├── src/
│   ├── main.tsx                # 엔트리 포인트
│   ├── App.tsx                 # 루트 컴포넌트
│   │
│   ├── pages/                  # 페이지 컴포넌트
│   │   ├── player/
│   │   │   ├── ThemeSelectPage.tsx       # 테마 선택
│   │   │   ├── GamePlayPage.tsx          # 게임 플레이
│   │   │   └── HintViewPage.tsx          # 힌트 보기
│   │   └── admin/
│   │       ├── AdminLoginPage.tsx        # 관리자 로그인
│   │       ├── DashboardPage.tsx         # 대시보드
│   │       ├── ThemeManagePage.tsx       # 테마 관리
│   │       └── HintManagePage.tsx        # 힌트 관리
│   │
│   ├── features/               # 기능별 컴포넌트 그룹
│   │   ├── game/
│   │   │   ├── components/
│   │   │   │   ├── Timer.tsx             # 타이머 컴포넌트
│   │   │   │   ├── HintInput.tsx         # 힌트 입력
│   │   │   │   ├── ProgressBar.tsx       # 진행률 바
│   │   │   │   └── GameStats.tsx         # 게임 통계
│   │   │   ├── hooks/
│   │   │   │   ├── useTimer.ts           # 타이머 훅
│   │   │   │   ├── useGameSession.ts     # 세션 훅
│   │   │   │   └── useHintSubmit.ts      # 힌트 제출 훅
│   │   │   └── types/
│   │   │       └── game.types.ts         # 게임 타입
│   │   │
│   │   ├── theme/
│   │   │   ├── components/
│   │   │   │   ├── ThemeCard.tsx         # 테마 카드
│   │   │   │   ├── ThemeForm.tsx         # 테마 폼
│   │   │   │   └── ThemeList.tsx         # 테마 목록
│   │   │   ├── hooks/
│   │   │   │   └── useThemes.ts          # 테마 훅
│   │   │   └── types/
│   │   │       └── theme.types.ts        # 테마 타입
│   │   │
│   │   ├── hint/
│   │   │   ├── components/
│   │   │   │   ├── HintCard.tsx          # 힌트 카드
│   │   │   │   ├── HintForm.tsx          # 힌트 폼
│   │   │   │   └── HintList.tsx          # 힌트 목록
│   │   │   ├── hooks/
│   │   │   │   └── useHints.ts           # 힌트 훅
│   │   │   └── types/
│   │   │       └── hint.types.ts         # 힌트 타입
│   │   │
│   │   └── auth/
│   │       ├── components/
│   │       │   └── AdminLoginForm.tsx    # 로그인 폼
│   │       ├── hooks/
│   │       │   └── useAuth.ts            # 인증 훅
│   │       └── types/
│   │           └── auth.types.ts         # 인증 타입
│   │
│   ├── components/             # 공통 재사용 컴포넌트
│   │   ├── ui/
│   │   │   ├── Button.tsx                # 버튼
│   │   │   ├── Input.tsx                 # 입력 필드
│   │   │   ├── Modal.tsx                 # 모달
│   │   │   ├── Card.tsx                  # 카드
│   │   │   └── Spinner.tsx               # 로딩 스피너
│   │   ├── layout/
│   │   │   ├── Header.tsx                # 헤더
│   │   │   ├── Footer.tsx                # 푸터
│   │   │   └── AdminLayout.tsx           # 관리자 레이아웃
│   │   └── feedback/
│   │       ├── ErrorMessage.tsx          # 에러 메시지
│   │       └── Toast.tsx                 # 토스트 알림
│   │
│   ├── hooks/                  # 공통 커스텀 훅
│   │   ├── useLocalStorage.ts            # 로컬 스토리지
│   │   ├── useFetch.ts                   # 데이터 페칭
│   │   └── useDebounce.ts                # 디바운스
│   │
│   ├── stores/                 # Zustand 상태 관리
│   │   ├── sessionStore.ts               # 세션 스토어
│   │   ├── themeStore.ts                 # 테마 스토어
│   │   └── authStore.ts                  # 인증 스토어
│   │
│   ├── services/               # API 통신 서비스
│   │   ├── api/
│   │   │   ├── apiClient.ts              # Axios 인스턴스
│   │   │   ├── themeApi.ts               # 테마 API
│   │   │   ├── hintApi.ts                # 힌트 API
│   │   │   ├── sessionApi.ts             # 세션 API
│   │   │   └── authApi.ts                # 인증 API
│   │   └── storage/
│   │       └── sessionStorage.ts         # 세션 로컬 저장
│   │
│   ├── utils/                  # 유틸리티 함수
│   │   ├── formatTime.ts                 # 시간 포맷
│   │   ├── validators.ts                 # 검증 함수
│   │   └── constants.ts                  # 상수
│   │
│   ├── types/                  # 공통 타입 정의
│   │   ├── api.types.ts                  # API 응답 타입
│   │   └── common.types.ts               # 공통 타입
│   │
│   ├── styles/                 # 스타일 파일
│   │   ├── globals.css                   # 전역 스타일
│   │   └── tailwind.css                  # Tailwind 설정
│   │
│   └── routes/                 # 라우팅 설정
│       └── index.tsx                     # React Router 설정
│
├── tests/                      # 테스트 파일
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example                # 환경변수 템플릿
├── .gitignore
├── package.json
├── tsconfig.json               # TypeScript 설정
├── vite.config.ts              # Vite 설정
├── tailwind.config.js          # Tailwind 설정
└── README.md
```

### 주요 디렉토리 설명

| 디렉토리      | 목적                          | 규칙                            |
| ------------- | ----------------------------- | ------------------------------- |
| `pages/`      | 페이지 컴포넌트 (라우팅 단위) | 라우터와 1:1 매핑               |
| `features/`   | 기능별 독립 모듈              | components + hooks + types 포함 |
| `components/` | 공통 재사용 컴포넌트          | 도메인 로직 없음, UI만          |
| `hooks/`      | 공통 커스텀 훅                | 비즈니스 로직 캡슐화            |
| `stores/`     | 전역 상태 관리                | Zustand 스토어                  |
| `services/`   | API 통신 및 외부 서비스       | Axios 클라이언트                |
| `utils/`      | 유틸리티 함수                 | 순수 함수만                     |
| `types/`      | 공통 타입 정의                | 전역 타입 및 인터페이스         |

---

## 7. 백엔드 디렉토리 구조 (Backend Directory Structure)

```
backend/
├── src/
│   ├── index.ts                # 엔트리 포인트
│   ├── app.ts                  # Express 앱 설정
│   │
│   ├── modules/                # 도메인별 모듈
│   │   ├── theme/
│   │   │   ├── theme.routes.ts           # 라우트
│   │   │   ├── theme.controller.ts       # 컨트롤러
│   │   │   ├── theme.service.ts          # 서비스
│   │   │   ├── theme.types.ts            # 타입 정의
│   │   │   ├── theme.validation.ts       # Zod 검증 스키마
│   │   │   └── theme.spec.ts             # 유닛 테스트
│   │   │
│   │   ├── hint/
│   │   │   ├── hint.routes.ts
│   │   │   ├── hint.controller.ts
│   │   │   ├── hint.service.ts
│   │   │   ├── hint.types.ts
│   │   │   ├── hint.validation.ts
│   │   │   └── hint.spec.ts
│   │   │
│   │   ├── session/
│   │   │   ├── session.routes.ts
│   │   │   ├── session.controller.ts
│   │   │   ├── session.service.ts
│   │   │   ├── session.types.ts
│   │   │   ├── session.validation.ts
│   │   │   └── session.spec.ts
│   │   │
│   │   └── auth/
│   │       ├── auth.routes.ts
│   │       ├── auth.controller.ts
│   │       ├── auth.service.ts
│   │       ├── auth.types.ts
│   │       ├── auth.validation.ts
│   │       └── auth.spec.ts
│   │
│   ├── shared/                 # 공통 모듈
│   │   ├── interfaces/
│   │   │   ├── api-response.interface.ts  # 공통 API 응답
│   │   │   ├── pagination.interface.ts    # 페이지네이션
│   │   │   └── error.interface.ts         # 에러 타입
│   │   │
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.ts         # JWT 검증
│   │   │   ├── error.middleware.ts        # 에러 핸들러
│   │   │   ├── validation.middleware.ts   # 요청 검증
│   │   │   └── rate-limit.middleware.ts   # Rate Limiting
│   │   │
│   │   ├── utils/
│   │   │   ├── logger.util.ts             # Winston 로거
│   │   │   ├── password.util.ts           # bcrypt 유틸
│   │   │   ├── jwt.util.ts                # JWT 유틸
│   │   │   └── time.util.ts               # 시간 계산
│   │   │
│   │   ├── constants/
│   │   │   ├── error-messages.ts          # 에러 메시지
│   │   │   └── config.ts                  # 설정 상수
│   │   │
│   │   └── errors/
│   │       ├── AppError.ts                # 커스텀 에러 클래스
│   │       ├── HintNotFoundError.ts
│   │       └── UnauthorizedError.ts
│   │
│   ├── database/               # 데이터베이스 관련
│   │   ├── prisma/
│   │   │   ├── schema.prisma              # Prisma 스키마
│   │   │   ├── migrations/                # 마이그레이션
│   │   │   └── seed.ts                    # 시드 데이터
│   │   └── client.ts                      # Prisma 클라이언트
│   │
│   ├── config/                 # 설정 파일
│   │   ├── database.config.ts             # DB 설정
│   │   ├── jwt.config.ts                  # JWT 설정
│   │   └── app.config.ts                  # 앱 설정
│   │
│   └── types/                  # 전역 타입 정의
│       └── express.d.ts                   # Express 타입 확장
│
├── tests/                      # 테스트 파일
│   ├── unit/
│   ├── integration/
│   └── helpers/
│       └── prisma-mock.ts                 # Prisma Mock
│
├── logs/                       # 로그 파일 (Git 무시)
│   ├── error.log
│   └── combined.log
│
├── .env.example                # 환경변수 템플릿
├── .gitignore
├── package.json
├── tsconfig.json               # TypeScript 설정
└── README.md
```

### 주요 디렉토리 설명

| 디렉토리    | 목적                          | 규칙                            |
| ----------- | ----------------------------- | ------------------------------- |
| `modules/`  | 도메인별 독립 모듈            | Routes → Controllers → Services |
| `shared/`   | 공통 모듈                     | 여러 도메인에서 사용하는 코드   |
| `database/` | Prisma 스키마 및 마이그레이션 | DB 관련 코드만                  |
| `config/`   | 설정 파일                     | 환경변수 기반 설정              |
| `tests/`    | 테스트 파일                   | src와 동일한 구조               |

---

## 8. 추가 권장 사항

### 8.1 Git Commit Convention

**Conventional Commits 형식:**

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type 종류:**

- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷팅 (기능 변경 없음)
- `refactor`: 코드 리팩토링
- `test`: 테스트 코드 추가/수정
- `chore`: 빌드/설정 파일 수정

**예시:**

```
feat(hint): 힌트 코드 검증 기능 추가

- 힌트 코드 입력 시 실시간 검증
- 대소문자 구분 없이 처리
- 중복 코드 검증 추가

Closes #12
```

---

### 8.2 Code Review Checklist

**PR 전 체크리스트:**

- [ ] 코드는 TypeScript로 작성되었는가?
- [ ] 모든 함수는 명시적 타입을 가지는가?
- [ ] 유닛 테스트가 작성되었는가?
- [ ] 에러 처리가 적절한가?
- [ ] 환경변수는 .env.example에 추가되었는가?
- [ ] README 업데이트가 필요한가?

---

## 문서 변경 이력

| 버전 | 날짜       | 작성자                | 변경 내용                       | 승인자 |
| ---- | ---------- | --------------------- | ------------------------------- | ------ |
| 1.0  | 2025-11-26 | Architecture Reviewer | 초안 작성 (전체 구조 설계 원칙) | 윤인수 |

---

## 문서 승인

본 문서는 EscapeHint 프로젝트의 공식 프로젝트 구조 설계 원칙 문서로, 모든 개발자가 준수해야 할 코드 구조, 네이밍, 테스트, 보안 가이드라인을 포함합니다.

**승인자**: 윤인수
**승인일**: 2025-11-26
**문서 상태**: 최종 승인 완료

---

**다음 단계**:

1. 프론트엔드/백엔드 디렉토리 구조 초기 생성
2. Prisma 스키마 작성 및 마이그레이션
3. 공통 컴포넌트 및 유틸리티 구현
4. 개발 착수 (Phase 1: 2025-11-26)

---

**문서 끝**
