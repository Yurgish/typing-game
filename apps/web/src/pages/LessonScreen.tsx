import { Button } from "@repo/ui/components/ui/button";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";

import Keyboard from "@/components/Keyboard/Keyboard";
import KeyIntroduction from "@/components/KeyIntroduction/KeyIntroduction";
import SequenceOfLetters from "@/components/SequenceOfLetters/SequenceOfLetters";
import TypingText from "@/components/TypingText/TypingText";
import { useTypingStore } from "@/stores/useTypingStore";

import { LearningModes } from "./Lessons";

const screenVariants = {
  hidden: { clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" },
  visible: { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" },
  exit: { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)" },
};

export default function LessonScreen({
  currentScreen,
  onScreenComplete,
}: {
  currentScreen: any;
  onScreenComplete: () => void;
}) {
  const { isEndOfInputText } = useTypingStore();

  return (
    <LayoutGroup>
      <motion.div className="flex w-full flex-col items-center justify-center gap-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen.id}
            layout="position"
            layoutId="lesson-screen"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={screenVariants}
            transition={{ duration: 0.4 }}
            className="flex w-full items-center justify-center py-1"
          >
            {(() => {
              switch (currentScreen.type) {
                case LearningModes.KEY_INTRODUCTION:
                  return <KeyIntroduction />;
                case LearningModes.DEFAULT:
                  return <TypingText />;
                case LearningModes.LETTER_SEQUENCE:
                  return <SequenceOfLetters />;
                default:
                  return null;
              }
            })()}
          </motion.div>
        </AnimatePresence>
        <motion.div layoutId="keyboard" className="block">
          <Keyboard size="full" />
        </motion.div>
        <AnimatePresence mode="wait">
          {isEndOfInputText && (
            <motion.div
              layoutId="continue-button"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={screenVariants}
              transition={{ duration: 0.4 }}
            >
              <Button onClick={onScreenComplete}>Continue</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  );
}
