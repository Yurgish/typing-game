import { UserStatsService } from '@api/services/UserStatsService';
import { protectedProcedure, router } from '@api/trpc';
import { calculateLevel } from '@api/utils/xpCalculator';

export const userStatsRouter = router({
  getUserXpAndLevel: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx.session;
    const userStatsService = new UserStatsService(ctx.prisma);
    const userStats = await userStatsService.getUserStats(userId);
    const { currentLevel, xpToNextLevel } = calculateLevel(userStats.totalExperience);
    return {
      totalExperience: userStats.totalExperience,
      currentLevel: currentLevel,
      xpToNextLevel: xpToNextLevel
    };
  })
});
