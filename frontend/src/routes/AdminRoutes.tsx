import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminLogin } from '../pages/admin/AdminLogin';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { ThemeManagement } from '../pages/admin/ThemeManagement';
import { HintManagement } from '../pages/admin/HintManagement';
import { SessionMonitoring } from '../pages/admin/SessionMonitoring';

export const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/themes" element={<ThemeManagement />} />
      <Route path="/themes/:themeId/hints" element={<HintManagement />} />
      <Route path="/sessions" element={<SessionMonitoring />} />
    </Routes>
  );
};