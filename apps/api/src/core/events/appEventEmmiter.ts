import { FullMetricData, FullMetricDataWithLearningMode } from '@api/types';
import { LessonDifficulty } from '@repo/database';
import { EventEmitter, on } from 'events';

/**
 * Defines the set of application-wide event names used for event emission and handling.
 */
export const APP_EVENTS = {
  SCREEN_COMPLETED: 'screenCompleted',
  LESSON_COMPLETED: 'lessonCompleted',
  SSE_ACHIEVEMENT_UNLOCKED: 'sse_achievementUnlocked',
  SSE_USER_XP_EARNED: 'sse_userXpEarned',
  SSE_USER_LEVEL_UP: 'sse_userLevelUp'
} as const;

/**
 * Defines the structure of data payloads sent via Server-Sent Events.
 */
export interface SSEPayloads {
  achievementUnlocked: {
    id: string;
    achievementName: string;
    achievementDescription: string;
    unlockedAt: string;
  };
  userXpEarned: {
    id: string;
    xpEarned: number;
    updatedAt: string;
  };
  levelUp: {
    id: string;
    newLevel: number;
    updatedAt: string;
  };
}

/**
 * Defines the set of all application events with their corresponding listener signatures.
 */
export interface AppEvents {
  /**
   * Event emitted when a user completes a single screen within a lesson.
   */
  [APP_EVENTS.SCREEN_COMPLETED]: (
    userId: string,
    xpEarned: number,
    lessonDifficulty: LessonDifficulty,
    metrics: FullMetricDataWithLearningMode,
    isFirstCompletion: boolean,
    wasPerfectCompletion: boolean,
    activityType: 'lesson' | 'screen'
  ) => void;

  /**
   * Event emitted when a user completes an entire lesson.
   */
  [APP_EVENTS.LESSON_COMPLETED]: (
    userId: string,
    xpEarned: number,
    lessonDifficulty: LessonDifficulty,
    metrics: FullMetricData,
    isFirstCompletion: boolean,
    wasPerfectCompletion: boolean,
    activityType: 'lesson' | 'screen'
  ) => void;

  /**
   * Event for broadcasting an unlocked achievement to a specific user via SSE.
   */
  [APP_EVENTS.SSE_ACHIEVEMENT_UNLOCKED]: (userId: string, payload: SSEPayloads['achievementUnlocked']) => void;

  /**
   * Event for broadcasting XP earned to a specific user via SSE.
   */
  [APP_EVENTS.SSE_USER_XP_EARNED]: (userId: string, payload: SSEPayloads['userXpEarned']) => void;

  /**
   * Event for broadcasting a user leveling up to a specific user via SSE.
   */
  [APP_EVENTS.SSE_USER_LEVEL_UP]: (userId: string, payload: SSEPayloads['levelUp']) => void;
}

/**
 * A custom interface for the EventEmitter to enforce type-safety on all methods.
 * It also adds the `toIterable` method for easy integration with async generators.
 */
interface AppEventEmitter extends EventEmitter {
  on<K extends keyof AppEvents>(eventName: K, listener: AppEvents[K]): this;
  off<K extends keyof AppEvents>(eventName: K, listener: AppEvents[K]): this;
  emit<K extends keyof AppEvents>(eventName: K, ...args: Parameters<AppEvents[K]>): boolean;
  // addListener<K extends keyof AppEvents>(eventName: K, listener: AppEvents[K]): this;
  // once<K extends keyof AppEvents>(eventName: K, listener: AppEvents[K]): this;
  // removeAllListeners<K extends keyof AppEvents>(eventName?: K): this;
  // listeners<K extends keyof AppEvents>(eventName: K): AppEvents[K][];

  /**
   * Converts the event stream into an AsyncIterable, allowing it to be consumed
   * by `for await...of` loops. This is essential for tRPC subscriptions.
   * @param {K} eventName - The name of the event to listen to.
   * @param {{ signal?: AbortSignal }} [options] - Options for the iterable, including an AbortSignal.
   * @returns {AsyncIterable<Parameters<AppEvents[K]>>} - An async iterable of event payloads.
   */
  toIterable<K extends keyof AppEvents>(
    eventName: K,
    options?: { signal?: AbortSignal }
  ): AsyncIterable<Parameters<AppEvents[K]>>;
}

/**
 * The singleton instance of the application-wide event emitter.
 */
const appEventEmitter = new EventEmitter() as AppEventEmitter;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(appEventEmitter as any).toIterable = function <K extends keyof AppEvents>(
  eventName: K,
  options?: { signal?: AbortSignal }
): AsyncIterable<Parameters<AppEvents[K]>> {
  return on(this, eventName, options) as AsyncIterable<Parameters<AppEvents[K]>>;
};

export default appEventEmitter;
