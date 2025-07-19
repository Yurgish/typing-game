import { Prisma } from '@repo/database';

import { IBaseRepository } from '../IBaseRepository';

export type UserStatsPayload = Prisma.UserStatsGetPayload<object>;

export interface IUserStatsRepository extends IBaseRepository<'userStats'> {
  findByUserId(userId: string): Promise<UserStatsPayload | null>;
  updateStreaks(userId: string, currentStreak: number, longestStreak: number): Promise<UserStatsPayload>;
  updateAllData(userId: string, data: Prisma.UserStatsUpdateInput): Promise<UserStatsPayload>;
  updateLevel(userId: string, newLevel: number): Promise<UserStatsPayload>;
  initializeUserStats(userId: string): Promise<UserStatsPayload>;
}
