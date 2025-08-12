import { IDailyActivityRepository } from '@api/repositories/dailyActivity/IDailyActivityRepository';
import { IUserStatsRepository } from '@api/repositories/userStats/IUserStatsRepository';
import { UserDailyActivity, UserStats } from '@repo/database';

/**
 * Service for managing user's daily activity and streaks.
 *
 * It handles the creation and updating of daily activity records and the
 * calculation and maintenance of a user's current and longest streaks.
 */
export class DailyActivityService {
  constructor(
    private dailyActivityRepository: IDailyActivityRepository,
    private userStatsRepository: IUserStatsRepository
  ) {}

  /**
   * Normalizes a given date to the start of the day in UTC (midnight).
   *
   * This ensures consistency for date-based lookups and comparisons, especially for daily streaks.
   */
  public normalizeDate(date: Date): Date {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    return d;
  }

  /**
   * Updates a user's daily activity record for the current day.
   *
   * This method performs an upsert operation: it either creates a new record for today
   * or updates an existing one, and then calls `updateStreaks` to recalculate the user's streak.
   * @param userId - The ID of the user.
   * @param xpEarned - The amount of XP to add to the daily activity record.
   * @param activityType - The type of activity completed.
   * @returns - The updated or newly created daily activity record.
   */
  public async updateDailyActivity(
    userId: string,
    xpEarned: number,
    activityType: 'screen' | 'lesson'
  ): Promise<UserDailyActivity> {
    const today = this.normalizeDate(new Date());

    const dailyActivity = await this.dailyActivityRepository.upsertDailyActivity(userId, today, xpEarned, activityType);

    await this.updateStreaks(userId, activityType);

    return dailyActivity;
  }

  /**
   * Updates a user's current and longest activity streaks.
   *
   * The streak logic is as follows:
   * 1. If there's no activity today, the streak is reset to 0.
   * 2. If there's activity today but not yesterday, the streak is set to 1.
   * 3. If there's activity today and yesterday, the streak is incremented, but only if it's the first activity of that type today.
   * 4. The longest streak is updated if the current streak exceeds it.
   * @param userId - The ID of the user.
   * @param activityType - The type of activity just completed.
   * @returns - The updated user stats record containing the new streak values.
   */
  public async updateStreaks(userId: string, activityType: 'screen' | 'lesson'): Promise<UserStats> {
    const userStats = await this.userStatsRepository.findUnique({ where: { userId } });

    if (!userStats) {
      throw new Error(`UserStats not found for user ID: ${userId}. Streaks cannot be updated.`);
    }

    let currentStreak = userStats.currentStreak || 0;
    let longestStreak = userStats.longestStreak || 0;

    const today = this.normalizeDate(new Date());
    const yesterday = new Date(today);
    yesterday.setUTCDate(today.getUTCDate() - 1);

    const todayActivity = await this.dailyActivityRepository.findActivityByUserIdAndDate(userId, today);

    const yesterdayActivity = await this.dailyActivityRepository.findActivityByUserIdAndDate(userId, yesterday);

    const wasActiveToday = todayActivity && (todayActivity.lessonsCompleted > 0 || todayActivity.screensCompleted > 0);
    const wasActiveYesterday =
      yesterdayActivity && (yesterdayActivity.lessonsCompleted > 0 || yesterdayActivity.screensCompleted > 0);

    if (!wasActiveToday) {
      currentStreak = 0;
    } else if (!wasActiveYesterday) {
      currentStreak = 1;
    } else {
      const isFirstActivityOfTypeToday =
        (activityType === 'screen' && todayActivity?.screensCompleted === 1) ||
        (activityType === 'lesson' && todayActivity?.lessonsCompleted === 1);

      if (isFirstActivityOfTypeToday) {
        currentStreak++;
      }
    }

    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }

    const updatedUserStats = await this.userStatsRepository.updateStreaks(userId, currentStreak, longestStreak);
    return updatedUserStats;
  }

  /**
   * Retrieves a user's daily activity records within a specified date range.
   * @param  userId - The ID of the user.
   * @param startDate - The start of the date range (inclusive).
   * @param endDate - The end of the date range (inclusive).
   * @returns - An array of daily activity records.
   */
  public async getDailyActivityForUser(userId: string, startDate: Date, endDate: Date): Promise<UserDailyActivity[]> {
    return this.dailyActivityRepository.findByUserInRange(
      userId,
      this.normalizeDate(startDate),
      this.normalizeDate(endDate)
    );
  }
}
