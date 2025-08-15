import { Toaster } from '@repo/ui/components/ui/sonner';
import HeadersButtons from '@web/components/HeadersButtons';
import { useKeyboardHandler } from '@web/hooks/useKeyboardHandler';
import { useApplyTheme } from '@web/stores/useThemeStore';
import { Outlet } from 'react-router';

export default function MainLayout() {
  useKeyboardHandler();
  useApplyTheme();

  return (
    <div className="relative flex min-h-screen flex-col">
      <Toaster expand={true} />
      <HeadersButtons />
      <main className="container mx-auto flex-1">
        <div className="flex min-h-screen w-full flex-col items-center justify-center">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
