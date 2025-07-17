import { Prisma } from '@repo/database';

import { IBaseRepository } from '../IBaseRepository';

export type DailyActivityPayload = Prisma.UserDailyActivityGetPayload<object>;

export interface IDailyActivityRepository extends IBaseRepository<'userDailyActivity', DailyActivityPayload> {
  findByUserInRange(userId: string, from: Date, to: Date): Promise<DailyActivityPayload[]>;
}
