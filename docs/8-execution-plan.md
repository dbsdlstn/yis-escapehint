# EscapeHint - 통합 실행계획

## 문서 정보

| 항목              | 내용                                                                                                                        |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **문서 버전**     | 1.1 (검토 반영)                                                                                                             |
| **작성일**        | 2025-11-26                                                                                                                  |
| **최종 수정일**   | 2025-11-26                                                                                                                  |
| **작성자**        | Architecture Reviewer                                                                                                       |
| **승인자**        | 윤인수                                                                                                                      |
| **문서 상태**     | 아키텍처 검토 완료 (수정 반영)                                                                                              |
| **관련 문서**     | [PRD](./3-prd.md), [프로젝트 구조](./5-project-structure.md), [아키텍처 다이어그램](./6-arch-diagram.md), [ERD](./7-ERD.md) |
| **개발 기간**     | 2025-11-26 ~ 2025-11-28 (3일)                                                                                               |
| **총 Task 수**    | 60개 (DB: 9개, BE: 26개, FE: 18개, 배포: 7개)                                                                               |
| **예상 소요시간** | 56-62시간                                                                                                                   |

---

## 변경 이력 (v1.1)

### 주요 수정 사항

1. **DB Task 추가**: DB-009 (비즈니스 규칙 제약 조건 검증) 추가
2. **Backend Task 수정**:
   - BE-005: Winston 로깅 시간 0.5h → 1h 증가
   - BE-008: Rate Limiting 우선순위 P1 → P0 상향
   - BE-013, BE-015: 비즈니스 규칙 검증 완료 조건 추가
   - BE-021: 환경변수 검증 로직 추가
   - BE-026: 성능 측정 완료 조건 추가
3. **Frontend Task 수정**:
   - FE-004: 접근성 요구사항 추가 (터치 영역, 대비율)
   - FE-010: 타이머 정확도 테스트 추가
   - FE-011: DOMPurify XSS 방지 추가
   - FE-016: 의존성 명확화
4. **배포 Task 세부화**: Phase 4에 7개 Task 추가 (환경변수, 빌드, 마이그레이션, E2E 테스트 등)

---

## 개요

본 문서는 EscapeHint MVP 개발을 위한 통합 실행계획입니다. 데이터베이스, 백엔드, 프론트엔드 영역별로 독립적이고 관리 가능한 Task로 분해하였으며, 각 Task별 완료 조건, 의존성, 예상 소요 시간을 명확히 정의했습니다.

### 실행계획 원칙

1. **독립성**: 각 Task는 독립적으로 실행 가능
2. **관리 가능성**: 1-2시간 이내 완료 가능한 크기로 분해
3. **명확성**: 완료 조건을 체크박스 형태로 구체화
4. **추적 가능성**: 의존성 관계를 명확히 정의
5. **비즈니스 규칙 반영**: 도메인 정의서 BR-01~BR-09 준수

---

## 전체 일정 요약

### Phase 1: 데이터베이스 구축 (Day 1 오전)

- **기간**: 2025-11-26 오전
- **소요 시간**: 8-10시간
- **Task 수**: 9개 (DB-001 ~ DB-009)
- **목표**: Prisma 스키마 작성, 마이그레이션 실행, Seed 데이터 삽입, 비즈니스 규칙 검증

### Phase 2: 백엔드 API 개발 (Day 1 오후 ~ Day 2)

- **기간**: 2025-11-26 오후 ~ 2025-11-27
- **소요 시간**: 22-26시간
- **Task 수**: 26개 (BE-001 ~ BE-026)
- **목표**: RESTful API 구현, JWT 인증, 비즈니스 로직, 보안 미들웨어

### Phase 3: 프론트엔드 개발 (Day 2 ~ Day 3)

- **기간**: 2025-11-27 ~ 2025-11-28
- **소요 시간**: 24시간
- **Task 수**: 18개 (FE-001 ~ FE-018)
- **목표**: 플레이어/관리자 UI 구현, 접근성 준수, XSS 방지

### Phase 4: 통합 및 배포 (Day 3 오후)

- **기간**: 2025-11-28 오후
- **소요 시간**: 4-6시간
- **Task 수**: 7개 (DEPLOY-001 ~ DEPLOY-007)
- **목표**: 환경변수 설정, 프로덕션 빌드, DB 마이그레이션, E2E 테스트, Vercel 배포

---

## 영역별 Task 요약

### 데이터베이스 (9개 Task)

