import { create } from "zustand";

import { globalShortcuts } from "@/config/keyboardShortcuts";

export type Shortcut = { keys: string[]; action: () => void };

type KeyboardState = {
  lastPressedKey: string | null;
  pressedKeys: Set<string>;
  globalShortcuts: Shortcut[];
  localShortcuts: Shortcut[];
  setKeyPressed: (key: string, pressed: boolean) => void;
  setLocalShortcuts: (shortcuts: Shortcut[]) => void;
};

export const useKeyboardStore = create<KeyboardState>((set) => ({
  lastPressedKey: null,
  pressedKeys: new Set(),
  globalShortcuts,
  localShortcuts: [],
  setKeyPressed: (key, pressed) =>
    set(({ pressedKeys }) => {
      const newPressedKeys = new Set(pressedKeys);

      if (pressed) {
        newPressedKeys.add(key);
      } else {
        newPressedKeys.delete(key);
      }

      return {
        pressedKeys: newPressedKeys,
        lastPressedKey: pressed ? key : null,
      };
    }),
  setLocalShortcuts: (shortcuts) => set({ localShortcuts: shortcuts }),
}));
