import { Achievement, AchievementConditionData, ACHIEVEMENTS } from '@api/core/lib/contstants';
import { IAchievementRepository } from '@api/repositories/achivement/IAchievementRepository';

export class AchievementService {
  constructor(private achievementsRepository: IAchievementRepository) {}

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

  public getAchievementById(achievementId: string): Achievement | undefined {
    return ACHIEVEMENTS.find((ach) => ach.id === achievementId);
  }
}
