import { create } from 'zustand';

type ScreenLink = {
  lessonId: string;
  screenId: number;
};

type ScreenLinkStore = {
  currentLink: ScreenLink | null;
  setCurrentLink: (link: ScreenLink) => void;
};

export const useScreenLinkStore = create<ScreenLinkStore>((set) => ({
  currentLink: null,
  setCurrentLink: (link) => set({ currentLink: link })
}));
