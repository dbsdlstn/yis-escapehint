const { Pool } = require('pg');

async function addDifficultyColumn() {
  const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'escapehint',
    password: '123123',
    port: 5432,
  });

  try {
    // difficulty 컬럼 추가
    await pool.query('ALTER TABLE "Theme" ADD COLUMN IF NOT EXISTS "difficulty" TEXT;');
    console.log('✅ difficulty 컬럼 추가 완료!');

    // playTime에 DEFAULT 값 추가
    await pool.query('ALTER TABLE "Theme" ALTER COLUMN "playTime" SET DEFAULT 60;');
    console.log('✅ playTime DEFAULT 값 설정 완료!');
  } catch (error) {
    console.error('❌ 컬럼 추가 실패:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

addDifficultyColumn();
