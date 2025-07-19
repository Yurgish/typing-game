import { FullMetricData, LearningMode } from '@api/types';
import { Prisma } from '@repo/database/generated/client';

import { IBaseRepository } from '../IBaseRepository';

export type ScreenMetricsPayload = Prisma.ScreenMetricsGetPayload<object>;

export interface IScreenMetricsRepository extends IBaseRepository<'screenMetrics'> {
  upsertScreenMetric(
    userLessonProgressId: string,
    screenOrder: number,
    screenType: LearningMode,
    metrics: FullMetricData,
    updateData: Prisma.ScreenMetricsUpdateInput
  ): Promise<ScreenMetricsPayload>;
}
