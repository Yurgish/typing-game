import { FullMetricData, FullMetricDataWithLearningMode } from '@api/types';
import { LessonDifficulty } from '@repo/database';
import { EventEmitter, on } from 'events';

export interface SSEPayloads {
  achievementUnlocked: {
    id: string;
    achievementName: string;
    achievementDescription: string;
    unlockedAt: string;
  };
  userStatsUpdated: {
    id: string;
    xpEarned: number;
    updatedAt: string;
  };
}

export interface AppEvents {
  screenCompleted: (
    userId: string,
    xpEarned: number,
    lessonDifficulty: LessonDifficulty,
    metrics: FullMetricDataWithLearningMode,
    isFirstCompletion: boolean,
    wasPerfectCompletion: boolean
  ) => void;
  lessonCompleted: (
    userId: string,
    xpEarned: number,
    lessonDifficulty: LessonDifficulty,
    metrics: FullMetricData,
    isFirstCompletion: boolean,
    wasPerfectCompletion: boolean
  ) => void;
  sse_achievementUnlocked: (userId: string, payload: SSEPayloads['achievementUnlocked']) => void;
  sse_userStatsUpdated: (userId: string, payload: SSEPayloads['userStatsUpdated']) => void;
}

interface AppEventEmitter extends EventEmitter {
  on<K extends keyof AppEvents>(eventName: K, listener: AppEvents[K]): this;
  off<K extends keyof AppEvents>(eventName: K, listener: AppEvents[K]): this;
  emit<K extends keyof AppEvents>(eventName: K, ...args: Parameters<AppEvents[K]>): boolean;
  // addListener<K extends keyof AppEvents>(eventName: K, listener: AppEvents[K]): this;
  // once<K extends keyof AppEvents>(eventName: K, listener: AppEvents[K]): this;
  // removeAllListeners<K extends keyof AppEvents>(eventName?: K): this;
  // listeners<K extends keyof AppEvents>(eventName: K): AppEvents[K][];

  toIterable<K extends keyof AppEvents>(
    eventName: K,
    options?: { signal?: AbortSignal }
  ): AsyncIterable<Parameters<AppEvents[K]>>;
}

const appEventEmitter = new EventEmitter() as AppEventEmitter;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(appEventEmitter as any).toIterable = function <K extends keyof AppEvents>(
  eventName: K,
  options?: { signal?: AbortSignal }
): AsyncIterable<Parameters<AppEvents[K]>> {
  return on(this, eventName, options) as AsyncIterable<Parameters<AppEvents[K]>>;
};

export default appEventEmitter;
