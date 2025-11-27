const { Pool } = require('pg');

async function createDatabase() {
  // postgres 기본 데이터베이스에 연결
  const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '123123',
    port: 5432,
  });

  try {
    // escapehint 데이터베이스 생성
    await pool.query('CREATE DATABASE escapehint;');
    console.log('✅ escapehint 데이터베이스 생성 완료!');
  } catch (error) {
    if (error.code === '42P04') {
      console.log('ℹ️  escapehint 데이터베이스가 이미 존재합니다.');
    } else {
      console.error('❌ 데이터베이스 생성 실패:', error.message);
      throw error;
    }
  } finally {
    await pool.end();
  }
}

createDatabase();
