import { memo } from 'react';

import Character from './Character';

interface WordProps {
  word: string;
  typedWord: string;
  isCurrentWord: boolean;
  wordIndex: number;
  currentWordIndex: number;
}

const Word = memo(({ word, typedWord, isCurrentWord, wordIndex }: WordProps) => {
  const isWordWrong = !word.slice(0, -1).startsWith(typedWord.slice(0, -1));
  const isSpaceWrong = typedWord.length === word.length && typedWord[typedWord.length - 1] !== ' ';

  return (
    <div data-word-index={wordIndex} data-word-length={word.length} data-word={word}>
      {word
        .slice(0, -1)
        .split('')
        .map((char: string, charIndex: number) => {
          const typedChar = typedWord[charIndex];
          const isCurrent = isCurrentWord && charIndex === typedWord.length;

          return (
            <Character
              key={`${char}-${wordIndex}-${charIndex}`}
              char={char}
              typedChar={typedChar}
              isCurrent={isCurrent}
              className={`${isWordWrong ? 'border-error border-b-2' : ''}`}
            />
          );
        })}

      <Character
        key={`space-${wordIndex}`}
        char=" "
        typedChar={typedWord[typedWord.length]}
        isCurrent={isCurrentWord && typedWord.length === word.length - 1}
        className={`${isSpaceWrong ? 'bg-error-background' : ''}`}
      />
    </div>
  );
});

export default Word;
