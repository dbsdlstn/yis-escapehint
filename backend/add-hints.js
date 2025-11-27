// Use the same prisma client initialization as in the application
const { prisma } = require('./dist/shared/utils/prisma.util.js');

async function seedHints() {
  try {
    // Add 3 hints for the 3rd theme (은하수 탐험대)
    await prisma.hint.create({
      data: {
        themeId: '3ca74b49-c561-40fa-845c-9e731bf6a066',
        code: 'GALAXY01',
        content: 'Check the constellation map displayed on the spaceship dashboard carefully.',
        answer: 'The password is 7890.',
        progressRate: 30,
        order: 1,
        isActive: true,
      },
    });

    await prisma.hint.create({
      data: {
        themeId: '3ca74b49-c561-40fa-845c-9e731bf6a066',
        code: 'GALAXY02',
        content: 'Look for the alien symbols near the engine room.',
        answer: 'The coordinates are X:245, Y:178.',
        progressRate: 60,
        order: 2,
        isActive: true,
      },
    });

    await prisma.hint.create({
      data: {
        themeId: '3ca74b49-c561-40fa-845c-9e731bf6a066',
        code: 'GALAXY03',
        content: 'Check the captain\'s log for the final escape sequence.',
        answer: 'The escape route is through the cargo bay.',
        progressRate: 90,
        order: 3,
        isActive: true,
      },
    });

    // Add 3 hints for the 4th theme (고대 유적의 비밀)
    await prisma.hint.create({
      data: {
        themeId: 'b0cdadb8-291d-474b-87c1-0c605d4f9ac3',
        code: 'ANCIENT01',
        content: 'Examine the hieroglyphs on the main wall carefully.',
        answer: 'The first symbol represents water.',
        progressRate: 30,
        order: 1,
        isActive: true,
      },
    });

    await prisma.hint.create({
      data: {
        themeId: 'b0cdadb8-291d-474b-87c1-0c605d4f9ac3',
        code: 'ANCIENT02',
        content: 'Look for the hidden compartment behind the statue.',
        answer: 'The key is shaped like a scarab.',
        progressRate: 60,
        order: 2,
        isActive: true,
      },
    });

    await prisma.hint.create({
      data: {
        themeId: 'b0cdadb8-291d-474b-87c1-0c605d4f9ac3',
        code: 'ANCIENT03',
        content: 'The final door mechanism is activated by aligning the stars.',
        answer: 'Rotate the stone circle to match the constellation.',
        progressRate: 90,
        order: 3,
        isActive: true,
      },
    });

    console.log('✅ Hints added successfully!');
  } catch (error) {
    console.error('Error adding hints:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedHints();