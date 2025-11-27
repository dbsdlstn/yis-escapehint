import { create } from 'zustand';
import { GameSession, Theme, Hint } from '../types';

interface AppState {
  // Session state
  currentSession: GameSession | null;
  currentTheme: Theme | null;
  currentHint: Hint | null;
  currentHintCode: string;
  currentProgress: number;
  usedHintCount: number;
  
  // UI state
  isDarkMode: boolean;
  
  // Actions
  setCurrentSession: (session: GameSession | null) => void;
  setCurrentTheme: (theme: Theme | null) => void;
  setCurrentHint: (hint: Hint | null) => void;
  setCurrentHintCode: (code: string) => void;
  setCurrentProgress: (progress: number | ((prev: number) => number)) => void;
  setUsedHintCount: (count: number) => void;
  setIsDarkMode: (darkMode: boolean) => void;
  resetGameState: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  currentSession: null,
  currentTheme: null,
  currentHint: null,
  currentHintCode: '',
  currentProgress: 0,
  usedHintCount: 0,
  isDarkMode: true,

  // Actions
  setCurrentSession: (session) => set({ currentSession: session }),
  setCurrentTheme: (theme) => set({ currentTheme: theme }),
  setCurrentHint: (hint) => set({ currentHint: hint }),
  setCurrentHintCode: (code) => set({ currentHintCode: code }),
  setCurrentProgress: (progress) => set((state) => ({
    currentProgress: typeof progress === 'function' ? progress(state.currentProgress) : progress
  })),
  setUsedHintCount: (count) => set({ usedHintCount: count }),
  setIsDarkMode: (darkMode) => set({ isDarkMode: darkMode }),
  resetGameState: () => set({
    currentSession: null,
    currentTheme: null,
    currentHint: null,
    currentHintCode: '',
    currentProgress: 0,
    usedHintCount: 0,
  }),
}));