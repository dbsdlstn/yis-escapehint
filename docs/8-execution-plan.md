# EscapeHint - 통합 실행계획

## 문서 정보

| 항목              | 내용                                                                                                                        |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **문서 버전**     | 1.0                                                                                                                         |
| **작성일**        | 2025-11-26                                                                                                                  |
| **작성자**        | Architecture Reviewer                                                                                                       |
| **승인자**        | 윤인수                                                                                                                      |
| **문서 상태**     | 최종 승인                                                                                                                   |
| **관련 문서**     | [PRD](./3-prd.md), [프로젝트 구조](./5-project-structure.md), [아키텍처 다이어그램](./6-arch-diagram.md), [ERD](./7-ERD.md) |
| **개발 기간**     | 2025-11-26 ~ 2025-11-28 (3일)                                                                                               |
| **총 Task 수**    | 52개 (DB: 8개, BE: 26개, FE: 18개)                                                                                          |
| **예상 소요시간** | 50-56시간                                                                                                                   |

---

## 개요

본 문서는 EscapeHint MVP 개발을 위한 통합 실행계획입니다. 데이터베이스, 백엔드, 프론트엔드 영역별로 독립적이고 관리 가능한 Task로 분해하였으며, 각 Task별 완료 조건, 의존성, 예상 소요 시간을 명확히 정의했습니다.

### 실행계획 원칙

1. **독립성**: 각 Task는 독립적으로 실행 가능
2. **관리 가능성**: 1-2시간 이내 완료 가능한 크기로 분해
3. **명확성**: 완료 조건을 체크박스 형태로 구체화
4. **추적 가능성**: 의존성 관계를 명확히 정의

---

## 전체 일정 요약

### Phase 1: 데이터베이스 구축 (Day 1 오전)

- **기간**: 2025-11-26 오전
- **소요 시간**: 6-8시간
- **Task 수**: 8개
- **목표**: Prisma 스키마 작성, 마이그레이션 실행, Seed 데이터 삽입

### Phase 2: 백엔드 API 개발 (Day 1 오후 ~ Day 2)

- **기간**: 2025-11-26 오후 ~ 2025-11-27
- **소요 시간**: 20-24시간
- **Task 수**: 26개
- **목표**: RESTful API 구현, 인증, 비즈니스 로직

### Phase 3: 프론트엔드 개발 (Day 2 ~ Day 3)

- **기간**: 2025-11-27 ~ 2025-11-28
- **소요 시간**: 24시간
- **Task 수**: 18개
- **목표**: 플레이어/관리자 UI 구현, 통합 테스트

### Phase 4: 통합 및 배포 (Day 3 오후)

- **기간**: 2025-11-28 오후
- **소요 시간**: 2-3시간
- **목표**: E2E 테스트, Vercel 배포

---

## 영역별 Task 요약

### 데이터베이스 (8개 Task)

| Task ID | Task 이름                         | 소요 시간 | 우선순위 | 의존성 |
| ------- | --------------------------------- | --------- | -------- | ------ |
| DB-001  | 프로젝트 초기 설정 및 Prisma 설치 | 0.5h      | P0       | 없음   |
| DB-002  | Prisma 스키마 작성                | 1.5h      | P0       | DB-001 |
| DB-003  | 환경 변수 설정 및 DB 연결         | 0.5h      | P0       | DB-002 |
| DB-004  | 마이그레이션 생성 및 실행         | 1h        | P0       | DB-003 |
| DB-005  | Seed 데이터 작성 및 실행          | 1h        | P0       | DB-004 |
| DB-006  | 인덱스 최적화 검증                | 0.5h      | P0       | DB-005 |
| DB-007  | 제약 조건 검증                    | 1h        | P0       | DB-006 |
| DB-008  | Prisma Client 생성 및 테스트      | 1.5h      | P0       | DB-007 |

**총 소요 시간**: 7-8시간

### 백엔드 API (26개 Task)

