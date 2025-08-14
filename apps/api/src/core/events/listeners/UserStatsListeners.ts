import { UserStatsService } from '@api/services/UserStatsService';
import { FullMetricDataWithLearningMode } from '@api/types';
import { LessonDifficulty } from '@repo/database';

import appEventEmitter, { APP_EVENTS } from '../appEventEmmiter';

/**
 * Registers event listeners related to user statistics aggregation and updates.
 *
 * This function attaches listeners to the `appEventEmitter` for the following events:
 * - `'screenCompleted'`: Triggered when a user completes a screen. Aggregates screen stats,
 *   emits XP earned and level-up events if applicable.
 * - `'lessonCompleted'`: Triggered when a user completes a lesson. Aggregates lesson stats,
 *   emits XP earned and level-up events if applicable.
 *
 * @param userStatsService - An instance of `UserStatsService` used to aggregate and update user statistics.
 */
export const registerUserStatsListeners = (userStatsService: UserStatsService) => {
  appEventEmitter.on(
    APP_EVENTS.SCREEN_COMPLETED,
    async (
      userId: string,
      xpEarned: number,
      lessonDifficulty: LessonDifficulty,
      metrics: FullMetricDataWithLearningMode
    ) => {
      try {
        console.log(`[UserStats Listener] Processing screenCompleted for user ${userId}`);
        const result = await userStatsService.handleScreenStatsAggregation(userId, xpEarned, lessonDifficulty, metrics);

        appEventEmitter.emit(APP_EVENTS.SSE_USER_XP_EARNED, userId, {
          id: `${userId}-${Date.now()}-xp`,
          xpEarned,
          updatedAt: new Date().toISOString()
        });

        if (result.newLevel !== undefined && result.oldLevel !== undefined && result.newLevel > result.oldLevel) {
          console.log(`[UserStats Listener] User ${userId} leveled up from ${result.oldLevel} to ${result.newLevel}!`);
          appEventEmitter.emit(APP_EVENTS.SSE_USER_LEVEL_UP, userId, {
            id: `${userId}-${Date.now()}-level`,
            newLevel: result.newLevel,
            updatedAt: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error(`[UserStats Listener Error] Failed to aggregate screen XP for user ${userId}:`, error);
      }
    }
  );

  appEventEmitter.on(
    APP_EVENTS.LESSON_COMPLETED,
    async (userId, xpEarned, _lessonDifficulty, _metrics, isFirstCompletion, wasPerfectCompletion) => {
      try {
        console.log(`[UserStats Listener] Processing lessonCompleted for user ${userId}`);

        const result = await userStatsService.handleLessonStatsAggregation(
          userId,
          xpEarned,
          isFirstCompletion,
          wasPerfectCompletion
        );

        if (xpEarned > 0) {
          appEventEmitter.emit(APP_EVENTS.SSE_USER_XP_EARNED, userId, {
            id: `${userId}-${Date.now()}-xp`,
            xpEarned,
            updatedAt: new Date().toISOString()
          });
        }

        if (result.newLevel !== undefined && result.oldLevel !== undefined && result.newLevel > result.oldLevel) {
          console.log(`[UserStats Listener] User ${userId} leveled up from ${result.oldLevel} to ${result.newLevel}!`);
          appEventEmitter.emit(APP_EVENTS.SSE_USER_LEVEL_UP, userId, {
            id: `${userId}-${Date.now()}-level`,
            newLevel: result.newLevel,
            updatedAt: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error(`[UserStats Listener Error] Failed to aggregate lesson completion for user ${userId}:`, error);
      }
    }
  );
};
