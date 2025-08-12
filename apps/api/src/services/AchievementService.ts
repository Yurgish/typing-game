import { Achievement, AchievementConditionData, ACHIEVEMENTS } from '@api/core/lib/contstants';
import { IAchievementRepository } from '@api/repositories/achivement/IAchievementRepository';

/**
 * Service for managing user achievements.
 *
 * Handles checking and awarding achievements based on user statistics,
 * retrieving user achievements with their unlock status, and fetching
 * achievement details by ID.
 *
 * @remarks
 * This service depends on an injected `IAchievementRepository` for data access.
 */
export class AchievementService {
  constructor(private achievementsRepository: IAchievementRepository) {}

  /**
   * Checks a user's statistics against all available achievement conditions and awards
   * any achievements that have been newly unlocked.
   *
   * @async
   * @param userId - The ID of the user.
   * @param userStats - The user's current statistics required for condition checks.
   * @returns An array of achievement IDs that were newly unlocked.
   */
  public async checkAndAwardAchievements(userId: string, userStats: AchievementConditionData): Promise<string[]> {
    const unlockedAchievements = await this.achievementsRepository.findAllUserAchievements(userId);

    const unlockedAchievementIds = new Set(unlockedAchievements.map((ua) => ua.achievementId));
    const newlyUnlockedAchievementIds: string[] = [];

    for (const achievement of ACHIEVEMENTS) {
      if (!unlockedAchievementIds.has(achievement.id) && achievement.condition(userStats)) {
        await this.achievementsRepository.createUserAchievement(userId, achievement.id, new Date());
        newlyUnlockedAchievementIds.push(achievement.id);
      }
    }

    return newlyUnlockedAchievementIds;
  }

  /**
   * Retrieves a list of all possible achievements, annotated with the user's unlock status.
   *
   * @async
   * @param userId - The ID of the user.
   * @returns An array of achievement objects, each
   * including a boolean `unlocked` status and an `unlockedAt` date if applicable.
   */
  public async getUserAchievements(
    userId: string
  ): Promise<(Achievement & { unlocked: boolean; unlockedAt: Date | null })[]> {
    const userUnlockedAchievements = await this.achievementsRepository.findAllUserAchievements(userId);
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

  /**
   * Retrieves the details of a single achievement by its ID from the hardcoded list.
   *
   * @param achievementId - The ID of the achievement to find.
   * @returns The achievement object, or `undefined` if not found.
   */
  public getAchievementById(achievementId: string): Achievement | undefined {
    return ACHIEVEMENTS.find((ach) => ach.id === achievementId);
  }
}
