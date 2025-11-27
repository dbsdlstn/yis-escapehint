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

  const { data: theme, isLoading: isLoadingTheme, error } = ThemeService.useGetThemeById(themeId || '');
  const { mutate: startSession, data: sessionData, isPending: isCreatingSession } = GameSessionService.useStartSession();
  const { mutateAsync: _submitHint } = HintService.useSubmitHint();

  // Get session from localStorage on component mount
  const savedSessionId = localStorage.getItem('currentSessionId');
  const { data: restoredSession, isLoading: isRestoringSession } = GameSessionService.useGetSession(savedSessionId || '', {
    enabled: !!savedSessionId, // Only fetch if savedSessionId exists
  });

  // 세션이 현재 테마와 일치하는지 확인
  useEffect(() => {
    if (restoredSession && themeId && restoredSession.themeId !== themeId) {
      // 복구된 세션이 현재 테마와 다르면 localStorage 삭제하고 새 세션 생성
      console.log('세션 테마 불일치 - 새 세션 생성:', {
        savedThemeId: restoredSession.themeId,
        currentThemeId: themeId
      });
      localStorage.removeItem('currentSessionId');
      startSession(themeId);
    }
  }, [restoredSession, themeId, startSession]);

  // 현재 활성 세션 결정 - 복구된 세션은 테마가 일치할 때만 사용
  const activeSession = sessionData || (restoredSession?.themeId === themeId ? restoredSession : null);
  const isLoadingSession = isCreatingSession || isRestoringSession;

  useEffect(() => {
    if (!savedSessionId && themeId) {
      // If no saved session, start a new session
      startSession(themeId);
    }
  }, [savedSessionId, themeId, startSession]);

  // Initialize timer when theme and session data are available
  useEffect(() => {
    if (theme && sessionData) {
      // Initialize with full time based on theme's playTime
      const serverPlayTime = theme.playTime || 0; // in minutes
      const totalSeconds = Number.isFinite(serverPlayTime) ? serverPlayTime * 60 : 0;
      const validatedTotalSeconds = Number.isFinite(totalSeconds) && totalSeconds >= 0 ? totalSeconds : 0;

      // Set the session start time and initial timer value
      setSessionStartTime(new Date(sessionData.startTime));
      setTimer(validatedTotalSeconds);
    }
  }, [theme, sessionData]);

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
    if (!activeSession) {
      alert('세션이 생성되지 않았습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('=== 세션 ID 디버깅 ===');
      console.log('activeSession:', activeSession);
      console.log('세션 ID:', activeSession.id);

      // 힌트 제출
      console.log('힌트 제출 요청:', { sessionId: activeSession.id, code: hintCode.toUpperCase() });
      const result = await _submitHint({
        sessionId: activeSession.id,
        code: hintCode.toUpperCase()
      });

      // 힌트 제출 성공 후, 힌트 내용을 표시하기 위해 힌트 데이터와 진행률을 state로 전달
      navigate('/hint', { state: result });
    } catch (error) {
      console.error('힌트 제출 오류:', error);
      alert('힌트를 찾을 수 없습니다. 코드를 확인하세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (timeInSeconds: number) => {
    // timeInSeconds가 NaN인 경우 00:00으로 처리
    if (isNaN(timeInSeconds)) {
      return '00:00';
    }

    const isNegative = timeInSeconds < 0;
    const absTime = Math.abs(timeInSeconds);
    const minutes = Math.floor(absTime / 60);
    const seconds = absTime % 60;
    return `${isNegative ? '-' : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // 세션 로딩 중이면 로딩 화면 표시
  if (isLoadingSession || isLoadingTheme) {
    return (
      <div className="screen-container">
        <div className="content-wrapper flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">게임 준비 중...</h2>
            <p className="text-text-secondary">잠시만 기다려주세요</p>
          </div>
        </div>
      </div>
    );
  }

  // 세션이 없으면 에러 메시지
  if (!activeSession) {
    return (
      <div className="screen-container">
        <div className="content-wrapper flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4 text-red-500">세션 생성 실패</h2>
            <p className="text-text-secondary mb-4">게임 세션을 생성할 수 없습니다.</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-accent-white text-dark-primary rounded-xl font-bold"
            >
              테마 선택으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-container">
      <div className="content-wrapper">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold">{theme?.name || '테마 정보 없음'}</h1>
          <div className="text-2xl font-mono">
            {isLoadingTheme ? '로딩 중...' :
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