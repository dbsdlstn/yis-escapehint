import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from './apiClient';
import { GameSession } from '../types';

export const GameSessionService = {
  // Player endpoints
  useGetSession: (sessionId: string) => {
    return useQuery({
      queryKey: ['session', sessionId],
      queryFn: async () => {
        const response = await apiClient.get<GameSession>(`/sessions/${sessionId}`);
        return response.data;
      }
    });
  },

  useStartSession: () => {
    return useMutation({
      mutationFn: async (themeId: string) => {
        const response = await apiClient.post<GameSession>('/sessions', { themeId });
        // Store session ID in localStorage for session recovery
        localStorage.setItem('currentSessionId', response.data.id);
        return response.data;
      }
    });
  },

};