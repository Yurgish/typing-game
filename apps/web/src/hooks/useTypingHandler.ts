import { useEffect } from 'react';

import { useKeyboardStore } from '@/stores/useKeyboardStore';
import { useTypingMetricsStore } from '@/stores/useTypingMetricsStore';
import { useTypingStore } from '@/stores/useTypingStore';

export function useTypingHandler() {
  const { lastPressedKey } = useKeyboardStore();
  const { addCharacter, removeCharacter, targetText, inputText } = useTypingStore();
  const { incrementBackspaces, incrementErrors, addTypedCharacter } = useTypingMetricsStore();

  useEffect(() => {
    if (!lastPressedKey) return;

    if (lastPressedKey === 'Backspace') {
      removeCharacter();
      incrementBackspaces();
    } else if (lastPressedKey.length === 1 && targetText.length !== inputText.length) {
      addCharacter(lastPressedKey);

      const currentTargetChar = targetText[inputText.length];
      const isCorrect = lastPressedKey === currentTargetChar;

      addTypedCharacter(isCorrect);

      if (!isCorrect) {
        incrementErrors();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastPressedKey, addCharacter, removeCharacter, incrementBackspaces, incrementErrors, addTypedCharacter]);
}
