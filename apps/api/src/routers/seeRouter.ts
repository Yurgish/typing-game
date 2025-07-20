import appEventEmitter, { SSEPayloads } from '@api/core/events/appEventEmmiter';
import { publicProcedure, router } from '@api/trpc';
import { tracked } from '@trpc/server';
import z from 'zod';

const sseInput = z.object({
  userId: z.string(),
  lastEventId: z.string().nullish()
});

export const sseRouter = router({
  onAchievementUnlocked: publicProcedure.input(sseInput).subscription(async function* (opts) {
    const { userId } = opts.input;
    const iterable = appEventEmitter.toIterable('sse_achievementUnlocked', {
      signal: opts.signal
    });

    for await (const [eventUserId, payload] of iterable) {
      if (eventUserId === userId) {
        yield tracked(payload.id, payload as SSEPayloads['achievementUnlocked']);
      }
    }
  }),

  onUserStatsUpdated: publicProcedure.input(sseInput).subscription(async function* (opts) {
    const { userId } = opts.input;

    const iterable = appEventEmitter.toIterable('sse_userStatsUpdated', {
      signal: opts.signal
    });

    for await (const [eventUserId, payload] of iterable) {
      if (eventUserId === userId) {
        yield tracked(payload.id, payload as SSEPayloads['userStatsUpdated']);
      }
    }
  })
});

// TODO: Реалізуй логіку "наздоганяння" пропущених подій для статистики
// Якщо lastEventId присутній, отримай всі оновлення статистики для цього userId,
// які відбулися після lastEventId, і yield їх першими.
// Це критично для забезпечення, що користувач не пропустить оновлення XP/рівня.
// Приклад:
// if (lastEventId) {
//   const lastUpdateTime = await yourStatsRepo.getTimestampOfEventId(lastEventId);
//   const missedUpdates = await yourStatsRepo.getUpdatesSince(userId, lastUpdateTime);
//   for (const update of missedUpdates) {
//     yield tracked(update.id, update.payload);
//   }
// }
