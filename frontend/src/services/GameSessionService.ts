import { useMutation, useQuery } from '@tanstack/react-query';
import { playerApiClient } from './apiClient';
import { GameSession } from '../types';

export const GameSessionService = {
  // Player endpoints
  useGetSession: (sessionId: string) => {
    return useQuery({
      queryKey: ['session', sessionId],
      queryFn: async () => {
        // undefined 문자열 또는 빈 문자열인 경우 오류 발생
        if (!sessionId || sessionId === 'undefined') {
          throw new Error('Session ID is not valid');
        }
        const response = await playerApiClient.get<{ success: boolean; data: GameSession }>(`/sessions/${sessionId}`);
        return response.data.data; // 표준 응답 구조에서 실제 세션 데이터만 반환
      },
      enabled: !!sessionId && sessionId !== 'undefined'
    });
  },

  useStartSession: () => {
    return useMutation({
      mutationFn: async (themeId: string) => {
        const response = await playerApiClient.post<{ success: boolean; data: GameSession }>('/sessions', { themeId });
        // Store session ID in localStorage for session recovery
        localStorage.setItem('currentSessionId', response.data.data.id);
        return response.data.data;
      }
    });
  },

};