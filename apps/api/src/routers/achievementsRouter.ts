import { protectedProcedure, router } from '@api/trpc';

export const achievementsRouter = router({
  getAchievements: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx.session;
    const { achievementService } = ctx.services;
    return achievementService.getUserAchievements(userId);
  })
});
