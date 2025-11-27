import { useMutation, useQuery } from '@tanstack/react-query';
import { playerApiClient, adminApiClient } from './apiClient';
import { Theme } from '../types';

export const ThemeService = {
  // Player endpoints
  useGetThemes: (status?: 'active') => {
    return useQuery({
      queryKey: ['themes', status],
      queryFn: async () => {
        const params = status ? { status } : {};
        const response = await playerApiClient.get<{ success: boolean; data: Theme[] }>('/themes', { params });
        return response.data.data;
      }
    });
  },

  useGetThemeById: (themeId: string) => {
    return useQuery({
      queryKey: ['theme', themeId],
      queryFn: async () => {
        if (!themeId) return null;
        const response = await playerApiClient.get<{ success: boolean; data: Theme }>(`/themes/${themeId}`);
        return response.data.data;
      },
      enabled: !!themeId
    });
  },

  // Admin endpoints
  useGetAllThemes: () => {
    return useQuery({
      queryKey: ['allThemes'],
      queryFn: async () => {
        const response = await adminApiClient.get<{ success: boolean; data: Theme[] }>('/admin/themes');
        return response.data.data;
      }
    });
  },

  useCreateTheme: () => {
    return useMutation({
      mutationFn: async (themeData: Omit<Theme, 'id' | 'hintCount' | 'createdAt' | 'updatedAt'>) => {
        const response = await adminApiClient.post<{ success: boolean; data: Theme }>('/admin/themes', themeData);
        return response.data.data;
      }
    });
  },

  useUpdateTheme: () => {
    return useMutation({
      mutationFn: async ({ id, ...themeData }: Theme) => {
        const response = await adminApiClient.put<{ success: boolean; data: Theme }>(`/admin/themes/${id}`, themeData);
        return response.data.data;
      }
    });
  },

  useDeleteTheme: () => {
    return useMutation({
      mutationFn: async (themeId: string) => {
        await adminApiClient.delete(`/admin/themes/${themeId}`);
      }
    });
  }
};