import * as bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

/**
 * 비밀번호를 해싱합니다.
 * @param password - 해싱할 평문 비밀번호
 * @returns 해싱된 비밀번호
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * 비밀번호를 비교합니다.
 * @param password - 비교할 평문 비밀번호
 * @param hashedPassword - 저장된 해싱된 비밀번호
 * @returns 비밀번호 일치 여부
 */
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
