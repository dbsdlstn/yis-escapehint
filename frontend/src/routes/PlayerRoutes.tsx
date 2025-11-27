import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeSelector } from '../pages/ThemeSelector';
import { GameScreen } from '../pages/GameScreen';
import { HintDisplay } from '../pages/HintDisplay';

export const PlayerRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ThemeSelector />} />
      <Route path="/game/:themeId" element={<GameScreen />} />
      <Route path="/hint" element={<HintDisplay />} />
    </Routes>
  );
};