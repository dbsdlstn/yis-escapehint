import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from './apiClient';
import { Hint } from '../types';

export const HintService = {
  // Player endpoints
  useSubmitHint: () => {
    return useMutation({
      mutationFn: async ({ sessionId, code }: { sessionId: string; code: string }) => {
        const response = await apiClient.post<Hint>(`/sessions/${sessionId}/hints`, { code });
        return response.data;
      }
    });
  },

  // Admin endpoints
  useGetHintsByTheme: (themeId: string) => {
    return useQuery({
      queryKey: ['hints', themeId],
      queryFn: async () => {
        const response = await apiClient.get<{ data: Hint[] }>(`/admin/hints/themes/${themeId}/hints`);
        return response.data.data; // 표준 응답 구조에서 실제 데이터만 반환
      }
    });
  },

  useCreateHint: () => {
    return useMutation({
      mutationFn: async ({ themeId, hintData }: { themeId: string; hintData: Omit<Hint, 'id' | 'createdAt' | 'updatedAt'> }) => {
        const response = await apiClient.post<Hint>(`/admin/hints/themes/${themeId}/hints`, hintData);
        return response.data;
      }
    });
  },

  useUpdateHint: () => {
    return useMutation({
      mutationFn: async ({ id, ...hintData }: Hint) => {
        const response = await apiClient.put<Hint>(`/admin/hints/${id}`, hintData);
        return response.data;
      }
    });
  },

  useDeleteHint: () => {
    return useMutation({
      mutationFn: async (hintId: string) => {
        await apiClient.delete(`/admin/hints/${hintId}`);
      }
    });
  },

  useUpdateHintOrder: () => {
    return useMutation({
      mutationFn: async ({ hintId, order }: { hintId: string; order: number }) => {
        const response = await apiClient.patch(`/admin/hints/${hintId}/order`, { order });
        return response.data;
      }
    });
  },

  // Player endpoint - Get hint by ID
  useGetHintById: (hintId: string) => {
    return useQuery({
      queryKey: ['hint', hintId],
      queryFn: async () => {
        const response = await apiClient.get<Hint>(`/hints/${hintId}`);
        return response.data;
      },
      enabled: !!hintId
    });
  }
};