import { Prisma } from '@repo/database';

import { IBaseRepository } from '../IBaseRepository';

export type AchievementPayload = Prisma.UserAchievementGetPayload<object>;

export interface IAchievementRepository extends IBaseRepository<'userAchievement'> {
  findAllUserAchievements(userId: string): Promise<AchievementPayload[]>;
  createUserAchievement(userId: string, achievementId: string, unlockedAt: Date): Promise<AchievementPayload>;
}
