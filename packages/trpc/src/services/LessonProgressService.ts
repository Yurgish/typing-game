import { prisma } from "@repo/database/prisma";

import { LearningMode, LessonDifficulty } from "../types"; // Import LearningMode
import { areNewMetricsBetter, MetricData as ComparisonMetricData } from "../utils/metricsComparator"; // Import MetricData for comparison
import {
  BASE_XP_ON_REATTEMPT,
  calculateXpDifference,
  calculateXpForLessonCompletion,
  calculateXpForScreen,
} from "../utils/xpCalculator"; // xpCalculator expects the full MetricData
import { AchievementService } from "./AchievementService";
import { DailyActivityService } from "./DailyActivityService";
import { UserStatsService } from "./UserStatsService";

type FullMetricData = {
  rawWPM: number;
  adjustedWPM: number;
  accuracy: number;
  backspaces: number;
  errors: number;
  timeTaken: number;
  typedCharacters: number;
  correctCharacters: number;
};

export class UserProgressService {
  private db = prisma;
  private userStatsService = new UserStatsService();
  private achievementService = new AchievementService();
  private dailyActivityService = new DailyActivityService();

  private async getLessonDifficulty(lessonId: string): Promise<LessonDifficulty> {
    const lesson = await this.db.lesson.findUnique({
      where: { id: lessonId },
    });
    if (lesson?.difficulty && Object.values(LessonDifficulty).includes(lesson.difficulty as LessonDifficulty)) {
      return lesson.difficulty as LessonDifficulty;
    }
    return LessonDifficulty.BEGINNER;
  }

