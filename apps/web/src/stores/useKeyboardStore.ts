import { create } from "zustand";

import { globalShortcuts } from "@/config/keyboardShortcuts";

export const SPECIAL_KEYS = new Set(["shift", "control", "alt", "meta", "space", "enter", "backspace"]);

export type Shortcut = { keyCodes: string[]; action: () => void };

type KeyboardState = {
  lastPressedKey: string | null;
  pressedKeys: Map<string, string>;
  globalShortcuts: Shortcut[];
  localShortcuts: Shortcut[];
  isKeyPressed: (key: string) => boolean;
  setKeyPressed: (code: string, key: string, pressed: boolean) => void;
  setLocalShortcuts: (shortcuts: Shortcut[]) => void;
};

export const useKeyboardStore = create<KeyboardState>((set, get) => ({
  lastPressedKey: null,
  pressedKeys: new Map(),
  globalShortcuts,
  localShortcuts: [],
  isKeyPressed: (key: string) => get().pressedKeys.has(key),
  setKeyPressed: (code, key, pressed) =>
    set(({ pressedKeys }) => {
      const newPressedKeys = new Map(pressedKeys);

      if (pressed) {
        newPressedKeys.set(code, key);
      } else {
        newPressedKeys.delete(code);
      }

      return {
        pressedKeys: newPressedKeys,
        lastPressedKey: pressed ? key : null,
      };
    }),
  setLocalShortcuts: (shortcuts) => set({ localShortcuts: shortcuts }),
}));
