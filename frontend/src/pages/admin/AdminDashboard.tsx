import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminService } from '../../services/AdminService';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data: sessions } = AdminService.useGetSessions();
  const { data: stats } = AdminService.useGetDashboardStats();

  // Calculate stats
  const totalThemes = stats?.themeCount || 0;
  const activeSessions = sessions?.filter(s => s.status === 'in_progress').length || 0;
  const hintUsageToday = stats?.hintUsageCount || 0;

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">EscapeHint 관리자</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            로그아웃
          </button>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">전체 테마</h2>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalThemes}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">진행중인 세션</h2>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{activeSessions}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">오늘의 힌트 사용</h2>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{hintUsageToday}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <button
            onClick={() => navigate('/admin/themes')}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">테마 관리</h3>
            <p className="text-gray-600 dark:text-gray-400">테마 추가/수정/삭제</p>
          </button>

          <button
            onClick={() => navigate('/admin/themes/1/hints')} // Placeholder theme ID
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">힌트 관리</h3>
            <p className="text-gray-600 dark:text-gray-400">힌트 추가/수정/순서조정</p>
          </button>

          <button
            onClick={() => navigate('/admin/sessions')}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">세션 모니터링</h3>
            <p className="text-gray-600 dark:text-gray-400">진행중인 세션 확인</p>
          </button>

          <button
            onClick={() => navigate('/admin/users')} // May not exist yet
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">사용자 관리</h3>
            <p className="text-gray-600 dark:text-gray-400">관리자 계정 관리</p>
          </button>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">최근 활동</h2>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <p className="text-gray-700 dark:text-gray-300">15:30 | '좀비 연구소' 세션 시작됨</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <p className="text-gray-700 dark:text-gray-300">15:25 | 'HINT03' 힌트 수정됨</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <p className="text-gray-700 dark:text-gray-300">14:50 | '해적선' 테마 신규 등록</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};