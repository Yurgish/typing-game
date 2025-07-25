import { Tabs, TabsList, TabsTrigger } from '@repo/ui/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import LessonCard from '@web/components/LessonCard';
import { useSession } from '@web/lib/auth';
import { trpc } from '@web/utils/trpc';

export const Lessons = () => {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user.id;

  const { data: lessons, isLoading: isLoadingLessons } = useQuery({
    ...trpc.lesson.getAll.queryOptions(),
    staleTime: 1000 * 60 * 10
  });

  const { data: allUserProgress, isLoading: isLoadingProgress } = useQuery({
    ...trpc.lessonProgress.getAllUserProgress.queryOptions(),
    enabled: isAuthenticated
  });

  const { data: lastCompletedLessonProgress, isLoading: isLoadingLastLesson } = useQuery({
    ...trpc.lessonProgress.getLastLessonByOrder.queryOptions(),
    enabled: isAuthenticated
  });

  if (isLoadingLessons || isLoadingProgress || isLoadingLastLesson) {
    return <div>Loading lessons...</div>;
  }

  const lastCompletedLessonOrder = lastCompletedLessonProgress?.lesson?.order ?? 0;

  return (
    lessons && (
      <div className="no-scrollbar h-full max-h-screen overflow-auto py-40">
        <Tabs className="mb-6 flex w-full items-center justify-center" defaultValue="BEGGINER">
          <TabsList>
            <TabsTrigger value="BEGGINER">BEGGINER</TabsTrigger>
            <TabsTrigger value="INTERMEDIATE">INTERMEDIATE</TabsTrigger>
            <TabsTrigger value="ADVANCED">ADVANCED</TabsTrigger>
          </TabsList>
        </Tabs>
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
