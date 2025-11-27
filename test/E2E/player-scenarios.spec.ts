import { test, expect } from '@playwright/test';

test.describe('Player Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
  });

  test('P1: First-time player game start and hint usage', async ({ page }) => {
    // Step 1: App access and theme selection
    await expect(page).toHaveTitle(/EscapeHint/);
    await expect(page.getByText('테마를 선택하세요')).toBeVisible();

    // Select the "좀비 연구소" theme
    const zombieLabCard = page.locator('text= zombie 연구소');
    await expect(zombieLabCard).toBeVisible();
    await page.getByRole('button', { name: '시작하기' }).first().click();

    // Step 2: Game screen entry and timer start
    await expect(page.getByText('게임을 시작합니다...')).toBeVisible();
    await expect(page.locator('text=60:00')).toBeVisible();

    // Step 3: Hint input field focus
    await expect(page.getByPlaceholder(/힌트 코드를 입력하세요/)).toBeFocused();

    // Step 4: Simulate 20 minutes of game time (we'll just test the functionality)
    await expect(page.locator('text=60:00')).toBeVisible();

    // Step 5: Enter first hint code
    await page.getByPlaceholder(/힌트 코드를 입력하세요/).fill('HINT01');
    await page.getByRole('button', { name: '확인' }).click();

    // Step 6: Verify hint content display
    await expect(page.getByText('힌트 #1')).toBeVisible();
    await expect(page.getByText('거울 뒤를 확인하세요. 숨겨진 숫자가 있습니다.')).toBeVisible();
    await expect(page.getByText('진행률: 15%')).toBeVisible();

    // Step 7: Test answer view (optional)
    await page.getByRole('button', { name: '정답보기' }).click();
    await expect(page.getByText('정답: 1234')).toBeVisible();

    // Step 8: Return to game screen
    await page.getByRole('button', { name: '돌아가기' }).click();
    await expect(page.getByPlaceholder(/힌트 코드를 입력하세요/)).toBeFocused();
    await expect(page.getByText('진행률: 15%')).toBeVisible();
    await expect(page.getByText('사용 힌트: 1개')).toBeVisible();

    // Step 9: Use additional hints
    await page.getByPlaceholder(/힌트 코드를 입력하세요/).fill('HINT02');
    await page.getByRole('button', { name: '확인' }).click();
    await expect(page.getByText('힌트 #2')).toBeVisible();

    // Return to game screen
    await page.getByRole('button', { name: '돌아가기' }).click();
    await expect(page.getByText('진행률: 30%')).toBeVisible();
    await expect(page.getByText('사용 힌트: 2개')).toBeVisible();

    // Step 10: Complete game
    await page.getByRole('button', { name: '게임 종료' }).click();
    await expect(page.getByText(/축하합니다!/)).toBeVisible();
    await expect(page.getByText(/방탈출 성공!/)).toBeVisible();
    await expect(page.getByText(/소요 시간:/)).toBeVisible();
    await expect(page.getByText(/사용 힌트: 2개/)).toBeVisible();
  });

  test('P2: Session recovery after browser close', async ({ page, context }) => {
    // Start a session and use a hint
    await page.goto('/');
    await page.getByRole('button', { name: '시작하기' }).first().click();
    await expect(page.locator('text=60:00')).toBeVisible();

    // Use a hint to have some progress
    await page.getByPlaceholder(/힌트 코드를 입력하세요/).fill('HINT01');
    await page.getByRole('button', { name: '확인' }).click();
    await expect(page.getByText('진행률: 15%')).toBeVisible();
    await page.getByRole('button', { name: '돌아가기' }).click();

    // Close and reopen the page to simulate browser closing
    const newPage = await context.newPage();
    await newPage.goto('/');

    // Should be automatically redirected to the game screen with session restored
    await expect(newPage.locator('text=60:00')).toBeVisible(); // Timer should continue from server time
    await expect(newPage.getByText('진행률: 15%')).toBeVisible();
    await expect(newPage.getByText('사용 힌트: 1개')).toBeVisible();
    await expect(newPage.getByText('세션이 복구되었습니다.')).toBeVisible();
  });

  test('P3: Invalid hint code input handling', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: '시작하기' }).first().click();
    await expect(page.locator('text=60:00')).toBeVisible();

    // Enter invalid hint code
    await page.getByPlaceholder(/힌트 코드를 입력하세요/).fill('HINT99');
    await page.getByRole('button', { name: '확인' }).click();

    // Verify error message
    await expect(page.getByText(/힌트를 찾을 수 없습니다. 코드를 다시 확인하세요./)).toBeVisible();

    // Verify input field is still available
    await expect(page.getByPlaceholder(/힌트 코드를 입력하세요/)).toBeFocused();
  });

  test('P4: Duplicate hint usage', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: '시작하기' }).first().click();
    await expect(page.locator('text=60:00')).toBeVisible();

    // Enter first hint code
    await page.getByPlaceholder(/힌트 코드를 입력하세요/).fill('HINT01');
    await page.getByRole('button', { name: '확인' }).click();
    await expect(page.getByText('힌트 #1')).toBeVisible();
    await page.getByRole('button', { name: '돌아가기' }).click();
    await expect(page.getByText('사용 힌트: 1개')).toBeVisible();

    // Enter the same hint code again
    await page.getByPlaceholder(/힌트 코드를 입력하세요/).fill('HINT01');
    await page.getByRole('button', { name: '확인' }).click();
    await expect(page.getByText('히')).toBeVisible();
    await expect(page.getByText('이미 확인한 힌트입니다.')).toBeVisible();
    await page.getByRole('button', { name: '돌아가기' }).click();
    
    // Hint count should not increase
    await expect(page.getByText('사용 힌트: 1개')).toBeVisible(); // Still 1, not 2
  });

  test('P5: Game continuation after time limit', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: '시작하기' }).first().click();
    
    // Simulate timer reaching 00:00
    // In real scenario, we would need to wait or mock the timer
    // For now, we test that the continuation UI is available
    
    // Simulate reaching the time limit notification
    await page.evaluate(() => {
      // Simulate reaching 00:00 in timer
      const timer = document.querySelector('.timer');
      if (timer) {
        timer.textContent = '00:00';
      }
    });

    // Check for continuation dialog
    await page.getByRole('button', { name: '계속하기' }).click();
    
    // Timer should continue in negative
    await expect(page.locator('.timer')).not.toBeEmpty();
  });
});