const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkThemes() {
  try {
    const themes = await prisma.theme.findMany({
      include: {
        _count: {
          select: { hints: true }
        }
      }
    });
    
    console.log('Current themes in database:');
    themes.forEach(theme => {
      console.log(`ID: ${theme.id}`);
      console.log(`Name: ${theme.name}`);
      console.log(`Description: ${theme.description}`);
      console.log(`Play time: ${theme.playTime} minutes`);
      console.log(`Difficulty: ${theme.difficulty}`);
      console.log(`Active: ${theme.isActive}`);
      console.log(`Hint count: ${theme._count.hints}`);
      console.log('---');
    });
  } catch (error) {
    console.error('Error checking themes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkThemes();