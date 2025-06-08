import '@repo/ui/globals.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';

import App from './App.tsx';
import MainLayout from './layouts/MainLayout.tsx';
import Lesson from './pages/Lesson.tsx';
import LessonResults from './pages/LessonResults.tsx';
import Lessons from './pages/Lessons.tsx';
import { queryClient } from './utils/trpc.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<App />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/lesson/:lessonId" element={<Lesson />} />
            <Route path="/lesson/:lessonId/results" element={<LessonResults />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
