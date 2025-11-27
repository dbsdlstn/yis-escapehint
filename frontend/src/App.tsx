import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './stores/ThemeContext';
import { PlayerRoutes } from './routes/PlayerRoutes';
import { AdminRoutes } from './routes/AdminRoutes';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router future={{ v7_startTransition: true }}>
          <div className="app">
            <Routes>
              <Route path="/*" element={<PlayerRoutes />} />
              <Route path="/admin/*" element={<AdminRoutes />} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;