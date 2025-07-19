import { Prisma } from '@repo/database';

import { IBaseRepository } from '../IBaseRepository';

export type CharacterMetricPayload = Prisma.CharacterMetricGetPayload<object>;

export interface ICharacterMetricRepository extends IBaseRepository<'characterMetric'> {
  findAllByUser(userId: string): Promise<CharacterMetricPayload[]>;
  upsertMany(
    metrics: Array<{ userId: string; character: string; correctCount: number; errorCount: number }>
  ): Promise<CharacterMetricPayload[]>;
}
