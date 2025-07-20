import { useSubscription } from '@trpc/tanstack-react-query';
import { useLessonsScreensHandler } from '@web/hooks/useLessonsScreensHandler';
import { authClient } from '@web/lib/auth';
import { trpc } from '@web/utils/trpc';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import LessonScreen from './LessonScreen';

const Lesson = () => {
  const { data: session } = authClient.useSession();
  const { lesson, currentScreen, handleScreenComplete } = useLessonsScreensHandler();

  useSubscription(
    trpc.sse.onUserStatsUpdated.subscriptionOptions(
      { userId: session?.user.id ?? '' },
      {
        enabled: !!lesson?.id,
        onData: ({ data }) => {
          toast.success(`You earned ${data.xpEarned} points!`);
        },
        onError: (error) => {
          toast.error(`Error: ${error.message}`);
        }
      }
    )
  );
  return (
    <motion.div layout className="relative w-full">
      {lesson && currentScreen && (
        <LessonScreen currentScreen={currentScreen} onScreenComplete={handleScreenComplete} lesson={lesson} />
      )}
    </motion.div>
  );
};

export default Lesson;
