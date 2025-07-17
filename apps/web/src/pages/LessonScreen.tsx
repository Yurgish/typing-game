import { Button } from '@repo/ui/components/ui/button';
import Keyboard from '@web/components/Keyboard';
import KeyIntroduction from '@web/components/KeyIntroduction';
import RealTimeMetrics from '@web/components/RealTimeMetrics';
import SequenceOfLetters from '@web/components/SequenceOfLetters';
import TypingText from '@web/components/TypingText';
import { useTypingMetricsStore } from '@web/stores/useTypingMetricsStore';
import { useTypingStore } from '@web/stores/useTypingStore';
import { LearningMode, Lesson, Screen } from '@web/utils/types';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const screenVariants = {
  hidden: { clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' },
  visible: { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' },
  exit: { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)' }
};

export default function LessonScreen({
  currentScreen,
  onScreenComplete,
  lesson
}: {
  currentScreen: Screen;
  onScreenComplete: () => void;
  lesson: Lesson;
}) {
  const isEndOfInputText = useTypingStore((s) => s.isEndOfInputText);
  const screenStartTime = useTypingMetricsStore((s) => s.screenStartTime);
  const updateCalculatedScreenMetrics = useTypingMetricsStore((s) => s.updateCalculatedScreenMetrics);
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

  useEffect(() => {
    if (!screenStartTime) return;

    const interval = setInterval(() => {
      updateCalculatedScreenMetrics();
    }, 1000);

    if (isEndOfInputText) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isEndOfInputText, screenStartTime, updateCalculatedScreenMetrics]);

  if (!lesson) return null;

  return (
    <LayoutGroup>
      <motion.div className="relative flex w-full flex-col items-center justify-center gap-6">
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

        <motion.div layoutId="keyboard" className="relative flex items-center justify-center">
          <Keyboard size="full" />
          <div className="absolute left-full ml-8 w-3/6">
            <RealTimeMetrics screensInLesson={lesson.screens.length} currentScreenOrder={currentScreen.order} />
          </div>
          <div className="absolute top-6 -left-full ml-20 w-full">
            <h1 className="text-2xl">
              Lesson {lesson.order} -&gt; {lesson.title}
            </h1>
            <p className="text-xl">Screen {currentScreen.order}</p>
          </div>
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
