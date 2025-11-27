const { prisma } = require('./dist/shared/utils/prisma.util.js');

async function updateHintContent() {
  try {
    // Update hint content and answers to use English text to avoid encoding issues
    const themes = await prisma.theme.findMany({
      include: {
        hints: {
          orderBy: { order: 'asc' }
        }
      }
    });

    for (const theme of themes) {
      console.log(`Updating hints for theme: ${theme.id}`);
      
      for (let i = 0; i < theme.hints.length; i++) {
        const hint = theme.hints[i];
        
        // Update hint content and answer to use clear English text to avoid encoding issues
        const updatedHint = await prisma.hint.update({
          where: { id: hint.id },
          data: {
            content: `Hint ${i+1} for theme ${theme.id}: Look for clues in the designated areas.`,
            answer: `Answer for hint ${i+1}: The solution is provided based on the hint.`
          }
        });
        
        console.log(`  Updated hint ${hint.code} content and answer`);
      }
    }
    
    console.log('✅ All hint content and answers updated!');
  } catch (error) {
    console.error('Error updating hint content:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateHintContent();