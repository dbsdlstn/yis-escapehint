# EscapeHint Backend

EscapeHint는 방탈출 카페에서 플레이어들에게 실시간으로 힌트를 제공하는 디지털 힌트 관리 시스템입니다.

## 기술 스택

- Node.js (v20.x 이상)
- TypeScript
- Express.js
- PostgreSQL (Supabase)
- Prisma ORM
- JWT 인증
- Zod (환경변수 검증)
- Winston (로깅)
- Jest (테스트)

## 설치 및 설정

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 `.env.example` 파일을 참고하여 필요한 환경 변수를 설정하세요:

```env
# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/escapehint"

# JWT Configuration
JWT_SECRET="very_long_secret_key_for_jwt_tokens_at_least_32_characters_long"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Admin Configuration
ADMIN_PASSWORD="admin123"

# CORS Configuration
CORS_ORIGIN="http://localhost:3000,http://localhost:3001,https://*.vercel.app"

# Application Configuration
NODE_ENV="development"
LOG_LEVEL="info"
PORT=3000
```

### 3. Prisma 데이터베이스 마이그레이션

```bash
npx prisma migrate dev
```

### 4. 시드 데이터 삽입 (선택 사항)

```bash
npm run seed
```

## 실행

### 개발 모드

```bash
npm run dev
```

### 프로덕션 모드

1. 빌드

```bash
npm run build
```

2. 실행

```bash
npm start
```

서버는 기본적으로 `PORT` 환경변수에 설정된 포트(기본값 3000)에서 실행됩니다.

## API 문서

API 문서는 Swagger를 통해 관리됩니다. 서버 실행 후 `http://localhost:3000/api/docs` 경로에서 확인할 수 있습니다.

## 테스트

```bash
# 모든 테스트 실행
npm test

# 감시 모드로 테스트 실행
npm run test:watch

# 커버리지 보고서 생성
npm run test:coverage
```

## 배포

### Vercel에 배포

이 프로젝트는 Vercel에 배포할 수 있도록 구성되어 있습니다.

1. Vercel CLI 설치

```bash
npm i -g vercel
```

2. 프로젝트 디렉터리에서 배포

```bash
vercel
```

3. 환경 변수 설정

Vercel 대시보드에서 다음과 같은 환경 변수를 설정해야 합니다:

- `DATABASE_URL`: PostgreSQL 데이터베이스 URL
- `JWT_SECRET`: JWT 토큰 생성을 위한 시크릿 키
- `ADMIN_PASSWORD`: 관리자 로그인 비밀번호
- `CORS_ORIGIN`: 프론트엔드 도메인 (예: https://your-frontend.vercel.app)
- `NODE_ENV`: `production`
- `LOG_LEVEL`: `info`

### 마이그레이션 배포

배포 후 데이터베이스 마이그레이션을 실행해야 합니다:

```bash
npx prisma migrate deploy
```

## 폴더 구조

```
src/
├── app.ts                 # Express 애플리케이션 진입점
├── config/                # 환경 설정
│   └── env.config.ts      # 환경 변수 검증
├── modules/               # 기능별 모듈
│   ├── auth/             # 인증 모듈
│   ├── hint/             # 힌트 모듈
│   ├── session/          # 세션 모듈
│   └── theme/            # 테마 모듈
└── shared/               # 공통 유틸리티
    ├── middleware/       # 미들웨어
    ├── utils/            # 유틸리티 함수
    └── errors/           # 커스텀 에러
```

## API 엔드포인트

### 플레이어 API

- `GET /themes` - 플레이 가능한 테마 목록
- `POST /sessions` - 새 게임 세션 시작
- `GET /sessions/:id` - 세션 상세 정보
- `POST /sessions/:id/hints` - 힌트 사용

### 관리자 API

- `POST /admin/auth/login` - 관리자 로그인
- `GET /admin/themes` - 모든 테마 목록
- `POST /admin/themes` - 테마 생성
- `PUT /admin/themes/:id` - 테마 수정
- `DELETE /admin/themes/:id` - 테마 삭제
- `GET /admin/themes/:themeId/hints` - 테마별 힌트 목록
- `POST /admin/themes/:themeId/hints` - 힌트 생성
- `PUT /admin/hints/:id` - 힌트 수정
- `DELETE /admin/hints/:id` - 힌트 삭제
- `PATCH /admin/hints/:id/order` - 힌트 순서 변경
- `GET /admin/sessions` - 세션 모니터링
- `DELETE /admin/sessions/:id` - 세션 강제 종료

## 보안

- Helmet.js를 사용하여 보안 헤더 추가
- Rate limiting: 100 요청/분
- JWT 인증 사용
- 환경변수 유효성 검사
- 입력값 검증(Zod)

## 로깅

Winston을 사용하여 로그를 기록합니다. 로그 파일은 `logs/` 디렉터리에 생성됩니다.

## 오류 처리

커스텀 에러 핸들링 미들웨어를 사용하여 일관된 오류 응답 형식을 제공합니다.