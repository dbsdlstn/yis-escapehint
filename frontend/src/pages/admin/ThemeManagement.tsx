import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeService } from '../../services/ThemeService';
import { Theme } from '../../types';

export const ThemeManagement: React.FC = () => {
  const navigate = useNavigate();
  const { 
    data: themes, 
    isLoading, 
    error 
  } = ThemeService.useGetAllThemes(); // Will need to implement this service method
  
  const { mutate: createTheme } = ThemeService.useCreateTheme();
  const { mutate: updateTheme } = ThemeService.useUpdateTheme();
  const { mutate: deleteTheme } = ThemeService.useDeleteTheme();
  
  const [isCreating, setIsCreating] = useState(false);
  const [newTheme, setNewTheme] = useState<Omit<Theme, 'id' | 'hintCount' | 'createdAt' | 'updatedAt'>>({
    name: '',
    description: '',
    playTime: 60,
    isActive: true,
    difficulty: '★★★☆☆'
  });

  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);
  const [editFormData, setEditFormData] = useState<Theme | null>(null);

  if (isLoading) return <div className="p-6">로딩 중...</div>;
  if (error) return <div className="p-6 text-red-500">에러: {String(error)}</div>;

  const handleCreateTheme = () => {
    createTheme(newTheme, {
      onSuccess: () => {
        setIsCreating(false);
        setNewTheme({
          name: '',
          description: '',
          playTime: 60,
          isActive: true,
          difficulty: '★★★☆☆'
        });
      }
    });
  };

  const handleUpdateTheme = () => {
    if (editFormData) {
      updateTheme(editFormData, {
        onSuccess: () => {
          setEditingTheme(null);
          setEditFormData(null);
        }
      });
    }
  };

  const handleDeleteTheme = (id: string) => {
    if (window.confirm('정말로 이 테마를 삭제하시겠습니까?')) {
      deleteTheme(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">테마 관리</h1>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            대시보드
          </button>
        </header>

        {/* Create Theme Form */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            {isCreating ? '새 테마 등록' : '테마 등록'}
          </h2>
          
          {!isCreating ? (
            <button
              onClick={() => setIsCreating(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              새 테마 등록
            </button>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">테마 이름 *</label>
                <input
                  type="text"
                  value={newTheme.name}
                  onChange={(e) => setNewTheme({...newTheme, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded"
                  placeholder="테마 이름"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">제한 시간 (분) *</label>
                <input
                  type="number"
                  value={newTheme.playTime}
                  onChange={(e) => setNewTheme({...newTheme, playTime: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded"
                  placeholder="분"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">난이도</label>
                <input
                  type="text"
                  value={newTheme.difficulty}
                  onChange={(e) => setNewTheme({...newTheme, difficulty: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded"
                  placeholder="★★★☆☆"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">활성화 여부</label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newTheme.isActive}
                    onChange={(e) => setNewTheme({...newTheme, isActive: e.target.checked})}
                    className="mr-2"
                  />
                  <span>{newTheme.isActive ? '활성' : '비활성'}</span>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 dark:text-gray-300 mb-1">설명</label>
                <textarea
                  value={newTheme.description || ''}
                  onChange={(e) => setNewTheme({...newTheme, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded"
                  placeholder="테마 설명"
                  rows={2}
                />
              </div>
              
              <div className="md:col-span-2 flex space-x-2">
                <button
                  onClick={handleCreateTheme}
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

        {/* Themes List */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">등록된 테마</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">이름</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">제한시간</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">난이도</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">힌트 수</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">상태</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">작업</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {themes?.map((theme) => (
                  <tr key={theme.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{theme.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{theme.playTime}분</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{theme.difficulty}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{theme.hintCount}개</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        theme.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                          : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                      }`}>
                        {theme.isActive ? '활성' : '비활성'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {editingTheme?.id === theme.id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={handleUpdateTheme}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          >
                            저장
                          </button>
                          <button
                            onClick={() => {
                              setEditingTheme(null);
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
                              setEditingTheme(theme);
                              setEditFormData({...theme});
                            }}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => navigate(`/admin/themes/${theme.id}/hints`)}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                          >
                            힌트 관리
                          </button>
                          <button
                            onClick={() => handleDeleteTheme(theme.id)}
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