import { FullMetricData } from '@api/types';
import { LessonDifficulty } from '@repo/database';
import { EventEmitter } from 'events';

// Визначте типи подій для кращої типізації та автодоповнення
export interface AppEvents {
  lessonCompleted: (
    userId: string,
    xpEarned: number,
    lessonDifficulty: LessonDifficulty,
    metrics: FullMetricData,
    isFirstCompletion: boolean,
    wasPerfectCompletion: boolean,
    activityType: 'screen' | 'lesson'
  ) => void;
  screenCompleted: (userId: string, xpEarned: number, activityType: 'screen' | 'lesson') => void;
}

interface AppEventEmitter extends EventEmitter {
  on<K extends keyof AppEvents>(eventName: K, listener: AppEvents[K]): this;
  off<K extends keyof AppEvents>(eventName: K, listener: AppEvents[K]): this;
  emit<K extends keyof AppEvents>(eventName: K, ...args: Parameters<AppEvents[K]>): boolean;
  // addListener<K extends keyof AppEvents>(eventName: K, listener: AppEvents[K]): this;
  // once<K extends keyof AppEvents>(eventName: K, listener: AppEvents[K]): this;
  // removeAllListeners<K extends keyof AppEvents>(eventName?: K): this;
  // listeners<K extends keyof AppEvents>(eventName: K): AppEvents[K][];
}

const appEventEmitter = new EventEmitter() as AppEventEmitter;

export default appEventEmitter;
