import { LessonDifficulty, Prisma } from '@repo/database';

import { IBaseRepository } from '../IBaseRepository';

export type LessonPayload = Prisma.LessonGetPayload<object>;

export interface ILessonRepository extends IBaseRepository<'lesson'> {
  findByDifficulty(difficulty: LessonDifficulty): Promise<LessonPayload[]>;
  findNextLessonByOrder(currentOrder: number): Promise<LessonPayload | null>;
  getLessonDifficulty(lessonId: string): Promise<LessonDifficulty>;
}