| Task ID | Task 이름                         | 소요 시간 | 우선순위 | 의존성 | 변경 사항             |
| ------- | --------------------------------- | --------- | -------- | ------ | --------------------- |
| DB-001  | 프로젝트 초기 설정 및 Prisma 설치 | 0.5h      | P0       | 없음   | -                     |
| DB-002  | Prisma 스키마 작성                | 2h        | P0       | DB-001 | 시간 증가 (HintUsage) |
| DB-003  | 환경 변수 설정 및 DB 연결         | 0.5h      | P0       | DB-002 | -                     |
| DB-004  | 마이그레이션 생성 및 실행         | 1h        | P0       | DB-003 | -                     |
| DB-005  | Seed 데이터 작성 및 실행          | 1h        | P0       | DB-004 | -                     |
| DB-006  | 인덱스 최적화 검증                | 0.5h      | P0       | DB-005 | -                     |
| DB-007  | 제약 조건 검증                    | 1h        | P0       | DB-006 | -                     |
| DB-008  | Prisma Client 생성 및 테스트      | 1.5h      | P0       | DB-007 | -                     |
| DB-009  | 비즈니스 규칙 제약 조건 검증      | 1h        | P0       | DB-008 | **신규 추가**         |

**총 소요 시간**: 9시간

---

### 백엔드 API (26개 Task)

| Task ID | Task 이름                                | 소요 시간 | 우선순위 | 의존성         | 변경 사항                 |
| ------- | ---------------------------------------- | --------- | -------- | -------------- | ------------------------- |
| BE-001  | 프로젝트 초기 설정 및 디렉토리 구조 생성 | 0.5h      | P0       | 없음           | -                         |
| BE-002  | TypeScript 및 개발 도구 설정             | 0.5h      | P0       | BE-001         | -                         |
| BE-003  | Prisma ORM 설정 및 스키마 정의           | 1h        | P0       | BE-002, DB-005 | 의존성 수정 (DB-005)      |
| BE-004  | Express 서버 기본 설정                   | 1h        | P0       | BE-003         | -                         |
| BE-005  | Winston 로깅 유틸리티 구현               | 1h        | P0       | BE-004         | **시간 증가 (0.5h→1h)**   |
| BE-006  | 공통 에러 처리 및 보안 미들웨어 구현     | 1.5h      | P0       | BE-005         | **helmet 추가, 시간증가** |
| BE-007  | Zod 스키마 검증 미들웨어 구현            | 0.5h      | P0       | BE-006         | -                         |
| BE-008  | Rate Limiting 미들웨어 설정              | 0.5h      | P0       | BE-007         | **우선순위 P1→P0**        |
| BE-009  | JWT 인증 유틸리티 및 미들웨어 구현       | 1h        | P0       | BE-008         | -                         |
| BE-010  | bcrypt 비밀번호 유틸리티 구현            | 0.5h      | P0       | BE-009         | -                         |
| BE-011  | Theme 도메인 - Service 계층 구현         | 1.5h      | P0       | BE-010         | -                         |
| BE-012  | Theme 도메인 - Controller 및 Routes 구현 | 1.5h      | P0       | BE-011         | -                         |
| BE-013  | Hint 도메인 - Service 계층 구현          | 2h        | P0       | BE-012         | **BR-01,BR-06 추가**      |
| BE-014  | Hint 도메인 - Controller 및 Routes 구현  | 1.5h      | P0       | BE-013         | -                         |
| BE-015  | Session 도메인 - Service 계층 구현       | 2.5h      | P0       | BE-014         | **BR-03,BR-04,BR-07추가** |
| BE-016  | Session 도메인 - Controller 및 Routes    | 1.5h      | P0       | BE-015         | -                         |
| BE-017  | Auth 도메인 - Service 계층 구현          | 1h        | P0       | BE-016         | -                         |
| BE-018  | Auth 도메인 - Controller 및 Routes       | 1h        | P0       | BE-017         | -                         |
| BE-019  | Prisma 마이그레이션 실행 및 시드 데이터  | 1h        | P0       | BE-018, DB-009 | 의존성 수정 (DB-009)      |
| BE-020  | 통합 테스트 작성 (API 엔드포인트)        | 2h        | P1       | BE-019         | -                         |
| BE-021  | 환경변수 관리 및 검증 로직 구현          | 1h        | P0       | BE-020         | **검증 로직 추가**        |
| BE-022  | API 응답 포맷 표준화                     | 0.5h      | P1       | BE-021         | -                         |
| BE-023  | CORS 설정 최적화                         | 0.5h      | P0       | BE-022         | -                         |
| BE-024  | API 문서화 (README 및 Postman)           | 1h        | P1       | BE-023         | -                         |
| BE-025  | 로컬 개발 환경 검증 및 배포 준비         | 1h        | P0       | BE-024         | -                         |
| BE-026  | 성능 최적화 및 보안 점검                 | 2h        | P1       | BE-025         | **성능 측정 추가**        |

**총 소요 시간**: 26시간

---

### 프론트엔드 (18개 Task)

