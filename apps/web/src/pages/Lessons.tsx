import { useQuery } from '@tanstack/react-query';

import LessonCard from '@/components/LessonCard';
import { trpc } from '@/utils/trpc';

const Lessons = () => {
  const { data: lessons } = useQuery({ ...trpc.lesson.getAll.queryOptions(), staleTime: 1000 * 60 * 10 });

  return (
    lessons && (
      <div>
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
