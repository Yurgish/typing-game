import { useTypingStore } from "@/stores/useTypingStore";

import Word from "./Word";

export default function TypingText() {
  const { targetText, inputText, currentWordIndex } = useTypingStore();

  const targetWords = targetText.split(" ");

  return (
    <div className="mb-4 flex max-w-[70%] flex-wrap text-4xl">
      {targetWords.map((word, wordIndex) => {
        const startIndex =
          wordIndex === 0 ? 0 : targetWords.slice(0, wordIndex).reduce((acc, w) => acc + w.length + 1, 0);
        const endIndex = startIndex + word.length + 1;
        const typedWord = inputText.slice(startIndex, endIndex);
        const isCurrentWord = inputText.length >= startIndex && inputText.length <= endIndex;

        return (
          <Word
            key={wordIndex}
            word={word + " "}
            typedWord={typedWord}
            isCurrentWord={isCurrentWord}
            wordIndex={wordIndex}
            currentWordIndex={currentWordIndex}
          />
        );
      })}
    </div>
  );
}
