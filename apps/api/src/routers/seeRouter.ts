import appEventEmitter, { SSEPayloads } from '@api/core/events/appEventEmmiter';
import { publicProcedure, router } from '@api/trpc';
import { tracked } from '@trpc/server';
import z from 'zod';

const sseInput = z.object({
  userId: z.string(),
  lastEventId: z.string().nullish()
});

/**
 * Router providing Server-Sent Events (SSE) subscriptions for user-related events.
 *
 * @remarks
 * This router exposes three SSE subscriptions:
 * - `onAchievementUnlocked`: Notifies when a user unlocks an achievement.
 * - `onUserXpEarned`: Notifies when a user earns experience points (XP).
 * - `onUserLevelUp`: Notifies when a user levels up.
 *
 * Each subscription listens for events specific to the provided `userId` and yields
 * tracked payloads for the corresponding event type.
 */
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
