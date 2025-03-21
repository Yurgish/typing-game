import { Outlet } from "react-router";

import { useKeyboardHandler } from "@/hooks/useKeyboardHandler";

export default function MainLayout() {
  useKeyboardHandler();

  return (
    <div className="flex min-h-screen flex-col">
      <main className="container mx-auto flex-1">
        <Outlet />
      </main>
    </div>
  );
}
