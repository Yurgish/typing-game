import appEventEmitter, { APP_EVENTS } from '@api/core/events/appEventEmmiter';
import { ILessonRepository } from '@api/repositories/lesson/ILessonRepository';
import { IScreenMetricsRepository } from '@api/repositories/screenMetric/IScreenMetricsRepository';
import { IUserLessonProgressRepository } from '@api/repositories/userLessonProgress/IUserLessonProgressRepository';
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

/**
 * Service for managing user progress through lessons and screens.
 *
 * It handles saving progress, calculating XP, and emitting events
 * for both individual screen completions and full lesson completions.
 */
export class UserProgressService {
  constructor(
    private lessonRepository: ILessonRepository,
    private userLessonProgressRepository: IUserLessonProgressRepository,
    private screenMetricsRepository: IScreenMetricsRepository
  ) {}

  private async getLessonDifficulty(lessonId: string): Promise<LessonDifficulty> {
    const difficulty = await this.lessonRepository.getLessonDifficulty(lessonId);
    return difficulty;
  }

  /**
   * Saves the user's overall progress for a lesson.
   *
   * This method updates the user's progress record, calculates XP if the lesson
   * is completed for the first time, and emits a `lessonCompleted` event.
   * @async
   * @param userId - The ID of the user.
   * @param input - The lesson progress data to save.
   * @returns The updated progress record and any XP earned.
   */
  public async saveLessonProgress(userId: string, input: SaveLessonProgressInput) {
    const { lessonId, currentScreenOrder, isCompleted, metrics: currentLessonMetrics } = input;

    const existingProgress = await this.userLessonProgressRepository.findByUserAndLesson(userId, lessonId);

    let newCurrentScreenOrder = currentScreenOrder;
    if (existingProgress && existingProgress.currentScreenOrder !== null) {
      newCurrentScreenOrder = Math.max(existingProgress.currentScreenOrder, currentScreenOrder);
    }

    let xpEarnedForLessonCompletion = 0;
    let updateLessonMetricsData: Partial<FullMetricData> = {};
    let isFirstCompletionOfLesson = false;
    const lessonDifficulty = await this.getLessonDifficulty(lessonId);

    if (isCompleted) {
      if (!existingProgress?.isCompleted) {
        isFirstCompletionOfLesson = true;

        const { xpEarned: calculatedXp, metricsToUpdate } = determineXpAndMetricsUpdate(
          currentLessonMetrics,
          null,
          lessonDifficulty,
          'lesson'
        );
        xpEarnedForLessonCompletion = calculatedXp;
        updateLessonMetricsData = metricsToUpdate;
      } else {
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

        const { metricsToUpdate } = determineXpAndMetricsUpdate(
          currentLessonMetrics,
          transformedExistingProgress,
          lessonDifficulty,
          'lesson'
        );
        updateLessonMetricsData = metricsToUpdate;
      }
    }

    const updatedProgress = await this.userLessonProgressRepository.upsertLessonProgress(userId, lessonId, {
      currentScreenOrder: newCurrentScreenOrder,
      isCompleted,
      completedAt: isCompleted ? new Date() : undefined,
      ...updateLessonMetricsData
    });

    appEventEmitter.emit(
      APP_EVENTS.LESSON_COMPLETED,
      userId,
      xpEarnedForLessonCompletion,
      lessonDifficulty,
      currentLessonMetrics,
      isFirstCompletionOfLesson,
      currentLessonMetrics.errors === 0 && currentLessonMetrics.backspaces === 0,
      'lesson'
    );

    return {
      updatedProgress,
      xpEarned: xpEarnedForLessonCompletion
    };
  }

  /**
   * Saves the metrics for a single screen completion.
   *
   * This method fetches or creates the user's lesson progress, calculates XP and metrics
   * based on the screen data, and emits a `screenCompleted` event.
   * @async
   * @param userId - The ID of the user.
   * @param input - The screen metric data to save.
   * @returns - The updated screen metric record and any XP earned.
   */
  public async saveScreenMetric(userId: string, input: SaveScreenMetricInput) {
    const { lessonId, screenMetric } = input;

    const progress = await this.userLessonProgressRepository.getOrCreateProgressWithScreenMetric(
      userId,
      lessonId,
      screenMetric.order
    );

    const existingScreenMetric = progress.screenMetrics[0];

    const currentScreenMetrics: FullMetricData = screenMetric.metrics;

    const lessonDifficulty = await this.getLessonDifficulty(lessonId);

    const { xpEarned: calculatedXp, metricsToUpdate } = determineXpAndMetricsUpdate(
      currentScreenMetrics,
      existingScreenMetric || null,
      lessonDifficulty,
      'screen'
    );

    const currentScreenXpEarned = calculatedXp;

    const updatedScreenMetricRecord = await this.screenMetricsRepository.upsertScreenMetric(
      progress.id,
      screenMetric.order,
      screenMetric.type,
      currentScreenMetrics,
      metricsToUpdate
    );

    const isScreenFirstCompletion = !existingScreenMetric;

    const wasScreenPerfectCompletion = currentScreenMetrics.errors === 0 && currentScreenMetrics.backspaces === 0;

    const newCurrentScreenOrder = Math.max(progress.currentScreenOrder || 0, screenMetric.order);

    await this.userLessonProgressRepository.update({
      where: {
        id: progress.id
      },
      data: {
        currentScreenOrder: newCurrentScreenOrder
      }
    });

    appEventEmitter.emit(
      APP_EVENTS.SCREEN_COMPLETED,
      userId,
      currentScreenXpEarned,
      lessonDifficulty,
      { ...currentScreenMetrics, learningMode: screenMetric.type },
      isScreenFirstCompletion,
      wasScreenPerfectCompletion,
      'screen'
    );

    return { updatedScreenMetricRecord, xpEarned: currentScreenXpEarned };
  }
}
