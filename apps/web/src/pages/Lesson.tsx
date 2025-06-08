import { motion } from 'framer-motion';

import { useLessonsScreensHandler } from '@/hooks/useLessonsScreensHandler';

import LessonScreen from './LessonScreen';

const Lesson = () => {
  const { lesson, currentScreen, handleScreenComplete } = useLessonsScreensHandler();

  return (
    <motion.div layout className="relative w-full">
      <h2 className="absolute top-0 left-0">{lesson?.title}</h2>

      {lesson && currentScreen && (
        <LessonScreen currentScreen={currentScreen} onScreenComplete={handleScreenComplete} lesson={lesson} />
      )}
    </motion.div>
  );
};

export default Lesson;
