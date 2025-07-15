import { Achievement, AchievementConditionData, ACHIEVEMENTS } from '@api/lib/contstants';
import { PrismaClient } from '@repo/database';

/**
 * Service for managing user achievements.
 *
 * Provides methods to check and award achievements based on user statistics,
 * as well as to fetch all achievements for a user with their unlock status.
 *
 * @remarks
 * - Uses Prisma ORM for database interactions.
 * - Assumes the existence of an `ACHIEVEMENTS` constant containing all possible achievements,
 *   each with an `id`, `name`, and a `condition` function.
 * - Should be called after user statistics are updated to ensure achievements are awarded promptly.
 *
 * @example
 * ```typescript
 * const service = new AchievementService();
 * const newAchievements = await service.checkAndAwardAchievements(userId, userStats);
 * const allAchievements = await service.getUserAchievements(userId);
 * ```
 */
export class AchievementService {
  constructor(private db: PrismaClient) {}

  /**
   * Checks if a user has unlocked any new achievements and awards them.
   * This method should be called after a user's UserStats have been updated.
   * @param userId The ID of the user.
   * @param userStats The current UserStats object for the user.
   * @returns An array of names of newly unlocked achievements.
   */
  public async checkAndAwardAchievements(userId: string, userStats: AchievementConditionData): Promise<string[]> {
    const unlockedAchievements = await this.db.userAchievement.findMany({
      where: { userId: userId },
      select: { achievementId: true }
    });

    const unlockedAchievementIds = new Set(unlockedAchievements.map((ua) => ua.achievementId));
    const newlyUnlockedAchievementNames: string[] = [];

    for (const achievement of ACHIEVEMENTS) {
      if (!unlockedAchievementIds.has(achievement.id) && achievement.condition(userStats)) {
        await this.db.userAchievement.create({
          data: {
            userId: userId,
            achievementId: achievement.id,
            unlockedAt: new Date()
          }
        });
        newlyUnlockedAchievementNames.push(achievement.name);
        unlockedAchievementIds.add(achievement.id);
      }
    }

    return newlyUnlockedAchievementNames;
  }

  /**
   * Fetches all achievements for a user, indicating which ones are unlocked.
   * @param userId The ID of the user.
   * @returns An array of Achievement objects with an `unlocked` status and `unlockedAt` date.
   */
  public async getUserAchievements(
    userId: string
  ): Promise<(Achievement & { unlocked: boolean; unlockedAt: Date | null })[]> {
    const userUnlockedAchievements = await this.db.userAchievement.findMany({
      where: { userId: userId }
    });

    const unlockedAchievementMap = new Map<string, Date>();
    userUnlockedAchievements.forEach((ua) => unlockedAchievementMap.set(ua.achievementId, ua.unlockedAt));

    const achievementsWithStatus = ACHIEVEMENTS.map((ach) => {
      const unlockedAt = unlockedAchievementMap.get(ach.id);
      return {
        ...ach,
        unlocked: !!unlockedAt,
        unlockedAt: unlockedAt || null
      };
    });

    return achievementsWithStatus;
  }
}
