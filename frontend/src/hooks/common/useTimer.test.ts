import { renderHook, act } from '@testing-library/react';
import { useTimer } from '../common/useTimer';

// Mock setTimeout and setInterval to control time in tests
jest.useFakeTimers();

describe('useTimer', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  test('should initialize with default time and not running', () => {
    const { result } = renderHook(() => useTimer());
    
    expect(result.current.time).toBe(0);
    expect(result.current.isRunning).toBe(false);
  });

  test('should initialize with provided initial time', () => {
    const { result } = renderHook(() => useTimer(60));
    
    expect(result.current.time).toBe(60);
    expect(result.current.isRunning).toBe(false);
  });

  test('should start the timer', () => {
    const { result } = renderHook(() => useTimer());
    
    act(() => {
      result.current.start();
    });
    
    expect(result.current.isRunning).toBe(true);
  });

  test('should pause the timer', () => {
    const { result } = renderHook(() => useTimer());
    
    act(() => {
      result.current.start();
      result.current.pause();
    });
    
    expect(result.current.isRunning).toBe(false);
  });

  test('should increment time when running', () => {
    const { result } = renderHook(() => useTimer());
    
    act(() => {
      result.current.start();
    });
    
    // Advance time by 5 seconds
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    expect(result.current.time).toBe(5);
  });

  test('should reset the timer', () => {
    const { result } = renderHook(() => useTimer());
    
    act(() => {
      result.current.start();
    });
    
    // Advance time by 10 seconds
    act(() => {
      jest.advanceTimersByTime(10000);
    });
    
    // Reset to 0
    act(() => {
      result.current.reset();
    });
    
    expect(result.current.time).toBe(0);
    expect(result.current.isRunning).toBe(false);
  });

  test('should reset the timer with custom time', () => {
    const { result } = renderHook(() => useTimer());
    
    act(() => {
      result.current.reset(30);
    });
    
    expect(result.current.time).toBe(30);
    expect(result.current.isRunning).toBe(false);
  });

  test('should format time correctly in MM:SS format', () => {
    const { result } = renderHook(() => useTimer());
    
    // Test 0 seconds
    expect(result.current.formatTime(0)).toBe('00:00');
    
    // Test 30 seconds
    expect(result.current.formatTime(30)).toBe('00:30');
    
    // Test 90 seconds (1:30)
    expect(result.current.formatTime(90)).toBe('01:30');
    
    // Test 3661 seconds (1:01:01)
    expect(result.current.formatTime(3661)).toBe('01:01:01');
    
    // Test negative time
    expect(result.current.formatTime(-90)).toBe('-01:30');
  });
});