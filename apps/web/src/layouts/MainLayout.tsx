import LoginButton from '@web/components/LoginButton';
import { ThemeToggle } from '@web/components/ThemeToggle';
import { useKeyboardHandler } from '@web/hooks/useKeyboardHandler';
import { useApplyTheme } from '@web/stores/useThemeStore';
import { Outlet } from 'react-router';

export default function MainLayout() {
  useKeyboardHandler();
  useApplyTheme();

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="absolute top-10 right-10 z-10 flex items-center justify-end gap-4">
        <ThemeToggle /> <LoginButton />
      </div>
      <main className="container mx-auto flex-1">
        <div className="flex min-h-screen w-full flex-col items-center justify-center">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
