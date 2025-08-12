import { Services } from '@api/core/dependencies/services';

import { registerAchievementListeners } from './AchievementListeners';
import { registerDailyActivityListeners } from './DailyActivityListeners';
import { registerUserStatsListeners } from './UserStatsListeners';

/**
 * Registers all application event listeners using the provided services.
 *
 * This function initializes and attaches event listeners for daily activity,
 * user statistics, and achievements by passing the appropriate service instances.
 * It also logs a confirmation message upon successful registration.
 *
 * @param services - An object containing all required application services for event listener registration.
 */
export const registerAllEventListeners = (services: Services) => {
  registerDailyActivityListeners(services.dailyActivityService);
  registerUserStatsListeners(services.userStatsService);
  registerAchievementListeners(services.achievementService, services.userStatsService);

  console.log('All application event listeners registered.');
};
