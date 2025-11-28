// This file seeds the database with initial data using the same Prisma initialization as the application
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

// Set environment variables directly for this script
process.env.DATABASE_URL = "postgresql://postgres:123123@localhost:5432/escapehint";

// Create the PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create the Prisma adapter
const adapter = new PrismaPg(pool);

// Create Prisma client with the adapter
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear existing data in reverse order of foreign key dependencies
  await prisma.hintUsage.deleteMany({});
  await prisma.gameSession.deleteMany({});
  await prisma.hint.deleteMany({});
  await prisma.theme.deleteMany({});

  // 테마 3개 생성
  const themes = await Promise.all([
    prisma.theme.create({
      data: {
        name: '좀비 연구소',
        description: '사라진 연구원의 흔적을 찾아 좀비가 난무하는 연구소를 탈출하라',
        playTime: 90,
        difficulty: '상',
        isActive: true,
      },
    }),
    prisma.theme.create({
      data: {
        name: '도둑의 금고',
        description: '도둑의 금고에서 보물을 훔치고 탈출하라',
        playTime: 60,
        difficulty: '하',
        isActive: true,
      },
    }),
    prisma.theme.create({
      data: {
        name: '시간 여행자의 방',
        description: '과거와 미래를 넘나드는 시간 여행자의 방에서 탈출하라',
        playTime: 120,
        difficulty: '중',
        isActive: true,
      },
    }),
  ]);

  // 각 테마에 속한 힌트 9개 생성 (각 테마당 3개)
  await Promise.all([
    // 좀비 연구소 힌트
    prisma.hint.create({
      data: {
        themeId: themes[0].id,
        code: 'Z001',
        content: '책상 위에 놓인 실험 일지를 확인해 보세요. 첫 번째 힌트가 있습니다.',
        answer: '암호는 1234입니다.',
        progressRate: 20,
        order: 1,
        isActive: true,
      },
    }),
    prisma.hint.create({
      data: {
        themeId: themes[0].id,
        code: 'Z002',
        content: '서쪽 벽에 있는 해부학 도표를 자세히 살펴보세요. 숨겨진 숫자가 있습니다.',
        answer: '암호는 5678입니다.',
        progressRate: 50,
        order: 2,
        isActive: true,
      },
    }),
    prisma.hint.create({
      data: {
        themeId: themes[0].id,
        code: 'Z003',
        content: '실험 기구 뒤쪽에 보석함이 있습니다. 힌트를 이용해 암호를 푸세요.',
        answer: '탈출문은 북쪽 문입니다.',
        progressRate: 80,
        order: 3,
        isActive: true,
      },
    }),

    // 시간 여행자의 방 힌트
    prisma.hint.create({
      data: {
        themeId: themes[1].id,
        code: 'T001',
        content: '과거로 간 시간 여행자의 일지를 확인해 보세요. 첫 번째 힌트가 있습니다.',
        answer: '암호는 9876입니다.',
        progressRate: 25,
        order: 1,
        isActive: true,
      },
    }),
    prisma.hint.create({
      data: {
        themeId: themes[1].id,
        code: 'T002',
        content: '미래의 컴퓨터에 적힌 문장을 해석해 보세요. 다음 힌트를 찾을 수 있습니다.',
        answer: '암호는 5432입니다.',
        progressRate: 55,
        order: 2,
        isActive: true,
      },
    }),
    prisma.hint.create({
      data: {
        themeId: themes[1].id,
        code: 'T003',
        content: '시간 기계 옆에 있는 다이얼을 과거로 돌리면 숨겨진 문이 열립니다.',
        answer: '탈출문은 서쪽 문입니다.',
        progressRate: 85,
        order: 3,
        isActive: true,
      },
    }),

    // 도둑의 금고 힌트
    prisma.hint.create({
      data: {
        themeId: themes[2].id,
        code: 'D001',
        content: '금고 입구 옆에 있는 그림을 자세히 살펴보세요. 숨겨진 암호가 있습니다.',
        answer: '암호는 1111입니다.',
        progressRate: 30,
        order: 1,
        isActive: true,
      },
    }),
    prisma.hint.create({
      data: {
        themeId: themes[2].id,
        code: 'D002',
        content: '책상 서랍에 있는 보물 지도를 확인해 보세요. 보물의 위치를 찾을 수 있습니다.',
        answer: '암호는 2222입니다.',
        progressRate: 60,
        order: 2,
        isActive: true,
      },
    }),
    prisma.hint.create({
      data: {
        themeId: themes[2].id,
        code: 'D003',
        content: '보물함 위에 있는 암호를 풀면 마지막 탈출문이 열립니다.',
        answer: '탈출문은 남쪽 문입니다.',
        progressRate: 90,
        order: 3,
        isActive: true,
      },
    }),
  ]);

  console.log('✅ Database seeded successfully with proper Korean text encoding!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Disconnected from database');
  });