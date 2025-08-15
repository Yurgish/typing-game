import { AchievementService } from '@api/services/AchievementService';
import { UserStatsService } from '@api/services/UserStatsService';

import appEventEmitter, { APP_EVENTS } from '../appEventEmmiter';

/**
 * Registers listeners for achievement-related events.
 *
 * Specifically, listens for the 'screenCompleted' event, checks if the user qualifies
 * for new achievements, awards them if applicable, and emits an 'sse_achievementUnlocked'
 * event for each new achievement unlocked.
 *
 * @param achievementService - Service responsible for achievement logic and data.
 * @param userStatsService - Service for retrieving user statistics.
 */
export const registerAchievementListeners = (
  achievementService: AchievementService,
  userStatsService: UserStatsService
) => {
  appEventEmitter.on(APP_EVENTS.SCREEN_COMPLETED, async (userId) => {
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
        appEventEmitter.emit(APP_EVENTS.SSE_ACHIEVEMENT_UNLOCKED, userId, {
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
