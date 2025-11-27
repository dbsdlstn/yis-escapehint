import { renderHook, act } from '@testing-library/react';
import { useAppStore } from '../stores/appStore';
import { GameSession, Theme, Hint } from '../types';

// Mock data
const mockTheme: Theme = {
  id: 'theme-1',
  name: 'Test Theme',
  description: 'A test theme',
  playTime: 60,
  isActive: true,
  difficulty: '★★★☆☆',
  hintCount: 5,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockHint: Hint = {
  id: 'hint-1',
  themeId: 'theme-1',
  code: 'TEST01',
  content: 'This is a test hint',
  answer: 'This is the answer',
  progressRate: 20,
  order: 1,
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockSession: GameSession = {
  id: 'session-1',
  themeId: 'theme-1',
  startTime: new Date().toISOString(),
  endTime: null,
  usedHintCount: 0,
  usedHintCodes: [],
  status: 'in_progress',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('appStore', () => {
  test('should initialize with default values', () => {
    const { result } = renderHook(() => useAppStore());
    
    expect(result.current.currentSession).toBeNull();
    expect(result.current.currentTheme).toBeNull();
    expect(result.current.currentHint).toBeNull();
    expect(result.current.currentHintCode).toBe('');
    expect(result.current.currentProgress).toBe(0);
    expect(result.current.usedHintCount).toBe(0);
    expect(result.current.isDarkMode).toBe(true);
  });

  test('should set current session', () => {
    const { result } = renderHook(() => useAppStore());
    
    act(() => {
      result.current.setCurrentSession(mockSession);
    });
    
    expect(result.current.currentSession).toEqual(mockSession);
  });

  test('should set current theme', () => {
    const { result } = renderHook(() => useAppStore());
    
    act(() => {
      result.current.setCurrentTheme(mockTheme);
    });
    
    expect(result.current.currentTheme).toEqual(mockTheme);
  });

  test('should set current hint', () => {
    const { result } = renderHook(() => useAppStore());
    
    act(() => {
      result.current.setCurrentHint(mockHint);
    });
    
    expect(result.current.currentHint).toEqual(mockHint);
  });

  test('should set current hint code', () => {
    const { result } = renderHook(() => useAppStore());
    const testCode = 'TEST123';
    
    act(() => {
      result.current.setCurrentHintCode(testCode);
    });
    
    expect(result.current.currentHintCode).toBe(testCode);
  });

  test('should set current progress', () => {
    const { result } = renderHook(() => useAppStore());
    const testProgress = 50;
    
    act(() => {
      result.current.setCurrentProgress(testProgress);
    });
    
    expect(result.current.currentProgress).toBe(testProgress);
  });

  test('should set used hint count', () => {
    const { result } = renderHook(() => useAppStore());
    const testCount = 3;
    
    act(() => {
      result.current.setUsedHintCount(testCount);
    });
    
    expect(result.current.usedHintCount).toBe(testCount);
  });

  test('should set dark mode', () => {
    const { result } = renderHook(() => useAppStore());
    
    act(() => {
      result.current.setIsDarkMode(false);
    });
    
    expect(result.current.isDarkMode).toBe(false);
  });

  test('should reset game state', () => {
    const { result } = renderHook(() => useAppStore());
    
    // Set some values first
    act(() => {
      result.current.setCurrentSession(mockSession);
      result.current.setCurrentTheme(mockTheme);
      result.current.setCurrentHint(mockHint);
      result.current.setCurrentHintCode('TEST123');
      result.current.setCurrentProgress(75);
      result.current.setUsedHintCount(5);
    });
    
    // Verify values are set
    expect(result.current.currentSession).toEqual(mockSession);
    expect(result.current.currentTheme).toEqual(mockTheme);
    expect(result.current.currentHint).toEqual(mockHint);
    expect(result.current.currentHintCode).toBe('TEST123');
    expect(result.current.currentProgress).toBe(75);
    expect(result.current.usedHintCount).toBe(5);
    
    // Reset state
    act(() => {
      result.current.resetGameState();
    });
    
    // Verify reset
    expect(result.current.currentSession).toBeNull();
    expect(result.current.currentTheme).toBeNull();
    expect(result.current.currentHint).toBeNull();
    expect(result.current.currentHintCode).toBe('');
    expect(result.current.currentProgress).toBe(0);
    expect(result.current.usedHintCount).toBe(0);
  });
});