| Task ID | Task 이름                               | 소요 시간 | 우선순위 | 의존성         | 변경 사항                |
| ------- | --------------------------------------- | --------- | -------- | -------------- | ------------------------ |
| FE-001  | 프로젝트 초기 설정 및 개발 환경 구성    | 1h        | P0       | 없음           | -                        |
| FE-002  | Tailwind CSS 설정 및 다크모드 구성      | 0.5h      | P0       | FE-001         | -                        |
| FE-003  | 프로젝트 디렉토리 구조 생성             | 0.5h      | P0       | FE-001         | -                        |
| FE-004  | 공통 UI 컴포넌트 구현                   | 2.5h      | P0       | FE-002, FE-003 | **접근성 요구사항 추가** |
| FE-005  | API 클라이언트 (Axios) 설정             | 1h        | P0       | FE-001, FE-003 | -                        |
| FE-006  | 도메인별 API 서비스 구현                | 2h        | P0       | FE-005         | -                        |
| FE-007  | Zustand 스토어 구현                     | 1.5h      | P0       | FE-003         | -                        |
| FE-008  | 커스텀 훅 구현                          | 2h        | P0       | FE-006, FE-007 | -                        |
| FE-009  | 플레이어 페이지 - 테마 선택 화면 구현   | 2h        | P0       | FE-004, FE-006 | -                        |
| FE-010  | 플레이어 페이지 - 게임 플레이 화면 구현 | 3.5h      | P0       | FE-008, FE-009 | **타이머 정확도 테스트** |
| FE-011  | 플레이어 페이지 - 힌트 표시 화면 구현   | 2.5h      | P0       | FE-010         | **DOMPurify XSS 방지**   |
| FE-012  | 관리자 페이지 - 로그인 화면 구현        | 1.5h      | P0       | FE-004, FE-008 | -                        |
| FE-013  | 관리자 페이지 - 대시보드 구현           | 1.5h      | P0       | FE-012         | -                        |
| FE-014  | 관리자 페이지 - 테마 관리 화면 구현     | 3h        | P0       | FE-013         | -                        |
| FE-015  | 관리자 페이지 - 힌트 관리 화면 구현     | 3.5h      | P0       | FE-014         | -                        |
| FE-016  | React Router 설정 및 라우팅 구현        | 1h        | P0       | FE-011~FE-015  | **의존성 명확화**        |
| FE-017  | 유틸리티 함수 구현                      | 1h        | P0       | FE-003         | -                        |
| FE-018  | 통합 테스트 및 버그 수정                | 2h        | P0       | FE-016         | -                        |

**총 소요 시간**: 27시간

---

### 배포 및 통합 (7개 Task)

| Task ID    | Task 이름                           | 소요 시간 | 우선순위 | 의존성         | 변경 사항     |
| ---------- | ----------------------------------- | --------- | -------- | -------------- | ------------- |
| DEPLOY-001 | Vercel 환경변수 설정                | 0.5h      | P0       | BE-025         | **신규 추가** |
| DEPLOY-002 | 프로덕션 빌드 테스트 (로컬)         | 1h        | P0       | FE-018, BE-026 | **신규 추가** |
| DEPLOY-003 | DB 마이그레이션 프로덕션 적용       | 0.5h      | P0       | DEPLOY-001     | **신규 추가** |
| DEPLOY-004 | Seed 데이터 프로덕션 DB 삽입        | 0.5h      | P0       | DEPLOY-003     | **신규 추가** |
| DEPLOY-005 | E2E 테스트 (플레이어+관리자 플로우) | 2h        | P1       | DEPLOY-002     | **신규 추가** |
| DEPLOY-006 | Vercel 배포 및 검증                 | 1h        | P0       | DEPLOY-004     | **신규 추가** |
| DEPLOY-007 | 프로덕션 환경 최종 검증             | 0.5h      | P0       | DEPLOY-006     | **신규 추가** |

**총 소요 시간**: 6시간

---

## 상세 Task 정의

---

## 데이터베이스 실행계획

### DB-002: Prisma 스키마 작성 ✅ 완료

**소요 시간**: 2h | **우선순위**: P0 | **의존성**: DB-001

**완료 조건**:

- [x] **4개 테이블 정의**: Theme, Hint, GameSession, HintUsage
- [x] **관계 정의**: Theme 1:N Hint, Theme 1:N GameSession, GameSession 1:N HintUsage, Hint 1:N HintUsage
- [x] **비즈니스 규칙 반영**: BR-01 `@@unique([themeId, code])`, BR-04 `@@unique([sessionId, hintId])`
- [x] **인덱스 추가**: Theme.isActive, Hint.themeId+code, GameSession.themeId+status, HintUsage.sessionId+hintId

---

### DB-009: 비즈니스 규칙 제약 조건 검증 ✅ 완료

**소요 시간**: 1h | **우선순위**: P0 | **의존성**: DB-008

**완료 조건**:

- [x] **BR-01: 힌트 코드 고유성 검증** - 동일 테마 내 중복 코드 차단, 다른 테마 간 허용
- [x] **BR-04: 힌트 중복 사용 방지 검증** - 동일 세션에서 동일 힌트 재사용 차단
- [x] **BR-07: 세션 복구 데이터 무결성 검증** - startTime, usedHintCount, status 정확성
- [x] **Cascade Delete 검증** - Theme 삭제 시 Hint 삭제, GameSession 삭제 시 HintUsage 삭제
- [x] **인덱스 성능 테스트** - 쿼리 실행 계획 확인

---

## 백엔드 실행계획

### BE-005: Winston 로깅 유틸리티 구현 ✅ 완료

**소요 시간**: 1h | **우선순위**: P0 | **의존성**: BE-004

**완료 조건**:

- [x] Winston 설정 파일 작성 (`src/shared/utils/logger.util.ts`)
- [x] 로그 레벨 설정 (error, warn, info, debug)
- [x] 전송 방식 설정 (Console, File: error.log, combined.log)
- [x] JSON 포맷 및 타임스탬프 포함
- [x] 로그 디렉토리 생성
- [x] 환경변수 기반 로그 레벨 설정
- [x] 테스트 완료

---

### BE-006: 공통 에러 처리 및 보안 미들웨어 구현 ✅ 완료

**소요 시간**: 1.5h | **우선순위**: P0 | **의존성**: BE-005

**완료 조건**:

- [x] helmet 보안 헤더 설정 (CSP, XSS 방지, HTTPS)
- [x] 커스텀 에러 클래스 작성 (AppError, HintNotFoundError, UnauthorizedError, ValidationError)
- [x] 전역 에러 핸들러 미들웨어 작성
- [x] Winston 로거 연동
- [x] 테스트 완료

---

### BE-007: Zod 스키마 검증 미들웨어 구현 ✅ 완료

**소요 시간**: 0.5h | **우선순위**: P0 | **의존성**: BE-006

**완료 조건**:

- [x] Zod 라이브러리 설치
- [x] Request Body 검증 미들웨어 작성
- [x] 도메인별 스키마 정의
- [x] 검증 실패 시 400 에러 반환
- [x] 테스트 완료

---

### BE-008: Rate Limiting 미들웨어 설정 ✅ 완료

**소요 시간**: 0.5h | **우선순위**: P0 | **의존성**: BE-007

**완료 조건**:

- [x] `express-rate-limit` 라이브러리 설치
- [x] API Rate Limiter 설정 (100 요청/분)
- [x] 모든 API 라우트에 적용
- [x] 초과 시 429 에러 반환
- [x] 로그인 엔드포인트에 엄격한 Rate Limiter 적용 (15분당 5 요청)

---

### BE-009: JWT 인증 유틸리티 및 미들웨어 구현 ✅ 완료

**소요 시간**: 1h | **우선순위**: P0 | **의존성**: BE-008

**완료 조건**:

- [x] JWT 유틸리티 작성 (generateToken, verifyToken)
- [x] 인증 미들웨어 작성 (`auth.middleware.ts`)
- [x] Request 타입 확장
- [x] 테스트 완료

---

### BE-010: bcrypt 비밀번호 유틸리티 구현 ✅ 완료

**소요 시간**: 0.5h | **우선순위**: P0 | **의존성**: BE-009

**완료 조건**:

- [x] bcrypt 라이브러리 설치
- [x] hashPassword, comparePassword 함수 작성
- [x] saltRounds 10 설정
- [x] 테스트 완료

---

### BE-012: Theme 도메인 - Controller 및 Routes 구현 ✅ 완료

**소요 시간**: 1.5h | **우선순위**: P0 | **의존성**: BE-011

**완료 조건**:

- [x] 플레이어용 테마 목록 조회 API 구현 (`GET /themes`)
- [x] 관리자용 테마 목록 조회 API 구현 (`GET /admin/themes`)
- [x] 관리자용 테마 생성 API 구현 (`POST /admin/themes`)
- [x] 관리자용 테마 수정 API 구현 (`PUT /admin/themes/:id`)
- [x] 관리자용 테마 삭제 API 구현 (`DELETE /admin/themes/:id`)
- [x] 인증 미들웨어 적용 (관리자 API에만)
- [x] Zod를 통한 요청 검증 구현
- [x] API 명세서와 일치하는 응답 형식 구현

---

### BE-013: Hint 도메인 - Service 계층 구현

**소요 시간**: 2h | **우선순위**: P0 | **의존성**: BE-012

**완료 조건**:

- [x] **힌트 CRUD 메서드**: findByCode, createHint, updateHint, deleteHint, reorderHints
- [x] **BR-01: 힌트 코드 고유성 검증** - 동일 테마 내 중복 코드 시 ValidationError, 대소문자 구분 없이 처리
- [x] **BR-06: 힌트 코드 검증 실패 처리** - HintNotFoundError, HintInactiveError, HintThemeMismatchError
- [x] **테스트**: 각 메서드 단위 테스트 작성

---

### BE-015: Session 도메인 - Service 계층 구현

**소요 시간**: 2.5h | **우선순위**: P0 | **의존성**: BE-014

**완료 조건**:

- [x] **세션 CRUD 메서드**: createSession, getSession, submitHint, endSession
- [x] **BR-03: 세션-테마 1:1 관계 검증** - 세션 진행 중 테마 변경 금지
- [x] **BR-04: 힌트 중복 사용 방지** - HintUsage 확인, 사용한 힌트 목록 반환
- [x] **BR-07: 세션 복구 로직** - 서버 시간 기준 정확한 남은 시간 계산
- [x] **진행률 자동 계산**: 사용한 힌트 중 가장 높은 progressRate 반환
- [x] **테스트**: 비즈니스 규칙 검증 테스트 작성

