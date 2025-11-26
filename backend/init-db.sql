-- =====================================================
-- EscapeHint Database Schema (DDL)
-- =====================================================
-- 데이터베이스: PostgreSQL 16
-- 작성일: 2025-11-26
-- 작성자: Architecture Reviewer
-- 참고 문서: docs/7-ERD.md
-- =====================================================

-- =====================================================
-- 1. ENUM 타입 정의
-- =====================================================

-- 세션 상태 ENUM
CREATE TYPE session_status AS ENUM (
    'in_progress',  -- 게임 진행 중
    'completed',    -- 게임 완료
    'aborted'       -- 게임 중단
);

-- =====================================================
-- 2. 테이블 생성
-- =====================================================

-- -----------------------------------------------------
-- 2.1 THEME 테이블 (테마)
-- -----------------------------------------------------
CREATE TABLE theme (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    play_time INT NOT NULL DEFAULT 60,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    -- 제약 조건
    CONSTRAINT theme_play_time_range CHECK (play_time >= 10 AND play_time <= 180)
);

-- 테마 설명
COMMENT ON TABLE theme IS '방탈출 게임 테마 정보';
COMMENT ON COLUMN theme.id IS '테마 고유 식별자';
COMMENT ON COLUMN theme.name IS '테마 이름';
COMMENT ON COLUMN theme.description IS '테마 설명';
COMMENT ON COLUMN theme.play_time IS '제한 시간 (분 단위, 10-180분)';
COMMENT ON COLUMN theme.is_active IS '활성화 상태 (true: 활성, false: 비활성)';
COMMENT ON COLUMN theme.created_at IS '생성 일시';
COMMENT ON COLUMN theme.updated_at IS '수정 일시';

-- -----------------------------------------------------
-- 2.2 HINT 테이블 (힌트)
-- -----------------------------------------------------
CREATE TABLE hint (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    theme_id UUID NOT NULL,
    code VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    answer VARCHAR(255),
    progress_rate INT NOT NULL DEFAULT 0,
    "order" INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    -- 외래키
    CONSTRAINT hint_theme_fk FOREIGN KEY (theme_id)
        REFERENCES theme(id)
        ON DELETE CASCADE,

    -- 제약 조건
    CONSTRAINT hint_progress_rate_range CHECK (progress_rate >= 0 AND progress_rate <= 100)
);

-- 힌트 설명
COMMENT ON TABLE hint IS '테마별 힌트 정보';
COMMENT ON COLUMN hint.id IS '힌트 고유 식별자';
COMMENT ON COLUMN hint.theme_id IS '테마 외래키';
COMMENT ON COLUMN hint.code IS '힌트 코드 (플레이어가 입력하는 코드)';
COMMENT ON COLUMN hint.content IS '힌트 내용';
COMMENT ON COLUMN hint.answer IS '정답 (선택 사항)';
COMMENT ON COLUMN hint.progress_rate IS '진행률 (0-100%)';
COMMENT ON COLUMN hint."order" IS '힌트 순서 (정렬용)';
COMMENT ON COLUMN hint.is_active IS '활성화 상태';
COMMENT ON COLUMN hint.created_at IS '생성 일시';
COMMENT ON COLUMN hint.updated_at IS '수정 일시';

-- -----------------------------------------------------
-- 2.3 GAME_SESSION 테이블 (게임 세션)
-- -----------------------------------------------------
CREATE TABLE game_session (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    theme_id UUID NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    used_hint_count INT NOT NULL DEFAULT 0,
    used_hint_codes JSONB NOT NULL DEFAULT '[]'::jsonb,
    status session_status NOT NULL DEFAULT 'in_progress',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    -- 외래키
    CONSTRAINT game_session_theme_fk FOREIGN KEY (theme_id)
        REFERENCES theme(id)
        ON DELETE RESTRICT
);

