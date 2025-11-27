import { useMutation, useQuery } from '@tanstack/react-query';
import { adminApiClient } from './apiClient';
import { GameSession } from '../types';

export interface DashboardStats {
  themeCount: number;
  hintUsageCount: number;
}

export const AdminService = {
  // Session monitoring endpoints
  useGetSessions: (status?: 'in_progress' | 'completed' | 'aborted') => {
    return useQuery({
      queryKey: ['admin-sessions', status],
      queryFn: async () => {
        const params = status ? { status } : {};
        const response = await adminApiClient.get<{ data: GameSession[] }>('/admin/sessions', { params });
        return response.data.data; // 표준 응답 구조에서 실제 데이터만 반환
      }
    });
  },

  // Dashboard stats
  useGetDashboardStats: () => {
    return useQuery({
      queryKey: ['dashboard-stats'],
      queryFn: async () => {
        const response = await adminApiClient.get<{ data: DashboardStats }>('/admin/themes/stats');
        console.log('Dashboard stats response:', response.data); // 디버깅 로그
        return response.data.data;
      }
    });
  },

  useGetSessionById: (sessionId: string) => {
    return useQuery({
      queryKey: ['admin-session', sessionId],
      queryFn: async () => {
        if (!sessionId) return null;
        const response = await adminApiClient.get<GameSession>(`/sessions/${sessionId}`);
        return response.data;
      },
      enabled: !!sessionId
    });
  },

  useForceEndSession: () => {
    return useMutation({
      mutationFn: async (sessionId: string) => {
        await adminApiClient.delete(`/admin/sessions/${sessionId}`);
      }
    });
  }
};