import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from '@prisma/client';

// PostgreSQL connection pool (환경 변수에서 URL 가져오기)
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/escapehint",
});

// Prisma adapter
const adapter = new PrismaPg(pool);

// Prisma client instance
const prisma = new PrismaClient({ adapter });

async function updateHintCodes() {
  try {
    console.log('히트 코드 업데이트 시작...');

    // 각 테마에 대한 힌트 코드 매핑
    const hintUpdates = [
      // 좀비 연구소 힌트 업데이트
      { oldCode: 'ZOMBIE01', newCode: 'Z001' },
      { oldCode: 'ZOMBIE02', newCode: 'Z002' },
      { oldCode: 'ZOMBIE03', newCode: 'Z003' },

      // 도둑의 금고 힌트 업데이트
      { oldCode: 'THIEF01', newCode: 'D001' },
      { oldCode: 'THIEF02', newCode: 'D002' },
      { oldCode: 'THIEF03', newCode: 'D003' },

      // 시간 여행자의 방 힌트 업데이트
      { oldCode: 'TIME01', newCode: 'T001' },
      { oldCode: 'TIME02', newCode: 'T002' },
      { oldCode: 'TIME03', newCode: 'T003' }
    ];

    // 각 힌트 코드 업데이트
    for (const update of hintUpdates) {
      const result = await prisma.hint.updateMany({
        where: {
          code: update.oldCode
        },
        data: {
          code: update.newCode
        }
      });

      if (result.count > 0) {
        console.log(`힌트 코드 ${update.oldCode} -> ${update.newCode} 업데이트 완료 (${result.count}개 행 영향)`);
      } else {
        console.log(`힌트 코드 ${update.oldCode}를 찾지 못했습니다.`);
      }
    }

    console.log('히트 코드 업데이트 완료!');
  } catch (error) {
    console.error('히트 코드 업데이트 중 오류 발생:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 스크립트 실행
if (require.main === module) {
  updateHintCodes();
}