import { useEffect } from "react";

import { useKeyboardStore } from "@/store/useKeyboardStore";

export function useKeyboardHandler(
  ref?: React.RefObject<HTMLElement>,
  localShortcuts?: { keys: string[]; action: () => void }[],
) {
  const {
    setKeyPressed,
    pressedKeys,
    globalShortcuts,
    setLocalShortcuts,
    localShortcuts: storedLocalShortcuts,
  } = useKeyboardStore();

  useEffect(() => {
    if (localShortcuts) setLocalShortcuts(localShortcuts);
    const target = ref?.current || document.body;

    const handleKeyDown = (event: KeyboardEvent) => {
      setKeyPressed(event.key, true);
      const activeShortcuts =
        storedLocalShortcuts.length > 0
          ? storedLocalShortcuts
          : globalShortcuts;

      activeShortcuts.forEach(({ keys, action }) => {
        const shortcutKeysSet = new Set(keys);
        const pressedKeysSet = new Set([...pressedKeys, event.key]);

        const isShortcutValid = keys.every((key) => pressedKeysSet.has(key));

        const hasExtraKeys =
          pressedKeysSet.size > shortcutKeysSet.size ||
          [...pressedKeysSet].some((key) => !shortcutKeysSet.has(key));

        if (isShortcutValid && !hasExtraKeys) {
          action();
        }
      });
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      setKeyPressed(event.key, false);
    };

    target.addEventListener("keydown", handleKeyDown);
    target.addEventListener("keyup", handleKeyUp);

    return () => {
      target.removeEventListener("keydown", handleKeyDown);
      target.removeEventListener("keyup", handleKeyUp);
      if (localShortcuts) setLocalShortcuts([]);
    };
  }, [
    ref,
    setKeyPressed,
    pressedKeys,
    globalShortcuts,
    localShortcuts,
    setLocalShortcuts,
    storedLocalShortcuts,
  ]);
}
