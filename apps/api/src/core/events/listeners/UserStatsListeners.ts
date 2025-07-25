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
        const result = await userStatsService.handleScreenStatsAggregation(userId, xpEarned, lessonDifficulty, metrics);

        appEventEmitter.emit('sse_userXpEarned', userId, {
          id: `${userId}-${Date.now()}-xp`,
          xpEarned,
          updatedAt: new Date().toISOString()
        });

        if (result.newLevel !== undefined && result.oldLevel !== undefined && result.newLevel > result.oldLevel) {
          console.log(`[UserStats Listener] User ${userId} leveled up from ${result.oldLevel} to ${result.newLevel}!`);
          appEventEmitter.emit('sse_userLevelUp', userId, {
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
    'lessonCompleted',
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
          appEventEmitter.emit('sse_userXpEarned', userId, {
            id: `${userId}-${Date.now()}-xp`,
            xpEarned,
            updatedAt: new Date().toISOString()
          });
        }

        if (result.newLevel !== undefined && result.oldLevel !== undefined && result.newLevel > result.oldLevel) {
          console.log(`[UserStats Listener] User ${userId} leveled up from ${result.oldLevel} to ${result.newLevel}!`);
          appEventEmitter.emit('sse_userLevelUp', userId, {
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
