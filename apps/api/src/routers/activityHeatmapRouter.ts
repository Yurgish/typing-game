import { protectedProcedure, router } from '@api/trpc';

// add it to activity service
export const activityHeatmapRouter = router({
  getUserActivityHeatmap: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx.session;
    const { dailyActivityService } = ctx.services;

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    dailyActivityService.normalizeDate(oneYearAgo);

    const activity = await dailyActivityService.getDailyActivityForUser(userId, oneYearAgo, new Date());

    const userStats = await ctx.prisma.userStats.findUnique({
      where: { userId: userId },
      select: { currentStreak: true, longestStreak: true }
    });

    const formattedActivity = activity.reduce(
      (acc: { [key: string]: { lessons: number; screens: number; xp: number } }, entry) => {
        const dateKey = entry.date.toISOString().split('T')[0] as string;
        acc[dateKey] = { lessons: entry.lessonsCompleted, screens: entry.screensCompleted, xp: entry.xpEarnedToday };
        return acc;
      },
      {}
    );

    return {
      heatmapData: formattedActivity,
      currentStreak: userStats?.currentStreak || 0,
      longestStreak: userStats?.longestStreak || 0
    };
  })
});
