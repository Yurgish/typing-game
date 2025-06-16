import { z } from "zod";

import { AchievementService } from "../../src/services/AchievementService";
import { DailyActivityService } from "../../src/services/DailyActivityService";
import { UserProgressService } from "../../src/services/LessonProgressService";
import { UserStatsService } from "../../src/services/UserStatsService";
import { calculateLevel } from "../../src/utils/xpCalculator";
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
  totalRawWPM: z.number(),
  totalAdjustedWPM: z.number(),
  totalAccuracy: z.number(),
  totalBackspaces: z.number().int(),
  totalErrors: z.number().int(),
  totalTimeTaken: z.number().int(),
  totalTypedCharacters: z.number().int(),
  totalCorrectCharacters: z.number().int(),
});

export const updateCharacterMetricsInputSchema = z.array(
  z.object({
    character: z.string().length(1),
    correctCount: z.number().int().min(0),
    errorCount: z.number().int().min(0),
  })
);

const saveSingleScreenInputSchema = z.object({
  lessonId: z.string(),
  screenMetric: screenMetricInputSchema,
});

export const userProgressRouter = router({
  saveLessonProgress: protectedProcedure.input(saveLessonProgressInputSchema).mutation(async ({ input, ctx }) => {
    const { userId } = ctx.session;

    const userProgressService = new UserProgressService();

    const result = await userProgressService.saveLessonProgress(
      userId,
      input.lessonId,
      input.currentScreenOrder,
      input.isCompleted,
      input.totalRawWPM,
      input.totalAdjustedWPM,
      input.totalAccuracy,
      input.totalBackspaces,
      input.totalErrors,
      input.totalTimeTaken,
      input.totalTypedCharacters,
      input.totalCorrectCharacters
    );

    return result;
  }),

  saveScreenMetric: protectedProcedure.input(saveSingleScreenInputSchema).mutation(async ({ input, ctx }) => {
    const { userId } = ctx.session;
    const { lessonId, screenMetric } = input;

    const userProgressService = new UserProgressService();
    const result = await userProgressService.saveScreenMetric(userId, lessonId, screenMetric);

    return result;
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

  getUserXpAndLevel: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx.session;
    const userStatsService = new UserStatsService();
    const userStats = await userStatsService.getUserStats(userId);

    const { currentLevel, xpToNextLevel } = calculateLevel(userStats.totalExperience);

    return {
      totalExperience: userStats.totalExperience,
      currentLevel: currentLevel,
      xpToNextLevel: xpToNextLevel,
    };
  }),

  getAchievements: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx.session;
    const achievementService = new AchievementService();
    return achievementService.getUserAchievements(userId);
  }),

  updateCharacterMetrics: protectedProcedure
    .input(updateCharacterMetricsInputSchema)
    .mutation(async ({ input, ctx }) => {
      const { userId } = ctx.session;
      const results = await ctx.prisma.$transaction(
        input.map(({ character, correctCount, errorCount }) => {
          return ctx.prisma.characterMetric.upsert({
            where: {
              userId_character: {
                userId: userId,
                character: character,
              },
            },
            update: {
              correctCount: { increment: correctCount },
              errorCount: { increment: errorCount },
            },
            create: {
              userId: userId,
              character: character,
              correctCount: correctCount,
              errorCount: errorCount,
            },
          });
        })
      );
      return results;
    }),

  getCharacterMetrics: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx.session;
    const characterMetrics = await ctx.prisma.characterMetric.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        errorCount: "desc",
      },
    });

    const metricsWithRatio = characterMetrics.map((metric) => {
      const totalTyped = metric.correctCount + metric.errorCount;
      // Уникаємо ділення на нуль
      const errorRatio = totalTyped > 0 ? metric.errorCount / totalTyped : 0;
      const accuracy = totalTyped > 0 ? metric.correctCount / totalTyped : 0;

      return {
        ...metric,
        errorRatio: parseFloat(errorRatio.toFixed(4)),
        accuracy: parseFloat(accuracy.toFixed(4)),
        errorPercentage: parseFloat((errorRatio * 100).toFixed(2)),
        accuracyPercentage: parseFloat((accuracy * 100).toFixed(2)),
      };
    });

    metricsWithRatio.sort((a, b) => b.errorRatio - a.errorRatio);

    return metricsWithRatio;
  }),

  getUserActivityHeatmap: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx.session;
    const dailyActivityService = new DailyActivityService();

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    dailyActivityService.normalizeDate(oneYearAgo);

    const activity = await dailyActivityService.getDailyActivityForUser(userId, oneYearAgo, new Date());

    const userStats = await ctx.prisma.userStats.findUnique({
      where: { userId: userId },
      select: { currentStreak: true, longestStreak: true },
    });

    const formattedActivity = activity.reduce(
      (acc: { [key: string]: { lessons: number; screens: number; xp: number } }, entry) => {
        const dateKey = entry.date.toISOString().split("T")[0] as string;
        acc[dateKey] = { lessons: entry.lessonsCompleted, screens: entry.screensCompleted, xp: entry.xpEarnedToday };
        return acc;
      },
      {}
    );

    return {
      heatmapData: formattedActivity,
      currentStreak: userStats?.currentStreak || 0,
      longestStreak: userStats?.longestStreak || 0,
    };
  }),
});
