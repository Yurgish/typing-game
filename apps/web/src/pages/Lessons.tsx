import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import LessonCard from '@/components/LessonCard';
import { useLessonsDataStore } from '@/stores/useLessonsDataStore';
import { trpc } from '@/utils/trpc';

const Lessons = () => {
  const { lessons, setLessons } = useLessonsDataStore();

  const { data, isSuccess } = useQuery({ enabled: !lessons.length, ...trpc.lesson.getAll.queryOptions() });

  useEffect(() => {
    if (isSuccess && data) {
      setLessons(data);
    }
  }, [isSuccess, data, setLessons]);

  return (
    lessons && (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <ul className="flex flex-col gap-4">
          {lessons.map((lesson, index) => (
            <LessonCard key={lesson.id} lesson={lesson} index={index} />
          ))}
        </ul>
      </div>
    )
  );
};

export default Lessons;
