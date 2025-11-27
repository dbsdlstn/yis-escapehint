const { prisma } = require('./dist/shared/utils/prisma.util.js');

async function addHintsToThiefTheme() {
  try {
    // Add 3 hints for the Thief's Vault theme (bf92abf6-91f5-41d8-a023-8b0ada88e401)
    await prisma.hint.create({
      data: {
        themeId: 'bf92abf6-91f5-41d8-a023-8b0ada88e401',
        code: 'THIEF01',
        content: 'Check the painting near the entrance for a hidden clue.',
        answer: 'The password is 1111.',
        progressRate: 30,
        order: 1,
        isActive: true,
      },
    });

    await prisma.hint.create({
      data: {
        themeId: 'bf92abf6-91f5-41d8-a023-8b0ada88e401',
        code: 'THIEF02',
        content: 'Look for the hidden compartment behind the statue.',
        answer: 'The key is shaped like a scarab.',
        progressRate: 60,
        order: 2,
        isActive: true,
      },
    });

    await prisma.hint.create({
      data: {
        themeId: 'bf92abf6-91f5-41d8-a023-8b0ada88e401',
        code: 'THIEF03',
        content: 'The final vault mechanism requires aligning the three gems.',
        answer: 'Rotate the gems to show the red, blue, and green faces.',
        progressRate: 90,
        order: 3,
        isActive: true,
      },
    });

    console.log('✅ Additional hints added to Thief\'s Vault theme successfully!');
  } catch (error) {
    console.error('Error adding hints to thief theme:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addHintsToThiefTheme();