---

### BE-021: 환경변수 관리 및 검증 로직 구현

**소요 시간**: 1h | **우선순위**: P0 | **의존성**: BE-020

**완료 조건**:

- [ ] **`.env.example` 파일 작성** - 모든 필수 환경변수 나열
- [ ] **환경변수 검증 로직 작성** (`src/config/env.config.ts`) - DATABASE_URL, JWT_SECRET, JWT_EXPIRES_IN 필수 검증
- [ ] **Zod를 활용한 타입 안전 환경변수 파싱**
- [ ] **테스트**: 환경변수 누락 시 에러 발생 확인

---

### BE-026: 성능 최적화 및 보안 점검

**소요 시간**: 2h | **우선순위**: P1 | **의존성**: BE-025

**완료 조건**:

- [ ] **API 응답시간 측정** - 주요 엔드포인트 P95 < 200ms 검증, Winston 로거로 응답시간 로깅
- [ ] **Prisma 쿼리 최적화** - N+1 쿼리 방지, 불필요한 필드 조회 제거
- [ ] **DB 인덱스 활용 검증** - EXPLAIN 쿼리로 인덱스 사용 확인
- [ ] **보안 점검** - JWT 시크릿 강도, bcrypt saltRounds, Rate Limiting 작동 확인
- [ ] **성능 테스트 스크립트 작성** (선택)

---

## 프론트엔드 실행계획

### FE-004: 공통 UI 컴포넌트 구현

**소요 시간**: 2.5h | **우선순위**: P0 | **의존성**: FE-002, FE-003

**완료 조건**:

- [ ] **Button 컴포넌트** - 최소 터치 영역 44x44px, 다크/라이트 모드, 로딩 상태
- [ ] **Input 컴포넌트** - 힌트 코드 입력, 대문자 자동 변환, 에러 메시지, 접근성 (label, placeholder, aria-label)
- [ ] **Modal 컴포넌트** - 확인 다이얼로그, ESC 키/배경 클릭 닫기
- [ ] **Card 컴포넌트** - 테마/힌트 카드 공통 레이아웃
- [ ] **Spinner 컴포넌트** - 로딩 상태 표시
- [ ] **접근성 요구사항** - 모든 버튼 최소 44x44px, 색상 대비율 WCAG AA (4.5:1), 다크모드 기본

---

### FE-010: 플레이어 페이지 - 게임 플레이 화면 구현

**소요 시간**: 3.5h | **우선순위**: P0 | **의존성**: FE-008, FE-009

**완료 조건**:

- [ ] **화면 구성**: 상단 타이머 (MM:SS, 32px), 중앙 힌트 코드 입력+버튼, 하단 진행률/사용 힌트 수
- [ ] **타이머 기능**: 클라이언트 측 1초 갱신, 60초마다 서버 동기화, 백그라운드 탭 전환 후 복귀 시 ±2초 이내
- [ ] **타이머 정확도 테스트** - 60초 동안 ±500ms 오차 확인, 탭 전환 후 ±2초 오차 확인
- [ ] **힌트 코드 입력**: 대소문자 구분 없음, 엔터 키 제출, 로딩 상태
- [ ] **에러 처리**: 잘못된 코드 시 명확한 오류 메시지
- [ ] **세션 복구**: localStorage에서 세션 ID 로드, 서버 조회 후 타이머 재계산

---

### FE-011: 플레이어 페이지 - 힌트 표시 화면 구현

**소요 시간**: 2.5h | **우선순위**: P0 | **의존성**: FE-010

**완료 조건**:

- [ ] **화면 구성**: 힌트 내용 (최소 18px), 진행률 표시, 정답보기 버튼, 뒤로 가기 버튼
- [ ] **DOMPurify XSS 방지** - 힌트 텍스트 sanitize 후 렌더링
- [ ] **정답 확인**: 정답보기 버튼 클릭 시 확인 다이얼로그, 확인 후 정답 표시
- [ ] **어두운 방 환경 고려** - 다크모드 기본, 글자 크기 최소 18px, 높은 명도 대비 (4.5:1)

---

### FE-016: React Router 설정 및 라우팅 구현

**소요 시간**: 1h | **우선순위**: P0 | **의존성**: FE-011, FE-012, FE-013, FE-014, FE-015

**완료 조건**:

- [ ] **플레이어 라우트**: /, /game/:themeId, /hint/:hintId
- [ ] **관리자 라우트**: /admin/login, /admin/dashboard, /admin/themes, /admin/themes/:id/hints, /admin/sessions
- [ ] **인증 가드**: 관리자 라우트 JWT 토큰 필수, 미인증 시 리다이렉트
- [ ] **404 페이지**: 존재하지 않는 경로 접근 시 표시

---

## 배포 및 통합 실행계획

### DEPLOY-001: Vercel 환경변수 설정

**소요 시간**: 0.5h | **우선순위**: P0 | **의존성**: BE-025

**완료 조건**:

