import { PrismaClient } from '@repo/database';

import { BaseRepository } from '../BaseRepository';
import { AchievementPayload, IAchievementRepository } from './IAchievementRepository';

export class AchievementRepository
  extends BaseRepository<'userAchievement', AchievementPayload>
  implements IAchievementRepository
{
  constructor(db: PrismaClient) {
    super(db, 'userAchievement');
  }

  async findAllUserAchievements(userId: string): Promise<AchievementPayload[]> {
    return this.db.userAchievement.findMany({
      where: { userId }
    });
  }
}
