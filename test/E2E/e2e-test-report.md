# EscapeHint E2E Test Report

**Test Run Date:** 2025-11-27  
**Test Environment:** Local development (Chrome DevTools)  
**Test Runner:** Playwright-MCP  
**Document Reference:** [User Scenario Document](../../docs/4-user-scenario.md)

## Overview

This report documents the End-to-End testing results for the EscapeHint application based on the user scenarios defined in the User Scenario Document. The tests cover both player and admin user flows to ensure the application meets functional requirements.

## Test Scenarios Overview

| Scenario ID | Scenario Title | Priority | Status |
|-------------|----------------|----------|---------|
| P1 | 첫 방문 플레이어의 게임 시작 및 힌트 확인 | P0 | Failed |
| P2 | 중간에 브라우저를 닫았다가 다시 접속 (세션 복구) | P1 | Failed |
| P3 | 잘못된 힌트 코드 입력 (오류 처리) | P0 | Failed |
| A1 | 관리자 모드 진입 및 새 테마 등록 | P0 | Failed |
| A2 | 등록한 테마에 힌트 추가 (10개) | P0 | Failed |

## Test Environment Details

- **Application URL:** http://localhost:5173/
- **Backend URL:** http://localhost:3000/api (assumed)
- **Browser:** Chromium, Firefox, WebKit (via Playwright)
- **Viewport:** 1024x768 (responsive testing)
- **Network:** Stable local network

## Test Results

### Scenario P1: 첫 방문 플레이어의 게임 시작 및 힌트 확인

**Objective:** Test the complete flow from accessing the app to using hints and finishing the game.

**Status:** Failed
**Browser(s):** All browsers (Chromium, Firefox, WebKit)

#### Test Steps Performed:

1. **Access Application**
   - Navigate to http://localhost:5173/
   - Verify theme selection screen displays

2. **Select Theme**
   - Verify available themes are listed
   - Click on "좀비 연구소" [시작하기] button
   - Verify game screen loads with timer

3. **Game Screen Verification**
   - Verify timer starts
   - Verify hint input field is focused
   - Verify progress and hint count display

4. **Enter Hint Code**
   - Enter a valid hint code
   - Click [확인] button
   - Verify hint details screen displays

5. **View Hint Details**
   - Verify hint content displays correctly
   - Verify progress percentage updates
   - Click [돌아가기] button

6. **Return to Game Screen**
   - Verify return to game screen
   - Verify updated progress and hint count

#### Test Results:

| Step | Expected | Actual | Status | Notes |
|------|----------|--------|--------|-------|
| App Access | Theme selection screen displays | ❌ Element not found: "테마를 선택하세요" | ❌ FAIL | Text element not found on page |
| Theme Selection | Game screen loads with timer | ❌ N/A due to previous step | ❌ N/A | - |
| Input Field | Hint input focused | ❌ N/A due to previous step | ❌ N/A | - |
| Hint Entry | Valid code accepted | ❌ N/A due to previous step | ❌ N/A | - |
| Hint Display | Hint content shows | ❌ N/A due to previous step | ❌ N/A | - |
| Return to Game | Returns to game screen | ❌ N/A due to previous step | ❌ N/A | - |

#### Error Logs:

```
Error: expect(locator).toBeVisible() failed
Locator: getByText('테마를 선택하세요')
Expected: visible
Timeout: 5000ms
Error: element(s) not found
```

#### Issues Found:

1. **Element Not Found**: The text "테마를 선택하세요" is not found on the page, indicating possible UI text changes or application loading issues.

### Scenario P2: 중간에 브라우저를 닫았다가 다시 접속 (세션 복구)

**Objective:** Test session recovery functionality when browser is closed and reopened.

**Status:** Failed
**Browser(s):** All browsers (Chromium, Firefox, WebKit)

#### Test Steps Performed:

1. Start a game session
2. Record session ID from localStorage
3. Simulate browser closure and reopening
4. Verify session is restored from localStorage
5. Validate timer continues from correct time
6. Confirm previously used hints are preserved

#### Test Results:

| Step | Expected | Actual | Status | Notes |
|------|----------|--------|--------|-------|
| App Access | Theme selection screen displays | ❌ Element not found: "좀비 연구소" | ❌ FAIL | Could not start initial game session |
| Session Start | Game screen loads with timer | ❌ N/A due to previous step | ❌ N/A | - |
| Session Recovery | Session restored from localStorage | ❌ N/A due to previous step | ❌ N/A | - |
| Timer Continuation | Timer continues from correct time | ❌ N/A due to previous step | ❌ N/A | - |

