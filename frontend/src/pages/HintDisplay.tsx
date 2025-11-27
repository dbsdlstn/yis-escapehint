import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface Hint {
  id: string;
  content: string;
  answer: string | null;
  progressRate: number;
}

export const HintDisplay: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  // 힌트 데이터를 state에서 가져오기
  const result = location.state;
  const hint: Hint | undefined = result?.hint;
  const progressRate: number = result?.progressRate || 0;

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
              style={{ width: `${progressRate}%` }}
            ></div>
          </div>
          <div className="text-text-secondary mb-8">{progressRate}% 진행률</div>

          {/* Show answer button */}
          {!showAnswer && hint?.answer && (
            <button
              onClick={handleShowAnswer}
              className="mb-8 px-6 py-3 bg-blue-600 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              정답 보기
            </button>
          )}

          {/* Answer display */}
          {showAnswer && hint && hint.answer && (
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