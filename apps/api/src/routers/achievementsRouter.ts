import { AchievementService } from '@api/services/AchievementService';
import { protectedProcedure, router } from '@api/trpc';

export const achievementsRouter = router({
  getAchievements: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx.session;
    const achievementService = new AchievementService(ctx.prisma);
    return achievementService.getUserAchievements(userId);
  })
});