#### Error Logs:

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
- waiting for getByText('좀비 연구소')
```

#### Issues Found:

1. **Element Not Found**: The theme "좀비 연구소" is not found on the page, preventing test continuation.
2. **Application Loading Issue**: The application may not be loading correctly or UI text may have changed.

### Scenario P3: 잘못된 힌트 코드 입력 (오류 처리)

**Objective:** Test error handling when invalid hint codes are entered.

**Status:** Failed
**Browser(s):** All browsers (Chromium, Firefox, WebKit)

#### Test Steps Performed:

1. Access game screen
2. Enter invalid hint code (e.g., "HINT99")
3. Verify error message displays: "❌ 힌트를 찾을 수 없습니다. 코드를 다시 확인하세요."
4. Verify input field remains and allows re-entry
5. Test other error cases (inactive hints, wrong theme hints)

#### Test Results:

| Step | Expected | Actual | Status | Notes |
|------|----------|--------|--------|-------|
| App Access | Theme selection screen displays | ❌ Element not found: "좀비 연구소" | ❌ FAIL | Could not start initial game session |
| Game Screen | Game screen loads | ❌ N/A due to previous step | ❌ N/A | - |
| Invalid Code Entry | Error message displays | ❌ N/A due to previous step | ❌ N/A | - |

#### Error Logs:

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
- waiting for getByText('좀비 연구소')
```

#### Issues Found:

1. **Element Not Found**: The theme "좀비 연구소" is not found on the page, preventing test continuation.
2. **Application Loading Issue**: The application may not be loading correctly or UI text may have changed.

### Scenario A1: 관리자 모드 진입 및 새 테마 등록

**Objective:** Test admin authentication and theme creation functionality.

**Status:** Failed
**Browser(s):** All browsers (Chromium, Firefox, WebKit)

#### Test Steps Performed:

1. Access admin mode (by clicking logo 5 times)
2. Enter admin password
3. Verify authentication and dashboard access
4. Navigate to theme management
5. Create new theme with valid data
6. Verify theme appears in the list
7. Verify new theme is accessible to players

#### Test Results:

| Step | Expected | Actual | Status | Notes |
|------|----------|--------|--------|-------|
| Admin Mode Entry | Admin login modal appears | ❌ Element not found: "EscapeHint" heading | ❌ FAIL | Could not trigger admin mode |
| Login | Authentication successful | ❌ N/A due to previous step | ❌ N/A | - |
| Dashboard Access | Admin dashboard loads | ❌ N/A due to previous step | ❌ N/A | - |
| Theme Creation | New theme created | ❌ N/A due to previous step | ❌ N/A | - |

#### Error Logs:

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
- waiting for locator('h1:has-text("EscapeHint")')
```

#### Issues Found:

1. **Element Not Found**: The "EscapeHint" heading is not found on the page, preventing admin mode activation.
2. **Application Loading Issue**: The application may not be loading correctly or UI text may have changed.

### Scenario A2: 등록한 테마에 힌트 추가 (10개)

**Objective:** Test hint creation functionality for an existing theme.

**Status:** Failed
**Browser(s):** All browsers (Chromium, Firefox, WebKit)

#### Test Steps Performed:

1. Access admin mode (by clicking logo 5 times)
2. Navigate to hint management for existing theme
3. Create 10 hints with valid data (codes, content, progress rates)
4. Verify hints appear in the management list
5. Verify hints are accessible during gameplay

#### Test Results:

| Step | Expected | Actual | Status | Notes |
|------|----------|--------|--------|-------|
| Admin Mode Entry | Admin login modal appears | ❌ Element not found: "EscapeHint" heading | ❌ FAIL | Could not trigger admin mode |
| Hint Management | Hint management screen loads | ❌ N/A due to previous step | ❌ N/A | - |
| Hint Creation | 10 hints created successfully | ❌ N/A due to previous step | ❌ N/A | - |

#### Error Logs:

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
- waiting for locator('h1:has-text("EscapeHint")')
```

#### Issues Found:

1. **Element Not Found**: The "EscapeHint" heading is not found on the page, preventing admin mode activation.
2. **Application Loading Issue**: The application may not be loading correctly or UI text may have changed.

## Summary

**Tests Completed:** 0/5 scenarios completed
**Tests Passed:** 0/30+ steps
**Tests Failed:** 30+ steps
**Error Rate:** 100%

## Critical Issues

1. **Application UI Mismatch**: The text elements that the tests are looking for don't match what's actually displayed in the application. This could be due to:
   - UI text changes that weren't reflected in the test code
   - Application not loading properly
   - Different language settings

2. **Frontend/Backend Connection Issues**: The application may not be connecting properly to the backend, causing elements to not load as expected.

3. **Test Selector Issues**: The test selectors (text-based locators) may need to be updated to match the current application UI.

## Recommendations

1. **UI Verification**: Check the actual application to verify the current UI text and element selectors.
2. **Backend Status**: Verify that the backend server is running properly and connecting to the database.
3. **Test Updates**: Update the test cases to use correct selectors (possibly based on data-testid attributes or CSS classes rather than text content).
4. **Debugging**: Add more detailed debugging information in the tests to understand what the application is actually rendering.
5. **Infrastructure Check**: Ensure all necessary services (frontend, backend, database) are running before tests.

## Next Actions

1. Investigate why the application UI doesn't match the expected text elements in tests.
2. Verify that all services are running properly.
3. Update test selectors to match the current application UI.
4. Re-run tests after fixes.