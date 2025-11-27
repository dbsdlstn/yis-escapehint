// src/shared/utils/response/api-response.util.ts
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  timestamp: string;
  statusCode: number;
}

/**
 * 성공 응답을 생성합니다.
 * @param data 응답 데이터
 * @param message 응답 메시지 (선택)
 * @param statusCode HTTP 상태 코드 (기본값: 200)
 * @returns 표준화된 성공 응답 객체
 */
export function createSuccessResponse<T = any>(data?: T, message?: string, statusCode: number = 200): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
    statusCode,
  };
}

/**
 * 실패 응답을 생성합니다.
 * @param message 오류 메시지
 * @param statusCode HTTP 상태 코드 (기본값: 400)
 * @param data 추가 데이터 (선택)
 * @returns 표준화된 실패 응답 객체
 */
export function createErrorResponse(message: string, statusCode: number = 400, data?: any): ApiResponse {
  return {
    success: false,
    message,
    data,
    timestamp: new Date().toISOString(),
    statusCode,
  };
}

/**
 * Express 응답을 표준화된 형식으로 설정합니다.
 * @param res Express Response 객체
 * @param data 응답 데이터
 * @param message 응답 메시지
 * @param statusCode HTTP 상태 코드
 */
export function sendResponse<T = any>(
  res: any, // express.Response
  data?: T,
  message?: string,
  statusCode: number = 200
) {
  const response = createSuccessResponse(data, message, statusCode);
  res.status(statusCode).json(response);
}

/**
 * Express 오류 응답을 표준화된 형식으로 설정합니다.
 * @param res Express Response 객체
 * @param message 오류 메시지
 * @param statusCode HTTP 상태 코드
 * @param data 추가 데이터
 */
export function sendErrorResponse(
  res: any, // express.Response
  message: string,
  statusCode: number = 400,
  data?: any
) {
  const response = createErrorResponse(message, statusCode, data);
  res.status(statusCode).json(response);
}