- [ ] Vercel 대시보드 접속
- [ ] **환경변수 설정**: DATABASE_URL, JWT_SECRET (최소 32자), JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN, NODE_ENV, LOG_LEVEL
- [ ] **검증**: Vercel 환경변수 저장 확인

---

### DEPLOY-002: 프로덕션 빌드 테스트 (로컬)

**소요 시간**: 1h | **우선순위**: P0 | **의존성**: FE-018, BE-026

**완료 조건**:

- [ ] **프론트엔드 빌드**: `npm run build` 성공, 오류 0건, 빌드 크기 < 500KB
- [ ] **백엔드 빌드**: `tsc` 컴파일 성공, TypeScript 오류 0건
- [ ] **Prisma Client 생성**: `prisma generate` 성공
- [ ] **로컬 프로덕션 서버 실행**: `NODE_ENV=production npm start`, 서버 정상 작동

---

### DEPLOY-003: DB 마이그레이션 프로덕션 적용

**소요 시간**: 0.5h | **우선순위**: P0 | **의존성**: DEPLOY-001

**완료 조건**:

- [ ] Supabase 프로덕션 DB 연결 확인
- [ ] **마이그레이션 실행**: `npx prisma migrate deploy`, 4개 테이블 생성 확인
- [ ] **Prisma Studio로 확인**: 테이블 구조, 인덱스 확인

---

### DEPLOY-004: Seed 데이터 프로덕션 DB 삽입

**소요 시간**: 0.5h | **우선순위**: P0 | **의존성**: DEPLOY-003

**완료 조건**:

- [ ] **Seed 데이터 실행**: `npx prisma db seed`, 3개 테마, 9개 힌트 삽입 확인
- [ ] **Prisma Studio로 검증**: 테마 목록, 힌트 목록 확인

---

### DEPLOY-005: E2E 테스트 (플레이어+관리자 플로우)

**소요 시간**: 2h | **우선순위**: P1 | **의존성**: DEPLOY-002

**완료 조건**:

- [ ] **Playwright 설정**: `npm install -D @playwright/test`, `playwright.config.ts` 작성
- [ ] **플레이어 E2E 테스트**: 테마 선택 → 게임 시작 → 힌트 조회 → 정답 확인, 타이머 작동, 세션 복구 (새로고침)
- [ ] **관리자 E2E 테스트**: 로그인 → 테마 생성 → 힌트 등록 → 힌트 순서 조정, JWT 인증 확인
- [ ] **모바일 반응형 확인**: 360px 너비에서 UI 정상 작동

---

### DEPLOY-006: Vercel 배포 및 검증

**소요 시간**: 1h | **우선순위**: P0 | **의존성**: DEPLOY-004

**완료 조건**:

- [ ] **Git Push**: `git add .`, `git commit`, `git push origin main`
- [ ] **Vercel 자동 배포 확인**: 배포 상태, 빌드 로그 확인 (오류 없음)
- [ ] **배포 URL 확인**: 플레이어/관리자 화면 정상 작동

---

### DEPLOY-007: 프로덕션 환경 최종 검증

**소요 시간**: 0.5h | **우선순위**: P0 | **의존성**: DEPLOY-006

**완료 조건**:

- [ ] **플레이어 플로우 검증**: 테마 선택 → 게임 시작 → 힌트 조회 → 정답 확인, 타이머 정확도 ±2초
- [ ] **관리자 플로우 검증**: 로그인 → 테마 관리 → 힌트 관리, JWT 인증 작동
- [ ] **모바일 반응형 확인**: 스마트폰에서 UI 정상 작동
- [ ] **다크모드 확인**: 플레이어 화면 다크모드 기본 적용
- [ ] **성능 확인**: Lighthouse Performance > 80, API 응답 < 200ms

---

## 전체 의존성 다이어그램

```
Day 1 (2025-11-26)
==================

Morning (Database - 9시간)
------------------
DB-001 → DB-002 → DB-003 → DB-004 → DB-005 → DB-006 → DB-007 → DB-008 → DB-009

Afternoon (Backend Start - 8시간)
--------------------------
BE-001 → BE-002 → BE-003 (depends on DB-005)
                    ↓
                  BE-004 → BE-005 → BE-006 → BE-007 → BE-008 → BE-009 → BE-010
                                                                            ↓
                                                                          BE-011 → BE-012

Day 2 (2025-11-27)
==================

Morning (Backend Continue - 10시간)
--------------------------
BE-012 → BE-013 → BE-014 → BE-015 → BE-016 → BE-017 → BE-018 → BE-019 (depends on DB-009)
                                                                            ↓
                                                                          BE-020 → BE-021 → BE-022 → BE-023

Afternoon (Backend Complete + Frontend Start - 8시간)
---------------------------
BE-024 → BE-025 → BE-026

FE-001 ┬→ FE-002 → FE-004 ───────────┬→ FE-009 → FE-010 → FE-011
       ├→ FE-003 → FE-005 → FE-006 ──┴→ FE-008 ──────────┘
       └→ FE-003 → FE-007 ────────────────┘
         └→ FE-017

Day 3 (2025-11-28)
==================

Morning (Frontend Continue - 8시간)
---------------------------
FE-008 → FE-012 → FE-013 → FE-014 → FE-015
                              ↓        ↓
                           FE-011  FE-015
                              ↓        ↓
                            FE-016 (Router)
                              ↓
                            FE-018 (Testing)

Afternoon (Deployment - 6시간)
------------------------------------
BE-025 → DEPLOY-001 → DEPLOY-003 → DEPLOY-004 → DEPLOY-006 → DEPLOY-007
           ↓
FE-018, BE-026 → DEPLOY-002 → DEPLOY-005 (E2E, P1)
```

