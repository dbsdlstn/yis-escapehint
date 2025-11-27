import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../stores/ThemeContext';
import { GameSessionService } from '../services/GameSessionService';
import { ThemeService } from '../services/ThemeService';
import { HintService } from '../services/HintService';

export const GameScreen: React.FC = () => {
  const { themeId } = useParams<{ themeId: string }>();
  const navigate = useNavigate();
  const { darkMode: _darkMode } = useTheme();
  const [timer, setTimer] = useState<number>(0); // in seconds
  const [usedHintCount, _setUsedHintCount] = useState<number>(0);
  const [progress, _setProgress] = useState<number>(0);
  const [hintCode, setHintCode] = useState<string>('');
  const [inputFields, setInputFields] = useState<string[]>(Array(4).fill(''));
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

  const { data: theme, isLoading, error } = ThemeService.useGetThemeById(themeId || '');
  const { mutate: startSession, data: sessionData } = GameSessionService.useStartSession();
  const { mutate: _submitHint } = HintService.useSubmitHint();

  // Get session from localStorage on component mount
  const savedSessionId = localStorage.getItem('currentSessionId');
  const { data: restoredSession, isLoading: isRestoringSession } = GameSessionService.useGetSession(savedSessionId || '', {
    enabled: !!savedSessionId, // Only fetch if savedSessionId exists
  });

  useEffect(() => {
    if (savedSessionId && restoredSession) {
      // If there's a saved session ID and we've retrieved the session data, restore the timer
      const serverStartTime = new Date(restoredSession.startTime);
      const serverPlayTime = theme?.playTime || 0; // in minutes
      const elapsedSeconds = Math.floor((Date.now() - serverStartTime.getTime()) / 1000);
      const totalSeconds = serverPlayTime * 60;
      const remainingTime = Math.max(0, totalSeconds - elapsedSeconds);

      setSessionStartTime(serverStartTime);
      setTimer(remainingTime);
    } else if (!savedSessionId && themeId) {
      // If no saved session, start a new session
      startSession(themeId);
    }
  }, [savedSessionId, restoredSession, themeId, startSession, theme?.playTime]);

  // Initialize and sync timer when theme and session data are available
  useEffect(() => {
    if (theme && sessionData && !savedSessionId) {
      // Only initialize with full time if this is a new session, not a restored one
      const serverStartTime = new Date(sessionData.startTime);
      const serverPlayTime = theme.playTime; // in minutes
      const totalSeconds = serverPlayTime * 60;

      setSessionStartTime(serverStartTime);
      setTimer(totalSeconds); // Start with full time
    }
  }, [theme, sessionData, savedSessionId]);

  // Timer effect with server synchronization
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    let syncInterval: NodeJS.Timeout | null = null;

    if (sessionStartTime && timer > 0) {
      // Main timer interval (client-side countdown)
      interval = setInterval(() => {
        setTimer(prev => Math.max(0, prev - 1));
      }, 1000);

      // Sync with server every minute to maintain accuracy
      syncInterval = setInterval(() => {
        // Calculate expected remaining time based on server start time
        const elapsedSeconds = Math.floor((Date.now() - sessionStartTime.getTime()) / 1000);
        const totalTime = theme?.playTime ? theme.playTime * 60 : 0;
        const expectedRemaining = Math.max(0, totalTime - elapsedSeconds);

        // Adjust timer if it's drifted more than 2 seconds from expected
        if (Math.abs(timer - expectedRemaining) > 2) {
          setTimer(expectedRemaining);
        }
      }, 60000); // Sync every minute
    } else if (sessionStartTime && timer === 0) {
      // Timer has reached zero, navigate back to theme selection
      alert('제한 시간이 초과되었습니다. 다시 시도해주세요.');
      navigate('/');
    }

    return () => {
      if (interval) clearInterval(interval);
      if (syncInterval) clearInterval(syncInterval);
    };
  }, [timer, sessionStartTime, theme?.playTime, navigate]);

  // Handle hint code input
  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newInputFields = [...inputFields];
    newInputFields[index] = value;
    setInputFields(newInputFields);

    // Move to next field if filled
    if (value && index < 3) {
      const nextField = document.getElementById(`hint-input-${index + 1}`) as HTMLInputElement;
      if (nextField) nextField.focus();
    }

    // Combine all fields to form the full code
    const fullCode = newInputFields.join('');
    setHintCode(fullCode);
  };

  // Handle keydown for navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !inputFields[index] && index > 0) {
      const prevField = document.getElementById(`hint-input-${index - 1}`) as HTMLInputElement;
      if (prevField) prevField.focus();
    }
  };

  const handleSubmit = async () => {
    if (hintCode.length !== 4) return;

    setIsSubmitting(true);
    try {
      // This would call the actual service to submit the hint
      // For now, we'll just navigate to the hint display page
      navigate(`/hint/${hintCode.toUpperCase()}`);
    } catch (error) {
      alert('힌트를 찾을 수 없습니다. 코드를 확인하세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const isNegative = timeInSeconds < 0;
    const absTime = Math.abs(timeInSeconds);
    const minutes = Math.floor(absTime / 60);
    const seconds = absTime % 60;
    return `${isNegative ? '-' : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="screen-container">
      <div className="content-wrapper">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold">{theme?.name || '테마 정보 없음'}</h1>
          <div className="text-2xl font-mono">
            {isLoading ? '로딩 중...' :
             !theme ? '테마 없음' :
             formatTime(timer)}
          </div>
        </div>

        {/* Hint info */}
        <div className="flex justify-end text-text-secondary mb-12">
          <div>사용한 힌트: {usedHintCount}개</div>
        </div>

        {/* Hint input section */}
        <div className="text-center mb-16">
          <h2 className="text-xl font-semibold mb-8">힌트 코드를 입력하세요</h2>

          {/* Input boxes */}
          <div className="flex justify-center space-x-3 mb-12">
            {inputFields.map((value, index) => (
              <input
                key={index}
                id={`hint-input-${index}`}
                type="text"
                maxLength={1}
                value={value}
                onChange={(e) => handleInputChange(index, e.target.value.toUpperCase())}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-14 h-14 text-center text-input-text font-bold bg-bg-input border-2 border-border-light rounded-xl focus:border-border-focus focus:ring-2 focus:ring-white/30 outline-none"
                autoFocus={index === 0}
              />
            ))}
          </div>

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || hintCode.length !== 4}
            className={`px-8 py-4 rounded-xl font-bold text-lg ${
              hintCode.length === 4 && !isSubmitting
                ? 'bg-accent-white text-dark-primary'
                : 'bg-gray-600 text-gray-400'
            }`}
          >
            {isSubmitting ? '처리 중...' : '확인'}
          </button>
        </div>

        {/* Keypad (Optional - could be implemented for mobile) */}
        <div className="mt-12">
          <p className="text-center text-text-secondary">Hint codes are typically provided in the escape room</p>
        </div>
      </div>
    </div>
  );
};