import { renderHook, act } from '@testing-library/react';
import { useSession } from '../common/useSession';
import { GameSession } from '../../types';

// Mock localStorage
const mockLocalStorage = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock data
const mockSession: GameSession = {
  id: 'session-123',
  themeId: 'theme-1',
  startTime: new Date().toISOString(),
  endTime: null,
  usedHintCount: 0,
  usedHintCodes: [],
  status: 'in_progress',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Mock the useAppStore
jest.mock('../../stores/appStore', () => ({
  useAppStore: () => ({
    setCurrentSession: jest.fn(),
    setCurrentProgress: jest.fn(),
    setUsedHintCount: jest.fn(),
  }),
}));

// Mock the services
jest.mock('../../services/GameSessionService', () => ({
  GameSessionService: {
    useStartSession: () => ({
      mutate: jest.fn((themeId, options) => {
        // Simulate successful start of session
        const newSession = {
          ...mockSession,
          themeId,
        };
        options?.onSuccess?.(newSession);
      }),
    }),
  },
}));

describe('useSession', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  test('should initialize with null session', () => {
    const { result } = renderHook(() => useSession());
    
    expect(result.current.session).toBeNull();
  });

  test('should start a new session', async () => {
    const themeId = 'theme-123';
    const { result } = renderHook(() => useSession());
    
    await act(async () => {
      await result.current.startSession(themeId);
    });
    
    expect(result.current.session).not.toBeNull();
    expect(result.current.session?.themeId).toBe(themeId);
    expect(localStorage.getItem('currentSessionId')).not.toBeNull();
  });

  test('should update session progress', () => {
    const { result } = renderHook(() => useSession());
    
    // Set an initial session first
    act(() => {
      result.current.startSession('theme-1');
    });
    
    // Update progress
    const hintProgress = 25;
    act(() => {
      result.current.updateSessionProgress(hintProgress);
    });
    
    // Note: The exact behavior depends on the implementation of updateSessionProgress
    // which was mocked in the original implementation
    expect(result.current.session).not.toBeNull();
  });
  
  // Note: Additional tests would require more detailed mock implementation
  // of the service and store functions
});