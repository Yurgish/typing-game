import { IDailyActivityRepository } from '@api/repositories/dailyActivity/IDailyActivityRepository';
import { IUserStatsRepository } from '@api/repositories/userStats/IUserStatsRepository';
import { Prisma, UserDailyActivity, UserStats } from '@repo/database';

export class DailyActivityService {
  constructor(
    private dailyActivityRepository: IDailyActivityRepository,
    private userStatsRepository: IUserStatsRepository
  ) {}

  public normalizeDate(date: Date): Date {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    return d;
  }

  public async updateDailyActivity(
    userId: string,
    xpEarned: number,
    activityType: 'screen' | 'lesson'
  ): Promise<UserDailyActivity> {
    const today = this.normalizeDate(new Date());

    const updateData: Prisma.UserDailyActivityUpdateInput = { xpEarnedToday: { increment: xpEarned } };
    if (activityType === 'screen') {
      updateData.screensCompleted = { increment: 1 };
    } else {
      updateData.lessonsCompleted = { increment: 1 };
    }

    const dailyActivity = await this.dailyActivityRepository.upsertDailyActivity(userId, today, xpEarned, activityType);

    await this.updateStreaks(userId, activityType);

    return dailyActivity;
  }

  public async updateStreaks(userId: string, activityType: 'screen' | 'lesson'): Promise<UserStats> {
    const userStats = await this.userStatsRepository.findUnique({ where: { userId } });

    if (!userStats) {
      throw new Error(`UserStats not found for user ID: ${userId}. Streaks cannot be updated.`);
    }

    let currentStreak = userStats.currentStreak || 0;
    let longestStreak = userStats.longestStreak || 0;

    const today = this.normalizeDate(new Date());
    const yesterday = this.normalizeDate(new Date());
    yesterday.setDate(today.getDate() - 1);

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

  public async getDailyActivityForUser(userId: string, startDate: Date, endDate: Date): Promise<UserDailyActivity[]> {
    return this.dailyActivityRepository.findByUserInRange(
      userId,
      this.normalizeDate(startDate),
      this.normalizeDate(endDate)
    );
  }
}
