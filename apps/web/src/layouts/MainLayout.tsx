import { Outlet } from 'react-router';

import { ThemeToggle } from '@/components/ThemeToggle';
import { useKeyboardHandler } from '@/hooks/useKeyboardHandler';
import { useApplyTheme } from '@/stores/useThemeStore';

export default function MainLayout() {
  useKeyboardHandler();
  useApplyTheme();

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="absolute top-0 right-0 z-10 flex items-center justify-end">
        <ThemeToggle />
      </div>
      <main className="container mx-auto flex-1">
        <Outlet />
      </main>
    </div>
  );
}
