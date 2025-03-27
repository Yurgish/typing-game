import { motion } from "framer-motion";

import { useLessonsScreensHandler } from "@/hooks/useLessonsScreensHandler";

import LessonScreen from "./LessonScreen";

const Lesson = () => {
  const { lesson, currentScreenIndex, handleScreenComplete } = useLessonsScreensHandler();

  return (
    <motion.div layout className="flex min-h-screen w-full flex-col items-center justify-center">
      {lesson && (
        <LessonScreen currentScreen={lesson.screens[currentScreenIndex]} onScreenComplete={handleScreenComplete} />
      )}
    </motion.div>
  );
};

export default Lesson;