  public async saveLessonProgress(
    userId: string,
    lessonId: string,
    currentScreenOrder: number,
    isCompleted: boolean,
    totalRawWPM: number,
    totalAdjustedWPM: number,
    totalAccuracy: number,
    totalBackspaces: number,
    totalErrors: number,
    totalTimeTaken: number,
    totalTypedCharacters: number,
    totalCorrectCharacters: number
  ) {
    const existingProgress = await this.db.userLessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: userId,
          lessonId: lessonId,
        },
      },
      select: {
        id: true,
        currentScreenOrder: true,
        isCompleted: true,
        totalRawWPM: true,
        totalAdjustedWPM: true,
        totalAccuracy: true,
        totalBackspaces: true,
        totalErrors: true,
        totalTimeTaken: true,
        totalTypedCharacters: true,
        totalCorrectCharacters: true,
      },
    });

    let newCurrentScreenOrder = currentScreenOrder;
    if (existingProgress && existingProgress.currentScreenOrder !== null) {
      newCurrentScreenOrder = Math.max(existingProgress.currentScreenOrder, currentScreenOrder);
    }

    let updateLessonMetricsData: {
      totalRawWPM?: number | null;
      totalAdjustedWPM?: number | null;
      totalAccuracy?: number | null;
      totalBackspaces?: number | null;
      totalErrors?: number | null;
      totalTimeTaken?: number | null;
      totalTypedCharacters?: number | null;
      totalCorrectCharacters?: number | null;
    } = {};

    let xpEarned = 0;
    let isFirstCompletion = false;
    const lessonDifficulty = await this.getLessonDifficulty(lessonId);

    const currentLessonMetrics: FullMetricData = {
      rawWPM: totalRawWPM,
      adjustedWPM: totalAdjustedWPM,
      accuracy: totalAccuracy,
      errors: totalErrors,
      backspaces: totalBackspaces,
      timeTaken: totalTimeTaken,
      typedCharacters: totalTypedCharacters,
      correctCharacters: totalCorrectCharacters,
    };

    if (isCompleted) {
      if (!existingProgress?.isCompleted) {
        isFirstCompletion = true;
        updateLessonMetricsData = {
          totalRawWPM: totalRawWPM,
          totalAdjustedWPM: totalAdjustedWPM,
          totalAccuracy: totalAccuracy,
          totalBackspaces: totalBackspaces,
          totalErrors: totalErrors,
          totalTimeTaken: totalTimeTaken,
          totalTypedCharacters: totalTypedCharacters,
          totalCorrectCharacters: totalCorrectCharacters,
        };
        xpEarned = calculateXpForLessonCompletion(currentLessonMetrics, lessonDifficulty);
      } else {
        const newMetricsForComparison: ComparisonMetricData = {
          adjustedWPM: totalAdjustedWPM,
          accuracy: totalAccuracy,
          errors: totalErrors,
          backspaces: totalBackspaces,
          timeTaken: totalTimeTaken,
        };

        const existingLessonMetrics: ComparisonMetricData = {
          adjustedWPM: existingProgress.totalAdjustedWPM ?? 0,
          accuracy: existingProgress.totalAccuracy ?? 0,
          errors: existingProgress.totalErrors ?? 0,
          backspaces: existingProgress.totalBackspaces ?? 0,
          timeTaken: existingProgress.totalTimeTaken ?? 0,
        };

        if (areNewMetricsBetter(newMetricsForComparison, existingLessonMetrics)) {
          updateLessonMetricsData = {
            totalRawWPM: totalRawWPM,
            totalAdjustedWPM: totalAdjustedWPM,
            totalAccuracy: totalAccuracy,
            totalBackspaces: totalBackspaces,
            totalErrors: totalErrors,
            totalTimeTaken: totalTimeTaken,
            totalTypedCharacters: totalTypedCharacters,
            totalCorrectCharacters: totalCorrectCharacters,
          };

          xpEarned = calculateXpDifference(
            newMetricsForComparison,
            existingLessonMetrics,
            lessonDifficulty,
            calculateXpForLessonCompletion
          );
          xpEarned += BASE_XP_ON_REATTEMPT;
        } else {
          xpEarned = BASE_XP_ON_REATTEMPT;
        }
      }
    }

    let updatedProgress;
    if (existingProgress) {
      updatedProgress = await this.db.userLessonProgress.update({
        where: {
          id: existingProgress.id,
        },
        data: {
          currentScreenOrder: newCurrentScreenOrder,
          isCompleted: isCompleted,
          completedAt: isCompleted ? new Date() : undefined,
          ...updateLessonMetricsData,
        },
      });
    } else {
      updatedProgress = await this.db.userLessonProgress.create({
        data: {
          userId: userId,
          lessonId: lessonId,
          currentScreenOrder: currentScreenOrder,
          isCompleted: isCompleted,
          completedAt: isCompleted ? new Date() : undefined,
          ...updateLessonMetricsData,
        },
      });
    }

    const wasPerfectCompletion = currentLessonMetrics.errors === 0 && currentLessonMetrics.backspaces === 0;

    const updatedUserStats = await this.userStatsService.handleLessonCompletionAggregation(
      userId,
      xpEarned,
      lessonDifficulty,
      currentLessonMetrics,
      isFirstCompletion,
      wasPerfectCompletion
    );

    const newAchievements = await this.achievementService.checkAndAwardAchievements(userId, updatedUserStats);

    await this.dailyActivityService.updateDailyActivity(userId, xpEarned, "lesson");

    return {
      updatedProgress,
      newAchievements,
      xpEarned,
    };
  }

  public async saveScreenMetric(
    userId: string,
    lessonId: string,
    screenMetric: {
      order: number;
      type: LearningMode;
      rawWPM: number;
      adjustedWPM: number;
      accuracy: number;
      backspaces: number;
      errors: number;
      timeTaken: number;
      typedCharacters: number;
      correctCharacters: number;
    }
  ) {
    await this.userStatsService.initializeUserStats(userId); //idk like :(

    const progress = await this.db.userLessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {},
      create: {
        userId,
        lessonId,
        currentScreenOrder: screenMetric.order,
        isCompleted: false,
      },
      include: {
        screenMetrics: {
          where: { screenOrder: screenMetric.order },
        },
      },
    });

    const existingScreenMetric = progress.screenMetrics[0];

    let xpEarned = 0;
    const lessonDifficulty = await this.getLessonDifficulty(lessonId);

    const currentScreenMetrics: FullMetricData = {
      adjustedWPM: screenMetric.adjustedWPM,
      accuracy: screenMetric.accuracy,
      errors: screenMetric.errors,
      backspaces: screenMetric.backspaces,
      timeTaken: screenMetric.timeTaken,
      rawWPM: screenMetric.rawWPM,
      typedCharacters: screenMetric.typedCharacters,
      correctCharacters: screenMetric.correctCharacters,
    };

    let updateData = {};
    if (!existingScreenMetric) {
      updateData = {
        rawWPM: screenMetric.rawWPM,
        adjustedWPM: screenMetric.adjustedWPM,
        accuracy: screenMetric.accuracy,
        backspaces: screenMetric.backspaces,
        errors: screenMetric.errors,
        timeTaken: screenMetric.timeTaken,
        typedCharacters: screenMetric.typedCharacters,
        correctCharacters: screenMetric.correctCharacters,
      };
      xpEarned = calculateXpForScreen(currentScreenMetrics, lessonDifficulty);
    } else {
      const newScreenMetricsForComparison: ComparisonMetricData = {
        adjustedWPM: screenMetric.adjustedWPM,
        accuracy: screenMetric.accuracy,
        errors: screenMetric.errors,
        backspaces: screenMetric.backspaces,
        timeTaken: screenMetric.timeTaken,
      };
      const existingMetricsForComparison: ComparisonMetricData = {
        adjustedWPM: existingScreenMetric.adjustedWPM ?? 0,
        accuracy: existingScreenMetric.accuracy ?? 0,
        errors: existingScreenMetric.errors ?? 0,
        backspaces: existingScreenMetric.backspaces ?? 0,
        timeTaken: existingScreenMetric.timeTaken ?? 0,
      };

      if (areNewMetricsBetter(newScreenMetricsForComparison, existingMetricsForComparison)) {
        updateData = {
          rawWPM: screenMetric.rawWPM,
          adjustedWPM: screenMetric.adjustedWPM,
          accuracy: screenMetric.accuracy,
          backspaces: screenMetric.backspaces,
          errors: screenMetric.errors,
          timeTaken: screenMetric.timeTaken,
          typedCharacters: screenMetric.typedCharacters,
          correctCharacters: screenMetric.correctCharacters,
        };

        xpEarned = calculateXpDifference(
          newScreenMetricsForComparison,
          existingMetricsForComparison,
          lessonDifficulty,
          calculateXpForScreen
        );
        xpEarned += BASE_XP_ON_REATTEMPT;
      } else {
        xpEarned = BASE_XP_ON_REATTEMPT;
      }
    }

    const updatedScreenMetricRecord = await this.db.screenMetrics.upsert({
      where: {
        userLessonProgressId_screenOrder: {
          userLessonProgressId: progress.id,
          screenOrder: screenMetric.order,
        },
      },
      update: updateData,
      create: {
        userLessonProgressId: progress.id,
        screenOrder: screenMetric.order,
        screenType: screenMetric.type,
        rawWPM: screenMetric.rawWPM,
        adjustedWPM: screenMetric.adjustedWPM,
        accuracy: screenMetric.accuracy,
        backspaces: screenMetric.backspaces,
        errors: screenMetric.errors,
        timeTaken: screenMetric.timeTaken,
        typedCharacters: screenMetric.typedCharacters,
        correctCharacters: screenMetric.correctCharacters,
      },
    });

    const newCurrentScreenOrder = Math.max(progress.currentScreenOrder || 0, screenMetric.order);

    await this.db.userLessonProgress.update({
      where: {
        id: progress.id,
      },
      data: {
        currentScreenOrder: newCurrentScreenOrder,
      },
    });

    await this.userStatsService.handleScreenXPAggregation(userId, xpEarned);

    await this.dailyActivityService.updateDailyActivity(userId, xpEarned, "screen");

    return { updatedScreenMetricRecord, xpEarned };
  }
}
