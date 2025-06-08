import { z } from "zod";

import { publicProcedure, router } from "../index";

export const lessonRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.lesson.findMany();
  }),
  getByDifficulty: publicProcedure
    .input(z.object({ difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]) }))
    .query(async ({ input, ctx }) => {
      return ctx.prisma.lesson.findMany({
        where: {
          difficulty: input.difficulty,
        },
      });
    }),
  getById: publicProcedure.input(z.string()).query(async ({ input: id, ctx }) => {
    const lesson = await ctx.prisma.lesson.findUnique({
      where: {
        id: id,
      },
      include: {
        screens: {},
      },
    });

    if (!lesson) {
      throw new Error("Lesson not found");
    }

    return lesson;
  }),
  getNextLessonById: publicProcedure.input(z.string()).query(async ({ input: id, ctx }) => {
    const currentLesson = await ctx.prisma.lesson.findUnique({
      where: { id: id },
    });

    if (!currentLesson) {
      return null;
    }

    const nextLesson = await ctx.prisma.lesson.findFirst({
      where: {
        order: {
          gt: currentLesson.order + 1,
        },
      },
      orderBy: {
        order: "asc",
      },
    });

    return nextLesson;
  }),
});
