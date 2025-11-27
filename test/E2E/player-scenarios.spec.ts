import { test, expect } from '@playwright/test';

// 플레이어 시나리오 테스트
test.describe('Player Scenarios', () => {
  // 시나리오 P1: 첫 방문 플레이어의 게임 시작 및 힌트 확인
  test('Scenario P1: 첫 방문 플레이어 게임 진행', async ({ page }) => {
    // 테마 선택 화면으로 이동
    await page.goto('/');
    
    // 테마가 로드될 때까지 기다림
    await expect(page.getByText('테마를 선택하세요')).toBeVisible();
    
    // "좀비 연구소" 테마 선택
    const zombieLabTheme = page.getByText('좀비 연구소');
    await expect(zombieLabTheme).toBeVisible();
    await zombieLabTheme.click();
    
    // 게임 화면으로 이동했는지 확인
    await expect(page.locator('text=힌트 코드를 입력하세요')).toBeVisible();
    
    // 타이머가 시작되었는지 확인 (60분 또는 90분 - 테마에 따라 다름)
    const timerElement = page.locator('.font-mono');
    await expect(timerElement).toBeVisible();
    
    // 힌트 입력 필드가 포커스되었는지 확인
    const firstHintInput = page.locator('#hint-input-0');
    await expect(firstHintInput).toBeFocused();
    
    // 테마 ID 저장 (힌트 제출 시 필요)
    const url = page.url();
    const themeId = url.split('/').pop();
    
    // 힌트 코드 입력 (4자리 숫자)
    await page.fill('#hint-input-0', '1');
    await page.fill('#hint-input-1', '0');
    await page.fill('#hint-input-2', '0');
    await page.fill('#hint-input-3', '0');
    
    // 확인 버튼 클릭
    await page.click('button:has-text("확인")');
    
    // 힌트 화면으로 이동했는지 확인
    await expect(page.locator('text=HINT')).toBeVisible();
  });

  // 시나리오 P2: 중간에 브라우저를 닫았다가 다시 접속 (세션 복구)
  test('Scenario P2: 세션 복구 기능', async ({ page }) => {
    // 먼저 게임 세션 시작
    await page.goto('/');
    await page.getByText('좀비 연구소').click();
    await expect(page.locator('text=힌트 코드를 입력하세요')).toBeVisible();
    
    // 현재 URL 및 로컬 스토리지의 세션 ID 저장
    const initialUrl = page.url();
    const sessionId = await page.evaluate(() => localStorage.getItem('currentSessionId'));
    
    // 페이지 새로 고침 (세션 복구 시뮬레이션)
    await page.reload();
    
    // 같은 테마 ID로 다시 연결되었는지 확인
    await expect(page.locator('text=힌트 코드를 입력하세요')).toBeVisible();
    const currentSessionId = await page.evaluate(() => localStorage.getItem('currentSessionId'));
    expect(currentSessionId).toBe(sessionId);
  });

  // 시나리오 P3: 잘못된 힌트 코드 입력 (오류 처리)
  test('Scenario P3: 잘못된 힌트 코드 입력', async ({ page }) => {
    await page.goto('/');
    await page.getByText('좀비 연구소').click();
    await expect(page.locator('text=힌트 코드를 입력하세요')).toBeVisible();
    
    // 잘못된 힌트 코드 입력
    await page.fill('#hint-input-0', '9');
    await page.fill('#hint-input-1', '9');
    await page.fill('#hint-input-2', '9');
    await page.fill('#hint-input-3', '9');
    
    // 확인 버튼 클릭
    await page.click('button:has-text("확인")');
    
    // 오류 메시지 확인
    await expect(page.locator('text=힌트를 찾을 수 없습니다')).toBeVisible();
  });
});