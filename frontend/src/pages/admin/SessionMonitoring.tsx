import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminService } from '../../services/AdminService';
import { GameSession } from '../../types';

export const SessionMonitoring: React.FC = () => {
  const navigate = useNavigate();
  const { data: sessions, isLoading } = AdminService.useGetSessions();

  if (isLoading) return <div className="p-6">로딩 중...</div>;

  const getStatusColor = (status: GameSession['status']) => {
    switch (status) {
      case 'in_progress':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      case 'aborted':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  // Calculate some stats
  const activeSessions = sessions?.filter(s => s.status === 'in_progress').length || 0;
  const completedSessions = sessions?.filter(s => s.status === 'completed').length || 0;
  const abortedSessions = sessions?.filter(s => s.status === 'aborted').length || 0;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">세션 모니터링</h1>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            대시보드
          </button>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">진행중 세션</h2>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{activeSessions}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">완료 세션</h2>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{completedSessions}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">중단 세션</h2>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">{abortedSessions}</p>
          </div>
        </div>

        {/* Sessions List */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">전체 세션</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">세션 ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">테마</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">시작 시간</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">사용 힌트</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">상태</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">작업</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {sessions?.map((session) => (
                  <tr key={session.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{session.id.substring(0, 8)}...</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{session.themeId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      {new Date(session.startTime).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{session.usedHintCount}개</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(session.status)}`}>
                        {session.status === 'in_progress' ? '진행중' : 
                         session.status === 'completed' ? '완료' : '중단'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => {
                          // In a real app, this would show session details
                          alert(`세션 상세 정보:\nID: ${session.id}\n시작: ${session.startTime}\n힌트: ${session.usedHintCount}개\n상태: ${session.status}`);
                        }}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                      >
                        상세보기
                      </button>
                      <button
                        onClick={() => {
                          // In a real app, this would force-end the session
                          alert(`세션 강제 종료: ${session.id}`);
                        }}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        disabled={session.status !== 'in_progress'}
                      >
                        강제 종료
                      </button>
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