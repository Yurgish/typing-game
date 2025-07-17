import { Prisma } from '@repo/database';

import { IBaseRepository } from '../IBaseRepository';

export type UserStatsPayload = Prisma.UserStatsGetPayload<object>;

export interface IUserStatsRepository extends IBaseRepository<'userStats', UserStatsPayload> {
  findByUserId(userId: string): Promise<UserStatsPayload | null>;
}
