const { prisma } = require('./dist/shared/utils/prisma.util.js');

async function updateToFourDigitCodes() {
  try {
    // Get all themes
    const themes = await prisma.theme.findMany();
    
    for (const theme of themes) {
      console.log(`Processing theme: ${theme.id}`);
      
      // Get all hints for this theme
      const hints = await prisma.hint.findMany({
        where: { themeId: theme.id },
        orderBy: { order: 'asc' } // Order by original order to maintain sequence
      });
      
      console.log(`  Current hints: ${hints.length}`);
      
      // Update each hint to have a 4-digit code for this specific theme
      for (let i = 0; i < hints.length; i++) {
        // Create a 4-digit code specific to this theme and position
        // Using the first 2 characters of the theme ID plus 2 digits for the hint number
        const themeCode = theme.id.substring(0, 2).toUpperCase();
        const hintNumber = String(i + 1).padStart(2, '0');
        const newCode = themeCode + hintNumber;
        
        await prisma.hint.update({
          where: { id: hints[i].id },
          data: { code: newCode }
        });
        
        console.log(`    Updated hint ${i+1} code to: ${newCode}`);
      }
    }
    
    console.log('✅ All hint codes updated to 4-digit format!');
  } catch (error) {
    console.error('Error updating to four digit codes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateToFourDigitCodes();