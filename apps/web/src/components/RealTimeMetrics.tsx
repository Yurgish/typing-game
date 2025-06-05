import { HoverCard, HoverCardContent, HoverCardTrigger } from '@repo/ui/components/ui/hover-card';
import { motion } from 'framer-motion';
import React from 'react';

import { useTypingMetricsStore } from '@/stores/useTypingMetricsStore';
import { useTypingStore } from '@/stores/useTypingStore';
import { formatTime } from '@/utils/metrics';

interface RealTimeMetricsProps {
  screensInLesson: number;
  currentScreenOrder: number;
}

const RealTimeMetrics: React.FC<RealTimeMetricsProps> = React.memo(({ screensInLesson, currentScreenOrder }) => {
  const {
    errors,
    backspaces,
    typedCharacters,
    correctCharacters,
    currentScreenRawWPM,
    currentScreenAdjustedWPM,
    currentScreenAccuracy,
    currentScreenTimeTaken
  } = useTypingMetricsStore();

  const isEndOfInputText = useTypingStore((s) => s.isEndOfInputText);

  const displayScreenOrder = isEndOfInputText ? currentScreenOrder + 1 : currentScreenOrder;

  const progress = ((displayScreenOrder - 1) / screensInLesson) * 100;

  return (
    <div className="flex flex-col justify-center gap-2">
      <div className="">Lesson Progress:</div>
      <div className="border-foreground h-3 w-full overflow-hidden border-2">
        <motion.div
          className="bg-foreground border-background h-full border-2"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
      </div>
      <HoverCard>
        <HoverCardTrigger className="cursor-pointer">
          Characters: {correctCharacters}/{typedCharacters}/{errors}/{backspaces}
        </HoverCardTrigger>
        <HoverCardContent className="flex items-center justify-center px-3 py-1 text-xs">
          correct/typed/errors/backspaces
        </HoverCardContent>
      </HoverCard>
      <HoverCard>
        <HoverCardTrigger className="cursor-pointer">Raw WPM: {currentScreenRawWPM}</HoverCardTrigger>
        <HoverCardContent className="flex w-full items-center justify-center px-3 py-1 text-xs">
          Speed without errors
        </HoverCardContent>
      </HoverCard>

      <HoverCard>
        <HoverCardTrigger className="cursor-pointer">Adjusted WPM: {currentScreenAdjustedWPM}</HoverCardTrigger>
        <HoverCardContent className="flex w-full items-center justify-center px-3 py-1 text-xs">
          Speed adjusted for accuracy
        </HoverCardContent>
      </HoverCard>

      <HoverCard>
        <HoverCardTrigger className="cursor-pointer">Accuracy: {currentScreenAccuracy}%</HoverCardTrigger>
        <HoverCardContent className="flex w-full items-center justify-center px-3 py-1 text-xs">
          Percent correct characters
        </HoverCardContent>
      </HoverCard>

      <HoverCard>
        <HoverCardTrigger className="cursor-pointer">Time Taken: {formatTime(currentScreenTimeTaken)}</HoverCardTrigger>
        <HoverCardContent className="flex w-full items-center justify-center px-3 py-1 text-xs">
          Time spent on screen
        </HoverCardContent>
      </HoverCard>
    </div>
  );
});

export default RealTimeMetrics;
