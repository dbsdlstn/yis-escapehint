const { Client } = require('pg');

// 데이터베이스 연결 설정
const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '123123',
  database: 'escapehint'
});

async function checkTables() {
  try {
    // 데이터베이스에 연결
    await client.connect();
    console.log('데이터베이스에 연결되었습니다.');

    // 테이블 목록 조회
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log('데이터베이스에 존재하는 테이블 목록:');
    result.rows.forEach(row => {
      console.log('- ' + row.table_name);
    });

    if (result.rows.length === 0) {
      console.log('데이터베이스에 테이블이 존재하지 않습니다.');
    }
  } catch (err) {
    console.error('오류 발생:', err);
  } finally {
    // 연결 종료
    await client.end();
    console.log('데이터베이스 연결이 종료되었습니다.');
  }
}

// 스크립트 실행
checkTables();