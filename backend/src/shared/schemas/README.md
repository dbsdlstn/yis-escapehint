# Zod 스키마 검증 미들웨어 사용 가이드

## 개요

이 디렉토리는 API 요청 검증을 위한 Zod 스키마와 검증 미들웨어를 포함합니다.

## 파일 구조

```
schemas/
├── auth.schema.ts       # 관리자 인증 관련 스키마
├── theme.schema.ts      # 테마 관련 스키마
├── hint.schema.ts       # 힌트 관련 스키마
├── session.schema.ts    # 세션 관련 스키마
└── index.ts            # 모든 스키마 export
```

## 사용 방법

### 1. 기본 사용법

```typescript
import { Router } from "express";
import { validate } from "@/shared/middleware/validate.middleware";
import { createThemeSchema, updateThemeSchema } from "@/shared/schemas";

const router = Router();

// POST 요청 검증 (body만)
router.post("/", validate(createThemeSchema), async (req, res) => {
  // req.body는 이미 검증되었음
  const { name, playTime, description } = req.body;
  // ...
});

// PUT 요청 검증 (params + body)
router.put("/:themeId", validate(updateThemeSchema), async (req, res) => {
  // req.params.themeId와 req.body 모두 검증되었음
  const { themeId } = req.params;
  const updateData = req.body;
  // ...
});
```

### 2. 타입 안전성 활용

```typescript
import { CreateThemeInput } from "@/shared/schemas";

// 스키마에서 자동으로 타입 추론
function createTheme(data: CreateThemeInput["body"]) {
  // data.name, data.playTime 등이 타입 안전하게 사용 가능
}
```

### 3. 세부 검증 (body, query, params 개별)

```typescript
import {
  validateBody,
  validateQuery,
  validateParams,
} from "@/shared/middleware/validate.middleware";

// body만 검증
router.post("/", validateBody(bodySchema), handler);

// query만 검증
router.get("/", validateQuery(querySchema), handler);

// params만 검증
router.get("/:id", validateParams(paramsSchema), handler);
```

## 스키마별 검증 규칙

### Theme 스키마

#### createThemeSchema
- **name**: 필수, 최대 50자
- **playTime**: 필수, 10~180 사이의 정수
- **description**: 선택적 문자열
- **isActive**: 선택적 boolean, 기본값 true
- **difficulty**: 선택적 문자열

#### updateThemeSchema
- **themeId** (params): 필수, UUID 형식
- **name**: 선택적, 최대 50자
- **playTime**: 선택적, 10~180 사이의 정수
- **description**: 선택적 문자열
- **isActive**: 선택적 boolean
- **difficulty**: 선택적 문자열

### Hint 스키마

#### createHintSchema
- **themeId** (params): 필수, UUID 형식
- **code**: 필수, 최대 20자
- **content**: 필수, 최대 500자
- **answer**: 필수, 최대 200자
- **progressRate**: 필수, 0~100 사이의 정수
- **order**: 선택적 정수
- **isActive**: 선택적 boolean, 기본값 true

#### updateHintSchema
- **hintId** (params): 필수, UUID 형식
- **code**: 선택적, 최대 20자
- **content**: 선택적, 최대 500자
- **answer**: 선택적, 최대 200자
- **progressRate**: 선택적, 0~100 사이의 정수
- **order**: 선택적 정수
- **isActive**: 선택적 boolean

#### updateHintOrderSchema
- **hintId** (params): 필수, UUID 형식
- **order**: 필수, 정수

### Session 스키마

#### createSessionSchema
- **themeId**: 필수, UUID 형식

#### useHintSchema
- **sessionId** (params): 필수, UUID 형식
- **code**: 필수, 비어있지 않은 문자열

#### getSessionsQuerySchema
- **status** (query): 선택적, "in_progress" | "completed" | "aborted"

### Auth 스키마

#### adminLoginSchema
- **password**: 필수, 비어있지 않은 문자열

## 에러 처리

검증 실패 시 다음과 같은 형태로 에러가 발생합니다:

```json
{
  "message": "유효하지 않은 요청입니다: name: 테마 이름은 최대 50자까지 가능합니다, playTime: 플레이 시간은 최소 10분 이상이어야 합니다"
}
```

이 에러는 `ValidationError`로 발생하며, `error.middleware.ts`에서 자동으로 400 Bad Request로 처리됩니다.

## 장점

1. **타입 안전성**: TypeScript inference를 통해 자동으로 타입이 추론됩니다
2. **명확한 에러 메시지**: 한국어로 사용자 친화적인 메시지를 제공합니다
3. **재사용성**: 스키마를 여러 곳에서 재사용할 수 있습니다
4. **유지보수성**: 검증 규칙이 한 곳에 집중되어 관리가 쉽습니다
5. **Swagger 일치성**: OpenAPI 스펙과 완벽하게 일치합니다
