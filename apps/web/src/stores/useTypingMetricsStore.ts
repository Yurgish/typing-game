// stores/useTypingMetricsStore.ts
import { LearningMode } from '@repo/database';
import { create } from 'zustand';

import { calculateWPM } from '@/utils/metrics';

export type ScreenMetricsData = {
  order: number;
  type: LearningMode;
  rawWPM: number;
  adjustedWPM: number;
  accuracy: number;
  backspaces: number;
  errors: number;
  timeTaken: number; // in milliseconds
  typedCharacters: number;
  correctCharacters: number;
};

export type LessonMetricsData = {
  lessonId: string;
  totalRawWPM: number;
  totalAdjustedWPM: number;
  totalAccuracy: number;
  totalBackspaces: number;
  totalErrors: number;
  totalTimeTaken: number; // in milliseconds
  totalTypedCharacters: number;
  totalCorrectCharacters: number;
  screenMetrics: ScreenMetricsData[];
};

type TypingMetricsState = {
  screenStartTime: number | null;
  lessonStartTime: number | null;
  errors: number;
  backspaces: number;
  typedCharacters: number;
  correctCharacters: number;
  currentScreenTargetTextLength: number;

  currentScreenRawWPM: number;
  currentScreenAdjustedWPM: number;
  currentScreenAccuracy: number;
  currentScreenTimeTaken: number;

  currentLessonMetrics: LessonMetricsData | null;

  startScreenTimer: () => void;
  startLessonTimer: () => void;
  incrementErrors: () => void;
  incrementBackspaces: () => void;
  addTypedCharacter: (isCorrect: boolean) => void;
  setCurrentScreenTargetTextLength: (length: number) => void;

  addScreenMetricsToLesson: (screenOrder: number, screenType: LearningMode) => void;
  resetScreenMetrics: () => void;
  resetLessonMetrics: (lessonId: string) => void;
  updateCalculatedScreenMetrics: () => void;
  updateTotalLessonMetrics: () => void;
};

