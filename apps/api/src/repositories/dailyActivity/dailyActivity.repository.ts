import { Prisma, PrismaClient } from '@repo/database';

import { BaseRepository } from '../BaseRepository';
import { DailyActivityPayload, IDailyActivityRepository } from './IDailyActivityRepository';

export class DailyActivityRepository extends BaseRepository<'userDailyActivity'> implements IDailyActivityRepository {
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
  async findActivityByUserIdAndDate(userId: string, date: Date): Promise<DailyActivityPayload | null> {
    return this.findUnique({
      where: {
        userId_date: {
          userId: userId,
          date: date
        }
      }
    });
  }

  async upsertDailyActivity(
    userId: string,
    date: Date,
    xpEarned: number,
    activityType: 'screen' | 'lesson'
  ): Promise<DailyActivityPayload> {
    const updateData: Prisma.UserDailyActivityUpdateInput = { xpEarnedToday: { increment: xpEarned } };
    if (activityType === 'screen') {
      updateData.screensCompleted = { increment: 1 };
    } else {
      updateData.lessonsCompleted = { increment: 1 };
    }

    return this.upsert({
      where: {
        userId_date: {
          userId: userId,
          date: date
        }
      },
      update: updateData,
      create: {
        userId: userId,
        date: date,
        xpEarnedToday: xpEarned,
        screensCompleted: activityType === 'screen' ? 1 : 0,
        lessonsCompleted: activityType === 'lesson' ? 1 : 0
      }
    });
  }
}
