// src/server/api/routers/userProgress.ts
import { z } from "zod";

import { protectedProcedure, router } from "../index";
import { LearningMode } from "../types";

const screenMetricInputSchema = z.object({
  order: z.number(),
  type: z.nativeEnum(LearningMode),
  rawWPM: z.number(),
  adjustedWPM: z.number(),
  accuracy: z.number(),
  backspaces: z.number(),
  errors: z.number(),
  timeTaken: z.number(),
  typedCharacters: z.number(),
  correctCharacters: z.number(),
});

const saveLessonProgressInputSchema = z.object({
  lessonId: z.string(),
  currentScreenOrder: z.number(),
  isCompleted: z.boolean(),
  totalRawWPM: z.number().optional().nullable(),
  totalAdjustedWPM: z.number().optional().nullable(),
  totalAccuracy: z.number().optional().nullable(),
  totalBackspaces: z.number().int().optional().nullable(),
  totalErrors: z.number().int().optional().nullable(),
  totalTimeTaken: z.number().int().optional().nullable(),
  totalTypedCharacters: z.number().int().optional().nullable(),
  totalCorrectCharacters: z.number().int().optional().nullable(),
  screenMetrics: z.array(screenMetricInputSchema).optional(),
});

const updateCharacterMetricsInputSchema = z.object({
  character: z.string().length(1), // not one symbol, but one keycode
  isCorrect: z.boolean(),
}); //remake later

const saveSingleScreenInputSchema = z.object({
  lessonId: z.string(),
  screenMetric: screenMetricInputSchema,
});

