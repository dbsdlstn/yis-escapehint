import { renderHook } from '@testing-library/react';
import { useThemeManager } from '../common/useThemeManager';

// Mock the ThemeService
jest.mock('../../services/ThemeService', () => ({
  ThemeService: {
    useGetAllThemes: () => ({
      data: [],
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    }),
    useCreateTheme: () => ({
      mutate: jest.fn(),
    }),
    useUpdateTheme: () => ({
      mutate: jest.fn(),
    }),
    useDeleteTheme: () => ({
      mutate: jest.fn(),
    }),
  },
}));

describe('useThemeManager', () => {
  test('should return initial state', () => {
    const { result } = renderHook(() => useThemeManager());
    
    expect(result.current.themes).toEqual([]);
    expect(result.current.activeThemes).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });
  
  // Add more tests as needed based on the actual implementation
});