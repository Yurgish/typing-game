import { motion } from 'framer-motion';

import { useTypingStore } from '@/stores/useTypingStore';

const letterGap = 8;
const letterWidth = 48;
const containerWidth = 800;

const SequenceOfLetters = () => {
  const { targetText, nextCharIndex, inputText } = useTypingStore();

  const variants = {
    base: { x: -((nextCharIndex ?? 0) * (letterWidth + letterGap)) + containerWidth / 2 - letterWidth / 2 }
  };

  return (
    <div className="relative flex w-full overflow-hidden" style={{ width: containerWidth }}>
      <motion.div
        className="flex"
        style={{ gap: letterGap }}
        variants={variants}
        initial="base"
        animate="base"
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        {Array.from(targetText).map((letter, index) => {
          const isTyped = index < (nextCharIndex ?? 0);
          const typedChar = inputText[index] || '';
          const isCorrect = isTyped && typedChar === letter;
          const isWrong = isTyped && typedChar !== letter;

          return (
            <span
              key={index}
              className={`border-border flex items-center justify-center rounded border-1 text-lg ${index === (nextCharIndex ?? 0) ? 'text-keyboard-key-next border-keyboard-key-next' : ''} ${isCorrect ? 'text-correct border-correct' : ''} ${isWrong ? 'text-error border-error' : ''} `}
              style={{ width: letterWidth, height: 48 }}
            >
              {letter.toUpperCase()}
            </span>
          );
        })}
      </motion.div>
    </div>
  );
};

export default SequenceOfLetters;
