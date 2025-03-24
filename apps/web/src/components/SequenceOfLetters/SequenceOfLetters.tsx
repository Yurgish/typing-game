import { motion } from "framer-motion";

import { useTypingStore } from "@/stores/useTypingStore";

const SequenceOfLetters = () => {
  const { targetText, nextCharIndex } = useTypingStore();
  const letterGap = 8;
  const letterWidth = 48;
  const containerWidth = 300;

  const variants = {
    base: { x: -(nextCharIndex * (letterWidth + letterGap)) + containerWidth / 2 - letterWidth / 2 },
  };

  return (
    <div className="relative flex w-full overflow-hidden" style={{ width: containerWidth }}>
      <motion.div
        className="flex"
        style={{ gap: letterGap }}
        variants={variants}
        initial="base"
        animate="base"
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        {Array.from(targetText).map((letter, index) => (
          <span
            key={index}
            className={`flex items-center justify-center rounded border text-lg ${index === nextCharIndex ? "text-blue-500" : ""}`}
            style={{ width: letterWidth, height: 48 }}
          >
            {letter.toUpperCase()}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default SequenceOfLetters;
