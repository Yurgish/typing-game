import { create } from 'zustand';

import { calculateWPM } from '@/utils/metrics';
import { LearningMode } from '@/utils/types';

// --- State Types ---
export type ScreenMetricsData = {
  order: number;
  type: LearningMode;
  rawWPM: number;
  adjustedWPM: number;
  accuracy: number;
  backspaces: number;
  errors: number;
  timeTaken: number;
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
  totalTimeTaken: number;
  totalTypedCharacters: number;
  totalCorrectCharacters: number;
  screenMetrics: ScreenMetricsData[];
};

type TypingMetricsState = {
  screenStartTime: number | null;
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
  isScreenTimerRunning: boolean;
  screenCharacterMetrics: Map<string, { correctCount: number; errorCount: number }>;
};

type TypingMetricsActions = {
  startScreenTimer: () => void;
  resetScreenTimerState: () => void;
  incrementErrors: () => void;
  incrementBackspaces: () => void;
  addTypedCharacter: (isCorrect: boolean) => void;
  setCurrentScreenTargetTextLength: (length: number) => void;
  addScreenMetricsToLesson: (screenOrder: number, screenType: LearningMode) => ScreenMetricsData | null;
  resetScreenMetrics: () => void;
  resetLessonMetrics: (lessonId: string) => void;
  updateCalculatedScreenMetrics: () => void;
  updateTotalLessonMetrics: () => LessonMetricsData | null;
  addCharacterMetric: (character: string, isCorrect: boolean) => void;
};

// --- Initial State ---
const initialScreenMetricsState: Omit<TypingMetricsState, 'currentLessonMetrics'> = {
  screenStartTime: null,
  errors: 0,
  backspaces: 0,
  typedCharacters: 0,
  correctCharacters: 0,
  currentScreenTargetTextLength: 0,
  currentScreenRawWPM: 0,
  currentScreenAdjustedWPM: 0,
  currentScreenAccuracy: 0,
  currentScreenTimeTaken: 0,
  isScreenTimerRunning: false,
  screenCharacterMetrics: new Map()
};

const createInitialLessonMetrics = (lessonId: string): LessonMetricsData => ({
  lessonId,
  totalRawWPM: 0,
  totalAdjustedWPM: 0,
  totalAccuracy: 0,
  totalBackspaces: 0,
  totalErrors: 0,
  totalTimeTaken: 0,
  totalTypedCharacters: 0,
  totalCorrectCharacters: 0,
  screenMetrics: []
});

const getInitialTypingMetricsState = (): TypingMetricsState => ({
  ...initialScreenMetricsState,
  currentLessonMetrics: null
});

export const useTypingMetricsStore = create<TypingMetricsState & TypingMetricsActions>()((set, get) => ({
  ...getInitialTypingMetricsState(),

  startScreenTimer: () => set({ screenStartTime: Date.now(), isScreenTimerRunning: true }),
  resetScreenTimerState: () => set({ screenStartTime: null, isScreenTimerRunning: false }),

  incrementErrors: () => set((state) => ({ errors: state.errors + 1 })),
  incrementBackspaces: () => set((state) => ({ backspaces: state.backspaces + 1 })),

  addTypedCharacter: (isCorrect: boolean) => {
    if (get().currentScreenTargetTextLength === get().typedCharacters) return;
    set((state) => ({
      typedCharacters: state.typedCharacters + 1,
      correctCharacters: isCorrect ? state.correctCharacters + 1 : state.correctCharacters
    }));
    get().updateCalculatedScreenMetrics();
  },

  addCharacterMetric: (character: string, isCorrect: boolean) => {
    set((state) => {
      const updatedMetrics = new Map(state.screenCharacterMetrics);
      const currentCounts = updatedMetrics.get(character) || { correctCount: 0, errorCount: 0 };

      if (isCorrect) {
        currentCounts.correctCount++;
      } else {
        currentCounts.errorCount++;
      }

      updatedMetrics.set(character, currentCounts);
      return { screenCharacterMetrics: updatedMetrics };
    });
  },

  setCurrentScreenTargetTextLength: (length: number) => set({ currentScreenTargetTextLength: length }),

  updateCalculatedScreenMetrics: () => {
    set((state) => {
      if (!state.screenStartTime) return {};
      const timeElapsed = Date.now() - state.screenStartTime;
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

    if (!currentLessonMetrics || !screenStartTime) return null;

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

    const filteredMetrics = currentLessonMetrics.screenMetrics.filter((m) => m.order !== screenOrder);

    const updatedLessonMetrics: LessonMetricsData = {
      ...currentLessonMetrics,
      screenMetrics: [...filteredMetrics, metrics]
    };

    set({ currentLessonMetrics: updatedLessonMetrics });

    return metrics;
  },

  resetScreenMetrics: () => set(initialScreenMetricsState),

  resetLessonMetrics: (lessonId: string) => set({ currentLessonMetrics: createInitialLessonMetrics(lessonId) }),

  updateTotalLessonMetrics: () => {
    const state = get();

    if (!state.currentLessonMetrics) return null;

    const relevantScreens = state.currentLessonMetrics.screenMetrics;

    const count = relevantScreens.length;
    if (count === 0) return null;

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
    const updatedMetrics: LessonMetricsData = {
      ...state.currentLessonMetrics,
      totalRawWPM: parseFloat((sum.rawWPM / count).toFixed(2)),
      totalAdjustedWPM: parseFloat((sum.adjustedWPM / count).toFixed(2)),
      totalAccuracy: parseFloat((sum.accuracy / count).toFixed(2)),
      totalBackspaces: sum.backspaces,
      totalErrors: sum.errors,
      totalTimeTaken: sum.timeTaken,
      totalTypedCharacters: sum.typedCharacters,
      totalCorrectCharacters: sum.correctCharacters
    };
    set({ currentLessonMetrics: updatedMetrics });
    return updatedMetrics;
  }
}));
