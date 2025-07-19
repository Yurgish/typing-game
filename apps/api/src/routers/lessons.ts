import { publicProcedure, router } from '@api/trpc';
import { z } from 'zod';

export const lessonRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const { lessonRepository } = ctx.repositories;
    return lessonRepository.findMany();
  }),
  getByDifficulty: publicProcedure
    .input(z.object({ difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']) }))
    .query(async ({ input, ctx }) => {
      const { lessonRepository } = ctx.repositories;
      return lessonRepository.findByDifficulty(input.difficulty);
    }),
  getById: publicProcedure.input(z.string()).query(async ({ input: id, ctx }) => {
    const { lessonRepository } = ctx.repositories;
    return lessonRepository.findUnique({ where: { id } });
  }),

  getNextLessonById: publicProcedure.input(z.string()).query(async ({ input: id, ctx }) => {
    const { lessonRepository } = ctx.repositories;
    const currentLesson = await lessonRepository.findUnique({
      where: { id }
    });

    if (!currentLesson) {
      return null;
    }

    return lessonRepository.findNextLessonByOrder(currentLesson.order);
  })
});
