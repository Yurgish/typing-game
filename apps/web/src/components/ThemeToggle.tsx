import { useThemeStore } from '@/stores/useThemeStore';

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? '🌞 Light Mode' : '🌙 Dark Mode'}
    </button>
  );
}
