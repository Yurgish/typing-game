import { FullMetricData } from '@api/types';
import { LearningMode, Prisma, PrismaClient } from '@repo/database';

import { BaseRepository } from '../BaseRepository';
import { IScreenMetricsRepository, ScreenMetricsPayload } from './IScreenMetricsRepository';

export class ScreenMetricsRepository extends BaseRepository<'screenMetrics'> implements IScreenMetricsRepository {
  constructor(db: PrismaClient) {
    super(db, 'screenMetrics');
  }

  async upsertScreenMetric(
    userLessonProgressId: string,
    screenOrder: number,
    screenType: LearningMode,
    metrics: FullMetricData,
    updateData: Prisma.ScreenMetricsCreateInput
  ): Promise<ScreenMetricsPayload> {
    return this.upsert({
      where: {
        userLessonProgressId_screenOrder: {
          userLessonProgressId: userLessonProgressId,
          screenOrder: screenOrder
        }
      },
      update: updateData,
      create: {
        userLessonProgressId: userLessonProgressId,
        screenOrder: screenOrder,
        screenType: screenType,
        ...metrics
      }
    });
  }
}
