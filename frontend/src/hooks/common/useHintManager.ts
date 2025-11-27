import { useState, useEffect } from 'react';
import { Hint } from '../../types';
import { HintService } from '../../services/HintService';

interface UseHintManager {
  hints: Hint[];
  isLoading: boolean;
  error: string | null;
  addHint: (themeId: string, hintData: Omit<Hint, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateHint: (hint: Hint) => void;
  deleteHint: (hintId: string) => void;
  refetchHints: () => void;
}

export const useHintManager = (themeId: string): UseHintManager => {
  const {
    data: hints,
    isLoading,
    error,
    refetch
  } = HintService.useGetHintsByTheme(themeId);
  
  const [localHints, setLocalHints] = useState<Hint[]>([]);
  
  useEffect(() => {
    if (hints) {
      setLocalHints(hints);
    }
  }, [hints]);

  const addHint = (_themeId: string, _hintData: Omit<Hint, 'id' | 'createdAt' | 'updatedAt'>) => {
    // For simplicity, we'll just refetch from the API
    // In a real app, you might want to optimistically update the UI
    refetch();
  };

  const updateHint = (_hint: Hint) => {
    // For simplicity, we'll just refetch from the API
    // In a real app, you might want to optimistically update the UI
    refetch();
  };

  const deleteHint = (_hintId: string) => {
    // For simplicity, we'll just refetch from the API
    // In a real app, you might want to optimistically update the UI
    refetch();
  };

  return {
    hints: localHints,
    isLoading,
    error: error ? (error as Error).message : null,
    addHint,
    updateHint,
    deleteHint,
    refetchHints: refetch
  };
};