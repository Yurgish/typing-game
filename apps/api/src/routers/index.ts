import { router } from '@api/trpc';

import { achievementsRouter } from './achievementsRouter';
import { activityHeatmapRouter } from './activityHeatmapRouter';
import { characterMetricsRouter } from './characterMetricsRouter';
import { lessonProgressRouter } from './lessonProgressRouter';
import { lessonRouter } from './lessons';
import { userStatsRouter } from './userStatsRouter';

export const appRouter = router({
  lesson: lessonRouter,
  lessonProgress: lessonProgressRouter,
  achievements: achievementsRouter,
  activityHeatmap: activityHeatmapRouter,
  characterMetrics: characterMetricsRouter,
  userStats: userStatsRouter
});

export type AppRouter = typeof appRouter;
