export const APP_ROUTES = {
  HOME: '/',
  LESSONS: '/lessons',
  LESSON_DETAIL: '/lesson/:lessonId',
  LESSON_RESULTS: '/lesson/:lessonId/results',
  PROFILE: '/profile',
  ACHIEVEMENTS: '/profile/achievements',
  ADMIN_DASHBOARD: '/dashboard',
  NOT_FOUND: '*'
} as const;

export const generateLessonPath = (lessonId: string) => APP_ROUTES.LESSON_DETAIL.replace(':lessonId', lessonId);

export const generateLessonResultsPath = (lessonId: string) => APP_ROUTES.LESSON_RESULTS.replace(':lessonId', lessonId);
