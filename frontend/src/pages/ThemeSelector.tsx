import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../stores/ThemeContext';
import { ThemeService } from '../services/ThemeService';
import { Theme } from '../types';
import { AdminLoginModal } from '../components/admin/AdminLoginModal';

export const ThemeSelector: React.FC = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const { data: themes, isLoading, error } = ThemeService.useGetThemes();

  const [clickCount, setClickCount] = useState<number>(0);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleThemeSelect = (themeId: string) => {
    navigate(`/game/${themeId}`);
  };

  const handleLogoClick = () => {
    // 이전 타이머가 있으면 취소
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    const newCount = clickCount + 1;
    setClickCount(newCount);

    // 진동 피드백 (지원되는 경우)
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    if (newCount >= 5) {
      setIsAdminModalOpen(true);
      setClickCount(0);
    } else {
      // 3초 후 카운트 리셋
      clickTimeoutRef.current = setTimeout(() => {
        setClickCount(0);
      }, 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="screen-container flex items-center justify-center">
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="screen-container flex items-center justify-center">
        <div className="error">Error loading themes: {String(error)}</div>
      </div>
    );
  }

  return (
    <div className="screen-container">
      <div className="content-wrapper">
        {/* Header with toggle button */}
        <div className="flex justify-between items-center mb-8">
          <h1
            className="text-2xl font-bold select-none"
            onClick={handleLogoClick}
          >
            EscapeHint
          </h1>
          <button
            className="p-2 rounded-full bg-gray-700"
            onClick={toggleDarkMode}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold mb-2">테마를 선택하세요</h2>
          <p className="text-text-secondary">Play the escape room game</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes?.map((theme: Theme) => (
            <div
              key={theme.id}
              className="bg-dark-secondary rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => handleThemeSelect(theme.id)}
            >
              <h3 className="text-xl font-bold mb-2">{theme.name}</h3>
              <p className="text-text-secondary mb-4">{theme.description}</p>
              <div className="flex justify-between text-sm">
                <span>⏱️ {theme.playTime}분</span>
                <span>{theme.difficulty}</span>
              </div>
              <div className="mt-4">
                <button className="w-full py-2 bg-accent-white text-dark-primary rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                  시작하기
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Admin Login Modal */}
        <AdminLoginModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
        />
      </div>
    </div>
  );
};