-- 게임 세션 설명
COMMENT ON TABLE game_session IS '플레이어의 게임 진행 상태';
COMMENT ON COLUMN game_session.id IS '세션 고유 식별자';
COMMENT ON COLUMN game_session.theme_id IS '테마 외래키';
COMMENT ON COLUMN game_session.start_time IS '게임 시작 시간';
COMMENT ON COLUMN game_session.end_time IS '게임 종료 시간 (완료/중단 시 기록)';
COMMENT ON COLUMN game_session.used_hint_count IS '사용한 힌트 개수';
COMMENT ON COLUMN game_session.used_hint_codes IS '사용한 힌트 코드 목록 (JSON 배열)';
COMMENT ON COLUMN game_session.status IS '세션 상태 (in_progress, completed, aborted)';
COMMENT ON COLUMN game_session.created_at IS '생성 일시';
COMMENT ON COLUMN game_session.updated_at IS '수정 일시';

-- -----------------------------------------------------
-- 2.4 HINT_USAGE 테이블 (힌트 사용 기록)
-- -----------------------------------------------------
CREATE TABLE hint_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL,
    hint_id UUID NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    -- 외래키
    CONSTRAINT hint_usage_session_fk FOREIGN KEY (session_id)
        REFERENCES game_session(id)
        ON DELETE CASCADE,
    CONSTRAINT hint_usage_hint_fk FOREIGN KEY (hint_id)
        REFERENCES hint(id)
        ON DELETE CASCADE
);

-- 힌트 사용 기록 설명
COMMENT ON TABLE hint_usage IS '세션별 힌트 사용 이력 추적 (통계 분석용)';
COMMENT ON COLUMN hint_usage.id IS '기록 고유 식별자';
COMMENT ON COLUMN hint_usage.session_id IS '세션 외래키';
COMMENT ON COLUMN hint_usage.hint_id IS '힌트 외래키';
COMMENT ON COLUMN hint_usage.used_at IS '힌트 사용 시각';

-- =====================================================
-- 3. 인덱스 생성
-- =====================================================

-- -----------------------------------------------------
-- 3.1 THEME 인덱스
-- -----------------------------------------------------
CREATE INDEX idx_theme_is_active ON theme(is_active);

COMMENT ON INDEX idx_theme_is_active IS '활성 테마 필터링 성능 향상';

-- -----------------------------------------------------
-- 3.2 HINT 인덱스
-- -----------------------------------------------------
CREATE INDEX idx_hint_theme_id ON hint(theme_id);
CREATE UNIQUE INDEX idx_hint_theme_code_unique ON hint(theme_id, code);

COMMENT ON INDEX idx_hint_theme_id IS '테마별 힌트 조회 성능 향상';
COMMENT ON INDEX idx_hint_theme_code_unique IS '테마 내 힌트 코드 고유성 보장 및 검증 성능 향상';

-- -----------------------------------------------------
-- 3.3 GAME_SESSION 인덱스
-- -----------------------------------------------------
CREATE INDEX idx_game_session_theme_id ON game_session(theme_id);
CREATE INDEX idx_game_session_status ON game_session(status);

COMMENT ON INDEX idx_game_session_theme_id IS '테마별 세션 조회 성능 향상';
COMMENT ON INDEX idx_game_session_status IS '세션 상태별 조회 성능 향상';

-- -----------------------------------------------------
-- 3.4 HINT_USAGE 인덱스
-- -----------------------------------------------------
CREATE INDEX idx_hint_usage_session_id ON hint_usage(session_id);
CREATE INDEX idx_hint_usage_hint_id ON hint_usage(hint_id);

COMMENT ON INDEX idx_hint_usage_session_id IS '세션별 힌트 사용 기록 조회';
COMMENT ON INDEX idx_hint_usage_hint_id IS '힌트별 사용 통계 조회';

-- =====================================================
-- 4. 트리거 함수 생성 (updated_at 자동 업데이트)
-- =====================================================

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_updated_at_column IS 'updated_at 컬럼을 현재 시각으로 자동 업데이트';

-- =====================================================
-- 5. 트리거 생성
-- =====================================================

