import { IUserStatsRepository, UserStatsPayload } from '@api/repositories/userStats/IUserStatsRepository';
import { FullMetricDataWithLearningMode } from '@api/types';
import { calculateLevel } from '@api/utils/xpCalculator';
import { LearningMode, LessonDifficulty, Prisma } from '@repo/database';

/**
 * Service for managing a user's overall statistics and progress.
 *
 * It handles the aggregation of statistics from individual screens and lessons,
 * updates overall records like highest WPM and accuracy, and calculates level
 * progression based on earned experience points.
 */
export class UserStatsService {
  constructor(private userStatsRepository: IUserStatsRepository) {}

  /**
   * Handles the aggregation of a user's stats after completing a single screen.
   *
   * This method updates a user's total experience, highest WPM and accuracy (both overall and
   * for the specific lesson difficulty), and checks if the user has leveled up.
   * @async
   * @param userId - The ID of the user.
   * @param xpEarned - XP earned from this screen completion.
   * @param lessonDifficulty - The difficulty of the lesson.
   * @param currentScreenMetrics - The metrics from the completed screen.
   * @returns - The updated user stats, including the new and old level if a level-up occurred.
   */
  public async handleScreenStatsAggregation(
    userId: string,
    xpEarned: number,
    lessonDifficulty: LessonDifficulty,
    currentScreenMetrics: FullMetricDataWithLearningMode
  ): Promise<UserStatsPayload & { newLevel?: number; oldLevel?: number }> {
    const currentUserStats = await this.userStatsRepository.initializeUserStats(userId);
    const oldLevel = currentUserStats.currentLevel;

    const userStatsUpdateData: Prisma.UserStatsUpdateInput = {};
    const difficultyStatsUpdateData: Prisma.LessonDifficultyStatsUpdateInput = {};

    if (currentScreenMetrics.learningMode !== LearningMode.KEY_INTRODUCTION) {
      if (currentScreenMetrics.adjustedWPM > (currentUserStats.highestOverallWPM || 0)) {
        userStatsUpdateData.highestOverallWPM = currentScreenMetrics.adjustedWPM;
      }
      if (currentScreenMetrics.accuracy > (currentUserStats.highestOverallAccuracy || 0)) {
        userStatsUpdateData.highestOverallAccuracy = currentScreenMetrics.accuracy;
      }
    }

    if (xpEarned > 0) {
      userStatsUpdateData.totalExperience = { increment: xpEarned };
    }

    if (currentScreenMetrics.learningMode !== LearningMode.KEY_INTRODUCTION) {
      if (
        currentScreenMetrics.adjustedWPM >
        (currentUserStats.difficultyStats.find((s) => s.difficulty === lessonDifficulty)?.highestWPM || 0)
      ) {
        difficultyStatsUpdateData.highestWPM = currentScreenMetrics.adjustedWPM;
      }
      if (
        currentScreenMetrics.accuracy >
        (currentUserStats.difficultyStats.find((s) => s.difficulty === lessonDifficulty)?.highestAccuracy || 0)
      ) {
        difficultyStatsUpdateData.highestAccuracy = currentScreenMetrics.accuracy;
      }
    }

    let updatedStats: UserStatsPayload;
    if (Object.keys(userStatsUpdateData).length > 0) {
      updatedStats = await this.userStatsRepository.update({
        where: { userId: userId },
        data: userStatsUpdateData,
        include: { difficultyStats: true }
      });
    } else {
      updatedStats = currentUserStats;
    }

    if (Object.keys(difficultyStatsUpdateData).length > 0) {
      await this.userStatsRepository.upsertLessonDifficultyStats(userId, lessonDifficulty, difficultyStatsUpdateData);
    }

    updatedStats = (await this.userStatsRepository.findByUserId(userId)) as UserStatsPayload;

    const { currentLevel: newNumericLevel } = calculateLevel(updatedStats.totalExperience);
    if (newNumericLevel !== updatedStats.currentLevel) {
      updatedStats = await this.userStatsRepository.updateLevel(userId, newNumericLevel);
      return { ...updatedStats, newLevel: newNumericLevel, oldLevel: oldLevel };
    }

    return { ...updatedStats, oldLevel: oldLevel };
  }

  /**
   * Handles the aggregation of a user's stats after completing an entire lesson.
   *
   * This method updates the user's total lessons completed, perfect lessons,
   * and total experience, and checks for a level-up.
   * @async
   * @param userId - The ID of the user.
   * @param xpEarned - Total XP earned from the lesson.
   * @param isFirstCompletion - True if this is the first time the user completed this lesson.
   * @param wasPerfectCompletion - True if the lesson was completed without any errors or backspaces.
   * @returns - The updated user stats, including the new and old level if a level-up occurred.
   */
  public async handleLessonStatsAggregation(
    userId: string,
    xpEarned: number,
    isFirstCompletion: boolean,
    wasPerfectCompletion: boolean
  ): Promise<UserStatsPayload & { newLevel?: number; oldLevel?: number }> {
    const currentUserStats = await this.userStatsRepository.initializeUserStats(userId);
    const oldLevel = currentUserStats.currentLevel;

    if (xpEarned <= 0 && !isFirstCompletion && !wasPerfectCompletion) {
      return await this.userStatsRepository.findUniqueOrThrow({
        where: { userId: userId },
        include: { difficultyStats: true }
      });
    }

    await this.userStatsRepository.initializeUserStats(userId);

    const userStatsUpdateData: Prisma.UserStatsUpdateInput = {};

    if (xpEarned > 0) {
      userStatsUpdateData.totalExperience = { increment: xpEarned };
    }

    if (isFirstCompletion) {
      userStatsUpdateData.totalLessonsCompleted = { increment: 1 };
    }
    if (wasPerfectCompletion) {
      userStatsUpdateData.totalPerfectLessons = { increment: 1 };
    }

    let updatedStats = await this.userStatsRepository.update({
      where: { userId: userId },
      data: userStatsUpdateData,
      include: { difficultyStats: true }
    });

    const { currentLevel: newNumericLevel } = calculateLevel(updatedStats.totalExperience);
    if (newNumericLevel !== updatedStats.currentLevel) {
      updatedStats = await this.userStatsRepository.updateLevel(userId, newNumericLevel);
      return { ...updatedStats, newLevel: newNumericLevel, oldLevel: oldLevel };
    }
    return { ...updatedStats, oldLevel: oldLevel };
  }

  /**
   * Retrieves a user's statistics. If the user has no existing stats, a new record is initialized.
   * @async
   * @param userId - The ID of the user.
   * @returns - The user's statistics record.
   */
  public async getUserStats(userId: string): Promise<UserStatsPayload> {
    let userStats = await this.userStatsRepository.findByUserId(userId);
    if (!userStats) {
      userStats = await this.userStatsRepository.initializeUserStats(userId);
    }
    return userStats;
  }
}