export const userProgressRouter = router({
  saveLessonProgress: protectedProcedure.input(saveLessonProgressInputSchema).mutation(async ({ input, ctx }) => {
    const { userId } = ctx.session;

    const existingProgress = await ctx.prisma.userLessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: userId,
          lessonId: input.lessonId,
        },
      },
    });

    let newCurrentScreenOrder = input.currentScreenOrder;
    if (existingProgress && existingProgress.currentScreenOrder !== null) {
      newCurrentScreenOrder = Math.max(existingProgress.currentScreenOrder, input.currentScreenOrder);
    }

    if (existingProgress) {
      const updatedProgress = await ctx.prisma.userLessonProgress.update({
        where: {
          id: existingProgress.id,
        },
        data: {
          currentScreenOrder: newCurrentScreenOrder,
          isCompleted: input.isCompleted,
          completedAt: input.isCompleted ? new Date() : undefined,
          totalRawWPM: input.totalRawWPM,
          totalAdjustedWPM: input.totalAdjustedWPM,
          totalAccuracy: input.totalAccuracy,
          totalBackspaces: input.totalBackspaces,
          totalErrors: input.totalErrors,
          totalTimeTaken: input.totalTimeTaken,
          totalTypedCharacters: input.totalTypedCharacters,
          totalCorrectCharacters: input.totalCorrectCharacters,
          screenMetrics: {
            upsert: input.screenMetrics?.map((metric) => ({
              where: {
                userLessonProgressId_screenOrder: {
                  userLessonProgressId: existingProgress.id,
                  screenOrder: metric.order,
                },
              },
              update: {
                rawWPM: metric.rawWPM,
                adjustedWPM: metric.adjustedWPM,
                accuracy: metric.accuracy,
                backspaces: metric.backspaces,
                errors: metric.errors,
                timeTaken: metric.timeTaken,
                typedCharacters: metric.typedCharacters,
                correctCharacters: metric.correctCharacters,
              },
              create: {
                screenOrder: metric.order,
                screenType: metric.type,
                rawWPM: metric.rawWPM,
                adjustedWPM: metric.adjustedWPM,
                accuracy: metric.accuracy,
                backspaces: metric.backspaces,
                errors: metric.errors,
                timeTaken: metric.timeTaken,
                typedCharacters: metric.typedCharacters,
                correctCharacters: metric.correctCharacters,
              },
            })),
          },
        },
      });
      return updatedProgress;
    } else {
      const newProgress = await ctx.prisma.userLessonProgress.create({
        data: {
          userId: userId,
          lessonId: input.lessonId,
          currentScreenOrder: input.currentScreenOrder,
          isCompleted: input.isCompleted,
          completedAt: input.isCompleted ? new Date() : undefined,
          totalRawWPM: input.totalRawWPM,
          totalAdjustedWPM: input.totalAdjustedWPM,
          totalAccuracy: input.totalAccuracy,
          totalBackspaces: input.totalBackspaces,
          totalErrors: input.totalErrors,
          totalTimeTaken: input.totalTimeTaken,
          totalTypedCharacters: input.totalTypedCharacters,
          totalCorrectCharacters: input.totalCorrectCharacters,
          screenMetrics: {
            createMany: {
              data:
                input.screenMetrics?.map((metric) => ({
                  screenOrder: metric.order,
                  screenType: metric.type,
                  rawWPM: metric.rawWPM,
                  adjustedWPM: metric.adjustedWPM,
                  accuracy: metric.accuracy,
                  backspaces: metric.backspaces,
                  errors: metric.errors,
                  timeTaken: metric.timeTaken,
                  typedCharacters: metric.typedCharacters,
                  correctCharacters: metric.correctCharacters,
                })) || [],
            },
          },
        },
      });
      return newProgress;
    }
  }),

  saveScreenMetric: protectedProcedure.input(saveSingleScreenInputSchema).mutation(async ({ input, ctx }) => {
    const { userId } = ctx.session;
    const { lessonId, screenMetric } = input;

    const progress = await ctx.prisma.userLessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {},
      create: {
        userId,
        lessonId,
        currentScreenOrder: screenMetric.order,
        isCompleted: false,
      },
    });

    const newCurrentScreenOrder = Math.max(progress.currentScreenOrder || 0, screenMetric.order);

    const updated = await ctx.prisma.screenMetrics.upsert({
      where: {
        userLessonProgressId_screenOrder: {
          userLessonProgressId: progress.id,
          screenOrder: screenMetric.order,
        },
      },
      update: {
        rawWPM: screenMetric.rawWPM,
        adjustedWPM: screenMetric.adjustedWPM,
        accuracy: screenMetric.accuracy,
        backspaces: screenMetric.backspaces,
        errors: screenMetric.errors,
        timeTaken: screenMetric.timeTaken,
        typedCharacters: screenMetric.typedCharacters,
        correctCharacters: screenMetric.correctCharacters,
      },
      create: {
        userLessonProgressId: progress.id,
        screenOrder: screenMetric.order,
        screenType: screenMetric.type,
        rawWPM: screenMetric.rawWPM,
        adjustedWPM: screenMetric.adjustedWPM,
        accuracy: screenMetric.accuracy,
        backspaces: screenMetric.backspaces,
        errors: screenMetric.errors,
        timeTaken: screenMetric.timeTaken,
        typedCharacters: screenMetric.typedCharacters,
        correctCharacters: screenMetric.correctCharacters,
      },
    });

    await ctx.prisma.userLessonProgress.update({
      where: {
        id: progress.id,
      },
      data: {
        currentScreenOrder: newCurrentScreenOrder,
      },
    });

    return updated;
  }),

  getUserLessonProgress: protectedProcedure.input(z.object({ lessonId: z.string() })).query(async ({ input, ctx }) => {
    const { userId } = ctx.session;

    const progress = await ctx.prisma.userLessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: userId,
          lessonId: input.lessonId,
        },
      },
      include: {
        screenMetrics: true,
      },
    });
    return progress;
  }),

  getAllUserProgress: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx.session;

    const allProgress = await ctx.prisma.userLessonProgress.findMany({
      where: {
        userId: userId,
      },
      include: {
        screenMetrics: true,
      },
    });
    return allProgress;
  }),

  getCompletedLessons: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx.session;

    const completedProgresses = await ctx.prisma.userLessonProgress.findMany({
      where: {
        userId: userId,
        isCompleted: true,
      },
      include: {
        screenMetrics: true,
      },
      orderBy: {
        completedAt: "desc",
      },
    });
    return completedProgresses;
  }),

  updateCharacterMetrics: protectedProcedure
    .input(z.array(updateCharacterMetricsInputSchema))
    .mutation(async ({ input, ctx }) => {
      const { userId } = ctx.session;
      const results = [];

      for (const { character, isCorrect } of input) {
        const updateData = isCorrect ? { correctCount: { increment: 1 } } : { errorCount: { increment: 1 } };

        const characterMetric = await ctx.prisma.characterMetric.upsert({
          where: {
            userId_character: {
              userId: userId,
              character: character,
            },
          },
          update: updateData,
          create: {
            userId: userId,
            character: character,
            correctCount: isCorrect ? 1 : 0,
            errorCount: isCorrect ? 0 : 1,
          },
        });
        results.push(characterMetric);
      }
      return results;
    }),

  getCharacterMetrics: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx.session;
    return ctx.prisma.characterMetric.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        errorCount: "desc",
      },
    });
  }),

  getLastLessonByOrder: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx.session;

    return ctx.prisma.userLessonProgress.findFirst({
      where: {
        userId: userId,
      },
      orderBy: {
        lesson: {
          order: "desc",
        },
      },
      include: {
        lesson: true,
      },
    });
  }),
});
