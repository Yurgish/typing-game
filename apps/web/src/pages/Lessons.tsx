import { useQuery } from '@tanstack/react-query';

import LessonCard from '@/components/LessonCard';
import { trpc } from '@/utils/trpc';

const Lessons = () => {
  const { data: lessons, isLoading: isLoadingLessons } = useQuery({
    ...trpc.lesson.getAll.queryOptions(),
    staleTime: 1000 * 60 * 10
  });

  const { data: allUserProgress, isLoading: isLoadingProgress } = useQuery(
    trpc.userProgress.getAllUserProgress.queryOptions()
  );

  const { data: lastCompletedLessonProgress, isLoading: isLoadingLastLesson } = useQuery(
    trpc.userProgress.getLastLessonByOrder.queryOptions()
  );

  if (isLoadingLessons || isLoadingProgress || isLoadingLastLesson) {
    return <div>Loading lessons...</div>;
  }

  const lastCompletedLessonOrder = lastCompletedLessonProgress?.lesson?.order ?? 0;

  return (
    lessons && (
      <div>
        <ul className="flex flex-col gap-4">
          {lessons.map((lesson, index) => {
            const lessonProgress = allUserProgress?.find((progress) => progress.lessonId === lesson.id);

            const isLessonAvailable = lessonProgress?.isCompleted || lesson.order <= lastCompletedLessonOrder + 1;

            return (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                index={index}
                lessonProgress={lessonProgress}
                isLessonAvailable={isLessonAvailable}
              />
            );
          })}
        </ul>
      </div>
    )
  );
};

export default Lessons;
