import { useEffect } from "react";

import Keyboard from "@/components/Keyboard/Keyboard";
import SequenceOfLetters from "@/components/SequenceOfLetters/SequenceOfLetters";
import { ThemeToggle } from "@/components/ThemeToggle";
import TypingText from "@/components/TypingText/TypingText";
import { useTypingHandler } from "@/hooks/useTypingHandler";
import { useTypingStore } from "@/stores/useTypingStore";

export default function LessonScreen() {
  const { setTargetText } = useTypingStore();
  useTypingHandler();

  useEffect(() => {
    setTargetText("apple ukraine eat same with dead lock");
  }, [setTargetText]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <TypingText />
      <SequenceOfLetters />
      <Keyboard size="full" />
      <ThemeToggle />
    </div>
  );
}
