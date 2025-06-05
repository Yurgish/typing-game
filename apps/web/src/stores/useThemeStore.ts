import { useEffect } from 'react';
import { create } from 'zustand';

type Theme = 'dark' | 'light' | 'system';

type ThemeStore = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: (localStorage.getItem('vite-ui-theme') as Theme) || 'system',
  setTheme: (theme) => {
    localStorage.setItem('vite-ui-theme', theme);
    set({ theme });
  }
}));

export function useApplyTheme() {
  const { theme } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);
}
