import { useState, useRef, useEffect } from 'react';

interface UseHintCode {
  inputValues: string[];
  currentCode: string;
  handleInputChange: (index: number, value: string) => void;
  handleKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  clearInputs: () => void;
  setInputValues: (values: string[]) => void;
}

export const useHintCode = (codeLength: number = 4): UseHintCode => {
  const [inputValues, setInputValues] = useState<string[]>(Array(codeLength).fill(''));
  const inputRefs = useRef<Array<HTMLInputElement | null>>(Array(codeLength).fill(null));

  // Calculate the current code from input values
  const currentCode = inputValues.join('').toUpperCase();

  const handleInputChange = (index: number, value: string) => {
    // Prevent entering more than one character
    if (value.length > 1) return;

    const newInputValues = [...inputValues];
    newInputValues[index] = value.toUpperCase();
    setInputValues(newInputValues);

    // Move to next field if filled and not last field
    if (value && index < codeLength - 1) {
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !inputValues[index] && index > 0) {
      const prevInput = inputRefs.current[index - 1];
      if (prevInput) {
        prevInput.focus();
        // Also clear the previous field if we're moving back from an empty field
        const newInputValues = [...inputValues];
        newInputValues[index - 1] = '';
        setInputValues(newInputValues);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      const prevInput = inputRefs.current[index - 1];
      if (prevInput) prevInput.focus();
    } else if (e.key === 'ArrowRight' && index < codeLength - 1) {
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) nextInput.focus();
    }
  };

  const clearInputs = () => {
    setInputValues(Array(codeLength).fill(''));
    if (inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  };

  // Focus first input on initial render
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, []);

  return {
    inputValues,
    currentCode,
    handleInputChange,
    handleKeyDown,
    clearInputs,
    setInputValues,
  };
};