-- THEME 테이블 트리거
CREATE TRIGGER trigger_theme_updated_at
    BEFORE UPDATE ON theme
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- HINT 테이블 트리거
CREATE TRIGGER trigger_hint_updated_at
    BEFORE UPDATE ON hint
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- GAME_SESSION 테이블 트리거
CREATE TRIGGER trigger_game_session_updated_at
    BEFORE UPDATE ON game_session
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 6. 샘플 데이터 삽입 (개발/테스트용)
-- =====================================================

-- 샘플 테마 데이터
INSERT INTO theme (id, name, description, play_time, is_active) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', '미스터리 저택', '오래된 저택에서 숨겨진 비밀을 찾아라', 60, true),
    ('550e8400-e29b-41d4-a716-446655440002', '타임머신 연구소', '과거로 돌아가기 위한 타임머신을 작동시켜라', 90, true),
    ('550e8400-e29b-41d4-a716-446655440003', '우주 정거장 탈출', '고장난 우주 정거장에서 탈출하라', 120, false);

-- 샘플 힌트 데이터 (미스터리 저택)
INSERT INTO hint (theme_id, code, content, answer, progress_rate, "order", is_active) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'H001', '서재의 책장을 자세히 살펴보세요. 빨간색 책에 주목하세요.', NULL, 20, 1, true),
    ('550e8400-e29b-41d4-a716-446655440001', 'H002', '벽난로 옆 그림의 액자를 돌려보세요.', '1847', 40, 2, true),
    ('550e8400-e29b-41d4-a716-446655440001', 'H003', '피아노 건반의 특정 순서를 눌러보세요. C-E-G 순서입니다.', NULL, 60, 3, true),
    ('550e8400-e29b-41d4-a716-446655440001', 'H004', '금고의 비밀번호는 저택 건축 연도입니다.', '1847', 80, 4, true),
    ('550e8400-e29b-41d4-a716-446655440001', 'H005', '지하실 열쇠는 시계 뒤편에 숨겨져 있습니다.', NULL, 100, 5, true);

-- 샘플 힌트 데이터 (타임머신 연구소)
INSERT INTO hint (theme_id, code, content, answer, progress_rate, "order", is_active) VALUES
    ('550e8400-e29b-41d4-a716-446655440002', 'TM01', '연구 노트의 마지막 페이지를 확인하세요.', NULL, 25, 1, true),
    ('550e8400-e29b-41d4-a716-446655440002', 'TM02', '제어판의 파란색 버튼을 먼저 눌러야 합니다.', NULL, 50, 2, true),
    ('550e8400-e29b-41d4-a716-446655440002', 'TM03', '타임머신 작동 코드는 아인슈타인의 생년입니다.', '1879', 75, 3, true),
    ('550e8400-e29b-41d4-a716-446655440002', 'TM04', '모든 전원을 켠 후 메인 스위치를 활성화하세요.', NULL, 100, 4, true);

-- =====================================================
-- 7. 데이터베이스 정보 조회 쿼리
-- =====================================================

-- 모든 테이블 목록 조회
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

-- 테이블별 컬럼 정보 조회
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns
-- WHERE table_schema = 'public' AND table_name = 'theme'
-- ORDER BY ordinal_position;

-- 인덱스 목록 조회
-- SELECT indexname, indexdef FROM pg_indexes WHERE schemaname = 'public' ORDER BY tablename, indexname;

-- 외래키 제약 조건 조회
-- SELECT
--     tc.constraint_name,
--     tc.table_name,
--     kcu.column_name,
--     ccu.table_name AS foreign_table_name,
--     ccu.column_name AS foreign_column_name
-- FROM information_schema.table_constraints AS tc
-- JOIN information_schema.key_column_usage AS kcu
--     ON tc.constraint_name = kcu.constraint_name
-- JOIN information_schema.constraint_column_usage AS ccu
--     ON ccu.constraint_name = tc.constraint_name
-- WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public';

-- =====================================================
-- 스키마 생성 완료
-- =====================================================
