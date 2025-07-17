import { LessonRepository } from '@api/repositories/lesson/lesson.repository';
import { publicProcedure, router } from '@api/trpc';
import { z } from 'zod';

// remake later this LessonRepository in every add to context

export const lessonRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const lessonRepository = new LessonRepository(ctx.prisma);
    return lessonRepository.findMany();
  }),
  getByDifficulty: publicProcedure
    .input(z.object({ difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']) }))
    .query(async ({ input, ctx }) => {
      const lessonRepository = new LessonRepository(ctx.prisma);
      return lessonRepository.findByDifficulty(input.difficulty);
    }),
  getById: publicProcedure.input(z.string()).query(async ({ input: id, ctx }) => {
    const lessonRepository = new LessonRepository(ctx.prisma);
    return lessonRepository.findUnique({ where: { id } });
  }),

  getNextLessonById: publicProcedure.input(z.string()).query(async ({ input: id, ctx }) => {
    const lessonRepository = new LessonRepository(ctx.prisma);
    const currentLesson = await lessonRepository.findUnique({
      where: { id }
    });

    if (!currentLesson) {
      return null;
    }

    return lessonRepository.findNextLessonByOrder(currentLesson.order);
  })
});
