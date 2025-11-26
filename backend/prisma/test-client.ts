import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Testing Prisma Client...');

  // 테마 수 확인
  const themeCount = await prisma.theme.count();
  console.log(`Total themes: ${themeCount}`);

  // 힌트 수 확인
  const hintCount = await prisma.hint.count();
  console.log(`Total hints: ${hintCount}`);

  // 첫 번째 테마 가져오기
  const firstTheme = await prisma.theme.findFirst();
  if (firstTheme) {
    console.log(`First theme: ${firstTheme.name}`);

    // 해당 테마의 힌트들 가져오기
    const hints = await prisma.hint.findMany({
      where: { themeId: firstTheme.id },
      orderBy: { order: 'asc' },
    });
    console.log(`Hints for ${firstTheme.name}:`, hints.length);

    // 각 힌트의 내용 출력
    hints.forEach((hint, index) => {
      console.log(`  Hint ${index + 1}: ${hint.content}`);
    });
  }

  // 게임 세션 수 확인 (seed 데이터에는 없을 수 있음)
  const sessionCount = await prisma.gameSession.count();
  console.log(`Total game sessions: ${sessionCount}`);

  console.log('Prisma Client test completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during Prisma Client test:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });