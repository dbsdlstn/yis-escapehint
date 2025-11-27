import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/AuthService';
import { useAuth } from '../../hooks/common/useAuth';

export const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const { mutate: login, isLoading } = AuthService.useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    login(
      { password },
      {
        onSuccess: (data) => {
          console.log('Received full response:', data); // 전체 응답 구조 확인
          // Store the access token using the auth hook
          authLogin(data.data.accessToken);
          console.log('Token stored via auth hook');
          // Redirect to admin dashboard
          navigate('/admin/dashboard');
        },
        onError: (err: any) => {
          setError(err?.response?.data?.message || 'Invalid credentials');
        }
      }
    );
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-dark-gradient-start to-dark-gradient-end p-4">
      <div className="w-full max-w-md bg-dark-secondary rounded-xl p-8 shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-primary">관리자 로그인</h1>
          <p className="text-text-secondary mt-2">EscapeHint 관리자 전용</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="password" className="block text-text-secondary mb-2">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-bg-input border border-border-light rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-white focus:border-transparent"
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>

          {error && (
            <div className="mb-4 text-red-500 text-center">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 py-3 rounded-lg font-semibold bg-gray-600 text-text-primary hover:bg-gray-700 transition-colors"
            >
              뒤로가기
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 py-3 rounded-lg font-semibold ${
                isLoading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-accent-white text-dark-primary hover:bg-gray-200'
              }`}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};