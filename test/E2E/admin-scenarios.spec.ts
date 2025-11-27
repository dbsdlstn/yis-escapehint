import { test, expect } from '@playwright/test';

// 관리자 시나리오 테스트
test.describe('Admin Scenarios', () => {
  // 시나리오 A1: 관리자 모드 진입 및 새 테마 등록
  test('Scenario A1: 관리자 로그인 및 테마 등록', async ({ page }) => {
    // 관리자 모드 진입 (로고 5회 클릭)
    await page.goto('/');
    for (let i = 0; i < 5; i++) {
      await page.locator('h1:has-text("EscapeHint")').click();
    }
    
    // 관리자 로그인 모달이 열리는지 확인
    await expect(page.locator('text=관리자 로그인')).toBeVisible();
    
    // 비밀번호 입력 (실제 비밀번호는 환경에 따라 다름)
    await page.fill('input[type="password"]', 'admin123'); // 임시 비밀번호
    
    // 로그인 시도
    await page.click('button:has-text("로그인")');
    
    // 관리자 대시보드로 이동 (대시보드 요소 확인)
    await expect(page.locator('text=관리자 대시보드')).toBeVisible();
    
    // 테마 관리 탭 클릭
    await page.click('text=테마 관리');
    
    // 새 테마 등록 버튼 클릭
    await page.click('text=+ 새 테마 등록');
    
    // 테마 등록 폼에 정보 입력
    await page.fill('input[placeholder="테마 이름"]', '테스트 테마');
    await page.fill('textarea[placeholder="테마 설명"]', 'Playwright 테스트용 테마');
    await page.fill('input[placeholder="제한 시간"]', '60');
    
    // 테마 저장
    await page.click('button:has-text("저장")');
    
    // 등록된 테마가 목록에 나타나는지 확인
    await expect(page.locator('text=테스트 테마')).toBeVisible();
  });

  // 시나리오 A2: 힌트 추가 (10개)
  test('Scenario A2: 등록한 테마에 힌트 추가', async ({ page }) => {
    // 관리자 모드로 이동 (이전 시나리오와 동일한 방법으로)
    await page.goto('/');
    for (let i = 0; i < 5; i++) {
      await page.locator('h1:has-text("EscapeHint")').click();
    }
    
    await expect(page.locator('text=관리자 로그인')).toBeVisible();
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("로그인")');
    
    // 테마 관리로 이동
    await page.click('text=테마 관리');
    
    // 첫 번째 테마의 힌트 관리 버튼 클릭
    await page.click('text=힌트 관리');
    
    // 10개의 힌트 추가
    for (let i = 1; i <= 10; i++) {
      // 새 힌트 등록 버튼 클릭
      await page.click('text=+ 새 힌트 등록');
      
      // 힌트 정보 입력
      await page.fill('input[placeholder="힌트 코드"]', `HINT${i.toString().padStart(2, '0')}`);
      await page.fill('textarea[placeholder="힌트 내용"]', `테스트 힌트 내용 ${i}`);
      await page.fill('textarea[placeholder="정답"]', `테스트 정답 ${i}`);
      await page.fill('input[placeholder="진행률"]', (i * 10).toString());
      
      // 저장 후 다음 버튼 클릭 (마지막 힌트는 저장 버튼)
      if (i < 10) {
        await page.click('button:has-text("저장 후 다음")');
      } else {
        await page.click('button:has-text("저장")');
      }
    }
    
    // 등록된 힌트들이 목록에 표시되는지 확인
    for (let i = 1; i <= 10; i++) {
      await expect(page.locator(`text=HINT${i.toString().padStart(2, '0')}`)).toBeVisible();
    }
  });
});