# EscapeHint - 방탈출 힌트 관리 시스템

EscapeHint는 방탈출 카페에서 플레이어들에게 실시간으로 힌트를 제공하는 디지털 힌트 관리 시스템입니다.

## 개요

EscapeHint는 방탈출 카페의 힌트 제공 프로세스를 디지털화하여, 플레이어는 게임 몰입도를 유지하면서 필요한 힌트를 즉시 확인할 수 있고, 관리자는 힌트를 효율적으로 관리할 수 있는 웹 기반 솔루션입니다.

## API 문서

### 베이스 URL
- Production: `https://escapehint.vercel.app/api`
- Local: `http://localhost:3000/api`

### 인증
- 플레이어 API: 인증 불필요
- 관리자 API: Bearer JWT 토큰 필요

### 공통 응답 형식
```json
{
  "success": true/false,
  "message": "응답 메시지",
  "data": {}, // 응답 데이터 (선택적)
  "timestamp": "2025-11-26T00:00:00.000Z",
  "statusCode": 200
}
```

### 플레이어 API

#### 1. 테마 목록 조회
- **Endpoint**: `GET /themes`
- **Description**: 플레이어가 선택할 수 있는 테마 목록을 조회합니다.
- **Parameters**:
  - `status` (optional, default: "active"): 테마 상태 필터 ('active'만 허용)
- **Headers**: 없음
- **Response**:
  ```json
  [
    {
      "id": "uuid",
      "name": "테마 이름",
      "description": "테마 설명",
      "playTime": 60,
      "isActive": true,
      "difficulty": "★★★☆☆",
      "hintCount": 3,
      "createdAt": "2025-11-26T00:00:00.000Z",
      "updatedAt": "2025-11-26T00:00:00.000Z"
    }
  ]
  ```

#### 2. 게임 세션 시작
- **Endpoint**: `POST /sessions`
- **Description**: 새로운 게임 세션을 생성하고 타이머를 시작합니다.
- **Headers**: 없음
- **Request Body**:
  ```json
  {
    "themeId": "string (uuid)"
  }
  ```
- **Response**:
  ```json
  {
    "id": "uuid",
    "themeId": "uuid",
    "startTime": "2025-11-26T00:00:00.000Z",
    "endTime": null,
    "usedHintCount": 0,
    "status": "in_progress",
    "createdAt": "2025-11-26T00:00:00.000Z",
    "updatedAt": "2025-11-26T00:00:00.000Z"
  }
  ```

#### 3. 세션 정보 조회
- **Endpoint**: `GET /sessions/{sessionId}`
- **Description**: 게임 세션의 상세 정보를 조회합니다.
- **Parameters**:
  - `sessionId`: 세션 ID
- **Headers**: 없음
- **Response**:
  ```json
  {
    // GameSession 객체 형식
  }
  ```

#### 4. 힌트 사용
- **Endpoint**: `POST /sessions/{sessionId}/hints`
- **Description**: 힌트 코드를 제출하여 힌트 내용을 확인합니다.
- **Parameters**:
  - `sessionId`: 세션 ID
- **Headers**: 없음
- **Request Body**:
  ```json
  {
    "code": "string"
  }
  ```
- **Response**:
  ```json
  {
    // Hint 객체 형식
  }
  ```

### 관리자 API

#### 1. 관리자 로그인
- **Endpoint**: `POST /admin/auth/login`
- **Description**: 관리자 인증 후 JWT 토큰을 발급합니다.
- **Headers**: 없음
- **Request Body**:
  ```json
  {
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "accessToken": "jwt token string"
  }
  ```

#### 2. 테마 전체 조회
- **Endpoint**: `GET /admin/themes`
- **Description**: 모든 테마(활성/비활성)를 조회합니다.
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
  ```json
  [
    // Theme 객체 배열
  ]
  ```

