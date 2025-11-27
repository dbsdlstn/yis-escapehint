import { useState, useEffect } from 'react';
import { Theme } from '../../types';
import { ThemeService } from '../../services/ThemeService';

interface UseThemeManager {
  themes: Theme[];
  activeThemes: Theme[];
  isLoading: boolean;
  error: string | null;
  addTheme: (theme: Omit<Theme, 'id' | 'hintCount' | 'createdAt' | 'updatedAt'>) => void;
  updateTheme: (theme: Theme) => void;
  deleteTheme: (themeId: string) => void;
  refetchThemes: () => void;
}

export const useThemeManager = (): UseThemeManager => {
  const {
    data: themes,
    isLoading,
    error,
    refetch
  } = ThemeService.useGetAllThemes();
  
  const [localThemes, setLocalThemes] = useState<Theme[]>([]);
  
  useEffect(() => {
    if (themes) {
      setLocalThemes(themes);
    }
  }, [themes]);

  const addTheme = (_themeData: Omit<Theme, 'id' | 'hintCount' | 'createdAt' | 'updatedAt'>) => {
    // For simplicity, we'll just refetch from the API
    // In a real app, you might want to optimistically update the UI
    refetch();
  };

  const updateTheme = (_theme: Theme) => {
    // For simplicity, we'll just refetch from the API
    // In a real app, you might want to optimistically update the UI
    refetch();
  };

  const deleteTheme = (_themeId: string) => {
    // For simplicity, we'll just refetch from the API
    // In a real app, you might want to optimistically update the UI
    refetch();
  };

  const activeThemes = localThemes.filter(theme => theme.isActive);

  return {
    themes: localThemes,
    activeThemes,
    isLoading,
    error: error ? (error as Error).message : null,
    addTheme,
    updateTheme,
    deleteTheme,
    refetchThemes: refetch
  };
};