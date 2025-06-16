// import { useMutation, useQuery } from '@tanstack/react-query';
// import { useEffect } from 'react';

// import { useCurrentLessonStore } from '@/stores/useCurrentLessonStore';
// import { useTypingMetricsStore } from '@/stores/useTypingMetricsStore';
// import { useTypingStore } from '@/stores/useTypingStore';
// import { trpc } from '@/utils/trpc';
// import { Screen } from '@/utils/types';

// export const useSaveProgress = () => {
//   const { currentScreenOrder, currentLessonId } = useCurrentLessonStore();
//   const { isEndOfInputText } = useTypingStore();
//   const { currentLessonMetrics } = useTypingMetricsStore();

//   const { data: lesson } = useQuery({
//     ...trpc.lesson.getById.queryOptions(currentLessonId || ''),
//     enabled: !!currentLessonId,
//     staleTime: 1000 * 60 * 10
//   });

//   const saveScreenMetricMutation = useMutation(trpc.userProgress.saveScreenMetric.mutationOptions());

//   useEffect(() => {
//     const saveMetrics = async () => {
//       const currentScreen: Screen | undefined = lesson?.screens.find((s) => s.order === currentScreenOrder);

//       if (!lesson || !currentScreen || !currentScreenOrder) return;

//       if (isEndOfInputText && currentScreenOrder < lesson.screens.length - 1) {
//         const latestScreenMetrics = currentLessonMetrics?.screenMetrics.find(
//           (metric) => metric.order === currentScreen.order
//         );

//         if (!latestScreenMetrics) {
//           throw new Error('Failed to capture latest screen metrics for saving.');
//         }

//         try {
//           await saveScreenMetricMutation.mutateAsync({
//             lessonId: lesson.id,
//             screenMetric: latestScreenMetrics
//           });
//         } catch (error) {
//           throw new Error(`Failed to update screen metrics: ${error}`);
//         }
//       }
//     };

//     saveMetrics();
//   }, [currentLessonMetrics, currentScreenOrder, isEndOfInputText, lesson, saveScreenMetricMutation]);
// };