#### 3. 테마 생성
- **Endpoint**: `POST /admin/themes`
- **Description**: 새로운 테마를 생성합니다.
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
  ```json
  {
    "name": "string (max 50)",
    "description": "string (nullable)",
    "playTime": "integer (10-180)",
    "isActive": "boolean (default: true)",
    "difficulty": "string (nullable)"
  }
  ```
- **Response**:
  ```json
  {
    // Theme 객체
  }
  ```

#### 4. 테마 수정
- **Endpoint**: `PUT /admin/themes/{themeId}`
- **Description**: 기존 테마를 수정합니다.
- **Parameters**: `themeId`
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
  ```json
  {
    // 수정할 필드들
  }
  ```
- **Response**:
  ```json
  {
    // Theme 객체
  }
  ```

#### 5. 테마 삭제
- **Endpoint**: `DELETE /admin/themes/{themeId}`
- **Description**: 테마를 삭제합니다 (연관된 힌트도 함께 삭제).
- **Parameters**: `themeId`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: 204 No Content

#### 6. 힌트 전체 조회
- **Endpoint**: `GET /admin/themes/{themeId}/hints`
- **Description**: 특정 테마에 속한 모든 힌트를 조회합니다.
- **Parameters**: `themeId`
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
  ```json
  [
    // Hint 객체 배열
  ]
  ```

#### 7. 힌트 생성
- **Endpoint**: `POST /admin/themes/{themeId}/hints`
- **Description**: 테마에 새로운 힌트를 추가합니다.
- **Parameters**: `themeId`
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
  ```json
  {
    "code": "string (max 20)",
    "content": "string (max 500)",
    "answer": "string (max 200)",
    "progressRate": "integer (0-100)",
    "order": "integer (default: 0)",
    "isActive": "boolean (default: true)"
  }
  ```
- **Response**:
  ```json
  {
    // Hint 객체
  }
  ```

#### 8. 힌트 수정
- **Endpoint**: `PUT /admin/hints/{hintId}`
- **Description**: 기존 힌트를 수정합니다.
- **Parameters**: `hintId`
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
  ```json
  {
    // 수정할 필드들
  }
  ```
- **Response**:
  ```json
  {
    // Hint 객체
  }
  ```

#### 9. 힌트 삭제
- **Endpoint**: `DELETE /admin/hints/{hintId}`
- **Description**: 힌트를 삭제합니다.
- **Parameters**: `hintId`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: 204 No Content

#### 10. 힌트 순서 변경
- **Endpoint**: `PATCH /admin/hints/{hintId}/order`
- **Description**: 힌트의 표시 순서를 변경합니다.
- **Parameters**: `hintId`
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
  ```json
  {
    "order": "integer"
  }
  ```
- **Response**:
  ```json
  {
    "message": "string"
  }
  ```

#### 11. 게임 세션 모니터링
- **Endpoint**: `GET /admin/sessions`
- **Description**: 진행 중인 게임 세션을 모니터링합니다.
- **Headers**: `Authorization: Bearer {token}`
- **Parameters**:
  - `status` (optional): 세션 상태 필터 ('in_progress', 'completed', 'aborted')
- **Response**:
  ```json
  [
    // GameSession 객체 배열
  ]
  ```

#### 12. 게임 세션 강제 종료
- **Endpoint**: `DELETE /admin/sessions/{sessionId}`
- **Description**: 관리자가 게임 세션을 강제 종료합니다.
- **Parameters**: `sessionId`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: 204 No Content

### Postman Collection

API를 Postman으로 사용하려면 다음을 참고하세요:
1. Postman을 실행합니다.
2. Import > Link 탭을 선택합니다.
3. 아래 링크를 입력합니다: `https://escapehint.vercel.app/api-docs` (이 링크는 Swagger UI를 가리키며, 실제 프로젝트에 따라 다를 수 있습니다)
4. 또는 `swagger/swagger.json` 파일을 직접 Import 할 수 있습니다.

API를 로컬에서 테스트하려면 서버를 실행시켜야 합니다:
```bash
cd backend
npm install
npm run dev
```

서버는 기본적으로 http://localhost:3000 에서 실행됩니다.
