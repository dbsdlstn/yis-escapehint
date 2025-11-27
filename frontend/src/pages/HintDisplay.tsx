import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HintService } from '../services/HintService';

export const HintDisplay: React.FC = () => {
  const { hintId } = useParams<{ hintId: string }>();
  const navigate = useNavigate();
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const { data: hint } = HintService.useGetHintById(hintId || '');
  
  const handleShowAnswer = () => {
    setShowAnswer(true);
  };
  
  const handleGoBack = () => {
    navigate(-1);  // Go back to the previous page
  };

  return (
    <div className="screen-container">
      <div className="content-wrapper">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold">EscapeHint</h1>
          <span className="text-2xl">⏰</span>
        </div>

        {/* Hint content */}
        <div className="text-center mb-12">
          <div className="text-hint-label text-text-secondary mb-2">HINT</div>
          <div className="text-2xl font-medium mb-8">{hint?.content || '힌트 내용을 불러오는 중...'}</div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-700 rounded-full h-2.5 mb-8">
            <div 
              className="bg-accent-white h-2.5 rounded-full" 
              style={{ width: `${hint?.progressRate || 0}%` }}
            ></div>
          </div>
          <div className="text-text-secondary mb-8">{hint?.progressRate || 0}% 진행률</div>
          
          {/* Show answer button */}
          {!showAnswer && (
            <button
              onClick={handleShowAnswer}
              className="mb-8 px-6 py-3 bg-blue-600 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              정답 보기
            </button>
          )}
          
          {/* Answer display */}
          {showAnswer && hint && (
            <div className="mb-8 p-4 bg-yellow-900/30 rounded-lg border border-yellow-700">
              <div className="font-medium text-yellow-300">정답:</div>
              <div className="text-lg mt-2">{hint.answer}</div>
            </div>
          )}
          
          {/* Back button */}
          <button
            onClick={handleGoBack}
            className="px-6 py-3 bg-gray-700 rounded-lg font-medium hover:bg-gray-600 transition-colors"
          >
            뒤로 가기
          </button>
        </div>
      </div>
    </div>
  );
};