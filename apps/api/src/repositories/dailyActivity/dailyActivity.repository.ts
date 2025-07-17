import { PrismaClient } from '@repo/database';

import { BaseRepository } from '../BaseRepository';
import { DailyActivityPayload, IDailyActivityRepository } from './IDailyActivityRepository';

export class DailyActivityRepository
  extends BaseRepository<'userDailyActivity', DailyActivityPayload>
  implements IDailyActivityRepository
{
  constructor(db: PrismaClient) {
    super(db, 'userDailyActivity');
  }

  async findByUserInRange(userId: string, from: Date, to: Date) {
    return this.findMany({
      where: {
        userId,
        date: {
          gte: from,
          lte: to
        }
      },
      orderBy: { date: 'asc' }
    });
  }
}
