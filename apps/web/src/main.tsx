import '@repo/ui/globals.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { LessonWrapper } from '@web/layouts/LessonWrapper.tsx';
import MainLayout from '@web/layouts/MainLayout.tsx';
import ProtectedRoute from '@web/layouts/ProtectedRoute.tsx';
import { UserRole } from '@web/lib/auth.ts';
import { APP_ROUTES } from '@web/lib/routes.ts';
import { Achievements, Lesson, LessonMetricsScreen, Lessons, Profile } from '@web/pages';
import { queryClient } from '@web/utils/trpc.ts';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';

import { AdminDashboard } from './pages/AdminDashboard';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path={APP_ROUTES.HOME} element={<Navigate to={APP_ROUTES.LESSONS} replace />} />
            <Route path={APP_ROUTES.LESSONS} element={<Lessons />} />

            <Route element={<LessonWrapper />}>
              <Route path={APP_ROUTES.LESSON_DETAIL} element={<Lesson />} />
              <Route path={APP_ROUTES.LESSON_RESULTS} element={<LessonMetricsScreen />} />
            </Route>

            <Route element={<ProtectedRoute unauthenticatedRedirectTo={APP_ROUTES.LESSONS} />}>
              <Route path={APP_ROUTES.PROFILE} element={<Profile />} />
              <Route path={APP_ROUTES.ACHIEVEMENTS} element={<Achievements />} />
            </Route>

            <Route
              element={<ProtectedRoute allowedRoles={[UserRole.Admin]} unauthorizedRedirectTo={APP_ROUTES.LESSONS} />}
            >
              <Route path={APP_ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
            </Route>
            <Route path={APP_ROUTES.NOT_FOUND} element={<div>404 Not Found</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
