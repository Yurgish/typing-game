import { DailyActivityService } from '@api/services/DailyActivityService';

import appEventEmitter from '../appEventEmmiter';

export const registerDailyActivityListeners = (dailyActivityService: DailyActivityService) => {
  appEventEmitter.on('screenCompleted', async (userId, xpEarned, activityType) => {
    try {
      console.log(`[DailyActivity Listener] Processing screenCompleted for user ${userId}`);
      await dailyActivityService.updateDailyActivity(userId, xpEarned, activityType);
    } catch (error) {
      console.error(`[DailyActivity Listener Error] Failed to update daily activity for user ${userId}:`, error);
    }
  });

  appEventEmitter.on(
    'lessonCompleted',
    async (userId, xpEarned, _lessonDifficulty, _metrics, _isFirstCompletion, _wasPerfectCompletion, activityType) => {
      try {
        console.log(`[DailyActivity Listener] Processing lessonCompleted for user ${userId}`);
        await dailyActivityService.updateDailyActivity(userId, xpEarned, activityType);
      } catch (error) {
        console.error(`[DailyActivity Listener Error] Failed to update daily activity for user ${userId}:`, error);
      }
    }
  );
};
