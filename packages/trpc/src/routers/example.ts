import { z } from "zod";
import { publicProcedure, router } from "../index";

export const lessonRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.lesson.findMany();
  }),
  getByDifficulty: publicProcedure
    .input(z.object({ difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]) })) // переробити
    .query(async ({ input, ctx }) => {
      return ctx.prisma.lesson.findMany({
        where: {
          difficulty: input.difficulty,
        },
      });
    }),
  getById: publicProcedure
    // .input(z.object({ id: z.string() })) // OLD: expects an object
    .input(z.string()) // NEW: expects a direct string input
    .query(async ({ input: id, ctx }) => {
      // Rename 'input' to 'id' for clarity
      const lesson = await ctx.prisma.lesson.findUnique({
        where: {
          id: id, // Use 'id' directly here
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
});
