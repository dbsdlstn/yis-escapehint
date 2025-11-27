const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkHints() {
  try {
    console.log('=== 힌트 데이터 확인 ===\n');

    // 모든 힌트 조회
    const hints = await prisma.hint.findMany({
      include: {
        theme: {
          select: {
            name: true
          }
        }
      }
    });

    console.log(`총 힌트 수: ${hints.length}\n`);

    hints.forEach((hint, index) => {
      console.log(`${index + 1}. 힌트 정보:`);
      console.log(`   - ID: ${hint.id}`);
      console.log(`   - 코드: ${hint.code}`);
      console.log(`   - 테마: ${hint.theme.name}`);
      console.log(`   - 테마 ID: ${hint.themeId}`);
      console.log(`   - 활성: ${hint.isActive}`);
      console.log(`   - 내용: ${hint.content.substring(0, 50)}...`);
      console.log('');
    });

    // 특정 코드로 검색 테스트
    console.log('=== Z001 코드 검색 테스트 ===');
    const testHint = await prisma.hint.findFirst({
      where: {
        code: 'Z001'
      }
    });

    if (testHint) {
      console.log('✓ Z001 힌트를 찾았습니다!');
      console.log(`  테마 ID: ${testHint.themeId}`);
      console.log(`  활성 상태: ${testHint.isActive}`);
    } else {
      console.log('✗ Z001 힌트를 찾지 못했습니다.');
    }

  } catch (error) {
    console.error('에러 발생:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkHints();
