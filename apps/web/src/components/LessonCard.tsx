import { Button } from '@repo/ui/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@repo/ui/components/ui/hover-card';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';

import { useCurrentLessonStore } from '@/stores/useCurrentLessonStore';
import { formatTime } from '@/utils/metrics';
import { getScreenCustomId } from '@/utils/transformation';
import { LearningMode, Lesson, UserLessonProgressType } from '@/utils/types';

interface LessonCardProps {
  lesson: Lesson;
  index: number;
  lessonProgress?: UserLessonProgressType;
  isLessonAvailable?: boolean;
}

const LessonCard = ({ lesson, index, lessonProgress, isLessonAvailable }: LessonCardProps) => {
  const navigate = useNavigate();
  const { setCurrentLessonId, setCurrentScreenOrder } = useCurrentLessonStore();

  const navigateToScreen = (screenOrder: number) => {
    if (!isLessonAvailable) return;
    setCurrentLessonId(lesson.id);
    setCurrentScreenOrder(screenOrder);
    navigate(`/lesson/${lesson.id}`);
  };

  return (
    <div
      className={`relative w-[700px] overflow-hidden rounded-md border-2 transition-all duration-200 hover:shadow-(--key-shadow)`}
    >
      <div className="border-background h-full w-full overflow-hidden rounded-md border-2">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-base">
            {index + 1}. {lesson.title} {lessonProgress?.isCompleted && '(completed)'}
          </h1>
          {lessonProgress?.isCompleted ? (
            <Button variant="ghost" size="sm" onClick={() => navigateToScreen(1)}>
              Restart
            </Button>
          ) : lessonProgress?.screenMetrics.length ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateToScreen((lessonProgress?.currentScreenOrder ?? 0) + 1)}
            >
              Continue
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => navigateToScreen(1)}>
              Start
            </Button>
          )}
        </div>
        <div className="flex w-full gap-1">
          {lesson.screens.map((screen) => {
            const screenMetric = lessonProgress?.screenMetrics.find((sm) => sm.screenOrder === screen.order);

            return (
              <HoverCard key={screen.order}>
                <motion.div
                  className="bg-accent h-1 cursor-pointer"
                  whileHover={{ scaleY: 2, flex: 1.1 }}
                  initial={{ scaleY: 1, flex: 1 }}
                  onClick={() => navigateToScreen(screen.order)}
                >
                  <HoverCardTrigger
                    className={`flex h-full w-full ${screenMetric && 'bg-foreground'} `}
                  ></HoverCardTrigger>
                </motion.div>
                <HoverCardContent className="w-full px-3 py-1 text-xs">
                  <p>
                    {getScreenCustomId(lesson.order, screen.order)} {screenMetric && '(done)'}
                  </p>
                  <p>Mode: {screen.type}</p>
                  {screenMetric && screenMetric.screenType !== LearningMode.KEY_INTRODUCTION && (
                    <>
                      <hr className="my-1 border-gray-600" />
                      <p>wpm: {screenMetric.rawWPM?.toFixed(2)}</p>
                      <p>acc: {screenMetric.accuracy?.toFixed(2)}%</p>
                      <p>err: {screenMetric.errors}</p>
                      <p>time: {formatTime(screenMetric.timeTaken)}</p>
                    </>
                  )}
                </HoverCardContent>
              </HoverCard>
            );
          })}
        </div>
      </div>
      {!isLessonAvailable && (
        <div className="absolute inset-0 z-30 h-full w-full">
          <div className="bg-background h-full w-full opacity-80"></div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute top-1/2 left-1/2 mr-5 size-10 -translate-x-1/2 -translate-y-1/2"
          >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default LessonCard;
