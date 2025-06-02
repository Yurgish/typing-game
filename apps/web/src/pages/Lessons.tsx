// Lessons.tsx
import { useQuery } from "@tanstack/react-query";

import LessonCard from "@/components/LessonCard";
import { trpc } from "@/utils/trpc";

const Lessons = () => {
  const { data: lessons } = useQuery(trpc.lesson.getAll.queryOptions());

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
