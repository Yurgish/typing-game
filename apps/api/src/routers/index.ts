import { router } from '@api/trpc';

import { lessonRouter } from './lessons';
import { userProgressRouter } from './userProgress';

export const appRouter = router({
  lesson: lessonRouter,
  userProgress: userProgressRouter
});

export type AppRouter = typeof appRouter;
