import { create } from 'zustand';

import { Lesson, Screen } from '@/utils/types';

import { useLessonsDataStore } from './useLessonsDataStore';

type CurrentLessonState = {
  currentLessonId: string | null;
  currentScreenOrder: number | null;
  isLessonComplete: boolean;

  setCurrentLessonId: (id: string) => void;
  setCurrentScreenOrder: (order: number) => void;
  setLessonComplete: (val: boolean) => void;
  resetLessonState: () => void;

  getLessonById: (id: string) => Lesson | undefined;
  getCurrentLesson: () => Lesson | undefined;
  getCurrentScreen: () => Screen | undefined;

  getNextLesson: () => Lesson | undefined;
};

export const useCurrentLessonStore = create<CurrentLessonState>((set, get) => ({
  currentLessonId: null,
  currentScreenOrder: null,
  isLessonComplete: false,

  setCurrentLessonId: (id) => set({ currentLessonId: id, isLessonComplete: false }),
  setCurrentScreenOrder: (order) => set({ currentScreenOrder: order }),
  setLessonComplete: (val) => set({ isLessonComplete: val }),
  resetLessonState: () => set({ currentLessonId: null, currentScreenOrder: null, isLessonComplete: false }),

  getLessonById: (id) => {
    const lessons = useLessonsDataStore.getState().lessons;
    return lessons.find((l) => l.id === id);
  },
  getCurrentLesson: () => {
    const { currentLessonId } = get();
    const lessons = useLessonsDataStore.getState().lessons;
    return lessons.find((l) => l.id === currentLessonId);
  },
  getCurrentScreen: () => {
    const lesson = get().getCurrentLesson();
    const order = get().currentScreenOrder;
    return lesson?.screens.find((s) => s.order === order);
  },

  getNextLesson: () => {
    const { currentLessonId } = get();
    if (!currentLessonId) return undefined;

    const lessons = useLessonsDataStore.getState().lessons;
    const currentLesson = lessons.find((l) => l.id === currentLessonId);
    if (!currentLesson) return undefined;

    return lessons
      .filter((l) => l.difficulty === currentLesson.difficulty && l.order > currentLesson.order)
      .sort((a, b) => a.order - b.order)[0];
  }
}));
