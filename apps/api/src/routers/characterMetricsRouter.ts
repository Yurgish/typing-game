import { protectedProcedure, router } from '@api/trpc';
import { z } from 'zod';

export const updateCharacterMetricsInputSchema = z.array(
  z.object({
    character: z.string().length(1),
    correctCount: z.number().int().min(0),
    errorCount: z.number().int().min(0)
  })
);

export const characterMetricsRouter = router({
  // need to make it into service or repository
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
                character: character
              }
            },
            update: {
              correctCount: { increment: correctCount },
              errorCount: { increment: errorCount }
            },
            create: {
              userId: userId,
              character: character,
              correctCount: correctCount,
              errorCount: errorCount
            }
          });
        })
      );
      return results;
    }),
  // thats remake into service
  getCharacterMetrics: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx.session;
    const characterMetrics = await ctx.prisma.characterMetric.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        errorCount: 'desc'
      }
    });

    const metricsWithRatio = characterMetrics.map((metric) => {
      const totalTyped = metric.correctCount + metric.errorCount;
      const errorRatio = totalTyped > 0 ? metric.errorCount / totalTyped : 0;
      const accuracy = totalTyped > 0 ? metric.correctCount / totalTyped : 0;
      return {
        ...metric,
        errorRatio: parseFloat(errorRatio.toFixed(4)),
        accuracy: parseFloat(accuracy.toFixed(4)),
        errorPercentage: parseFloat((errorRatio * 100).toFixed(2)),
        accuracyPercentage: parseFloat((accuracy * 100).toFixed(2))
      };
    });

    metricsWithRatio.sort((a, b) => b.errorRatio - a.errorRatio);

    return metricsWithRatio;
  })
});
