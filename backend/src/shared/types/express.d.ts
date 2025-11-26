// Express Request 타입 확장
declare namespace Express {
  export interface Request {
    user?: {
      userId: string;
      role: string;
      [key: string]: any;
    };
  }
}
