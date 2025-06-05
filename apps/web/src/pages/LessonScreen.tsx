import { Button } from '@repo/ui/components/ui/button';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import Keyboard from '@/components/Keyboard';
import KeyIntroduction from '@/components/KeyIntroduction';
import SequenceOfLetters from '@/components/SequenceOfLetters';
import TypingText from '@/components/TypingText';
import { useTypingStore } from '@/stores/useTypingStore';
import { LearningMode, Screen } from '@/utils/types';

const screenVariants = {
  hidden: { clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' },
  visible: { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' },
  exit: { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)' }
};

export default function LessonScreen({
  currentScreen,
  onScreenComplete
}: {
  currentScreen: Screen;
  onScreenComplete: () => void;
}) {
  const { isEndOfInputText } = useTypingStore();
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const onContinueButtonClick = () => {
    setIsExiting(true);
  };

  useEffect(() => {
    if (isEndOfInputText) {
      setIsButtonVisible(true);
    }
  }, [isEndOfInputText]);

  return (
    <LayoutGroup>
      <motion.div className="relative flex w-full flex-col items-center justify-center gap-6">
        <p className="absolute top-6 left-0">{currentScreen.order}</p>

        <AnimatePresence mode="wait">
          {!isExiting && (
            <motion.div
              key={currentScreen.order}
              layout="position"
              layoutId="lesson-screen"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={screenVariants}
              transition={{ duration: 0.4 }}
              onAnimationComplete={(definition) => {
                if (definition === 'exit') {
                  onScreenComplete();
                  setIsExiting(false);
                  setIsButtonVisible(false);
                }
              }}
              className="flex w-full items-center justify-center py-1"
            >
              {(() => {
                switch (currentScreen.type) {
                  case LearningMode.KEY_INTRODUCTION:
                    return <KeyIntroduction />;
                  case LearningMode.DEFAULT:
                    return <TypingText />;
                  case LearningMode.LETTER_SEQUENCE:
                    return <SequenceOfLetters />;
                  default:
                    return null;
                }
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div layoutId="keyboard" className="block">
          <Keyboard size="full" />
        </motion.div>

        <AnimatePresence mode="wait">
          {isButtonVisible && !isExiting && (
            <motion.div
              layoutId="continue-button"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={screenVariants}
              transition={{ duration: 0.4 }}
            >
              <Button onClick={onContinueButtonClick}>Continue</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  );
}
