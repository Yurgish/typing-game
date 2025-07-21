import { AchievementService, DailyActivityService, UserProgressService, UserStatsService } from '@api/services';

import { Repositories } from '../repositories';

export const createServices = (repositories: Repositories) => ({
  dailyActivityService: new DailyActivityService(
    repositories.dailyActivityRepository,
    repositories.userStatsRepository
  ),
  achievementService: new AchievementService(repositories.achievementRepository),
  userStatsService: new UserStatsService(repositories.userStatsRepository),
  userProgressService: new UserProgressService(
    repositories.lessonRepository,
    repositories.userLessonProgressRepository,
    repositories.screenMetricsRepository
  )
});

export type Services = ReturnType<typeof createServices>;
