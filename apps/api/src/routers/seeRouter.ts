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

  onUserXpEarned: publicProcedure.input(sseInput).subscription(async function* (opts) {
    const { userId } = opts.input;

    const iterable = appEventEmitter.toIterable('sse_userXpEarned', {
      signal: opts.signal
    });

    for await (const [eventUserId, payload] of iterable) {
      if (eventUserId === userId) {
        yield tracked(payload.id, payload as SSEPayloads['userXpEarned']);
      }
    }
  }),

  onUserLevelUp: publicProcedure.input(sseInput).subscription(async function* (opts) {
    const { userId } = opts.input;

    const iterable = appEventEmitter.toIterable('sse_userLevelUp', {
      signal: opts.signal
    });

    for await (const [eventUserId, payload] of iterable) {
      if (eventUserId === userId) {
        yield tracked(payload.id, payload as SSEPayloads['levelUp']);
      }
    }
  })
});
