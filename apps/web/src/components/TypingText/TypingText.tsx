import { useEffect } from "react";

import { useTypingStore } from "@/stores/useTypingStore";

import Word from "./Word";

export default function TypingText() {
  const { targetText, inputText, currentWordIndex } = useTypingStore();

  const targetWords = targetText.split(" ");

  useEffect(() => {
    console.log(inputText);
  }, [inputText]);

  return (
    <div className="mb-4 flex max-w-[70%] flex-wrap text-4xl">
      {targetWords.map((word, wordIndex) => {
        const startIndex = targetWords.slice(0, wordIndex).join(" ").length + (wordIndex > 0 ? 1 : 0);
        const endIndex = startIndex + word.length;
        const typedWord = inputText.slice(startIndex, endIndex);
        const isCurrentWord = inputText.length >= startIndex && inputText.length <= endIndex;

        return (
          <Word
            key={wordIndex}
            word={word}
            typedWord={typedWord}
            isCurrentWord={isCurrentWord}
            wordIndex={wordIndex}
            currentWordIndex={currentWordIndex}
            wordsLength={targetWords.length}
          />
        );
      })}
    </div>
  );
}
