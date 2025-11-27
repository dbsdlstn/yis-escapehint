const { Client } = require('pg');

async function main() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'escapehint',
    user: 'postgres',
    password: '123123',
  });

  try {
    await client.connect();
    console.log('데이터베이스 연결 성공');

    // 기존 테마 업데이트
    await client.query(`
      UPDATE "Theme"
      SET name = '좀비 연구소', description = '사라진 연구원의 흔적을 찾아 좀비가 난무하는 연구소를 탈출하라'
      WHERE id = '7343e80b-c164-4b63-a175-6a68037635aa'
    `);
    console.log('테마 1 업데이트 완료');

    await client.query(`
      UPDATE "Theme"
      SET name = '시간 여행자의 방', description = '과거와 미래를 넘나드는 시간 여행자의 방에서 탈출하라'
      WHERE id = 'b1523dd8-8847-4094-a233-acaef24f4795'
    `);
    console.log('테마 2 업데이트 완료');

    // 확인
    const result = await client.query('SELECT id, name, description FROM "Theme"');
    console.log('\n업데이트된 테마:');
    result.rows.forEach(row => {
      console.log(`- ${row.name}: ${row.description}`);
    });

    console.log('\n✅ 한글 수정 완료!');
  } catch (error) {
    console.error('에러:', error.message);
  } finally {
    await client.end();
  }
}

main();
