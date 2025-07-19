import { Prisma } from '@repo/database';

import { IBaseRepository } from '../IBaseRepository';

export type DailyActivityPayload = Prisma.UserDailyActivityGetPayload<object>;

export interface IDailyActivityRepository extends IBaseRepository<'userDailyActivity'> {
  findByUserInRange(userId: string, from: Date, to: Date): Promise<DailyActivityPayload[]>;
  findActivityByUserIdAndDate(userId: string, date: Date): Promise<DailyActivityPayload | null>;
  upsertDailyActivity(
    userId: string,
    date: Date,
    xpEarned: number,
    activityType: 'screen' | 'lesson'
  ): Promise<DailyActivityPayload>;
}
