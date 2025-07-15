import { FullMetricData, LearningMode, LessonDifficulty } from '@api/types';
import { determineXpAndMetricsUpdate } from '@api/utils/xpCalculator';
import { PrismaClient } from '@repo/database';

import { AchievementService } from './AchievementService';
import { DailyActivityService } from './DailyActivityService';
import { UserStatsService } from './UserStatsService';

type SaveLessonProgressInput = {
  lessonId: string;
  currentScreenOrder: number;
  isCompleted: boolean;
  metrics: FullMetricData;
};

type SaveScreenMetricInput = {
  lessonId: string;
  screenMetric: {
    order: number;
    type: LearningMode;
    metrics: FullMetricData;
  };
};

export class UserProgressService {
  private userStatsService: UserStatsService;
  private achievementService: AchievementService;
  private dailyActivityService: DailyActivityService;

  constructor(private db: PrismaClient) {
    this.userStatsService = new UserStatsService(db);
    this.achievementService = new AchievementService(db);
    this.dailyActivityService = new DailyActivityService(db);
  }

  private async getLessonDifficulty(lessonId: string): Promise<LessonDifficulty> {
    const lesson = await this.db.lesson.findUnique({
      where: { id: lessonId }
    });
    if (lesson?.difficulty && Object.values(LessonDifficulty).includes(lesson.difficulty as LessonDifficulty)) {
      return lesson.difficulty as LessonDifficulty;
    }
    return LessonDifficulty.BEGINNER;
  }

  public async saveLessonProgress(userId: string, input: SaveLessonProgressInput) {
    const { lessonId, currentScreenOrder, isCompleted, metrics: currentLessonMetrics } = input;

    const existingProgress = await this.db.userLessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: userId,
          lessonId: lessonId
        }
      },
      select: {
        id: true,
        currentScreenOrder: true,
        isCompleted: true,
        rawWPM: true,
        adjustedWPM: true,
        accuracy: true,
        backspaces: true,
        errors: true,
        timeTaken: true,
        typedCharacters: true,
        correctCharacters: true
      }
    });

    let newCurrentScreenOrder = currentScreenOrder;
    if (existingProgress && existingProgress.currentScreenOrder !== null) {
      newCurrentScreenOrder = Math.max(existingProgress.currentScreenOrder, currentScreenOrder);
    }

    let xpEarned = 0;
    let updateLessonMetricsData: Partial<FullMetricData> = {};
    let isFirstCompletion = false;
    const lessonDifficulty = await this.getLessonDifficulty(lessonId);

    const transformedExistingProgress: FullMetricData | null = existingProgress
      ? {
          rawWPM: existingProgress.rawWPM ?? 0,
          adjustedWPM: existingProgress.adjustedWPM ?? 0,
          accuracy: existingProgress.accuracy ?? 0,
          backspaces: existingProgress.backspaces ?? 0,
          errors: existingProgress.errors ?? 0,
          timeTaken: existingProgress.timeTaken ?? 0,
          typedCharacters: existingProgress.typedCharacters ?? 0,
          correctCharacters: existingProgress.correctCharacters ?? 0
        }
      : null;

    if (isCompleted) {
      const { xpEarned: calculatedXp, metricsToUpdate } = determineXpAndMetricsUpdate(
        currentLessonMetrics,
        transformedExistingProgress,
        lessonDifficulty,
        'lesson'
      );
      xpEarned = calculatedXp;
      updateLessonMetricsData = metricsToUpdate;
      isFirstCompletion = !existingProgress?.isCompleted;
    }

    let updatedProgress;
    if (existingProgress) {
      updatedProgress = await this.db.userLessonProgress.update({
        where: {
          id: existingProgress.id
        },
        data: {
          currentScreenOrder: newCurrentScreenOrder,
          isCompleted: isCompleted,
          completedAt: isCompleted ? new Date() : undefined,
          ...updateLessonMetricsData
        }
      });
    } else {
      updatedProgress = await this.db.userLessonProgress.create({
        data: {
          userId: userId,
          lessonId: lessonId,
          currentScreenOrder: currentScreenOrder,
          isCompleted: isCompleted,
          completedAt: isCompleted ? new Date() : undefined,
          ...updateLessonMetricsData
        }
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

    await this.dailyActivityService.updateDailyActivity(userId, xpEarned, 'lesson');

    return {
      updatedProgress,
      newAchievements,
      xpEarned
    };
  }

  public async saveScreenMetric(userId: string, input: SaveScreenMetricInput) {
    const { lessonId, screenMetric } = input;

    await this.userStatsService.initializeUserStats(userId); // Ensure user stats are initialized (remake later if needed)

    const progress = await this.db.userLessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId
        }
      },
      update: {},
      create: {
        userId,
        lessonId,
        currentScreenOrder: screenMetric.order,
        isCompleted: false
      },
      include: {
        screenMetrics: {
          where: { screenOrder: screenMetric.order }
        }
      }
    });

    const existingScreenMetric = progress.screenMetrics[0];

    const currentScreenMetrics: FullMetricData = screenMetric.metrics;

    let xpEarned = 0;
    let updateData: Partial<FullMetricData> = {};
    const lessonDifficulty = await this.getLessonDifficulty(lessonId);

    const { xpEarned: calculatedXp, metricsToUpdate } = determineXpAndMetricsUpdate(
      currentScreenMetrics,
      existingScreenMetric || null,
      lessonDifficulty,
      'screen'
    );
    xpEarned = calculatedXp;
    updateData = metricsToUpdate;

    const updatedScreenMetricRecord = await this.db.screenMetrics.upsert({
      where: {
        userLessonProgressId_screenOrder: {
          userLessonProgressId: progress.id,
          screenOrder: screenMetric.order
        }
      },
      update: updateData,
      create: {
        userLessonProgressId: progress.id,
        screenOrder: screenMetric.order,
        screenType: screenMetric.type,
        ...currentScreenMetrics
      }
    });

    const newCurrentScreenOrder = Math.max(progress.currentScreenOrder || 0, screenMetric.order);

    await this.db.userLessonProgress.update({
      where: {
        id: progress.id
      },
      data: {
        currentScreenOrder: newCurrentScreenOrder
      }
    });

    await this.userStatsService.handleScreenXPAggregation(userId, xpEarned);

    await this.dailyActivityService.updateDailyActivity(userId, xpEarned, 'screen');

    return { updatedScreenMetricRecord, xpEarned };
  }
}
