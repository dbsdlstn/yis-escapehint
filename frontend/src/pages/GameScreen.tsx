import React, { useState, useEffect } from 'react';
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
  const [hintCode, setHintCode] = useState<string>('');
  const [inputFields, setInputFields] = useState<string[]>(Array(4).fill(''));
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const { data: theme, isLoading: isLoadingTheme, error: themeError } = ThemeService.useGetThemeById(themeId || '');

  // 세션 생성을 위한 mutation
  const { mutate: startSession, data: sessionData, isPending: isCreatingSession, error: sessionError } = GameSessionService.useStartSession();

  // 현재 세션 ID에 따라 세션 정보를 가져옴
  const { data: currentSession, isLoading: isSessionLoading, error: sessionFetchError } = GameSessionService.useGetSession(
    currentSessionId || ''
  );

  const { mutateAsync: _submitHint } = HintService.useSubmitHint();

  // 현재 로컬 스토리지에 저장된 세션 ID 가져오기
  const savedSessionId = localStorage.getItem('currentSessionId');

  // 세션 생성 또는 복구 로직
  useEffect(() => {
    let isMounted = true; // 컴포넌트 언마운트 후 상태 업데이트 방지

    // 먼저 저장된 세션 ID를 사용하려 시도
    if (savedSessionId && themeId && !isCreatingSession) {
      // 저장된 세션이 현재 테마와 일치하는지 확인
      // useGetSession 훅을 직접 호출하는 대신 수동으로 API 호출
      fetch(`${import.meta.env.VITE_API_BASE_URL}/sessions/${savedSessionId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        if (!response.ok) {
          // 세션이 존재하지 않는 경우 (404 등)
          if (response.status === 404) {
            console.log('저장된 세션이 데이터베이스에 존재하지 않음:', savedSessionId);
            if (isMounted) {
              localStorage.removeItem('currentSessionId');
              startSession(themeId);
            }
            return null;
          }
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (isMounted && data && data.success && data.data?.themeId === themeId) {
          // 테마가 일치하면 현재 세션 ID로 사용
          setCurrentSessionId(savedSessionId);
        } else if (isMounted && data) {
          // 테마가 불일치하면 저장된 세션 ID 제거 및 새 세션 생성
          localStorage.removeItem('currentSessionId');
          startSession(themeId);
        }
      })
      .catch(error => {
        if (isMounted) {
          console.error('세션 복구 중 오류 발생:', error);
          // 저장된 세션이 유효하지 않으면 새 세션 생성
          localStorage.removeItem('currentSessionId');
          startSession(themeId);
        }
      });
    } else if (!savedSessionId && themeId && !isCreatingSession) {
      // 저장된 세션이 없고 테마 ID가 있으면 새 세션 생성
      startSession(themeId);
    }

    return () => {
      isMounted = false; // 컴포넌트 언마운트 시 isMounted를 false로 설정
    };
  }, [savedSessionId, themeId, startSession, isCreatingSession]);

  // 세션 생성 시 로컬 스토리지 및 현재 세션 ID 업데이트
  useEffect(() => {
    if (sessionData && sessionData.id) {
      localStorage.setItem('currentSessionId', sessionData.id);
      setCurrentSessionId(sessionData.id);
    }
  }, [sessionData]);

  // 세션 데이터가 있을 때 타이머 초기화
  useEffect(() => {
    if (theme && currentSession) {
      // Initialize with full time based on theme's playTime
      const serverPlayTime = theme.playTime || 0; // in minutes
      const totalSeconds = Number.isFinite(serverPlayTime) ? serverPlayTime * 60 : 0;
      const validatedTotalSeconds = Number.isFinite(totalSeconds) && totalSeconds >= 0 ? totalSeconds : 0;

      // Set the session start time and initial timer value
      setSessionStartTime(new Date(currentSession.startTime));
      setTimer(validatedTotalSeconds);
    }
  }, [theme, currentSession]);

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
    if (!currentSessionId) {
      alert('세션이 생성되지 않았습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('=== 세션 ID 디버깅 ===');
      console.log('currentSessionId:', currentSessionId);

      // 힌트 제출
      console.log('힌트 제출 요청:', { sessionId: currentSessionId, code: hintCode.toUpperCase() });
      const result = await _submitHint({
        sessionId: currentSessionId,
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

  // 로딩 상태: 테마 로딩 중이거나 세션을 생성/로드 중일 때만
  const isLoading = isLoadingTheme || isCreatingSession || (savedSessionId ? isSessionLoading : false);

  // 세션 로딩 중이면 로딩 화면 표시
  if (isLoading) {
    return (
      <div className="screen-container">
        <div className="content-wrapper flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">게임 준비 중...</h2>
            <p className="text-text-secondary">잠시만 기다려주세요</p>
            <div>
              <>
                {sessionError && <p className="text-red-500">세션 생성 오류 발생: {(sessionError as Error).message}</p>}
                {themeError && <p className="text-red-500">테마 정보 로딩 오류: {(themeError as Error).message}</p>}
                {sessionFetchError && <p className="text-red-500">세션 복구 오류: {(sessionFetchError as Error).message}</p>}
              </>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If there's an error in session creation or theme loading
  if (sessionError || themeError || sessionFetchError) {
    return (
      <div className="screen-container">
        <div className="content-wrapper flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4 text-red-500">로딩 오류 발생</h2>
            <div className="text-text-secondary mb-4">
              {sessionError ? `세션 생성 오류: ${(sessionError as Error).message}` :
               themeError ? `테마 정보 오류: ${(themeError as Error).message}` :
               `세션 복구 오류: ${(sessionFetchError as Error).message}`}
            </div>
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

  // 세션이 없으면 에러 메시지
  if (!currentSession) {
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