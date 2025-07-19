import appEventEmitter from '@api/core/events/appEventEmmiter';
import { ILessonRepository } from '@api/repositories/lesson/ILessonRepository';
import { IScreenMetricsRepository } from '@api/repositories/screenMetric/IScreenMetricsRepository';
import { IUserLessonProgressRepository } from '@api/repositories/userLessonProgress/IUserLessonProgressRepository';
import { IUserStatsRepository } from '@api/repositories/userStats/IUserStatsRepository';
import { FullMetricData, LearningMode } from '@api/types';
import { determineXpAndMetricsUpdate } from '@api/utils/xpCalculator';
import { LessonDifficulty } from '@repo/database';

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
  constructor(
    private lessonRepository: ILessonRepository,
    private userLessonProgressRepository: IUserLessonProgressRepository,
    private screenMetricsRepository: IScreenMetricsRepository,
    private userStatsRepository: IUserStatsRepository
  ) {}

  private async getLessonDifficulty(lessonId: string): Promise<LessonDifficulty> {
    const difficulty = await this.lessonRepository.getLessonDifficulty(lessonId);
    return difficulty;
  }

  public async saveLessonProgress(userId: string, input: SaveLessonProgressInput) {
    const { lessonId, currentScreenOrder, isCompleted, metrics: currentLessonMetrics } = input;

    const existingProgress = await this.userLessonProgressRepository.findByUserAndLesson(userId, lessonId);

    let newCurrentScreenOrder = currentScreenOrder;
    if (existingProgress && existingProgress.currentScreenOrder !== null) {
      newCurrentScreenOrder = Math.max(existingProgress.currentScreenOrder, currentScreenOrder);
    }

    let xpEarned = 0;
    let updateLessonMetricsData: Partial<FullMetricData> = {};
    let isFirstCompletion = false;
    const lessonDifficulty = await this.getLessonDifficulty(lessonId);

    // this shit idk what to do with this, ill be hones with u, future me ;)
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

    const updatedProgress = await this.userLessonProgressRepository.upsertLessonProgress(userId, lessonId, {
      currentScreenOrder: newCurrentScreenOrder,
      isCompleted,
      completedAt: isCompleted ? new Date() : undefined,
      ...updateLessonMetricsData
    });

    const wasPerfectCompletion = currentLessonMetrics.errors === 0 && currentLessonMetrics.backspaces === 0;

    appEventEmitter.emit(
      'lessonCompleted',
      userId,
      xpEarned,
      lessonDifficulty,
      currentLessonMetrics,
      isFirstCompletion,
      wasPerfectCompletion,
      'lesson'
    );

    // const updatedUserStats = await this.userStatsService.handleLessonCompletionAggregation(
    //   userId,
    //   xpEarned,
    //   lessonDifficulty,
    //   currentLessonMetrics,
    //   isFirstCompletion,
    //   wasPerfectCompletion
    // );

    // const newAchievements = await this.achievementService.checkAndAwardAchievements(userId, updatedUserStats);

    // await this.dailyActivityService.updateDailyActivity(userId, xpEarned, 'lesson');

    return {
      updatedProgress,
      xpEarned
    };
  }

  public async saveScreenMetric(userId: string, input: SaveScreenMetricInput) {
    const { lessonId, screenMetric } = input;

    await this.userStatsRepository.initializeUserStats(userId);

    const progress = await this.userLessonProgressRepository.getOrCreateProgressWithScreenMetric(
      userId,
      lessonId,
      screenMetric.order
    );

    const existingScreenMetric = progress.screenMetrics[0];

    const currentScreenMetrics: FullMetricData = screenMetric.metrics;

    let xpEarned = 0;
    const lessonDifficulty = await this.getLessonDifficulty(lessonId);

    //remake this later into xp service
    const { xpEarned: calculatedXp, metricsToUpdate } = determineXpAndMetricsUpdate(
      currentScreenMetrics,
      existingScreenMetric || null,
      lessonDifficulty,
      'screen'
    );
    xpEarned = calculatedXp;

    const updatedScreenMetricRecord = await this.screenMetricsRepository.upsertScreenMetric(
      progress.id,
      screenMetric.order,
      screenMetric.type,
      currentScreenMetrics,
      metricsToUpdate
    );

    const newCurrentScreenOrder = Math.max(progress.currentScreenOrder || 0, screenMetric.order);

    await this.userLessonProgressRepository.update({
      where: {
        id: progress.id
      },
      data: {
        currentScreenOrder: newCurrentScreenOrder
      }
    });

    appEventEmitter.emit('screenCompleted', userId, xpEarned, 'screen');

    // await this.userStatsService.handleScreenXPAggregation(userId, xpEarned);

    // await this.dailyActivityService.updateDailyActivity(userId, xpEarned, 'screen');`

    return { updatedScreenMetricRecord, xpEarned };
  }
}
