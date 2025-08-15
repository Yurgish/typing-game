import { useKeyboardStore } from '@web/stores/useKeyboardStore';
import { useTypingMetricsStore } from '@web/stores/useTypingMetricsStore';
import { useTypingStore } from '@web/stores/useTypingStore';
import { useEffect } from 'react';

/**
 * Custom hook that handles typing logic for a typing application.
 *
 * Integrates with keyboard, typing, and metrics stores to process user input,
 * track typing statistics, and manage timers.
 *
 * - Handles character addition and removal based on key presses.
 * - Tracks backspaces, errors, and typed characters.
 * - Starts a timer when typing begins.
 * - Updates character metrics for each typed character.
 */
export function useTypingHandler() {
  const { lastPressedKey } = useKeyboardStore();

  const { addCharacter, removeCharacter, targetText, inputText, isEndOfInputText } = useTypingStore();
  const {
    incrementBackspaces,
    incrementErrors,
    addTypedCharacter,
    startScreenTimer,
    isScreenTimerRunning,
    addCharacterMetric
  } = useTypingMetricsStore();

  useEffect(() => {
    if (!lastPressedKey || isEndOfInputText) return;

    if (lastPressedKey === 'Backspace') {
      removeCharacter();
      incrementBackspaces();
    } else if (lastPressedKey.length === 1 && targetText.length !== inputText.length) {
      addCharacter(lastPressedKey);

      const currentTargetChar = targetText[inputText.length];
      const isCorrect = lastPressedKey === currentTargetChar;

      addTypedCharacter(isCorrect);

      if (currentTargetChar) {
        addCharacterMetric(currentTargetChar, isCorrect);
      }

      if (!isCorrect) {
        incrementErrors();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastPressedKey, addCharacter, removeCharacter, incrementBackspaces, incrementErrors, addTypedCharacter]);

  useEffect(() => {
    if (!lastPressedKey || isEndOfInputText) return;

    if (!isScreenTimerRunning && lastPressedKey !== 'Backspace') {
      startScreenTimer();
    }
  }, [isEndOfInputText, isScreenTimerRunning, lastPressedKey, startScreenTimer]);
}
