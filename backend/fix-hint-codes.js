const { prisma } = require('./dist/shared/utils/prisma.util.js');

async function fixHintCodes() {
  try {
    // Get all themes
    const themes = await prisma.theme.findMany();
    
    for (const theme of themes) {
      console.log(`Processing theme: ${theme.name} (${theme.id})`);
      
      // Get all hints for this theme
      const hints = await prisma.hint.findMany({
        where: { themeId: theme.id }
      });
      
      console.log(`  Current hints count: ${hints.length}`);
      
      // Update existing hints to ensure codes are 4 digits
      for (let j = 0; j < hints.length; j++) {
        const hint = hints[j];

        // Extract the theme-based prefix and ensure the number part is 4 digits
        const prefixMatch = hint.code.match(/^([A-Za-z]+)(\d+)$/);
        if (prefixMatch) {
          const originalPrefix = prefixMatch[1].substring(0, 3).toUpperCase(); // Take first 3 chars of prefix
          const numberPart = prefixMatch[2];
          const fourDigitNumber = numberPart.padStart(4, '0').slice(-4); // Ensure it's 4 digits
          const newCode = originalPrefix + fourDigitNumber;

          if (hint.code !== newCode) {
            await prisma.hint.update({
              where: { id: hint.id },
              data: { code: newCode }
            });
            console.log(`    Updated hint code from ${hint.code} to ${newCode}`);
          }
        } else {
          // If the code doesn't follow the expected pattern, create a new one based on theme ID
          let prefix;
          if (hint.code.toLowerCase().includes('zombie') || theme.name.includes('좀비')) {
            prefix = 'ZMB';
          } else if (hint.code.toLowerCase().includes('time') || theme.name.includes('시간')) {
            prefix = 'TMR';
          } else if (hint.code.toLowerCase().includes('thief') || theme.name.includes('도둑')) {
            prefix = 'THF';
          } else if (hint.code.toLowerCase().includes('galaxy') || theme.name.includes('은하')) {
            prefix = 'GLX';
          } else if (hint.code.toLowerCase().includes('ancient') || theme.name.includes('고대')) {
            prefix = 'ACN';
          } else {
            prefix = 'HT';
          }

          const newCode = prefix + String(j+1).padStart(4, '0');
          await prisma.hint.update({
            where: { id: hint.id },
            data: { code: newCode }
          });
          console.log(`    Updated hint code from ${hint.code} to ${newCode}`);
        }
      }

      // If theme has less than 3 hints, add more
      if (hints.length < 3) {
        const hintsToAdd = 3 - hints.length;
        console.log(`  Need to add ${hintsToAdd} hints`);

        // Determine the appropriate prefix for this theme
        let prefix;
        if (theme.name.includes('좀비') || theme.name.includes('Zombie')) {
          prefix = 'ZMB';
        } else if (theme.name.includes('시간') || theme.name.includes('Time')) {
          prefix = 'TMR';
        } else if (theme.name.includes('도둑') || theme.name.includes('Thief')) {
          prefix = 'THF';
        } else if (theme.name.includes('은하') || theme.name.includes('Galaxy')) {
          prefix = 'GLX';
        } else if (theme.name.includes('고대') || theme.name.includes('Ancient')) {
          prefix = 'ACN';
        } else {
          prefix = 'HT';
        }

        for (let i = 0; i < hintsToAdd; i++) {
          const newHintNumber = hints.length + i + 1;
          const code = prefix + String(newHintNumber).padStart(4, '0');

          await prisma.hint.create({
            data: {
              themeId: theme.id,
              code: code,
              content: `Additional hint ${newHintNumber} for ${theme.name}`,
              answer: `The answer for hint ${newHintNumber} is ...`,
              progressRate: 30 * (newHintNumber), // 30, 60, 90 for 3 hints
              order: newHintNumber,
              isActive: true,
            },
          });

          console.log(`    Added hint with code: ${code}`);
        }
      }
    }
    
    console.log('✅ All hint codes fixed and themes have at least 3 hints each!');
  } catch (error) {
    console.error('Error fixing hint codes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixHintCodes();