import { AppServices } from '@api/core/dependencies/types';

import { registerAchievementListeners } from './AchievementListeners';
import { registerDailyActivityListeners } from './DailyActivityListeners';
import { registerUserStatsListeners } from './UserStatsListeners';

export const registerAllEventListeners = (services: AppServices) => {
  registerDailyActivityListeners(services.dailyActivityService);
  registerUserStatsListeners(services.userStatsService);
  registerAchievementListeners(services.achievementService, services.userStatsService);

  console.log('All application event listeners registered.');
};
