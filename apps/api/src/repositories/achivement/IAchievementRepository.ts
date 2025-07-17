import { Prisma } from '@repo/database';

import { IBaseRepository } from '../IBaseRepository';

export type AchievementPayload = Prisma.UserAchievementGetPayload<object>;

export interface IAchievementRepository extends IBaseRepository<'userAchievement', AchievementPayload> {
  findAllUserAchievements(userId: string): Promise<AchievementPayload[]>;
}
