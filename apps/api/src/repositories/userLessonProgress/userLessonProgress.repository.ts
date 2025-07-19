import { PrismaClient } from '@repo/database';

import { BaseRepository } from '../BaseRepository';
import {
  IUserLessonProgressRepository,
  UserLessonProgressPayload,
  UserLessonProgressWithSpecificScreenMetrics
} from './IUserLessonProgressRepository';

export class UserLessonProgressRepository
  extends BaseRepository<'userLessonProgress'>
  implements IUserLessonProgressRepository
{
  constructor(db: PrismaClient) {
    super(db, 'userLessonProgress');
  }

  async findByUserAndLesson(userId: string, lessonId: string) {
    return this.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
      include: { screenMetrics: true, lesson: true }
    });
  }

  async findAllByUser(userId: string) {
    return this.findMany({
      where: { userId },
      include: { screenMetrics: true, lesson: true }
    });
  }

  async findCompletedByUser(userId: string) {
    return this.findMany({
      where: { userId, isCompleted: true },
      include: { screenMetrics: true, lesson: true },
      orderBy: { completedAt: 'desc' }
    });
  }

  async findLastByUser(userId: string) {
    return this.findFirst({
      where: { userId },
      orderBy: { lesson: { order: 'desc' } },
      include: { lesson: true }
    });
  }

  async findProgressByUserAndLesson(userId: string, lessonId: string) {
    return this.findUnique({
      where: { userId_lessonId: { userId, lessonId } }
    });
  }

  async upsertLessonProgress(userId: string, lessonId: string, data: Partial<UserLessonProgressPayload>) {
    return this.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: data,
      create: { userId, lessonId, ...data }
    });
  }

  async getOrCreateProgressWithScreenMetric(
    userId: string,
    lessonId: string,
    screenOrder: number
  ): Promise<UserLessonProgressWithSpecificScreenMetrics> {
    return this.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: {},
      create: { userId, lessonId, currentScreenOrder: screenOrder, isCompleted: false },
      include: { screenMetrics: { where: { screenOrder } } }
    });
  }
}
