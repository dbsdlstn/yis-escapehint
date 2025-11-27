import { useMutation } from '@tanstack/react-query';
import apiClient from './apiClient';

export interface LoginCredentials {
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export const AuthService = {
  useLogin: () => {
    return useMutation({
      mutationFn: async (credentials: LoginCredentials) => {
        const response = await apiClient.post<LoginResponse>('/admin/auth/login', credentials);
        return response.data;
      }
    });
  }
};