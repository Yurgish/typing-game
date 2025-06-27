import '@repo/ui/globals.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';

import MainLayout from './layouts/MainLayout.tsx';
import Achivments from './pages/Achievements.tsx';
import Lesson from './pages/Lesson.tsx';
import LessonResults from './pages/LessonResults.tsx';
import Lessons from './pages/Lessons.tsx';
import Profile from './pages/Profile.tsx';
import { queryClient } from './utils/trpc.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/lessons" replace />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/lesson/:lessonId" element={<Lesson />} />
            <Route path="/lesson/:lessonId/results" element={<LessonResults />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/achievements" element={<Achivments />} />
            <Route path="*" element={<div>404 Not Found</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
