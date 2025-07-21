import { UserStatsService } from '@api/services/UserStatsService';
import { FullMetricDataWithLearningMode } from '@api/types';
import { LessonDifficulty } from '@repo/database';

import appEventEmitter from '../appEventEmmiter';

export const registerUserStatsListeners = (userStatsService: UserStatsService) => {
  appEventEmitter.on(
    'screenCompleted',
    async (
      userId: string,
      xpEarned: number,
      lessonDifficulty: LessonDifficulty,
      metrics: FullMetricDataWithLearningMode
    ) => {
      try {
        console.log(`[UserStats Listener] Processing screenCompleted for user ${userId}`);
        await userStatsService.handleScreenStatsAggregation(userId, xpEarned, lessonDifficulty, metrics);

        appEventEmitter.emit('sse_userStatsUpdated', userId, {
          id: `${userId}-${Date.now()}`,
          xpEarned,
          updatedAt: new Date().toISOString()
        });
      } catch (error) {
        console.error(`[UserStats Listener Error] Failed to aggregate screen XP for user ${userId}:`, error);
      }
    }
  );

  appEventEmitter.on(
    'lessonCompleted',
    async (userId, xpEarned, _lessonDifficulty, _metrics, isFirstCompletion, wasPerfectCompletion) => {
      try {
        console.log(`[UserStats Listener] Processing lessonCompleted for user ${userId}`);

        await userStatsService.handleLessonStatsAggregation(userId, xpEarned, isFirstCompletion, wasPerfectCompletion);
      } catch (error) {
        console.error(`[UserStats Listener Error] Failed to aggregate lesson completion for user ${userId}:`, error);
      }
    }
  );
};
