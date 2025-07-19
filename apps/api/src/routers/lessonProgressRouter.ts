import { protectedProcedure, router } from '@api/trpc';
import { LearningMode } from '@api/types';
import { z } from 'zod';

const fullMetricDataSchema = z.object({
  rawWPM: z.number(),
  adjustedWPM: z.number(),
  accuracy: z.number(),
  backspaces: z.number().int(),
  errors: z.number().int(),
  timeTaken: z.number().int(),
  typedCharacters: z.number().int(),
  correctCharacters: z.number().int()
});

const screenMetricInputSchema = z.object({
  order: z.number(),
  type: z.nativeEnum(LearningMode),
  metrics: fullMetricDataSchema
});

const saveLessonProgressInputSchema = z.object({
  lessonId: z.string(),
  currentScreenOrder: z.number(),
  isCompleted: z.boolean(),
  metrics: fullMetricDataSchema
});

const saveSingleScreenInputSchema = z.object({
  lessonId: z.string(),
  screenMetric: screenMetricInputSchema
});

export const lessonProgressRouter = router({
  saveLessonProgress: protectedProcedure.input(saveLessonProgressInputSchema).mutation(async ({ input, ctx }) => {
    const { userId } = ctx.session;
    const { userProgressService } = ctx.services;
    const result = await userProgressService.saveLessonProgress(userId, input);
    return result;
  }),
  saveScreenMetric: protectedProcedure.input(saveSingleScreenInputSchema).mutation(async ({ input, ctx }) => {
    const { userId } = ctx.session;
    const { userProgressService } = ctx.services;
    const result = await userProgressService.saveScreenMetric(userId, input);
    return result;
  }),
  getUserLessonProgress: protectedProcedure.input(z.object({ lessonId: z.string() })).query(async ({ input, ctx }) => {
    const { userId } = ctx.session;
    const progress = await ctx.prisma.userLessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: userId,
          lessonId: input.lessonId
        }
      },
      include: {
        screenMetrics: true
      }
    });
    return progress;
  }),
  getAllUserProgress: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx.session;
    const allProgress = await ctx.prisma.userLessonProgress.findMany({
      where: {
        userId: userId
      },
      include: {
        screenMetrics: true
      }
    });
    return allProgress;
  }),
  getCompletedLessons: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx.session;
    const completedProgresses = await ctx.prisma.userLessonProgress.findMany({
      where: {
        userId: userId,
        isCompleted: true
      },
      include: {
        screenMetrics: true
      },
      orderBy: {
        completedAt: 'desc'
      }
    });
    return completedProgresses;
  }),
  getLastLessonByOrder: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx.session;
    return ctx.prisma.userLessonProgress.findFirst({
      where: {
        userId: userId
      },
      orderBy: {
        lesson: {
          order: 'desc'
        }
      },
      include: {
        lesson: true
      }
    });
  })
});