export const useTypingMetricsStore = create<TypingMetricsState>((set, get) => ({
  screenStartTime: null,
  lessonStartTime: null,
  errors: 0,
  backspaces: 0,
  typedCharacters: 0,
  correctCharacters: 0,
  currentScreenTargetTextLength: 0,

  currentScreenRawWPM: 0,
  currentScreenAdjustedWPM: 0,
  currentScreenAccuracy: 0,
  currentScreenTimeTaken: 0,

  currentLessonMetrics: null,

  startScreenTimer: () => set({ screenStartTime: Date.now() }),
  startLessonTimer: () => set({ lessonStartTime: Date.now() }),

  incrementErrors: () => {
    set((state) => ({ errors: state.errors + 1 }));
  },
  incrementBackspaces: () => {
    set((state) => ({ backspaces: state.backspaces + 1 }));
  },
  addTypedCharacter: (isCorrect: boolean) => {
    if (get().currentScreenTargetTextLength === get().typedCharacters) return;
    set((state) => ({
      typedCharacters: state.typedCharacters + 1,
      correctCharacters: isCorrect ? state.correctCharacters + 1 : state.correctCharacters
    }));
    get().updateCalculatedScreenMetrics();
  },
  setCurrentScreenTargetTextLength: (length: number) => set({ currentScreenTargetTextLength: length }),

  updateCalculatedScreenMetrics: () => {
    set((state) => {
      const timeElapsed = state.screenStartTime ? Date.now() - state.screenStartTime : 0;
      const { rawWPM, adjustedWPM, accuracy } = calculateWPM(
        state.typedCharacters,
        state.correctCharacters,
        timeElapsed,
        state.currentScreenTargetTextLength
      );
      return {
        currentScreenRawWPM: rawWPM,
        currentScreenAdjustedWPM: adjustedWPM,
        currentScreenAccuracy: accuracy,
        currentScreenTimeTaken: timeElapsed
      };
    });
  },

  addScreenMetricsToLesson: (screenOrder, screenType) => {
    if (screenType === 'KEY_INTRODUCTION') return;

    const state = get();
    const {
      currentScreenRawWPM,
      currentScreenAdjustedWPM,
      currentScreenAccuracy,
      currentScreenTimeTaken,
      screenStartTime,
      errors,
      backspaces,
      typedCharacters,
      correctCharacters,
      currentLessonMetrics
    } = state;

    if (!currentLessonMetrics || !screenStartTime) return;

    const metrics: ScreenMetricsData = {
      order: screenOrder,
      type: screenType,
      rawWPM: currentScreenRawWPM,
      adjustedWPM: currentScreenAdjustedWPM,
      accuracy: currentScreenAccuracy,
      backspaces,
      errors,
      timeTaken: currentScreenTimeTaken,
      typedCharacters,
      correctCharacters
    };

    set({
      currentLessonMetrics: {
        ...currentLessonMetrics,
        screenMetrics: [...currentLessonMetrics.screenMetrics, metrics]
      }
    });
  },

  resetScreenMetrics: () =>
    set({
      errors: 0,
      backspaces: 0,
      typedCharacters: 0,
      correctCharacters: 0,
      screenStartTime: null,
      currentScreenTargetTextLength: 0,
      currentScreenRawWPM: 0,
      currentScreenAdjustedWPM: 0,
      currentScreenAccuracy: 0,
      currentScreenTimeTaken: 0
    }),

  resetLessonMetrics: (lessonId: string) =>
    set({
      currentLessonMetrics: {
        lessonId,
        totalRawWPM: 0,
        totalAdjustedWPM: 0,
        totalAccuracy: 0,
        totalBackspaces: 0,
        totalErrors: 0,
        totalTimeTaken: 0,
        screenMetrics: [],
        totalTypedCharacters: 0,
        totalCorrectCharacters: 0
      },
      lessonStartTime: null
    }),

  updateTotalLessonMetrics: () =>
    set((state) => {
      if (!state.currentLessonMetrics) return state;

      const relevantScreens = state.currentLessonMetrics.screenMetrics.filter(
        (screen) => screen.type !== 'KEY_INTRODUCTION'
      );

      const count = relevantScreens.length;
      if (count === 0) return state;

      const sum = relevantScreens.reduce(
        (acc, sm) => {
          acc.rawWPM += sm.rawWPM;
          acc.adjustedWPM += sm.adjustedWPM;
          acc.accuracy += sm.accuracy;
          acc.backspaces += sm.backspaces;
          acc.errors += sm.errors;
          acc.timeTaken += sm.timeTaken;
          acc.typedCharacters += sm.typedCharacters;
          acc.correctCharacters += sm.correctCharacters;
          return acc;
        },
        {
          rawWPM: 0,
          adjustedWPM: 0,
          accuracy: 0,
          backspaces: 0,
          errors: 0,
          timeTaken: 0,
          typedCharacters: 0,
          correctCharacters: 0
        }
      );

      return {
        currentLessonMetrics: {
          ...state.currentLessonMetrics,
          totalRawWPM: parseFloat((sum.rawWPM / count).toFixed(2)),
          totalAdjustedWPM: parseFloat((sum.adjustedWPM / count).toFixed(2)),
          totalAccuracy: parseFloat((sum.accuracy / count).toFixed(2)),
          totalBackspaces: parseFloat((sum.backspaces / count).toFixed(2)),
          totalErrors: parseFloat((sum.errors / count).toFixed(2)),
          totalTimeTaken: parseFloat((sum.timeTaken / count).toFixed(2)),
          totalTypedCharacters: parseFloat((sum.typedCharacters / count).toFixed(2)),
          totalCorrectCharacters: parseFloat((sum.correctCharacters / count).toFixed(2))
        }
      };
    })
}));
