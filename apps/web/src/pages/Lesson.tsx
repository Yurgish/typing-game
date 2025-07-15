import { useLessonsScreensHandler } from '@web/hooks/useLessonsScreensHandler';
import { motion } from 'framer-motion';

import LessonScreen from './LessonScreen';

const Lesson = () => {
  const { lesson, currentScreen, handleScreenComplete } = useLessonsScreensHandler();

  return (
    <motion.div layout className="relative w-full">
      {lesson && currentScreen && (
        <LessonScreen currentScreen={currentScreen} onScreenComplete={handleScreenComplete} lesson={lesson} />
      )}
    </motion.div>
  );
};

export default Lesson;
