import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../ui/Modal';
import { AuthService } from '../../services/AuthService';
import { useAuth } from '../../hooks/common/useAuth';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [blockUntil, setBlockUntil] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const { mutate: login, isPending: isLoading } = AuthService.useLogin();

  // 카운트다운 타이머
  useEffect(() => {
    if (blockUntil) {
      const interval = setInterval(() => {
        const remaining = Math.ceil((blockUntil - Date.now()) / 1000);
        if (remaining <= 0) {
          setBlockUntil(null);
          setFailedAttempts(0);
          setCountdown(0);
          setError('');
        } else {
          setCountdown(remaining);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [blockUntil]);

  const isBlocked = blockUntil !== null && Date.now() < blockUntil;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isBlocked) {
      return;
    }

    login(
      { password },
      {
        onSuccess: (data) => {
          // Store the access token using the auth hook
          authLogin(data.data.accessToken);
          setPassword('');
          setError('');
          setFailedAttempts(0);
          onClose();
          navigate('/admin/dashboard');
        },
        onError: (err: any) => {
          const newFailedAttempts = failedAttempts + 1;
          setFailedAttempts(newFailedAttempts);

          if (newFailedAttempts >= 3) {
            const blockTime = Date.now() + 5 * 60 * 1000; // 5분
            setBlockUntil(blockTime);
            setError('3회 실패하였습니다. 5분 후 다시 시도해주세요.');
          } else {
            setError(err?.response?.data?.message || `잘못된 비밀번호입니다 (${newFailedAttempts}/3)`);
          }
        }
      }
    );
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  const formatCountdown = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} showCloseButton={false}>
      <div className="bg-dark-secondary rounded-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-primary">관리자 로그인</h1>
          <p className="text-text-secondary mt-2">EscapeHint 관리자 전용</p>
        </div>

        <form onSubmit={handleSubmit} aria-label="관리자 로그인 폼">
          <div className="mb-6">
            <label htmlFor="password" className="block text-text-secondary mb-2">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-bg-input border border-border-light rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-white focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="비밀번호를 입력하세요"
              required
              disabled={isBlocked}
              aria-required="true"
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? 'password-error' : undefined}
            />
          </div>

          {error && (
            <div
              id="password-error"
              className="mb-4 text-red-500 text-center"
              role="alert"
            >
              {error}
              {isBlocked && (
                <div className="mt-2 text-xl font-bold">
                  {formatCountdown(countdown)}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 rounded-lg font-semibold bg-gray-600 text-text-primary hover:bg-gray-700 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading || isBlocked}
              className={`flex-1 py-3 rounded-lg font-semibold ${
                isLoading || isBlocked
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-accent-white text-dark-primary hover:bg-gray-200'
              } transition-colors`}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
