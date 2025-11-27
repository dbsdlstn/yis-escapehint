export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class HintNotFoundError extends AppError {
  constructor(code: string) {
    super(`힌트를 찾을 수 없습니다: ${code}`, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "인증이 필요합니다") {
    super(message, 401);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class ThemeNotFoundError extends AppError {
  constructor(id: string) {
    super(`테마를 찾을 수 없습니다: ${id}`, 404);
  }
}

export class SessionNotFoundError extends AppError {
  constructor(id: string) {
    super(`세션을 찾을 수 없습니다: ${id}`, 404);
  }
}

export class HintInactiveError extends AppError {
  constructor(code: string) {
    super(`현재 사용할 수 없는 힌트입니다: ${code}`, 400);
  }
}

export class HintThemeMismatchError extends AppError {
  constructor(code: string) {
    super(`현재 테마에서 사용할 수 없는 코드입니다: ${code}`, 400);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}
