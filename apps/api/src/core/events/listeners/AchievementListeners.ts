import { AchievementService } from '@api/services/AchievementService';
import { UserStatsService } from '@api/services/UserStatsService';

import appEventEmitter from '../appEventEmmiter';

export const registerAchievementListeners = (
  achievementService: AchievementService,
  userStatsService: UserStatsService
) => {
  appEventEmitter.on('lessonCompleted', async (userId) => {
    try {
      console.log(`[Achievement Listener] Processing lessonCompleted for user ${userId}`);

      const currentUserStats = await userStatsService.getUserStats(userId);
      const newAchievements = await achievementService.checkAndAwardAchievements(userId, currentUserStats);

      if (newAchievements.length > 0) {
        console.log(`[Achievement Listener] User ${userId} unlocked new achievements: ${newAchievements.join(', ')}`);
      }
    } catch (error) {
      console.error(`[Achievement Listener Error] Failed to check/award achievements for user ${userId}:`, error);
    }
  });

  //   appEventEmitter.on('screenCompleted', async (userId, _xpEarned, _activityType) => {
  //     try {
  //       console.log(`[Achievement Listener] Processing screenCompleted for user ${userId}`);
  //       const currentUserStats = await userStatsService.getUserStats(userId);
  //       const newAchievements = await achievementService.checkAndAwardAchievements(userId, currentUserStats);
  //       if (newAchievements.length > 0) {
  //         console.log(
  //           `[Achievement Listener] User ${userId} unlocked new achievements (screen): ${newAchievements.join(', ')}`
  //         );
  //       }
  //     } catch (error) {
  //       console.error(
  //         `[Achievement Listener Error] Failed to check/award achievements for user ${userId} (screen):`,
  //         error
  //       );
  //     }
  //   });
};
