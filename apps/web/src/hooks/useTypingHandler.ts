import { useEffect } from "react";

import { useKeyboardStore } from "@/stores/useKeyboardStore";
import { useTypingStore } from "@/stores/useTypingStore";

export function useTypingHandler() {
  const { lastPressedKey } = useKeyboardStore();
  const { addCharacter, removeCharacter } = useTypingStore();

  useEffect(() => {
    if (!lastPressedKey) return;

    if (lastPressedKey === "Backspace") {
      removeCharacter();
    } else if (lastPressedKey.length === 1) {
      addCharacter(lastPressedKey);
    }
  }, [lastPressedKey, addCharacter, removeCharacter]);
}
