// stores/useTypingMetricsStore.ts
import { create } from 'zustand';

import { calculateWPM } from '@/utils/metrics';

export type ScreenMetricsData = {
  screenId: number;
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

  addScreenMetricsToLesson: () => void;
  resetScreenMetrics: () => void;
  resetLessonMetrics: (lessonId: string) => void;
  updateCalculatedScreenMetrics: () => void;
  updateTotalLessonMetrics: (totalLessonTargetTextLength: number) => void;
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

  addScreenMetricsToLesson: () => {
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
      screenId: currentLessonMetrics.screenMetrics.length + 1,
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
        screenMetrics: []
      },
      lessonStartTime: null
    }),

  updateTotalLessonMetrics: (totalLessonTargetTextLength: number) =>
    set((state) => {
      if (!state.currentLessonMetrics) return state;

      const { screenMetrics } = state.currentLessonMetrics;

      const totalTimeTaken = screenMetrics.reduce((sum, sm) => sum + sm.timeTaken, 0);
      const totalErrors = screenMetrics.reduce((sum, sm) => sum + sm.errors, 0);
      const totalBackspaces = screenMetrics.reduce((sum, sm) => sum + sm.backspaces, 0);
      const totalTypedCharacters = screenMetrics.reduce((sum, sm) => sum + sm.typedCharacters, 0);
      const totalCorrectCharacters = screenMetrics.reduce((sum, sm) => sum + sm.correctCharacters, 0);

      const { rawWPM, adjustedWPM, accuracy } = calculateWPM(
        totalTypedCharacters,
        totalCorrectCharacters,
        totalTimeTaken,
        totalLessonTargetTextLength
      );

      return {
        currentLessonMetrics: {
          ...state.currentLessonMetrics,
          totalRawWPM: rawWPM,
          totalAdjustedWPM: adjustedWPM,
          totalAccuracy: accuracy,
          totalBackspaces,
          totalErrors,
          totalTimeTaken
        }
      };
    })
}));
