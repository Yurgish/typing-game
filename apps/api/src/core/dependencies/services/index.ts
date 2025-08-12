import { AchievementService, DailyActivityService, UserProgressService, UserStatsService } from '@api/services';

import { Repositories } from '../repositories';

/**
 * Creates and initializes all application services.
 *
 * Services contain the business logic of the application. They coordinate
 * multiple repositories to perform complex operations and encapsulate
 * the core functionality.
 * @param {Repositories} repositories An object containing all initialized repository instances.
 * @returns {object} An object containing all initialized service instances.
 */
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

/**
 * A type representing the collection of all services.
 * This is automatically inferred from the `createServices` function for type safety.
 */
export type Services = ReturnType<typeof createServices>;
