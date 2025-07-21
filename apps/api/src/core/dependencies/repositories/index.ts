import {
  AchievementRepository,
  CharacterMetricRepository,
  DailyActivityRepository,
  LessonRepository,
  ScreenMetricsRepository,
  UserLessonProgressRepository,
  UserStatsRepository
} from '@api/repositories';
import { PrismaClient } from '@repo/database/generated/client';

export const createRepositories = (db: PrismaClient) => ({
  dailyActivityRepository: new DailyActivityRepository(db),
  userStatsRepository: new UserStatsRepository(db),
  achievementRepository: new AchievementRepository(db),
  screenMetricsRepository: new ScreenMetricsRepository(db),
  lessonRepository: new LessonRepository(db),
  userLessonProgressRepository: new UserLessonProgressRepository(db),
  characterMetricsRepository: new CharacterMetricRepository(db)
});

export type Repositories = ReturnType<typeof createRepositories>;
