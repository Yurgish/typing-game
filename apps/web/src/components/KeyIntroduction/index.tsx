import { Alert, AlertDescription, AlertTitle } from '@repo/ui/components/ui/alert';
import { useKeyboardStore } from '@web/stores/useKeyboardStore';
import { useTypingStore } from '@web/stores/useTypingStore';
import { findKeyCodeByChar } from '@web/utils/keyboard';
import { useEffect, useState } from 'react';

import Key from '../Keyboard/Key';

const KeyIntroduction = () => {
  const { targetText } = useTypingStore();
  const { pressedKeys, isKeyPressed } = useKeyboardStore();

  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    if (isKeyPressed(findKeyCodeByChar(targetText || '') || '')) {
      setIsCorrect(true);
    }
  }, [isKeyPressed, targetText, pressedKeys]);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Alert>
        <AlertTitle className="flex items-center gap-2 py-1">
          <p>Introduction of key</p>
          <Key keyCode={findKeyCodeByChar(targetText || '') || ''} isPressed={false} />
        </AlertTitle>
        <AlertDescription>Press the key {targetText?.toUpperCase()} with your finger to continue!</AlertDescription>
      </Alert>
      <span
        className={`flex items-center justify-center rounded border-1 text-lg ${isCorrect ? 'text-correct border-correct' : 'text-keyboard-key-next border-keyboard-key-next'}`}
        style={{ width: 48, height: 48 }}
      >
        {targetText?.toUpperCase()}
      </span>
    </div>
  );
};

export default KeyIntroduction;
