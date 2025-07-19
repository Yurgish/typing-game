import { Prisma } from '@repo/database';

import { IBaseRepository } from '../IBaseRepository';

export type UserLessonProgressPayload = Prisma.UserLessonProgressGetPayload<object>;

export type UserLessonProgressWithSpecificScreenMetrics = Prisma.UserLessonProgressGetPayload<{
  include: {
    screenMetrics: {
      where: { screenOrder: number };
    };
  };
}>;

export interface IUserLessonProgressRepository extends IBaseRepository<'userLessonProgress'> {
  findByUserAndLesson(userId: string, lessonId: string): Promise<UserLessonProgressPayload | null>;
  findAllByUser(userId: string): Promise<UserLessonProgressPayload[]>;
  findCompletedByUser(userId: string): Promise<UserLessonProgressPayload[]>;
  findLastByUser(userId: string): Promise<UserLessonProgressPayload | null>;
  findProgressByUserAndLesson(userId: string, lessonId: string): Promise<UserLessonProgressPayload | null>;
  upsertLessonProgress(
    userId: string,
    lessonId: string,
    data: Partial<UserLessonProgressPayload>
  ): Promise<UserLessonProgressPayload>;
  getOrCreateProgressWithScreenMetric(
    userId: string,
    lessonId: string,
    screenOrder: number
  ): Promise<UserLessonProgressWithSpecificScreenMetrics>;
}
