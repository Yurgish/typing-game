import { Tabs, TabsList, TabsTrigger } from '@repo/ui/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import LessonCard from '@web/components/LessonCard';
import { useSession } from '@web/lib/auth';
import { trpc } from '@web/utils/trpc';
import { LessonDifficulty } from '@web/utils/types';
import { useState } from 'react';

export const Lessons = () => {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user.id;

  const [difficulty, setDifficulty] = useState<LessonDifficulty>(LessonDifficulty.BEGINNER);

  const { data: lessons, isLoading: isLoadingLessons } = useQuery({
    ...trpc.lesson.getByDifficulty.queryOptions({ difficulty }),
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
    <div className="no-scrollbar h-full max-h-screen overflow-auto py-40">
      <Tabs
        className="mb-6 flex w-full items-center justify-center"
        defaultValue={difficulty}
        value={difficulty}
        onValueChange={(value) => setDifficulty(value as LessonDifficulty)}
      >
        <TabsList>
          <TabsTrigger value={LessonDifficulty.BEGINNER}>BEGINNER</TabsTrigger>
          <TabsTrigger value={LessonDifficulty.INTERMEDIATE}>INTERMEDIATE</TabsTrigger>
          <TabsTrigger value={LessonDifficulty.ADVANCED}>ADVANCED</TabsTrigger>
        </TabsList>
      </Tabs>
      {lessons?.length ? (
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
      ) : (
        <div className="flex justify-center">No lessons available :(</div>
      )}
    </div>
  );
};