---

## 리스크 관리

### High Risk (높은 우선순위로 해결)

| 리스크                          | 영향도 | 완화 전략                                           | 관련 Task              |
| ------------------------------- | ------ | --------------------------------------------------- | ---------------------- |
| 타이머 정확도 문제              | 높음   | 60초마다 서버 동기화, 탭 전환 감지, 테스트 강화     | FE-010, DEPLOY-005     |
| 세션 복구 실패                  | 높음   | localStorage + 서버 동기화, 에러 핸들링 강화        | BE-015, FE-010         |
| JWT 인증 버그                   | 높음   | 테스트 케이스 작성, Postman 검증                    | BE-009, BE-020         |
| Prisma 마이그레이션 실패        | 높음   | 로컬 테스트 후 프로덕션 적용, DB-009 제약 조건 검증 | DB-009, DEPLOY-003     |
| 비즈니스 규칙 미반영            | 높음   | DB-009, BE-013, BE-015에 명시적 검증 추가           | DB-009, BE-013, BE-015 |
| XSS 공격 취약점                 | 높음   | DOMPurify 적용, helmet 보안 헤더 설정               | FE-011, BE-006         |
| API 남용 (Rate Limiting 미설정) | 중간   | BE-008을 P0로 상향, express-rate-limit 적용         | BE-008                 |
| Vercel 배포 실패                | 중간   | 로컬 빌드 테스트, 환경변수 사전 확인, DEPLOY-002    | DEPLOY-002, DEPLOY-006 |

---

## 일별 체크리스트

### Day 1 (2025-11-26) - 데이터베이스 + 백엔드 기초

#### Morning (Database - 9시간)

- [x] **DB-001**: 프로젝트 초기 설정 및 Prisma 설치
- [x] **DB-002**: Prisma 스키마 작성
- [x] **DB-003**: 환경 변수 설정 및 Supabase 연결
- [x] **DB-004**: 마이그레이션 생성
- [x] **DB-005**: Seed 데이터 삽입
- [x] **DB-006**: 인덱스 검증
- [x] **DB-007**: 제약 조건 검증
- [x] **DB-008**: Prisma Client 테스트
- [x] **DB-009**: 비즈니스 규칙 제약 조건 검증

#### Afternoon (Backend - 8시간)

- [x] **BE-001**: 백엔드 프로젝트 초기화
- [x] **BE-002**: TypeScript, ESLint, Prettier 설정
- [x] **BE-003**: Prisma 연동
- [x] **BE-004**: Express 서버 기본 설정
- [x] **BE-005**: Winston 로깅
- [x] **BE-006**: 에러 처리 + helmet 보안
- [x] **BE-007**: Zod 검증
- [x] **BE-008**: Rate Limiting
- [x] **BE-009**: JWT 인증
- [x] **BE-010**: bcrypt 유틸리티

---

### Day 2 (2025-11-27) - 백엔드 완료 + 프론트엔드 시작

#### Morning (Backend - 10시간)

- [x] **BE-011**: Theme Service
- [x] **BE-012**: Theme Controller/Routes
- [x] **BE-013**: Hint Service (BR-01, BR-06 검증)
- [x] **BE-014**: Hint Controller/Routes
- [x] **BE-015**: Session Service (BR-03, BR-04, BR-07 검증)
- [x] **BE-016**: Session Controller/Routes
- [x] **BE-017**: Auth Service
- [x] **BE-018**: Auth Controller/Routes
- [x] **BE-019**: Prisma 마이그레이션 & 시드
- [x] **BE-020**: 통합 테스트

#### Afternoon (Backend Complete + Frontend Start - 8시간)

- [x] **BE-021**: 환경변수 관리 및 검증 로직 (Zod)
- [x] **BE-022**: API 응답 표준화
- [x] **BE-023**: CORS 설정
- [x] **BE-024**: API 문서화
- [x] **BE-025**: 배포 준비
- [x] **BE-026**: 성능 최적화

**또는 Frontend 시작:**

- [ ] **FE-001**: 프로젝트 초기 설정
- [ ] **FE-002**: Tailwind CSS 설정
- [ ] **FE-003**: 디렉토리 구조
- [ ] **FE-004**: 공통 UI 컴포넌트
- [ ] **FE-005**: API 클라이언트
- [ ] **FE-006**: 도메인 API 서비스
- [ ] **FE-017**: 유틸리티 함수

---

