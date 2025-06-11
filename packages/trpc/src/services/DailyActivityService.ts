import { Prisma, UserDailyActivity, UserStats } from "@repo/database";
import { prisma } from "@repo/database/prisma";

export class DailyActivityService {
  private db = prisma;

  /**
   * Приводить дату до початку дня (00:00:00.000).
   * @param date Дата для нормалізації.
   * @returns Нормалізована дата.
   */
  public normalizeDate(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  public async updateDailyActivity(
    userId: string,
    xpEarned: number,
    activityType: "screen" | "lesson"
  ): Promise<UserDailyActivity> {
    const today = this.normalizeDate(new Date());

    const updateData: Prisma.UserDailyActivityUpdateInput = { xpEarnedToday: { increment: xpEarned } };
    if (activityType === "screen") {
      updateData.screensCompleted = { increment: 1 };
    } else {
      updateData.lessonsCompleted = { increment: 1 };
    }

    const dailyActivity = await this.db.userDailyActivity.upsert({
      where: {
        userId_date: {
          userId: userId,
          date: today,
        },
      },
      update: updateData,
      create: {
        userId: userId,
        date: today,
        xpEarnedToday: xpEarned,
        screensCompleted: activityType === "screen" ? 1 : 0,
        lessonsCompleted: activityType === "lesson" ? 1 : 0,
      },
    });

    await this.updateStreaks(userId, activityType);

    return dailyActivity;
  }

  public async updateStreaks(userId: string, activityType: "screen" | "lesson"): Promise<UserStats> {
    const userStats = await this.db.userStats.findUnique({
      where: { userId: userId },
      select: { currentStreak: true, longestStreak: true },
    });

    if (!userStats) {
      throw new Error(`UserStats not found for user ID: ${userId}. Streaks cannot be updated.`);
    }

    let currentStreak = userStats.currentStreak || 0;
    let longestStreak = userStats.longestStreak || 0;

    const today = this.normalizeDate(new Date());
    const yesterday = this.normalizeDate(new Date());
    yesterday.setDate(today.getDate() - 1);

    const todayActivity = await this.db.userDailyActivity.findUnique({
      where: {
        userId_date: {
          userId: userId,
          date: today,
        },
      },
    });

    const yesterdayActivity = await this.db.userDailyActivity.findUnique({
      where: {
        userId_date: {
          userId: userId,
          date: yesterday,
        },
      },
    });

    const wasActiveToday = todayActivity && (todayActivity.lessonsCompleted > 0 || todayActivity.screensCompleted > 0);
    const wasActiveYesterday =
      yesterdayActivity && (yesterdayActivity.lessonsCompleted > 0 || yesterdayActivity.screensCompleted > 0);

    if (wasActiveToday) {
      if (wasActiveYesterday) {
        let isFirstActivityOfTypeToday = false;
        if (activityType === "screen" && todayActivity?.screensCompleted === 1) {
          isFirstActivityOfTypeToday = true;
        } else if (activityType === "lesson" && todayActivity?.lessonsCompleted === 1) {
          isFirstActivityOfTypeToday = true;
        }

        if (isFirstActivityOfTypeToday) {
          currentStreak++;
        }
      } else {
        currentStreak = 1;
      }
    } else {
      currentStreak = 0;
    }

    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }
    const updatedUserStats = await this.db.userStats.update({
      where: { userId: userId },
      data: {
        currentStreak: currentStreak,
        longestStreak: longestStreak,
      },
    });
    return updatedUserStats;
  }

  public async getDailyActivityForUser(userId: string, startDate: Date, endDate: Date): Promise<UserDailyActivity[]> {
    return this.db.userDailyActivity.findMany({
      where: {
        userId: userId,
        date: {
          gte: this.normalizeDate(startDate),
          lte: this.normalizeDate(endDate),
        },
      },
      orderBy: {
        date: "asc",
      },
    });
  }
}
