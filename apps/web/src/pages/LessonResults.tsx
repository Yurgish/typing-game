import { Button } from '@repo/ui/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';

import { useCurrentLessonStore } from '@/stores/useCurrentLessonStore';
import { useTypingMetricsStore } from '@/stores/useTypingMetricsStore';
import { formatTime } from '@/utils/metrics';
import { trpc } from '@/utils/trpc';

const LessonMetricsScreen = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { setCurrentLessonId, setCurrentScreenOrder } = useCurrentLessonStore();
  const navigate = useNavigate();

  const currentLessonMetrics = useTypingMetricsStore((state) => state.currentLessonMetrics);

  const { data: lesson } = useQuery({
    ...trpc.lesson.getById.queryOptions(lessonId || ''),
    staleTime: 1000 * 60 * 10
  });

  const { refetch: fetchNextLesson } = useQuery({
    ...trpc.lesson.getNextLessonById.queryOptions(lessonId || ''),
    staleTime: 1000 * 60 * 10,
    enabled: false
  });

  const handleNextLesson = useCallback(async () => {
    if (!lessonId) return;

    const { data: nextLesson } = await fetchNextLesson();

    if (nextLesson) {
      setCurrentLessonId(nextLesson.id);
      navigate(`/lesson/${nextLesson.id}`);
    } else {
      navigate('/lessons');
    }
  }, [fetchNextLesson, lessonId, navigate, setCurrentLessonId]);

  const handleRestartScreen = (order: number) => {
    if (!currentLessonMetrics) return;

    setCurrentScreenOrder(order);
    navigate(`/lesson/${currentLessonMetrics.lessonId}`);
  };

  if (!currentLessonMetrics) {
    return <div>No metrics available.</div>;
  } // remake later

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="mb-4 text-4xl">
          Lesson {lesson?.order} -&gt; {lesson?.title}
        </h2>
        <div className="grid grid-cols-2 gap-2 text-xl">
          <p>
            Characters: {currentLessonMetrics.totalCorrectCharacters}/{currentLessonMetrics.totalTypedCharacters}/
            {currentLessonMetrics.totalErrors}/{currentLessonMetrics.totalBackspaces}
          </p>
          <p>Raw WPM: {currentLessonMetrics.totalRawWPM}</p>
          <p>Adjusted WPM: {currentLessonMetrics.totalAdjustedWPM}</p>
          <p>Accuracy: {currentLessonMetrics.totalAccuracy}%</p>
          <p>Time Taken: {formatTime(currentLessonMetrics.totalTimeTaken)}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="mb-2 text-2xl">Screens Overview</h3>
        {currentLessonMetrics.screenMetrics.map((screen) => (
          <div
            key={screen.order}
            className="border-border min-h-[80px] overflow-hidden rounded-md border-2 transition-all duration-200 hover:shadow-(--key-shadow)"
          >
            <div className="flex items-center justify-between px-3 py-3">
              <div className="h-full flex-1">
                <h2 className="mb-1 text-lg">
                  Screen {screen.order} ({screen.type})
                </h2>
                <div className="flex justify-between gap-4">
                  <p>
                    Characters: {screen.correctCharacters}/{screen.typedCharacters}/{screen.errors}/{screen.backspaces};
                  </p>
                  <p>Raw WPM: {screen.rawWPM};</p>
                  <p>Adjusted WPM: {screen.adjustedWPM};</p>
                  <p>Accuracy: {screen.accuracy}%;</p>
                  <p>Time Taken: {formatTime(screen.timeTaken)};</p>
                </div>
              </div>
              <div className="ml-3 flex flex-[0_0_5%] self-stretch">
                <Button size={null} className="h-full w-full" onClick={() => handleRestartScreen(screen.order)}>
                  -&gt;
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Button className="mt-6" onClick={() => navigate('/lessons')}>
        Back to Lessons
      </Button>
      <Button className="mt-6" onClick={handleNextLesson}>
        Continue
      </Button>
    </div>
  );
};

export default LessonMetricsScreen;
