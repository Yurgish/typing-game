import { AchievementRepository } from '@api/repositories/achivement/achievement.repository';
import { CharacterMetricRepository } from '@api/repositories/characterMetric/characterMetric.repository';
import { DailyActivityRepository } from '@api/repositories/dailyActivity/dailyActivity.repository';
import { LessonRepository } from '@api/repositories/lesson/lesson.repository';
import { ScreenMetricsRepository } from '@api/repositories/screenMetric/screenMetrics.repository';
import { UserLessonProgressRepository } from '@api/repositories/userLessonProgress/userLessonProgress.repository';
import { UserStatsRepository } from '@api/repositories/userStats/userStats.repository';
import { AchievementService } from '@api/services/AchievementService';
import { DailyActivityService } from '@api/services/DailyActivityService';
import { UserProgressService } from '@api/services/UserProgressService';
import { UserStatsService } from '@api/services/UserStatsService';
import { PrismaClient } from '@repo/database/generated/client';

import { registerAllEventListeners } from '../events/listeners';
import { AppRepositories, AppServices } from './types';

// thats how we initialize our dependencies (thats bad need to remake this (maybe)))
export const initializeDependencies = (db: PrismaClient) => {
  const dailyActivityRepository = new DailyActivityRepository(db);
  const userStatsRepository = new UserStatsRepository(db);
  const achievementRepository = new AchievementRepository(db);
  const screenMetricsRepository = new ScreenMetricsRepository(db);
  const lessonRepository = new LessonRepository(db);
  const userLessonProgressRepository = new UserLessonProgressRepository(db);
  const characterMetricsRepository = new CharacterMetricRepository(db);

  const repositories: AppRepositories = {
    dailyActivityRepository,
    userStatsRepository,
    achievementRepository,
    screenMetricsRepository,
    lessonRepository,
    userLessonProgressRepository,
    characterMetricsRepository
  };

  const dailyActivityService = new DailyActivityService(
    repositories.dailyActivityRepository,
    repositories.userStatsRepository
  );
  const achievementService = new AchievementService(achievementRepository);
  const userStatsService = new UserStatsService(repositories.userStatsRepository);
  const userProgressService = new UserProgressService(
    lessonRepository,
    userLessonProgressRepository,
    screenMetricsRepository,
    userStatsRepository
  );

  const services: AppServices = {
    dailyActivityService,
    userStatsService,
    achievementService,
    userProgressService
  };

  registerAllEventListeners(services);

  return { repositories, services };
};