| Task ID | Task 이름                                | 소요 시간 | 우선순위 | 의존성         |
| ------- | ---------------------------------------- | --------- | -------- | -------------- |
| BE-001  | 프로젝트 초기 설정 및 디렉토리 구조 생성 | 0.5h      | P0       | 없음           |
| BE-002  | TypeScript 및 개발 도구 설정             | 0.5h      | P0       | BE-001         |
| BE-003  | Prisma ORM 설정 및 스키마 정의           | 1h        | P0       | BE-002, DB-002 |
| BE-004  | Express 서버 기본 설정                   | 1h        | P0       | BE-003         |
| BE-005  | Winston 로깅 유틸리티 구현               | 0.5h      | P0       | BE-004         |
| BE-006  | 공통 에러 처리 미들웨어 구현             | 1h        | P0       | BE-005         |
| BE-007  | Zod 스키마 검증 미들웨어 구현            | 0.5h      | P0       | BE-006         |
| BE-008  | Rate Limiting 미들웨어 설정              | 0.5h      | P1       | BE-007         |
| BE-009  | JWT 인증 유틸리티 및 미들웨어 구현       | 1h        | P0       | BE-008         |
| BE-010  | bcrypt 비밀번호 유틸리티 구현            | 0.5h      | P0       | BE-009         |
| BE-011  | Theme 도메인 - Service 계층 구현         | 1.5h      | P0       | BE-010         |
| BE-012  | Theme 도메인 - Controller 및 Routes 구현 | 1.5h      | P0       | BE-011         |
| BE-013  | Hint 도메인 - Service 계층 구현          | 1.5h      | P0       | BE-012         |
| BE-014  | Hint 도메인 - Controller 및 Routes 구현  | 1.5h      | P0       | BE-013         |
| BE-015  | Session 도메인 - Service 계층 구현       | 2h        | P0       | BE-014         |
| BE-016  | Session 도메인 - Controller 및 Routes    | 1.5h      | P0       | BE-015         |
| BE-017  | Auth 도메인 - Service 계층 구현          | 1h        | P0       | BE-016         |
| BE-018  | Auth 도메인 - Controller 및 Routes       | 1h        | P0       | BE-017         |
| BE-019  | Prisma 마이그레이션 실행 및 시드 데이터  | 1h        | P0       | BE-018, DB-008 |
| BE-020  | 통합 테스트 작성 (API 엔드포인트)        | 2h        | P1       | BE-019         |
| BE-021  | 환경변수 관리 및 설정 파일 정리          | 0.5h      | P0       | BE-020         |
| BE-022  | API 응답 포맷 표준화                     | 0.5h      | P1       | BE-021         |
| BE-023  | CORS 설정 최적화                         | 0.5h      | P0       | BE-022         |
| BE-024  | API 문서화 (README 및 Postman)           | 1h        | P1       | BE-023         |
| BE-025  | 로컬 개발 환경 검증 및 배포 준비         | 1h        | P0       | BE-024         |
| BE-026  | 성능 최적화 및 보안 점검                 | 1.5h      | P1       | BE-025         |

**총 소요 시간**: 20-24시간

### 프론트엔드 (18개 Task)

| Task ID | Task 이름                               | 소요 시간 | 우선순위 | 의존성         |
| ------- | --------------------------------------- | --------- | -------- | -------------- |
| FE-001  | 프로젝트 초기 설정 및 개발 환경 구성    | 1h        | P0       | 없음           |
| FE-002  | Tailwind CSS 설정 및 다크모드 구성      | 0.5h      | P0       | FE-001         |
| FE-003  | 프로젝트 디렉토리 구조 생성             | 0.5h      | P0       | FE-001         |
| FE-004  | 공통 UI 컴포넌트 구현                   | 2h        | P0       | FE-002, FE-003 |
| FE-005  | API 클라이언트 (Axios) 설정             | 1h        | P0       | FE-001, FE-003 |
| FE-006  | 도메인별 API 서비스 구현                | 2h        | P0       | FE-005         |
| FE-007  | Zustand 스토어 구현                     | 1.5h      | P0       | FE-003         |
| FE-008  | 커스텀 훅 구현                          | 2h        | P0       | FE-006, FE-007 |
| FE-009  | 플레이어 페이지 - 테마 선택 화면 구현   | 2h        | P0       | FE-004, FE-006 |
| FE-010  | 플레이어 페이지 - 게임 플레이 화면 구현 | 3h        | P0       | FE-008, FE-009 |
| FE-011  | 플레이어 페이지 - 힌트 표시 화면 구현   | 2h        | P0       | FE-010         |
| FE-012  | 관리자 페이지 - 로그인 화면 구현        | 1.5h      | P0       | FE-004, FE-008 |
| FE-013  | 관리자 페이지 - 대시보드 구현           | 1.5h      | P0       | FE-012         |
| FE-014  | 관리자 페이지 - 테마 관리 화면 구현     | 3h        | P0       | FE-013         |
| FE-015  | 관리자 페이지 - 힌트 관리 화면 구현     | 3.5h      | P0       | FE-014         |
| FE-016  | React Router 설정 및 라우팅 구현        | 1h        | P0       | FE-011, FE-015 |
| FE-017  | 유틸리티 함수 구현                      | 1h        | P0       | FE-003         |
| FE-018  | 통합 테스트 및 버그 수정                | 2h        | P0       | FE-016         |

