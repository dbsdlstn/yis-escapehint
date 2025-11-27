# EscapeHint - 방탈출 힌트 관리 시스템

## 프로젝트 개요

EscapeHint는 방탈출 카페에서 플레이어들에게 실시간으로 힌트를 제공하는 디지털 힌트 관리 시스템입니다. 이 프로젝트는 웹 기반 솔루션으로, 플레이어는 게임 몰입도를 유지하면서 필요한 힌트를 즉시 확인할 수 있고, 관리자는 힌트를 효율적으로 관리할 수 있습니다.

### 주요 특징

1. **플레이어 친화적 인터페이스**: 게임 진행 중 힌트를 쉽게 요청할 수 있음
2. **관리자 대시보드**: 힌트 및 테마를 관리할 수 있는 백오피스
3. **실시간 모니터링**: 진행 중인 게임 세션을 실시간으로 모니터링
4. **힌트 코드 시스템**: 고유 코드를 통해 힌트를 안전하게 제공
5. **진행률 기반 힌트**: 게임 진행률에 따라 적절한 힌트 제공

### 기술 스택

- **Backend**: Node.js, TypeScript, Express.js
- **Frontend**: React, TypeScript, Tailwind CSS
- **Database**: PostgreSQL 16
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Testing**: Playwright, Jest
- **API 문서**: Swagger
- **Build Tool**: Vite

## 프로젝트 구조

```
yis-escapehint/
├── backend/              # 서버 및 API 로직
│   ├── prisma/           # 데이터베이스 스키마 및 마이그레이션
│   ├── src/
│   │   ├── modules/      # 기능 모듈 (themes, hints, sessions, auth)
│   │   ├── shared/       # 공통 유틸리티 및 미들웨어
│   │   └── config/       # 환경 설정
│   └── tests/            # 백엔드 테스트
├── frontend/             # React 프론트엔드 애플리케이션
│   ├── src/
│   │   ├── components/   # React 컴포넌트
│   │   ├── routes/       # 라우트 설정
│   │   ├── stores/       # 상태 관리 (Zustand)
│   │   └── pages/        # 페이지 컴포넌트
│   └── tests/            # 프론트엔드 테스트
├── database/             # 데이터베이스 스키마 SQL 파일
├── docs/                 # 문서
├── swagger/              # API 문서
└── test/                 # 통합 테스트
```

## 데이터베이스 구조

EscapeHint는 PostgreSQL 데이터베이스를 사용하며, 주요 테이블은 다음과 같습니다:

1. **theme** - 방탈출 테마 정보
2. **hint** - 테마별 힌트 정보
3. **game_session** - 플레이어의 게임 진행 상태
4. **hint_usage** - 세션별 힌트 사용 이력

자세한 스키마 정보는 `database/schema.sql` 파일을 참조하세요.

## 개발 환경 설정

### 사전 요구 사항

- Node.js (v18 이상)
- PostgreSQL 16
- Docker (선택사항)

### 백엔드 설정

1. 프로젝트 루트에서 백엔드 디렉토리로 이동:
```bash
cd backend
```

2. 의존성 설치:
```bash
npm install
```

3. 환경 변수 설정 (.env 파일 생성 및 구성):
```bash
# backend/.env 예시
PORT=3000
DATABASE_URL="postgresql://postgres:password@localhost:5432/escapehint"
JWT_SECRET="your-jwt-secret-key"
CORS_ORIGIN="http://localhost:5173,http://localhost:3000"
NODE_ENV="development"
```

4. 데이터베이스 초기화:
```bash
# Docker 사용 시
docker-compose up -d

# 또는 로컬 PostgreSQL 사용
npx prisma migrate dev
```

5. 개발 서버 시작:
```bash
npm run dev
```

### 프론트엔드 설정

1. 프로젝트 루트에서 프론트엔드 디렉토리로 이동:
```bash
cd frontend
```

2. 의존성 설치:
```bash
npm install
```

3. 환경 변수 설정 (.env 파일 생성 및 구성):
```bash
# frontend/.env 예시
VITE_API_BASE_URL=http://localhost:3000
```

4. 개발 서버 시작:
```bash
npm run dev
```

## API 엔드포인트

### 플레이어 API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/themes` | 테마 목록 조회 |
| POST | `/api/sessions` | 게임 세션 시작 |
| GET | `/api/sessions/:sessionId` | 세션 정보 조회 |
| POST | `/api/sessions/:sessionId/hints` | 힌트 사용 |

### 관리자 API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/auth/login` | 관리자 로그인 |
| GET | `/api/admin/themes` | 테마 전체 조회 |
| POST | `/api/admin/themes` | 테마 생성 |
| PUT | `/api/admin/themes/:themeId` | 테마 수정 |
| DELETE | `/api/admin/themes/:themeId` | 테마 삭제 |
| GET | `/api/admin/themes/:themeId/hints` | 특정 테마의 힌트 조회 |
| POST | `/api/admin/themes/:themeId/hints` | 힌트 생성 |
| PUT | `/api/admin/hints/:hintId` | 힌트 수정 |
| DELETE | `/api/admin/hints/:hintId` | 힌트 삭제 |
| PATCH | `/api/admin/hints/:hintId/order` | 힌트 순서 변경 |
| GET | `/api/admin/sessions` | 게임 세션 모니터링 |
| DELETE | `/api/admin/sessions/:sessionId` | 게임 세션 강제 종료 |

API에 대한 자세한 정보는 Swagger 문서를 참조하세요: `http://localhost:3000/api-docs`

## 테스트

### 백엔드 테스트

```bash
# Jest를 사용한 백엔드 유닛 테스트
npm run test
npm run test:watch  # 감시 모드
npm run test:coverage  # 커버리지 보고서
```

### 프론트엔드 테스트

```bash
# Jest를 사용한 프론트엔드 유닛 테스트
npm run test
```

### 통합 테스트

```bash
# Playwright를 사용한 E2E 테스트
npm run test  # 프로젝트 루트에서 실행
npm run test:ui  # UI 모드에서 실행
```

## 빌드 및 배포

### 프론트엔드 빌드

```bash
cd frontend
npm run build
```

### 백엔드 빌드

```bash
cd backend
npm run build
```

### 배포

배포는 Vercel을 사용하여 수행되며, 프론트엔드와 백엔드 모두를 커버하는 방식으로 설정되어 있습니다.

## 개발 규칙

1. **코딩 스타일**: TypeScript ESLint 및 Prettier를 사용한 코드 스타일 통일
2. **네이밍 규칙**: camelCase 사용 (변수, 함수), PascalCase 사용 (컴포넌트)
3. **주석**: 복잡한 로직에는 주석 추가
4. **API 응답**: 공통 응답 형식 사용 (success, message, data, timestamp, statusCode)
5. **테스트 커버리지**: 가능한 한 높은 테스트 커버리지 유지

## 보안 고려사항

1. **JWT 인증**: 관리자 API에 대한 JWT 기반 인증
2. **CORS 설정**: 환경 변수를 통한 안전한 CORS 구성
3. **Helmet 미들웨어**: 보안 헤더 추가
4. **Rate Limiting**: API 요청 제한
5. **SQL Injection 방지**: Prisma ORM 사용

## 환경별 설정

- **Development**: `NODE_ENV=development`
- **Production**: `NODE_ENV=production`

환경에 따라 로깅 수준, CORS 설정, 데이터베이스 연결 등이 달라집니다.

## 프로젝트 지침

- 모든 과정 출력 및 입출력은 한국어로 할 것
- 오버엔지니어링 절대 금지
- 1회성 동작 .js 파일은 동작 후에 자동으로 삭제할 것