### Day 3 (2025-11-28) - 프론트엔드 완료 + 배포

#### Morning (Frontend - 8시간)

- [ ] **FE-007**: Zustand 스토어
- [ ] **FE-008**: 커스텀 훅
- [ ] **FE-009**: 플레이어 - 테마 선택 화면
- [ ] **FE-010**: 플레이어 - 게임 플레이 화면
- [ ] **FE-011**: 플레이어 - 힌트 표시 화면

#### Afternoon (Frontend Complete + Deployment - 8시간)

- [ ] **FE-012**: 관리자 - 로그인 화면
- [ ] **FE-013**: 관리자 - 대시보드
- [ ] **FE-014**: 관리자 - 테마 관리
- [ ] **FE-015**: 관리자 - 힌트 관리
- [ ] **FE-016**: React Router 설정
- [ ] **FE-018**: 통합 테스트 및 버그 수정

**Deployment (6시간):**

- [ ] **DEPLOY-001**: Vercel 환경변수 설정
- [ ] **DEPLOY-002**: 프로덕션 빌드 테스트
- [ ] **DEPLOY-003**: DB 마이그레이션 프로덕션 적용
- [ ] **DEPLOY-004**: Seed 데이터 프로덕션 DB 삽입
- [ ] **DEPLOY-005**: E2E 테스트
- [ ] **DEPLOY-006**: Vercel 배포 및 검증
- [ ] **DEPLOY-007**: 프로덕션 환경 최종 검증

---

## 핵심 체크포인트

### Milestone 1: 데이터베이스 완료 (Day 1 오전)

- [x] Supabase에 4개 테이블 생성 확인
- [x] Seed 데이터 3개 테마, 9개 힌트 삽입 확인
- [x] 비즈니스 규칙 제약 조건 검증 완료 (BR-01, BR-04, BR-07)
- [x] Prisma Studio로 데이터 확인
- [x] Prisma Client 테스트 쿼리 성공

### Milestone 2: 백엔드 API 완료 (Day 2 오전)

- [ ] 플레이어 API 4개 엔드포인트 작동 (GET /api/themes, POST /api/sessions, GET /api/sessions/:id, POST /api/sessions/:id/hints)
- [ ] 관리자 API 10개 엔드포인트 작동 (POST /api/admin/auth/login, Theme CRUD 4개, Hint CRUD 4개, Session 관리 2개)
- [ ] JWT 인증 작동 확인
- [ ] Rate Limiting 작동 확인 (100 요청/분)
- [ ] helmet 보안 헤더 설정 확인
- [ ] Postman Collection 완성

### Milestone 3: 프론트엔드 플레이어 화면 완료 (Day 2 오후)

- [ ] 테마 선택 화면 작동
- [ ] 게임 플레이 화면 작동
- [ ] 타이머 정확도 확인 (±2초 이내)
- [ ] 힌트 조회 및 정답 표시 작동
- [ ] DOMPurify XSS 방지 적용 확인
- [ ] 세션 복구 기능 작동 (localStorage)

### Milestone 4: 프론트엔드 관리자 화면 완료 (Day 3 오전)

- [ ] 관리자 로그인 작동
- [ ] 테마 CRUD 작동
- [ ] 힌트 CRUD 작동
- [ ] 힌트 순서 조정 작동

### Milestone 5: 배포 완료 (Day 3 오후)

- [ ] Vercel 환경변수 설정 완료
- [ ] 프로덕션 빌드 로컬 테스트 성공
- [ ] DB 마이그레이션 프로덕션 적용 완료
- [ ] E2E 테스트 통과 (플레이어 + 관리자 플로우)
- [ ] Vercel 배포 성공
- [ ] 프로덕션 환경에서 플레이어/관리자 플로우 정상 작동
- [ ] 모바일 반응형 확인
- [ ] 다크모드 확인
- [ ] API 응답시간 P95 < 200ms 확인

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

## 문서 변경 이력

| 버전 | 날짜       | 작성자                | 변경 내용                                                                                                             | 승인자 |
| ---- | ---------- | --------------------- | --------------------------------------------------------------------------------------------------------------------- | ------ |
| 1.0  | 2025-11-26 | Architecture Reviewer | 초안 작성 (전체 Task 정의)                                                                                            | 윤인수 |
| 1.1  | 2025-11-26 | Architecture Reviewer | 아키텍처 검토 반영: DB-009 추가, BE-005/006/008/013/015/021/026 수정, FE-004/010/011/016 수정, DEPLOY Task 추가 (7개) | 윤인수 |
| 1.2  | 2025-11-26 | Technical Writer      | 토큰 최적화: 완료된 Task 코드 삭제, 미완료 Task 코드 예시 제거, 핵심 정보 유지                                        | 윤인수 |

---

## 문서 승인

본 문서는 EscapeHint 프로젝트의 공식 통합 실행계획 문서입니다.

**승인자**: 윤인수
**승인일**: 2025-11-26
**문서 상태**: 아키텍처 검토 완료, v1.2 토큰 최적화 완료

---

**문서 끝**
