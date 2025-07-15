import { create } from 'zustand';

type CurrentLessonState = {
  currentLessonId: string | null;
  currentScreenOrder: number | null;
  isLessonComplete: boolean;
};

type CurrentLessonActions = {
  setCurrentLessonId: (id: string) => void;
  setCurrentScreenOrder: (order: number) => void;
  setLessonComplete: (val: boolean) => void;
  resetLessonState: () => void;
};

const initialState: CurrentLessonState = {
  currentLessonId: null,
  currentScreenOrder: null,
  isLessonComplete: false
};

export const useCurrentLessonStore = create<CurrentLessonState & CurrentLessonActions>((set) => ({
  ...initialState,
  setCurrentLessonId: (id) => set({ currentLessonId: id, isLessonComplete: false }),
  setCurrentScreenOrder: (order) => set({ currentScreenOrder: order }),
  setLessonComplete: (val) => set({ isLessonComplete: val }),
  resetLessonState: () => set(initialState)
}));