**총 소요 시간**: 24시간

---

## 상세 실행계획 참조

각 영역별 상세 Task 설명은 다음을 참조하세요:

### 데이터베이스 실행계획

[데이터베이스 실행계획 상세 문서](#데이터베이스-실행계획)에서 DB-001 ~ DB-008 Task의 완료 조건, 구현 가이드를 확인할 수 있습니다.

### 백엔드 실행계획

[백엔드 실행계획 상세 문서](#백엔드-실행계획)에서 BE-001 ~ BE-026 Task의 완료 조건, API 엔드포인트, 구현 가이드를 확인할 수 있습니다.

### 프론트엔드 실행계획

[프론트엔드 실행계획 상세 문서](#프론트엔드-실행계획)에서 FE-001 ~ FE-018 Task의 완료 조건, 컴포넌트 구조, 구현 가이드를 확인할 수 있습니다.

---

## 전체 의존성 다이어그램

```
Day 1 (2025-11-26)
==================

Morning (Database)
------------------
DB-001 → DB-002 → DB-003 → DB-004 → DB-005 → DB-006 → DB-007 → DB-008

Afternoon (Backend Start)
--------------------------
BE-001 → BE-002 → BE-003 (depends on DB-002)
                    ↓
                  BE-004 → BE-005 → BE-006 → BE-007 → BE-008 → BE-009 → BE-010
                                                                            ↓
                                                                          BE-011 → BE-012
                                                                            ↓
                                                                          BE-013 → BE-014
                                                                            ↓
                                                                          BE-015 → BE-016

Day 2 (2025-11-27)
==================

Morning (Backend Continue)
--------------------------
BE-017 → BE-018 → BE-019 (depends on DB-008)
                    ↓
                  BE-020 → BE-021 → BE-022 → BE-023 → BE-024 → BE-025 → BE-026

Afternoon (Frontend Start)
---------------------------
FE-001 ┬→ FE-002 → FE-004 ──────┬→ FE-009 → FE-010 → FE-011
       └→ FE-003 → FE-005 → FE-006 ──┬→ FE-008 ──────┘
                 ↓                    │
               FE-007 ────────────────┘
               FE-017 → FE-008

Day 3 (2025-11-28)
==================

Morning (Frontend Continue)
---------------------------
FE-008 → FE-012 → FE-013 → FE-014 → FE-015
                              ↓        ↓
                           FE-011  FE-015
                              ↓        ↓
                            FE-016 (Router)
                              ↓
                            FE-018 (Testing)

Afternoon (Integration & Deployment)
------------------------------------
[All Tasks Complete] → E2E Testing → Vercel Deployment
```

---

## 일별 체크리스트

### Day 1 (2025-11-26) - 데이터베이스 + 백엔드 기초

#### Morning (Database - 8시간)

- [ ] **DB-001**: 프로젝트 초기 설정 및 Prisma 설치
- [ ] **DB-002**: Prisma 스키마 작성 (Theme, Hint, GameSession, HintUsage)
- [ ] **DB-003**: 환경 변수 설정 및 Supabase 연결
- [ ] **DB-004**: 마이그레이션 실행
- [ ] **DB-005**: Seed 데이터 삽입
- [ ] **DB-006**: 인덱스 검증 (7개 인덱스)
- [ ] **DB-007**: 제약 조건 검증 (UNIQUE, CHECK, FK)
- [ ] **DB-008**: Prisma Client 테스트 쿼리 성공

#### Afternoon (Backend - 8시간)

- [ ] **BE-001**: 백엔드 프로젝트 초기화
- [ ] **BE-002**: TypeScript, ESLint, Prettier 설정
- [ ] **BE-003**: Prisma 연동
- [ ] **BE-004**: Express 서버 기본 설정
- [ ] **BE-005**: Winston 로깅
- [ ] **BE-006**: 에러 처리 미들웨어
- [ ] **BE-007**: Zod 검증 미들웨어
- [ ] **BE-008**: Rate Limiting
- [ ] **BE-009**: JWT 인증 미들웨어
- [ ] **BE-010**: bcrypt 유틸리티

---

### Day 2 (2025-11-27) - 백엔드 완료 + 프론트엔드 시작

#### Morning (Backend - 8시간)

- [ ] **BE-011**: Theme Service
- [ ] **BE-012**: Theme Controller/Routes
- [ ] **BE-013**: Hint Service
- [ ] **BE-014**: Hint Controller/Routes
- [ ] **BE-015**: Session Service (핵심 비즈니스 로직)
- [ ] **BE-016**: Session Controller/Routes
- [ ] **BE-017**: Auth Service
- [ ] **BE-018**: Auth Controller/Routes

#### Afternoon (Backend + Frontend - 8시간)

- [ ] **BE-019**: Prisma 마이그레이션 & 시드
- [ ] **BE-020**: 통합 테스트
- [ ] **BE-021**: 환경변수 정리
- [ ] **BE-022**: API 응답 표준화
- [ ] **BE-023**: CORS 설정
- [ ] **BE-024**: API 문서화
- [ ] **BE-025**: 배포 준비
- [ ] **BE-026**: 성능 최적화

**또는 Frontend 시작:**

- [ ] **FE-001**: 프로젝트 초기 설정
- [ ] **FE-002**: Tailwind CSS 설정
- [ ] **FE-003**: 디렉토리 구조
- [ ] **FE-004**: 공통 UI 컴포넌트
- [ ] **FE-005**: API 클라이언트
- [ ] **FE-006**: 도메인 API 서비스
- [ ] **FE-017**: 유틸리티 함수

---

### Day 3 (2025-11-28) - 프론트엔드 완료 + 통합

#### Morning (Frontend - 8시간)

- [ ] **FE-007**: Zustand 스토어
- [ ] **FE-008**: 커스텀 훅 (useTimer, useGameSession, useAuth)
- [ ] **FE-009**: 플레이어 - 테마 선택 화면
- [ ] **FE-010**: 플레이어 - 게임 플레이 화면 (타이머, 힌트 입력)
- [ ] **FE-011**: 플레이어 - 힌트 표시 화면

#### Afternoon (Frontend + Integration - 6시간)

- [ ] **FE-012**: 관리자 - 로그인 화면
- [ ] **FE-013**: 관리자 - 대시보드
- [ ] **FE-014**: 관리자 - 테마 관리
- [ ] **FE-015**: 관리자 - 힌트 관리
- [ ] **FE-016**: React Router 설정
- [ ] **FE-018**: 통합 테스트 및 버그 수정

#### Evening (Deployment - 2시간)

- [ ] E2E 테스트 (플레이어 + 관리자 플로우)
- [ ] Vercel 배포 (Frontend + Backend)
- [ ] 환경변수 설정 (Vercel 대시보드)
- [ ] 프로덕션 환경 검증
- [ ] 배포 완료 및 문서화

---

## 핵심 체크포인트

### Milestone 1: 데이터베이스 완료 (Day 1 오전)

- [ ] Supabase에 4개 테이블 생성 확인
- [ ] Seed 데이터 3개 테마, 9개 힌트 삽입 확인
- [ ] Prisma Studio로 데이터 확인
- [ ] Prisma Client 테스트 쿼리 성공

### Milestone 2: 백엔드 API 완료 (Day 2 오전)

- [ ] 플레이어 API 4개 엔드포인트 작동 확인
  - GET /api/themes
  - POST /api/sessions
  - GET /api/sessions/:id
  - POST /api/sessions/:id/hints
- [ ] 관리자 API 10개 엔드포인트 작동 확인
  - POST /api/admin/auth/login
  - Theme CRUD (4개)
  - Hint CRUD (4개)
  - Session 관리 (2개)
- [ ] JWT 인증 작동 확인
- [ ] Postman Collection 완성

### Milestone 3: 프론트엔드 플레이어 화면 완료 (Day 2 오후)

- [ ] 테마 선택 화면 작동
- [ ] 게임 플레이 화면 작동
- [ ] 타이머 정확도 확인 (±2초)
- [ ] 힌트 조회 및 정답 표시 작동
- [ ] 세션 복구 기능 작동 (localStorage)

### Milestone 4: 프론트엔드 관리자 화면 완료 (Day 3 오전)

- [ ] 관리자 로그인 작동
- [ ] 테마 CRUD 작동
- [ ] 힌트 CRUD 작동
- [ ] 힌트 순서 조정 작동

### Milestone 5: 배포 완료 (Day 3 오후)

- [ ] Vercel 배포 성공
- [ ] 프로덕션 환경에서 플레이어 플로우 정상 작동
- [ ] 프로덕션 환경에서 관리자 플로우 정상 작동
- [ ] 모바일 반응형 확인
- [ ] 다크모드 확인

---

## 리스크 관리

### High Risk (높은 우선순위로 해결)

| 리스크                   | 영향도 | 완화 전략                            |
| ------------------------ | ------ | ------------------------------------ |
| 타이머 정확도 문제       | 높음   | 60초마다 서버 동기화, 테스트 강화    |
| 세션 복구 실패           | 높음   | localStorage 백업, 에러 핸들링 강화  |
| JWT 인증 버그            | 높음   | 테스트 케이스 작성, Postman 검증     |
| Prisma 마이그레이션 실패 | 높음   | 로컬 테스트 후 프로덕션 적용         |
| Vercel 배포 실패         | 중간   | 로컬 빌드 테스트, 환경변수 사전 확인 |

### Medium Risk (모니터링)

| 리스크                      | 영향도 | 완화 전략                         |
| --------------------------- | ------ | --------------------------------- |
| API 응답 시간 초과 (>200ms) | 중간   | Prisma 쿼리 최적화, 인덱스 활용   |
| 브라우저 호환성 문제        | 중간   | 지원 브라우저 명시, Polyfill 추가 |
| 다크모드 스타일 버그        | 낮음   | 테스트 강화                       |

---

## Critical Files (우선순위 파일)

개발 시 가장 중요하게 다뤄야 할 파일들:

### 데이터베이스

1. **`backend/prisma/schema.prisma`** - 모든 데이터 구조의 기반
2. **`backend/prisma/seed.ts`** - 초기 데이터 및 테스트 데이터

### 백엔드

1. **`backend/src/app.ts`** - Express 앱 설정, 모든 미들웨어/라우트 등록
2. **`backend/src/modules/session/session.service.ts`** - 핵심 비즈니스 로직
3. **`backend/src/shared/middlewares/auth.middleware.ts`** - JWT 인증 처리
4. **`backend/src/shared/middlewares/error.middleware.ts`** - 전역 에러 처리
5. **`backend/.env`** - 환경변수 (DATABASE_URL, JWT_SECRET 등)

### 프론트엔드

1. **`frontend/src/services/api/apiClient.ts`** - 모든 API 호출의 기반
2. **`frontend/src/stores/sessionStore.ts`** - 세션 복구 및 상태 관리
3. **`frontend/src/hooks/useTimer.ts`** - 타이머 정확도
4. **`frontend/src/pages/player/GamePlayPage.tsx`** - 플레이어 메인 화면
5. **`frontend/src/routes/index.tsx`** - 라우팅 설정

---

## 개발 환경 요구사항

### 필수 소프트웨어

- [ ] Node.js 20.x LTS
- [ ] pnpm (패키지 매니저)
- [ ] Git
- [ ] VS Code (권장 에디터)
- [ ] PostgreSQL 클라이언트 (DBeaver 또는 Prisma Studio)

### 계정 및 서비스

- [ ] Supabase 계정 (무료 티어)
- [ ] Vercel 계정 (무료 티어)
- [ ] GitHub 리포지토리

### VS Code 확장 (권장)

- [ ] Prisma
- [ ] ESLint
- [ ] Prettier
- [ ] Tailwind CSS IntelliSense
- [ ] TypeScript and JavaScript Language Features

---

## 다음 단계 (MVP 이후)

### 2차 버전 (2026 Q1)

- 세션 모니터링 고도화 (실시간 WebSocket)
- 통계 대시보드 (테마별 힌트 사용 분석)
- 이미지 힌트 지원 (Cloudinary 연동)
- 대량 힌트 등록 (CSV 업로드)

### 3차 버전 (2026 Q2)

- PWA 지원 (오프라인 사용)
- 다국어 지원 (i18n)
- 2FA 인증 (관리자 보안 강화)
- 동적 힌트 코드 (세션별 고유 코드)

---

## 문서 승인

본 문서는 EscapeHint 프로젝트의 공식 통합 실행계획 문서입니다.

**승인자**: 윤인수
**승인일**: 2025-11-26
**문서 상태**: 최종 승인 완료

---

**문서 끝**
