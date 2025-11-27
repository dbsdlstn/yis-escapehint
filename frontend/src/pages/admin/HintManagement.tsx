import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HintService } from '../../services/HintService';
import { ThemeService } from '../../services/ThemeService';
import { Hint } from '../../types';

export const HintManagement: React.FC = () => {
  const { themeId } = useParams<{ themeId: string }>();
  const navigate = useNavigate();
  
  const { 
    data: hints, 
    isLoading: hintsLoading,
    refetch 
  } = HintService.useGetHintsByTheme(themeId || '');
  
  const { data: theme } = ThemeService.useGetThemeById(themeId || '');
  
  const { mutate: createHint } = HintService.useCreateHint();
  const { mutate: updateHint } = HintService.useUpdateHint();
  const { mutate: deleteHint } = HintService.useDeleteHint();
  const { mutate: _updateHintOrder } = HintService.useUpdateHintOrder();
  
  const [isCreating, setIsCreating] = useState(false);
  const [newHint, setNewHint] = useState<Omit<Hint, 'id' | 'createdAt' | 'updatedAt'>>({
    themeId: themeId || '',
    code: '',
    content: '',
    answer: '',
    progressRate: 0,
    order: 0,
    isActive: true
  });

  const [editingHint, setEditingHint] = useState<Hint | null>(null);
  const [editFormData, setEditFormData] = useState<Hint | null>(null);

  if (!themeId) {
    return <div className="p-6">테마 ID가 필요합니다.</div>;
  }

  if (hintsLoading) return <div className="p-6">로딩 중...</div>;

  const handleCreateHint = () => {
    createHint({ themeId, hintData: newHint }, {
      onSuccess: () => {
        setIsCreating(false);
        setNewHint({
          themeId: themeId,
          code: '',
          content: '',
          answer: '',
          progressRate: 0,
          order: 0,
          isActive: true
        });
        refetch(); // Refresh hints list
      }
    });
  };

  const handleUpdateHint = () => {
    if (editFormData) {
      updateHint(editFormData, {
        onSuccess: () => {
          setEditingHint(null);
          setEditFormData(null);
          refetch(); // Refresh hints list
        }
      });
    }
  };

  const handleDeleteHint = (id: string) => {
    if (window.confirm('정말로 이 힌트를 삭제하시겠습니까?')) {
      deleteHint(id, {
        onSuccess: () => {
          refetch(); // Refresh hints list
        }
      });
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">힌트 관리</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {theme ? theme.name : '테마'} - 힌트 {hints?.length || 0}개
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/themes')}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            테마 목록
          </button>
        </header>

        {/* Create Hint Form */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            {isCreating ? '새 힌트 등록' : '힌트 등록'}
          </h2>
          
          {!isCreating ? (
            <button
              onClick={() => setIsCreating(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              새 힌트 등록
            </button>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">힌트 코드 *</label>
                <input
                  type="text"
                  value={newHint.code}
                  onChange={(e) => setNewHint({...newHint, code: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded"
                  placeholder="HINT01"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">진행률 (%) *</label>
                <input
                  type="number"
                  value={newHint.progressRate}
                  onChange={(e) => setNewHint({...newHint, progressRate: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded"
                  placeholder="10"
                  min="0"
                  max="100"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">순서</label>
                <input
                  type="number"
                  value={newHint.order}
                  onChange={(e) => setNewHint({...newHint, order: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded"
                  placeholder="1"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">활성화 여부</label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newHint.isActive}
                    onChange={(e) => setNewHint({...newHint, isActive: e.target.checked})}
                    className="mr-2"
                  />
                  <span>{newHint.isActive ? '활성' : '비활성'}</span>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 dark:text-gray-300 mb-1">힌트 내용 *</label>
                <textarea
                  value={newHint.content}
                  onChange={(e) => setNewHint({...newHint, content: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded"
                  placeholder="힌트 내용을 입력하세요"
                  rows={3}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 dark:text-gray-300 mb-1">정답 *</label>
                <textarea
                  value={newHint.answer}
                  onChange={(e) => setNewHint({...newHint, answer: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded"
                  placeholder="정답을 입력하세요"
                  rows={2}
                />
              </div>
              
              <div className="md:col-span-2 flex space-x-2">
                <button
                  onClick={handleCreateHint}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  저장
                </button>
                <button
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  취소
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Hints List */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">등록된 힌트</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">순서</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">코드</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">내용</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">진행률</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">상태</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">작업</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {hints?.map((hint) => (
                  <tr key={hint.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{hint.order}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{hint.code}</td>
                    <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200 max-w-xs truncate" title={hint.content}>
                      {hint.content}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{hint.progressRate}%</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        hint.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                          : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                      }`}>
                        {hint.isActive ? '활성' : '비활성'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {editingHint?.id === hint.id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={handleUpdateHint}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          >
                            저장
                          </button>
                          <button
                            onClick={() => {
                              setEditingHint(null);
                              setEditFormData(null);
                            }}
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                          >
                            취소
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingHint(hint);
                              setEditFormData({...hint});
                            }}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDeleteHint(hint.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            삭제
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};