const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // 테마 3개 생성
  const theme1 = await prisma.theme.create({
    data: {
      name: '좀비 연구소',
      description: '사라진 연구원의 흔적을 찾아 좀비가 난무하는 연구소를 탈출하라',
      playTime: 90,
      difficulty: '상',
      isActive: true,
    },
  });

  const theme2 = await prisma.theme.create({
    data: {
      name: '시간 여행자의 방',
      description: '과거와 미래를 넘나드는 시간 여행자의 방에서 탈출하라',
      playTime: 120,
      difficulty: '중',
      isActive: true,
    },
  });

  const theme3 = await prisma.theme.create({
    data: {
      name: '도둑의 금고',
      description: '도둑의 금고에서 보물을 훔치고 탈출하라',
      playTime: 60,
      difficulty: '하',
      isActive: true,
    },
  });

  // 좀비 연구소 힌트
  await prisma.hint.create({
    data: {
      themeId: theme1.id,
      code: 'ZOMBIE01',
      content: '책상 위에 놓인 실험 일지를 확인해 보세요. 첫 번째 힌트가 있습니다.',
      answer: '암호는 1234입니다.',
      progressRate: 20,
      order: 1,
      isActive: true,
    },
  });

  await prisma.hint.create({
    data: {
      themeId: theme1.id,
      code: 'ZOMBIE02',
      content: '서쪽 벽에 있는 해부학 도표를 자세히 살펴보세요. 숨겨진 숫자가 있습니다.',
      answer: '암호는 5678입니다.',
      progressRate: 50,
      order: 2,
      isActive: true,
    },
  });

  await prisma.hint.create({
    data: {
      themeId: theme1.id,
      code: 'ZOMBIE03',
      content: '실험 기구 뒤쪽에 보석함이 있습니다. 힌트를 이용해 암호를 푸세요.',
      answer: '탈출문은 북쪽 문입니다.',
      progressRate: 80,
      order: 3,
      isActive: true,
    },
  });

  // 시간 여행자의 방 힌트
  await prisma.hint.create({
    data: {
      themeId: theme2.id,
      code: 'TIME01',
      content: '과거로 간 시간 여행자의 일지를 확인해 보세요. 첫 번째 힌트가 있습니다.',
      answer: '암호는 9876입니다.',
      progressRate: 25,
      order: 1,
      isActive: true,
    },
  });

  await prisma.hint.create({
    data: {
      themeId: theme2.id,
      code: 'TIME02',
      content: '미래의 컴퓨터에 적힌 문장을 해석해 보세요. 다음 힌트를 찾을 수 있습니다.',
      answer: '암호는 5432입니다.',
      progressRate: 55,
      order: 2,
      isActive: true,
    },
  });

  await prisma.hint.create({
    data: {
      themeId: theme2.id,
      code: 'TIME03',
      content: '시간 기계 옆에 있는 다이얼을 과거로 돌리면 숨겨진 문이 열립니다.',
      answer: '탈출문은 서쪽 문입니다.',
      progressRate: 85,
      order: 3,
      isActive: true,
    },
  });

  // 도둑의 금고 힌트
  await prisma.hint.create({
    data: {
      themeId: theme3.id,
      code: 'THIEF01',
      content: '금고 입구 옆에 있는 그림을 자세히 살펴보세요. 숨겨진 암호가 있습니다.',
      answer: '암호는 1111입니다.',
      progressRate: 30,
      order: 1,
      isActive: true,
    },
  });

  await prisma.hint.create({
    data: {
      themeId: theme3.id,
      code: 'THIEF02',
      content: '책상 서랍에 있는 보물 지도를 확인해 보세요. 보물의 위치를 찾을 수 있습니다.',
      answer: '암호는 2222입니다.',
      progressRate: 60,
      order: 2,
      isActive: true,
    },
  });

  await prisma.hint.create({
    data: {
      themeId: theme3.id,
      code: 'THIEF03',
      content: '보물함 위에 있는 암호를 풀면 마지막 탈출문이 열립니다.',
      answer: '탈출문은 남쪽 문입니다.',
      progressRate: 90,
      order: 3,
      isActive: true,
    },
  });

  console.log('✅ Seed 완료!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
