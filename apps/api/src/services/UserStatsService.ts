import { FullMetricData, LessonDifficulty } from '@api/types';
import { calculateLevel } from '@api/utils/xpCalculator';
import { Prisma, PrismaClient, UserStats } from '@repo/database';

export class UserStatsService {
  constructor(private db: PrismaClient) {}

  public async initializeUserStats(userId: string): Promise<UserStats> {
    const userStats = await this.db.userStats.upsert({
      where: {
        userId: userId
      },
      update: {},
      create: {
        userId: userId
      }
    });

    return userStats;
  }

  public async handleLessonCompletionAggregation(
    userId: string,
    xpEarned: number,
    lessonDifficulty: LessonDifficulty,
    currentLessonMetrics: FullMetricData,
    wasFirstCompletion: boolean,
    wasPerfectCompletion: boolean
  ): Promise<UserStats> {
    const currentUserStats = await this.db.userStats.findUnique({ where: { userId: userId } });
    if (!currentUserStats) {
      throw new Error(`UserStats not found for user ID: ${userId}. Please ensure UserStats are initialized.`);
    }

    const updateData: Prisma.UserStatsUpdateInput = {};

    if (wasFirstCompletion) {
      updateData.totalLessonsCompleted = { increment: 1 };

      switch (lessonDifficulty) {
        case LessonDifficulty.BEGINNER:
          updateData.beginnerLessonsCompleted = { increment: 1 };
          break;
        case LessonDifficulty.INTERMEDIATE:
          updateData.mediumLessonsCompleted = { increment: 1 };
          break;
        case LessonDifficulty.ADVANCED:
          updateData.advancedLessonsCompleted = { increment: 1 };
          break;
      }
    }

    if (wasPerfectCompletion) {
      updateData.totalPerfectLessons = { increment: 1 };
      switch (lessonDifficulty) {
        case LessonDifficulty.BEGINNER:
          updateData.beginnerPerfectLessons = { increment: 1 };
          break;
        case LessonDifficulty.INTERMEDIATE:
          updateData.mediumPerfectLessons = { increment: 1 };
          break;
        case LessonDifficulty.ADVANCED:
          updateData.advancedPerfectLessons = { increment: 1 };
          break;
      }
    }

    if (currentLessonMetrics.adjustedWPM > (currentUserStats.highestOverallWPM || 0)) {
      updateData.highestOverallWPM = currentLessonMetrics.adjustedWPM;
    }
    if (currentLessonMetrics.accuracy > (currentUserStats.highestOverallAccuracy || 0)) {
      updateData.highestOverallAccuracy = currentLessonMetrics.accuracy;
    }

    switch (lessonDifficulty) {
      case LessonDifficulty.BEGINNER:
        if (currentLessonMetrics.adjustedWPM > (currentUserStats.highestBeginnerWPM || 0)) {
          updateData.highestBeginnerWPM = currentLessonMetrics.adjustedWPM;
        }
        if (currentLessonMetrics.accuracy > (currentUserStats.highestBeginnerAccuracy || 0)) {
          updateData.highestBeginnerAccuracy = currentLessonMetrics.accuracy;
        }
        break;
      case LessonDifficulty.INTERMEDIATE:
        if (currentLessonMetrics.adjustedWPM > (currentUserStats.highestMediumWPM || 0)) {
          updateData.highestMediumWPM = currentLessonMetrics.adjustedWPM;
        }
        if (currentLessonMetrics.accuracy > (currentUserStats.highestMediumAccuracy || 0)) {
          updateData.highestMediumAccuracy = currentLessonMetrics.accuracy;
        }
        break;
      case LessonDifficulty.ADVANCED:
        if (currentLessonMetrics.adjustedWPM > (currentUserStats.highestAdvancedWPM || 0)) {
          updateData.highestAdvancedWPM = currentLessonMetrics.adjustedWPM;
        }
        if (currentLessonMetrics.accuracy > (currentUserStats.highestAdvancedAccuracy || 0)) {
          updateData.highestAdvancedAccuracy = currentLessonMetrics.accuracy;
        }
        break;
    }

    if (xpEarned > 0) {
      updateData.totalExperience = { increment: xpEarned };
    }

    let updatedStats = await this.db.userStats.update({
      where: { userId: userId },
      data: updateData
    });

    const { currentLevel: newNumericLevel } = calculateLevel(updatedStats.totalExperience);
    if (newNumericLevel !== updatedStats.currentLevel) {
      updatedStats = await this.db.userStats.update({
        where: { userId: userId },
        data: { currentLevel: newNumericLevel }
      });
    }

    return updatedStats;
  }

  public async handleScreenXPAggregation(userId: string, xpEarned: number): Promise<UserStats> {
    if (xpEarned <= 0) {
      return await this.db.userStats.findUniqueOrThrow({ where: { userId: userId } });
    }

    let updatedStats = await this.db.userStats.update({
      where: { userId: userId },
      data: {
        totalExperience: { increment: xpEarned }
      }
    });

    const { currentLevel: newNumericLevel } = calculateLevel(updatedStats.totalExperience);
    if (newNumericLevel !== updatedStats.currentLevel) {
      updatedStats = await this.db.userStats.update({
        where: { userId: userId },
        data: { currentLevel: newNumericLevel }
      });
    }
    return updatedStats;
  }

  public async getUserStats(userId: string): Promise<UserStats> {
    const userStats = await this.db.userStats.findUnique({ where: { userId: userId } });
    if (!userStats) {
      throw new Error(`UserStats not found for user ID: ${userId}`);
    }
    return userStats;
  }
}
