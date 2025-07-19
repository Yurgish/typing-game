import { Prisma, PrismaClient } from '@repo/database';

import { BaseRepository } from '../BaseRepository';
import { IUserStatsRepository, UserStatsPayload } from './IUserStatsRepository';

export class UserStatsRepository extends BaseRepository<'userStats'> implements IUserStatsRepository {
  constructor(db: PrismaClient) {
    super(db, 'userStats');
  }

  async findByUserId(userId: string) {
    return this.findUnique({ where: { userId } });
  }

  async updateStreaks(userId: string, currentStreak: number, longestStreak: number): Promise<UserStatsPayload> {
    return this.update({
      where: { userId },
      data: {
        currentStreak,
        longestStreak
      }
    });
  }

  async initializeUserStats(userId: string): Promise<UserStatsPayload> {
    return this.upsert({
      where: { userId },
      update: {},
      create: { userId }
    });
  }

  async updateAllData(userId: string, data: Prisma.UserStatsUpdateInput): Promise<UserStatsPayload> {
    return this.update({
      where: { userId },
      data
    });
  }

  async updateLevel(userId: string, newLevel: number): Promise<UserStatsPayload> {
    return this.update({
      where: { userId },
      data: { currentLevel: newLevel }
    });
  }
}
