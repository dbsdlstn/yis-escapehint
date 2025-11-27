import { useMutation, useQuery } from '@tanstack/react-query';
import { playerApiClient, adminApiClient } from './apiClient';
import { Hint } from '../types';

export const HintService = {
  // Player endpoints
  useSubmitHint: () => {
    return useMutation({
      mutationFn: async ({ sessionId, code }: { sessionId: string; code: string }) => {
        const response = await playerApiClient.post<{ success: boolean; data: Hint; message: string }>(`/sessions/${sessionId}/hints`, { code });
        return response.data.data; // 표준 응답 구조에서 실제 힌트 데이터만 반환
      }
    });
  },

  // Admin endpoints
  useGetHintsByTheme: (themeId: string) => {
    return useQuery({
      queryKey: ['hints', themeId],
      queryFn: async () => {
        const response = await adminApiClient.get<{ data: Hint[] }>(`/admin/hints/themes/${themeId}/hints`);
        return response.data.data; // 표준 응답 구조에서 실제 데이터만 반환
      }
    });
  },

  useCreateHint: () => {
    return useMutation({
      mutationFn: async ({ themeId, hintData }: { themeId: string; hintData: Omit<Hint, 'id' | 'createdAt' | 'updatedAt'> }) => {
        const response = await adminApiClient.post<Hint>(`/admin/hints/themes/${themeId}/hints`, hintData);
        return response.data;
      }
    });
  },

  useUpdateHint: () => {
    return useMutation({
      mutationFn: async ({ id, ...hintData }: Hint) => {
        const response = await adminApiClient.put<Hint>(`/admin/hints/${id}`, hintData);
        return response.data;
      }
    });
  },

  useDeleteHint: () => {
    return useMutation({
      mutationFn: async (hintId: string) => {
        await adminApiClient.delete(`/admin/hints/${hintId}`);
      }
    });
  },

  useUpdateHintOrder: () => {
    return useMutation({
      mutationFn: async ({ hintId, order }: { hintId: string; order: number }) => {
        const response = await adminApiClient.patch(`/admin/hints/${hintId}/order`, { order });
        return response.data;
      }
    });
  },

  // Player endpoint - Get hint by ID
  useGetHintById: (hintId: string) => {
    return useQuery({
      queryKey: ['hint', hintId],
      queryFn: async () => {
        // 플레이어용 API에서는 세션 ID와 함께 힌트를 조회해야 할 수 있으므로,
        // 현재 구조에서는 힌트 코드를 사용하여 조회
        const response = await playerApiClient.get<{ success: boolean; data: Hint }>(`/hints/${hintId}`);
        return response.data.data;
      },
      enabled: !!hintId
    });
  }
};