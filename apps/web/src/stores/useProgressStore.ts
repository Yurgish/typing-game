import { create } from 'zustand';

import { localStorageWrapper as storage } from '@/utils/localStorage';

type Progress = {
  lessons: Record<string, { started: boolean; completedScreens: string[] }>;
  lastLessonId: string | null;
  lastScreenId: string | null;
};

type ProgressStore = Progress & {
  startLesson: (lessonId: string) => void;
  completeScreen: (lessonId: string, screenId: string) => void;
  setLastScreen: (lessonId: string, screenId: string) => void;
  resetProgress: () => void;
};

const LOCAL_STORAGE_KEY = 'lessonProgress';

const loadProgress = (): Progress =>
  storage.get(LOCAL_STORAGE_KEY, { lessons: {}, lastLessonId: null, lastScreenId: null });

export const useProgressStore = create<ProgressStore>((set) => ({
  ...loadProgress(),

  startLesson: (lessonId) =>
    set((state) => {
      const newState = {
        ...state,
        lessons: {
          ...state.lessons,
          [lessonId]: { started: true, completedScreens: state.lessons[lessonId]?.completedScreens || [] }
        }
      };
      storage.set(LOCAL_STORAGE_KEY, newState);
      return newState;
    }),

  completeScreen: (lessonId, screenId) =>
    set((state) => {
      const lesson = state.lessons[lessonId] || { started: true, completedScreens: [] };
      if (!lesson.completedScreens.includes(screenId)) {
        lesson.completedScreens.push(screenId);
      }

      const newState = {
        ...state,
        lessons: {
          ...state.lessons,
          [lessonId]: lesson
        }
      };

      storage.set(LOCAL_STORAGE_KEY, newState);
      return newState;
    }),

  setLastScreen: (lessonId, screenId) =>
    set((state) => {
      const newState = { ...state, lastLessonId: lessonId, lastScreenId: screenId };
      storage.set(LOCAL_STORAGE_KEY, newState);
      return newState;
    }),

  resetProgress: () =>
    set(() => {
      storage.remove(LOCAL_STORAGE_KEY);
      return { lessons: {}, lastLessonId: null, lastScreenId: null };
    })
}));
