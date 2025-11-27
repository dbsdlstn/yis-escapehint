import { useState, useEffect, useCallback } from 'react';

interface UseTimer {
  time: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: (newTime?: number) => void;
  formatTime: (timeInSeconds: number) => string;
}

export const useTimer = (initialTime: number = 0): UseTimer => {
  const [time, setTime] = useState<number>(initialTime);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning]);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback((newTime: number = 0) => {
    setTime(newTime);
    setIsRunning(false);
  }, []);

  const formatTime = useCallback((timeInSeconds: number) => {
    const isNegative = timeInSeconds < 0;
    const absTime = Math.abs(timeInSeconds);
    const hours = Math.floor(absTime / 3600);
    const mins = Math.floor((absTime % 3600) / 60);
    const secs = absTime % 60;

    if (hours > 0) {
      return `${isNegative ? '-' : ''}${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    return `${isNegative ? '-' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return { time, isRunning, start, pause, reset, formatTime };
};