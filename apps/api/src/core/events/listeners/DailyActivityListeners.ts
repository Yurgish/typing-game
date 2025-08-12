import { DailyActivityService } from '@api/services/DailyActivityService';

import appEventEmitter from '../appEventEmmiter';

/**
 * Registers event listeners for daily activity updates.
 *
 * This function attaches listeners to the `appEventEmitter` for the following events:
 * - `'screenCompleted'`: Triggered when a user completes a screen. The listener updates the user's daily activity.
 * - `'lessonCompleted'`: Triggered when a user completes a lesson. The listener updates the user's daily activity.
 *
 * Both listeners call `dailyActivityService.updateDailyActivity` with the user ID, XP earned, and activity type.
 *
 * @param dailyActivityService - An instance of `DailyActivityService` used to update daily activity records.
 */
export const registerDailyActivityListeners = (dailyActivityService: DailyActivityService) => {
  appEventEmitter.on(
    'screenCompleted',
    async (userId, xpEarned, _lessonDifficulty, _metrics, _isFirstCompletion, _wasPerfectCompletion, activityType) => {
      try {
        console.log(`[DailyActivity Listener] Processing screenCompleted for user ${userId}`);
        await dailyActivityService.updateDailyActivity(userId, xpEarned, activityType);
      } catch (error) {
        console.error(`[DailyActivity Listener Error] Failed to update daily activity for user ${userId}:`, error);
      }
    }
  );

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
