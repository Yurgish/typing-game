import { UserStatsService } from '@api/services/UserStatsService';

import appEventEmitter from '../appEventEmmiter';

export const registerUserStatsListeners = (userStatsService: UserStatsService) => {
  appEventEmitter.on('screenCompleted', async (userId, xpEarned) => {
    try {
      console.log(`[UserStats Listener] Processing screenCompleted for user ${userId}`);
      await userStatsService.handleScreenXPAggregation(userId, xpEarned);

      appEventEmitter.emit('sse_userStatsUpdated', userId, {
        id: `${userId}-${Date.now()}`,
        xpEarned,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error(`[UserStats Listener Error] Failed to aggregate screen XP for user ${userId}:`, error);
    }
  });

  appEventEmitter.on(
    'lessonCompleted',
    async (userId, xpEarned, lessonDifficulty, metrics, isFirstCompletion, wasPerfectCompletion) => {
      try {
        console.log(`[UserStats Listener] Processing lessonCompleted for user ${userId}`);

        await userStatsService.handleLessonCompletionAggregation(
          userId,
          xpEarned,
          lessonDifficulty,
          metrics,
          isFirstCompletion,
          wasPerfectCompletion
        );
      } catch (error) {
        console.error(`[UserStats Listener Error] Failed to aggregate lesson completion for user ${userId}:`, error);
      }
    }
  );
};
