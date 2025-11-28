import { config } from "dotenv";
import { pool } from "../shared/utils/pg.util";

// 환경 변수 로드 (env.config.ts를 로드하기 전에 먼저 .env 파일에서 로드)
config({ path: "../../../.env" });

// env.config.ts에서 환경 변수 검증을 위해 필요한 값들을 수동으로 설정
process.env.DATABASE_URL = process.env.DATABASE_URL || '';
process.env.JWT_SECRET = process.env.JWT_SECRET || '';

async function seedData() {
  try {
    // 기존 데이터 삭제 - 외래키 제약 조건 순서 고려
    await pool.query('DELETE FROM "HintUsage";');
    await pool.query('DELETE FROM "Hint";');
    await pool.query('DELETE FROM "GameSession";');
    await pool.query('DELETE FROM "Theme";');

    // 샘플 테마 데이터 삽입
    const themes = [
      {
        id: '821e3ac8-15e6-4ec7-9703-91f522260c2b',
        name: '좀비 연구소',
        description: '사라진 연구원의 흔적을 찾아 좀비가 난무하는 연구소를 탈출하라',
        playTime: 90,
        isActive: true,
        difficulty: '상'
      },
      {
        id: '4042b9aa-dd43-4573-8108-b1abb1400e12',
        name: '도둑의 금고',
        description: '도둑의 금고에서 보물을 훔치고 탈출하라',
        playTime: 60,
        isActive: true,
        difficulty: '하'
      },
      {
        id: '95b9ead7-615d-4374-a0dc-8cf73300b21b',
        name: '시간 여행자의 방',
        description: '과거와 미래를 넘나드는 시간 여행자의 방에서 탈출하라',
        playTime: 120,
        isActive: true,
        difficulty: '중'
      }
    ];

    for (const theme of themes) {
      await pool.query(`
        INSERT INTO "Theme" (id, name, description, "playTime", "isActive", difficulty)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        theme.id,
        theme.name,
        theme.description,
        theme.playTime,
        theme.isActive,
        theme.difficulty
      ]);
    }

    // 샘플 힌트 데이터 삽입
    const hints = [
      // 좀비 연구소 힌트
      { themeId: '821e3ac8-15e6-4ec7-9703-91f522260c2b', code: 'Z001', content: '책상 위에 놓인 실험 일지를 확인해 보세요. 첫 번째 힌트가 있습니다.', answer: '암호는 1234입니다.', progressRate: 20, order: 1, isActive: true },
      { themeId: '821e3ac8-15e6-4ec7-9703-91f522260c2b', code: 'Z002', content: '서쪽 벽에 있는 해부학 도표를 자세히 살펴보세요. 숨겨진 숫자가 있습니다.', answer: '암호는 5678입니다.', progressRate: 50, order: 2, isActive: true },
      { themeId: '821e3ac8-15e6-4ec7-9703-91f522260c2b', code: 'Z003', content: '실험 기구 뒤쪽에 보석함이 있습니다. 힌트를 이용해 암호를 푸세요.', answer: '탈출문은 북쪽 문입니다.', progressRate: 80, order: 3, isActive: true },
      // 도둑의 금고 힌트
      { themeId: '4042b9aa-dd43-4573-8108-b1abb1400e12', code: 'D001', content: '금고 입구 옆에 있는 그림을 자세히 살펴보세요. 숨겨진 암호가 있습니다.', answer: '암호는 1111입니다.', progressRate: 30, order: 1, isActive: true },
      { themeId: '4042b9aa-dd43-4573-8108-b1abb1400e12', code: 'D002', content: '책상 서랍에 있는 보물 지도를 확인해 보세요. 보물의 위치를 찾을 수 있습니다.', answer: '암호는 2222입니다.', progressRate: 60, order: 2, isActive: true },
      { themeId: '4042b9aa-dd43-4573-8108-b1abb1400e12', code: 'D003', content: '보물함 위에 있는 암호를 풀면 마지막 탈출문이 열립니다.', answer: '탈출문은 남쪽 문입니다.', progressRate: 90, order: 3, isActive: true },
      // 시간 여행자의 방 힌트
      { themeId: '95b9ead7-615d-4374-a0dc-8cf73300b21b', code: 'T001', content: '과거로 간 시간 여행자의 일지를 확인해 보세요. 첫 번째 힌트가 있습니다.', answer: '암호는 9876입니다.', progressRate: 25, order: 1, isActive: true },
      { themeId: '95b9ead7-615d-4374-a0dc-8cf73300b21b', code: 'T002', content: '미래의 컴퓨터에 적힌 문장을 해석해 보세요. 다음 힌트를 찾을 수 있습니다.', answer: '암호는 5432입니다.', progressRate: 55, order: 2, isActive: true },
      { themeId: '95b9ead7-615d-4374-a0dc-8cf73300b21b', code: 'T003', content: '시간 기계 옆에 있는 다이얼을 과거로 돌리면 숨겨진 문이 열립니다.', answer: '탈출문은 서쪽 문입니다.', progressRate: 85, order: 3, isActive: true }
    ];

    for (const hint of hints) {
      await pool.query(`
        INSERT INTO "Hint" ("themeId", code, content, answer, "progressRate", "order", "isActive")
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        hint.themeId,
        hint.code,
        hint.content,
        hint.answer,
        hint.progressRate,
        hint.order,
        hint.isActive
      ]);
    }

    console.log("샘플 데이터 삽입 완료:", themes.length, "개의 테마");
  } catch (error) {
    console.error("샘플 데이터 삽입 중 오류 발생:", error);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  seedData();
}