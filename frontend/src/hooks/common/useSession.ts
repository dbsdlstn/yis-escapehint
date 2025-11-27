import { useState, useEffect } from 'react';
import { GameSession } from '../../types';
import { useAppStore } from '../../stores/appStore';

interface UseSession {
  session: GameSession | null;
  startSession: (themeId: string) => Promise<void>;
  endSession: () => void;
  updateSessionProgress: (hintProgress: number) => void;
}

export const useSession = (): UseSession => {
  const [session, setSession] = useState<GameSession | null>(null);
  const { setCurrentSession, setCurrentProgress, setUsedHintCount } = useAppStore();
  
  // Load session from localStorage on mount
  useEffect(() => {
    const savedSessionId = localStorage.getItem('currentSessionId');
    if (savedSessionId) {
      // In a real app, we would fetch session details from the API
      // For now, we'll just set the ID
      const sessionData: GameSession = {
        id: savedSessionId,
        themeId: '', // This would be populated from the API
        startTime: new Date().toISOString(),
        endTime: null,
        usedHintCount: 0,
        usedHintCodes: [],
        status: 'in_progress',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setSession(sessionData);
      setCurrentSession(sessionData);
    }
  }, [setCurrentSession]);

  const startSession = async (themeId: string) => {
    // This would call the API to start a session
    // For now, we'll simulate it
    const newSession: GameSession = {
      id: `session_${Date.now()}`,
      themeId,
      startTime: new Date().toISOString(),
      endTime: null,
      usedHintCount: 0,
      usedHintCodes: [],
      status: 'in_progress',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('currentSessionId', newSession.id);
    setSession(newSession);
    setCurrentSession(newSession);
    setCurrentProgress(0);
    setUsedHintCount(0);
  };

  const endSession = () => {
    if (session) {
      const updatedSession: GameSession = {
        ...session,
        endTime: new Date().toISOString(),
        status: 'completed'
      };
      
      setSession(updatedSession);
      setCurrentSession(updatedSession);
      localStorage.removeItem('currentSessionId');
    }
  };

  const updateSessionProgress = (hintProgress: number) => {
    if (session) {
      const newUsedHintCount = session.usedHintCount + 1;
      const updatedUsedHintCodes = [...session.usedHintCodes, `HINT${newUsedHintCount}`]; // Simplified
      
      const updatedSession: GameSession = {
        ...session,
        usedHintCount: newUsedHintCount,
        usedHintCodes: updatedUsedHintCodes
      };
      
      setSession(updatedSession);
      setCurrentSession(updatedSession);
      setUsedHintCount(newUsedHintCount);
      
      // Update progress based on hint
      setCurrentProgress((prev: number) => Math.max(prev, hintProgress));
    }
  };

  return {
    session,
    startSession,
    endSession,
    updateSessionProgress
  };
};