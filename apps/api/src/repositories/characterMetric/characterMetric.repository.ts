import { PrismaClient } from '@repo/database';

import { BaseRepository } from '../BaseRepository';
import { ICharacterMetricRepository } from './ICharacterMetricRepository';

export class CharacterMetricRepository extends BaseRepository<'characterMetric'> implements ICharacterMetricRepository {
  constructor(db: PrismaClient) {
    super(db, 'characterMetric');
  }

  async findAllByUser(userId: string) {
    return this.findMany({
      where: { userId },
      orderBy: { errorCount: 'desc' }
    });
  }

  async upsertMany(metrics: Array<{ userId: string; character: string; correctCount: number; errorCount: number }>) {
    return this.db.$transaction(
      metrics.map(({ userId, character, correctCount, errorCount }) =>
        this.db.characterMetric.upsert({
          where: { userId_character: { userId, character } },
          update: {
            correctCount: { increment: correctCount },
            errorCount: { increment: errorCount }
          },
          create: {
            userId,
            character,
            correctCount,
            errorCount
          }
        })
      )
    );
  }
}
