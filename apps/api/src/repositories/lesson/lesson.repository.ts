import { LessonDifficulty, PrismaClient } from '@repo/database';

import { BaseRepository } from '../BaseRepository';
import { ILessonRepository, LessonPayload } from './ILessonRepository';

export class LessonRepository extends BaseRepository<'lesson'> implements ILessonRepository {
  constructor(db: PrismaClient) {
    super(db, 'lesson');
  }

  async findByDifficulty(difficulty: LessonDifficulty): Promise<LessonPayload[]> {
    return this.findMany({ where: { difficulty }, orderBy: { order: 'asc' } });
  }

  async findNextLessonByOrder(currentOrder: number) {
    return this.findFirst({
      where: { order: { gt: currentOrder } },
      orderBy: { order: 'asc' }
    });
  }

  async getLessonDifficulty(lessonId: string): Promise<LessonDifficulty> {
    const lesson = await this.findUnique({ where: { id: lessonId } });
    return lesson?.difficulty ?? LessonDifficulty.BEGINNER;
  }
}
