import { create } from 'zustand';

type CurrentLessonState = {
  currentLessonId: string | null;
  currentScreenOrder: number | null;
  isLessonComplete: boolean;
  setCurrentLessonId: (id: string) => void;
  setCurrentScreenOrder: (order: number) => void;
  setLessonComplete: (val: boolean) => void;
  resetLessonState: () => void;
};

export const useCurrentLessonStore = create<CurrentLessonState>((set) => ({
  currentLessonId: null,
  currentScreenOrder: null,
  isLessonComplete: false,
  currentLessonData: null,

  setCurrentLessonId: (id) => set({ currentLessonId: id, isLessonComplete: false }),
  setCurrentScreenOrder: (order) => set({ currentScreenOrder: order }),
  setLessonComplete: (val) => set({ isLessonComplete: val }),
  resetLessonState: () => set({ currentLessonId: null, currentScreenOrder: null, isLessonComplete: false })
}));
