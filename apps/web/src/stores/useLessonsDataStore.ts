import { create } from 'zustand';

import { Lesson } from '@/utils/types';

type LessonsDataState = {
  lessons: Lesson[];
  setLessons: (lessons: Lesson[]) => void;
};

export const useLessonsDataStore = create<LessonsDataState>((set) => ({
  lessons: [],
  setLessons: (lessons) => set({ lessons })
}));
