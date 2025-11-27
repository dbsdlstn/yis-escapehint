export interface Theme {
  id: string;
  name: string;
  description?: string;
  playTime: number; // in minutes
  isActive: boolean;
  difficulty?: string;
  hintCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Hint {
  id: string;
  themeId: string;
  code: string;
  content: string;
  answer: string;
  progressRate: number; // 0-100
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GameSession {
  id: string;
  themeId: string;
  startTime: string;
  endTime: string | null;
  usedHintCount: number;
  usedHintCodes: string[];
  status: 'in_progress' | 'completed' | 'aborted';
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  username?: string;
  createdAt: string;
  updatedAt: string;
}