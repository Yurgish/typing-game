import { AchievementService } from '@api/services/AchievementService';
import { UserStatsService } from '@api/services/UserStatsService';

import appEventEmitter from '../appEventEmmiter';

export const registerAchievementListeners = (
  achievementService: AchievementService,
  userStatsService: UserStatsService
) => {
  appEventEmitter.on('screenCompleted', async (userId) => {
    try {
      console.log(`[Achievement Listener] Processing screenCompleted for user ${userId}`);
      const currentUserStats = await userStatsService.getUserStats(userId);
      const newAchievementsIds = await achievementService.checkAndAwardAchievements(userId, currentUserStats);
      if (newAchievementsIds.length === 0) {
        return;
      }

      console.log(
        `[Achievement Listener] User ${userId} unlocked new achievements (screen): ${newAchievementsIds.join(', ')}`
      );

      for (const achievementId of newAchievementsIds) {
        const achievement = achievementService.getAchievementById(achievementId);
        if (!achievement) continue;
        appEventEmitter.emit('sse_achievementUnlocked', userId, {
          id: achievement.id,
          achievementName: achievement.name,
          achievementDescription: achievement.description,
          unlockedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error(
        `[Achievement Listener Error] Failed to check/award achievements for user ${userId} (screen):`,
        error
      );
    }
  });
};
