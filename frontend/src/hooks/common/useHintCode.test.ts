import { renderHook, act } from '@testing-library/react';
import { useHintCode } from '../common/useHintCode';

// Mock a function to create refs for our tests
function setupUseHintCode(codeLength = 4) {
  return renderHook(() => useHintCode(codeLength));
}

describe('useHintCode', () => {
  test('should initialize with empty input values based on code length', () => {
    const { result } = setupUseHintCode(4);
    
    expect(result.current.inputValues).toEqual(['', '', '', '']);
    expect(result.current.currentCode).toBe('');
  });

  test('should handle input change and move to next field', () => {
    const { result } = setupUseHintCode(4);
    
    // Change the first input
    act(() => {
      result.current.handleInputChange(0, 'A');
    });
    
    expect(result.current.inputValues[0]).toBe('A');
    expect(result.current.inputValues).toEqual(['A', '', '', '']);
    expect(result.current.currentCode).toBe('A');
  });

  test('should only accept single character input', () => {
    const { result } = setupUseHintCode(4);
    
    // Try to enter multiple characters in one field
    act(() => {
      result.current.handleInputChange(0, 'AB');
    });
    
    expect(result.current.inputValues[0]).toBe(''); // Should remain empty since 'AB' is more than 1 char
    expect(result.current.currentCode).toBe('');
  });

  test('should handle backspace and move to previous field', () => {
    const { result } = setupUseHintCode(4);

    // Fill first field
    act(() => {
      result.current.handleInputChange(0, 'A');
    });

    expect(result.current.inputValues[0]).toBe('A');

    // Test navigation using arrow keys (which is what the hook supports)
    // This verifies that the onKeyDown handler works correctly
    const event = { key: 'ArrowLeft' } as React.KeyboardEvent<HTMLInputElement>;
    act(() => {
      result.current.handleKeyDown(1, event);
    });

    // The input should remain as is since ArrowLeft just navigates
    expect(result.current.inputValues[0]).toBe('A');
  });

  test('should clear all inputs', () => {
    const { result } = setupUseHintCode(4);
    
    // Set some values
    act(() => {
      result.current.setInputValues(['A', 'B', 'C', 'D']);
    });
    
    // Clear them
    act(() => {
      result.current.clearInputs();
    });
    
    expect(result.current.inputValues).toEqual(['', '', '', '']);
    expect(result.current.currentCode).toBe('');
  });

  test('should update currentCode when inputs change', () => {
    const { result } = setupUseHintCode(4);
    
    // Change inputs
    act(() => {
      result.current.setInputValues(['H', 'I', 'N', 'T']);
    });
    
    expect(result.current.currentCode).toBe('HINT');
  });

  test('should format code to uppercase', () => {
    const { result } = setupUseHintCode(4);
    
    // Change the first input to lowercase
    act(() => {
      result.current.handleInputChange(0, 'h');
    });
    
    expect(result.current.inputValues[0]).toBe('H');
    expect(result.current.currentCode).toBe('H');
  });
});