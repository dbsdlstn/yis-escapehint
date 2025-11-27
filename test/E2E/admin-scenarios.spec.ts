import { test, expect } from '@playwright/test';

test.describe('Admin Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('A1: Admin mode entry and new theme registration', async ({ page }) => {
    // Step 1: Enter admin mode by clicking logo 5 times
    const logo = page.locator('text=EscapeHint');
    for (let i = 0; i < 5; i++) {
      await logo.click();
    }

    // Step 2: Enter admin password
    await expect(page.getByText('관리자 로그인')).toBeVisible();
    await page.locator('input[type="password"]').fill('admin2024!@');
    await page.getByRole('button', { name: '로그인' }).click();

    // Step 3: Verify admin dashboard access
    await expect(page.getByText('대시보드')).toBeVisible();
    await expect(page.getByText('테마 관리')).toBeVisible();
    await expect(page.getByText('힌트 관리')).toBeVisible();
    await expect(page.getByText('세션 모니터링')).toBeVisible();

    // Step 4: Navigate to theme management
    await page.getByRole('button', { name: '테마 관리' }).click();
    await expect(page.getByText('새 테마 등록')).toBeVisible();

    // Step 5: Register new theme
    await page.getByRole('button', { name: '+ 새 테마 등록' }).click();
    await expect(page.locator('text=새 테마 등록')).toBeVisible();

    // Fill in theme details
    await page.locator('input[placeholder="테마 이름"]').fill('해적선의 보물');
    await page.locator('textarea[placeholder="테마 설명"]').fill('해적선에서 숨겨진 보물을 찾아라!');
    await page.locator('input[placeholder="제한 시간"]').fill('60');

    // Ensure activation toggle is ON
    const activationToggle = page.locator('text=활성화: ON');
    if (await activationToggle.count() === 0) {
      await page.locator('input[type="checkbox"]').click(); // Toggle activation
    }

    // Save the theme
    await page.getByRole('button', { name: '저장' }).click();

    // Step 6: Verify the new theme is registered and visible
    await expect(page.getByText('해적선의 보물')).toBeVisible();
    await expect(page.getByText('60분')).toBeVisible();
    await expect(page.getByText('0개')).toBeVisible(); // 0 hints initially
    await expect(page.getByText('🟢 활성')).toBeVisible();
  });

  test('A2: Add hints to registered theme (10 hints)', async ({ page }) => {
    // Navigate to admin mode and theme management (assuming already logged in)
    const logo = page.locator('text=EscapeHint');
    for (let i = 0; i < 5; i++) {
      await logo.click();
    }
    await page.locator('input[type="password"]').fill('admin2024!@');
    await page.getByRole('button', { name: '로그인' }).click();
    await page.getByRole('button', { name: '테마 관리' }).click();

    // Find the "해적선의 보물" theme and click "힌트 관리"
    // If it doesn't exist yet, create it first
    const pirateTheme = page.getByText('해적선의 보물');
    if (await pirateTheme.count() === 0) {
      // Create the theme first if it doesn't exist
      await page.getByRole('button', { name: '+ 새 테마 등록' }).click();
      await page.locator('input[placeholder="테마 이름"]').fill('해적선의 보물');
      await page.locator('textarea[placeholder="테마 설명"]').fill('해적선에서 숨겨진 보물을 찾아라!');
      await page.locator('input[placeholder="제한 시간"]').fill('60');
      await page.getByRole('button', { name: '저장' }).click();
    }

    // Click "힌트 관리" for the pirate theme
    await page.getByText('해적선의 보물').locator('..').getByRole('button', { name: '힌트 관리' }).click();

    // Add 10 hints
    const hintData = [
      { code: 'HINT01', content: '선장의 방에서 나침반을 찾으세요.', answer: '나침반은 책장 뒤에 있습니다.', progress: '10' },
      { code: 'HINT02', content: '갑판 위의 나무 상자 속을 확인하세요.', answer: '상자 안에는 열쇠가 있습니다.', progress: '20' },
      { code: 'HINT03', content: '돛대 위 편지에 적힌 암호를 풀어보세요.', answer: '암호는 해적의 암호 체계를 따릅니다.', progress: '30' },
      { code: 'HINT04', content: '돛대 뒤에 숨겨진 지도를 찾아보세요.', answer: '지도는 오른쪽 돛대 뒤에 있습니다.', progress: '40' },
      { code: 'HINT05', content: '선실의 비밀 서랍을 열어보세요.', answer: '서랍에는 고대의 열쇠가 있습니다.', progress: '50' },
      { code: 'HINT06', content: '돛대의 타이머가 가리키는 곳을 확인하세요.', answer: '타이머 방향은 북서쪽입니다.', progress: '60' },
      { code: 'HINT07', content: '해적의 일기장을 찾아보세요.', answer: '일기장은 선장의 방 책상에 있습니다.', progress: '70' },
      { code: 'HINT08', content: '돛대와 돛대 사이에 숨겨진 것을 찾아보세요.', answer: '돛대 사이에는 고대의 지도가 있습니다.', progress: '80' },
      { code: 'HINT09', content: '해적의 보물 상자에 적힌 암호를 풀어보세요.', answer: '암호는 선장의 생일입니다.', progress: '90' },
      { code: 'HINT10', content: '최종 보물 상자를 찾아 탈출하세요.', answer: '보물은 함선의 중앙 갑판에 있습니다.', progress: '100' }
    ];

    for (let i = 0; i < hintData.length; i++) {
      const hint = hintData[i];
      
      // Click "새 힌트 등록" button
      await page.getByRole('button', { name: '+ 새 힌트 등록' }).click();
      await expect(page.locator('text=새 힌트 등록')).toBeVisible();

      // Fill in hint details
      await page.locator('input[placeholder="힌트 코드"]').fill(hint.code);
      await page.locator('textarea[placeholder="힌트 내용"]').fill(hint.content);
      await page.locator('textarea[placeholder="정답"]').fill(hint.answer);
      await page.locator('input[placeholder="진행률"]').fill(hint.progress);

      // For the last hint, use '저장' instead of '저장 후 다음'
      if (i === hintData.length - 1) {
        await page.getByRole('button', { name: '저장' }).click();
      } else {
        await page.getByRole('button', { name: '저장 후 다음' }).click();
      }

      // Verify success message
      await expect(page.getByText('✅ 힌트가 저장되었습니다.')).toBeVisible();
    }

    // Verify all 10 hints are added
    const hintRows = page.locator('table tbody tr');
    await expect(hintRows).toHaveCount(10);

    // Check that HINT01 has 10% progress and HINT10 has 100%
    await expect(page.getByText('HINT01')).toBeVisible();
    await expect(page.getByText('10%')).toBeVisible();
    await expect(page.getByText('HINT10')).toBeVisible();
    await expect(page.getByText('100%')).toBeVisible();
  });

  test('A3: Hint content modification based on feedback', async ({ page }) => {
    // Access admin mode
    const logo = page.locator('text=EscapeHint');
    for (let i = 0; i < 5; i++) {
      await logo.click();
    }
    await page.locator('input[type="password"]').fill('admin2024!@');
    await page.getByRole('button', { name: '로그인' }).click();

    // Navigate to hint management for a theme
    await page.getByRole('button', { name: '테마 관리' }).click();
    await page.getByText('해적선의 보물').locator('..').getByRole('button', { name: '힌트 관리' }).click();

    // Find HINT05 and click the edit button
    await page.getByText('HINT05').locator('..').getByRole('button', { name: '수정' }).click();

    // Modify the hint content
    await page.locator('textarea[placeholder="힌트 내용"]').fill('선실 침대 옆 서랍에 숫자 자물쇠가 있습니다. 비밀번호는 4자리입니다.');
    await page.getByRole('button', { name: '저장' }).click();

    // Verify the modification was successful
    await expect(page.getByText('✅ 힌트가 수정되었습니다.')).toBeVisible();
    await expect(page.getByText('선실 침대 옆 서랍에 숫자 자물쇠가 있습니다.')).toBeVisible();
  });

  test('A4: Session monitoring during active games', async ({ page }) => {
    // Access admin mode
    const logo = page.locator('text=EscapeHint');
    for (let i = 0; i < 5; i++) {
      await logo.click();
    }
    await page.locator('input[type="password"]').fill('admin2024!@');
    await page.getByRole('button', { name: '로그인' }).click();

    // Navigate to session monitoring
    await page.getByRole('button', { name: '세션 모니터링' }).click();
    
    // Verify session monitoring page is visible
    await expect(page.getByText('진행 중인 세션')).toBeVisible();
    await expect(page.getByText('전체 세션')).toBeVisible();
    
    // Test filters
    await page.getByRole('button', { name: '진행중' }).click();
    await expect(page.getByText('진행중')).toBeVisible();
    
    // Test that session details are visible
    // Since we don't have real sessions, we'll check for the UI elements
    const sessionTable = page.locator('table.sessions');
    await expect(sessionTable).toBeVisible();
  });
});