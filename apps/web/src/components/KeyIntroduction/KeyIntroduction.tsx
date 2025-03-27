import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/ui/alert";
import { useEffect, useState } from "react";

import { useKeyboardStore } from "@/stores/useKeyboardStore";
import { useTypingStore } from "@/stores/useTypingStore";
import { findKeyCodeByChar } from "@/utils/keyboard";

import Key from "../Keyboard/Key";

const KeyIntroduction = () => {
  const { targetText } = useTypingStore();
  const { pressedKeys, isKeyPressed } = useKeyboardStore();

  const [isCorrect, setIsCorrect] = useState(false);
  const targetKey = targetText[0];

  useEffect(() => {
    if (isKeyPressed(findKeyCodeByChar(targetKey || "") || "")) {
      setIsCorrect(true);
    }
  }, [isKeyPressed, targetKey, pressedKeys]);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Alert>
        <AlertTitle className="flex items-center gap-2 py-1">
          <p>Introduction of key</p>
          <Key keyCode={findKeyCodeByChar(targetKey || "") || ""} isPressed={false} />
        </AlertTitle>
        <AlertDescription>Press the key {targetKey?.toUpperCase()} with your finger to continue!</AlertDescription>
      </Alert>
      <span
        className={`flex items-center justify-center rounded border-1 text-lg ${isCorrect ? "text-correct border-correct" : "text-keyboard-key-next border-keyboard-key-next"}`}
        style={{ width: 48, height: 48 }}
      >
        {targetKey?.toUpperCase()}
      </span>
    </div>
  );
};

export default KeyIntroduction;
