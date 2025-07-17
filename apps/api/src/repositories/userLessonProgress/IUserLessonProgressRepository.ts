import { Prisma } from '@repo/database';

import { IBaseRepository } from '../IBaseRepository';

export type UserLessonProgressPayload = Prisma.UserLessonProgressGetPayload<{
  include?: { screenMetrics?: true; lesson?: true };
}>;

export interface IUserLessonProgressRepository
  extends IBaseRepository<'userLessonProgress', UserLessonProgressPayload> {
  findByUserAndLesson(userId: string, lessonId: string): Promise<UserLessonProgressPayload | null>;
  findAllByUser(userId: string): Promise<UserLessonProgressPayload[]>;
  findCompletedByUser(userId: string): Promise<UserLessonProgressPayload[]>;
  findLastByUser(userId: string): Promise<UserLessonProgressPayload | null>;
}
