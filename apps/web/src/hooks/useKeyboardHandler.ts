import { Shortcut, useKeyboardStore } from '@web/stores/useKeyboardStore';
import { useEffect } from 'react';

function isShortcutPressed(
  shortcutKeys: string[],
  pressedKeys: Map<string, string>,
  lastPressedKeyCode: string
): boolean {
  const shortcutSet = new Set(shortcutKeys);
  const pressedKeyCodes = new Set([...pressedKeys.keys(), lastPressedKeyCode]);

  const allKeysPressed = shortcutKeys.every((key) => pressedKeyCodes.has(key));

  const hasNoExtraKeys = Array.from(pressedKeyCodes).every((key) => shortcutSet.has(key));

  return allKeysPressed && hasNoExtraKeys;
}

export function useKeyboardHandler(ref?: React.RefObject<HTMLElement>, localShortcuts?: Shortcut[]): void {
  const {
    setKeyPressed,
    pressedKeys,
    globalShortcuts,
    setLocalShortcuts,
    localShortcuts: storedLocalShortcuts
  } = useKeyboardStore();

  useEffect(() => {
    if (localShortcuts) setLocalShortcuts(localShortcuts);

    const target = ref?.current || document.body;

    const handleKeyDown = (event: KeyboardEvent) => {
      setKeyPressed(event.code, event.key, true);

      const activeShortcuts = storedLocalShortcuts.length > 0 ? storedLocalShortcuts : globalShortcuts;

      activeShortcuts.forEach(({ keyCodes, action }) => {
        if (isShortcutPressed(keyCodes, pressedKeys, event.code)) {
          action();
        }
      });
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      setKeyPressed(event.code, event.key, false);
    };

    target.addEventListener('keydown', handleKeyDown);
    target.addEventListener('keyup', handleKeyUp);

    return () => {
      target.removeEventListener('keydown', handleKeyDown);
      target.removeEventListener('keyup', handleKeyUp);
      if (localShortcuts) setLocalShortcuts([]);
    };
  }, [ref, setKeyPressed, pressedKeys, globalShortcuts, setLocalShortcuts, storedLocalShortcuts, localShortcuts]);
}
