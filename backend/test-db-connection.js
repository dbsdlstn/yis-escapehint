require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

async function testConnection() {
  try {
    console.log('🔍 DATABASE_URL:', process.env.DATABASE_URL ? '설정됨 ✅' : '설정 안됨 ❌');

    // Prisma 7에서는 adapter를 통해 연결
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    console.log('🔗 데이터베이스 연결 테스트 중...');

    await prisma.$connect();
    console.log('✅ 데이터베이스 연결 성공!');

    await prisma.$disconnect();
    await pool.end();
  } catch (error) {
    console.error('❌ 데이터베이스 연결 실패:', error.message);
    console.log('\n💡 로컬 PostgreSQL을 사용 중이거나 Supabase를 아직 설정하지 않았다면 정상입니다.');
    console.log('   Supabase 설정 후 DATABASE_URL을 업데이트하면 됩니다.\n');
  }
}

testConnection();
