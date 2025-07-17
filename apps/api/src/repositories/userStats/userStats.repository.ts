import { PrismaClient } from '@repo/database';

import { BaseRepository } from '../BaseRepository';
import { IUserStatsRepository, UserStatsPayload } from './IUserStatsRepository';

export class UserStatsRepository extends BaseRepository<'userStats', UserStatsPayload> implements IUserStatsRepository {
  constructor(db: PrismaClient) {
    super(db, 'userStats');
  }

  async findByUserId(userId: string) {
    return this.findUnique({ where: { userId } });
  }
}
