import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../common/useAuth';

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

describe('useAuth', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  test('should initialize with no authentication', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.token).toBeNull();
  });

  test('should authenticate when token is provided', () => {
    const { result } = renderHook(() => useAuth());
    const token = 'test-token';
    
    act(() => {
      result.current.login(token);
    });
    
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.token).toBe(token);
    expect(localStorage.getItem('accessToken')).toBe(token);
  });

  test('should logout and clear token', () => {
    const { result } = renderHook(() => useAuth());
    const token = 'test-token';
    
    // Login first
    act(() => {
      result.current.login(token);
    });
    
    expect(result.current.isAuthenticated).toBe(true);
    
    // Then logout
    act(() => {
      result.current.logout();
    });
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.token).toBeNull();
    expect(localStorage.getItem('accessToken')).toBeNull();
  });

  test('should persist authentication after initialization if token exists in localStorage', () => {
    const token = 'persisted-token';
    localStorage.setItem('accessToken', token);
    
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.token).toBe(token);
  });
});