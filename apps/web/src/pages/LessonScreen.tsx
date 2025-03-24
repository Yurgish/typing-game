import { useEffect } from "react";

import Keyboard from "@/components/Keyboard/Keyboard";
import SequenceOfLetters from "@/components/SequenceOfLetters/SequenceOfLetters";
import TypingText from "@/components/TypingText/TypingText";
import { useTypingHandler } from "@/hooks/useTypingHandler";
import { useTypingStore } from "@/stores/useTypingStore";

export default function LessonScreen() {
  const { setTargetText } = useTypingStore();
  useTypingHandler();

  useEffect(() => {
    setTargetText("sdfsdf sdfsdf");
  }, [setTargetText]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <TypingText />
      <SequenceOfLetters />
      <Keyboard size="full" />
    </div>
  );
}
