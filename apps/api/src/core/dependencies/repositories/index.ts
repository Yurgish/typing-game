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

/**
 * Creates and initializes all data repositories using a Prisma client instance.
 *
 * Repositories are the data access layer of the application. They encapsulate
 * the logic for interacting with the database, abstracting the details from services.
 * @param {PrismaClient} db The PrismaClient instance for database access.
 * @returns {object} An object containing all initialized repository instances.
 */
export const createRepositories = (db: PrismaClient) => ({
  dailyActivityRepository: new DailyActivityRepository(db),
  userStatsRepository: new UserStatsRepository(db),
  achievementRepository: new AchievementRepository(db),
  screenMetricsRepository: new ScreenMetricsRepository(db),
  lessonRepository: new LessonRepository(db),
  userLessonProgressRepository: new UserLessonProgressRepository(db),
  characterMetricsRepository: new CharacterMetricRepository(db)
});

/**
 * A type representing the collection of all repositories.
 * This is automatically inferred from the `createRepositories` function for type safety.
 */
export type Repositories = ReturnType<typeof createRepositories>;
