import { memo } from "react";

import Character from "./Character";

interface WordProps {
  word: string;
  typedWord: string;
  isCurrentWord: boolean;
  wordIndex: number;
  currentWordIndex: number;
  wordsLength: number;
}

const Word = memo(({ word, typedWord, isCurrentWord, wordIndex, wordsLength }: WordProps) => {
  const isWordWrong = !word.startsWith(typedWord);

  return (
    <div className={`word`}>
      {word.split("").map((char, charIndex) => {
        const typedChar = typedWord[charIndex];
        const isCurrent = isCurrentWord && charIndex === typedWord.length;

        return (
          <Character
            key={`${char}-${wordIndex}-${charIndex}`}
            char={char}
            typedChar={typedChar}
            isCurrent={isCurrent}
            className={`${isWordWrong ? "border-b-2 border-red-400" : ""}`}
          />
        );
      })}
      {wordIndex < wordsLength - 1 && (
        <Character
          key={`space-${wordIndex}`}
          char=" "
          typedChar={typedWord[typedWord.length]}
          isCurrent={isCurrentWord && typedWord.length === word.length}
        />
      )}
    </div>
  );
});

export default Word;
