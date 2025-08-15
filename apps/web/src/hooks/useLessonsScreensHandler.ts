import { useMutation, useQuery } from '@tanstack/react-query';
import { useCurrentLessonStore } from '@web/stores/useCurrentLessonStore';
import { useTypingMetricsStore } from '@web/stores/useTypingMetricsStore';
import { useTypingStore } from '@web/stores/useTypingStore';
import { trpc } from '@web/utils/trpc';
import { LearningMode, Screen } from '@web/utils/types';
import { useCallback, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';

import { useTypingHandler } from './useTypingHandler';

/**
 * Custom hook to manage the state and logic for handling lesson screens in a typing lesson application.
 *
 * This hook coordinates the flow of lesson screens, typing input, metrics collection, and progress saving.
 * It interacts with multiple stores and mutations to track user progress, update metrics, and navigate between screens.
 *
 * @returns An object containing:
 * - `lesson`: The current lesson data fetched from the backend.
 * - `currentScreen`: The current screen object within the lesson.
 * - `handleScreenComplete`: Callback to handle completion of the current screen, update metrics, and navigate to the next screen or results.
 *
 * @remarks
 * - Handles initialization and cleanup of lesson and screen metrics.
 * - Sets up the target text or key for the current screen based on its type.
 * - Saves screen and lesson progress to the backend.
 * - Navigates to the results page upon lesson completion.
 */
export const useLessonsScreensHandler = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();

  useTypingHandler();

  const { isEndOfInputText, setTargetText, setTargetKeyCode, reset: resetTypingInput } = useTypingStore();

  const {
    startScreenTimer,
    resetScreenMetrics,
    resetLessonMetrics,
    updateCalculatedScreenMetrics,
    addScreenMetricsToLesson,
    updateTotalLessonMetrics,
    setCurrentScreenTargetTextLength,
    resetScreenTimerState,
    screenCharacterMetrics
  } = useTypingMetricsStore();

  const { currentScreenOrder, setCurrentLessonId, setCurrentScreenOrder, setLessonComplete } = useCurrentLessonStore();

  const isFirstRender = useRef(true);

  const { data: lesson } = useQuery({
    ...trpc.lesson.getById.queryOptions(lessonId || ''),
    enabled: !!lessonId,
    staleTime: 1000 * 60 * 10
  });

  const currentScreen: Screen | undefined = lesson?.screens.find((s) => s.order === currentScreenOrder);

  const saveLessonProgressMutation = useMutation(trpc.lessonProgress.saveLessonProgress.mutationOptions());
  const saveScreenMetricMutation = useMutation(trpc.lessonProgress.saveScreenMetric.mutationOptions());
  const updateCharacterMetricsMutation = useMutation(trpc.characterMetrics.updateCharacterMetrics.mutationOptions());

  useEffect(() => {
    if (lessonId && isFirstRender.current) {
      resetLessonMetrics(lessonId);
      setCurrentLessonId(lessonId);
      isFirstRender.current = false;
    }
    return () => {
      isFirstRender.current = true;
    };
  }, [lessonId, resetLessonMetrics, setCurrentLessonId, setCurrentScreenOrder]);

  useEffect(() => {
    if (!currentScreen) return;

    resetTypingInput();
    resetScreenMetrics();
    resetScreenTimerState();

    const targetTextContent = currentScreen.content.sequence || currentScreen.content.text || '';

    setCurrentScreenTargetTextLength(targetTextContent.length);
  }, [
    currentScreen,
    resetTypingInput,
    resetScreenMetrics,
    startScreenTimer,
    setCurrentScreenTargetTextLength,
    resetScreenTimerState
  ]);

  useEffect(() => {
    if (!currentScreen) return;

    if (currentScreen.type === LearningMode.LETTER_SEQUENCE || currentScreen.type === LearningMode.DEFAULT) {
      const targetText = currentScreen.content.sequence || currentScreen.content.text || '';
      setTargetText(targetText);
    } else if (currentScreen.type === LearningMode.KEY_INTRODUCTION) {
      const targetKey = currentScreen.content.keyCode || '';
      setTargetKeyCode(targetKey);
    }
  }, [currentScreen, setTargetKeyCode, setTargetText]);

  //remake
  const handleScreenComplete = useCallback(() => {
    if (!lesson || !currentScreen) return;

    const metrics = addScreenMetricsToLesson(currentScreen.order, currentScreen.type as LearningMode);

    if (metrics) {
      try {
        const data = saveScreenMetricMutation.mutateAsync({
          lessonId: lesson.id,
          screenMetric: {
            type: currentScreen.type as LearningMode,
            order: currentScreen.order,
            metrics: metrics
          }
        });

        const aggregatedDataForBackend = Array.from(screenCharacterMetrics.entries()).map(([character, counts]) => ({
          character,
          correctCount: counts.correctCount,
          errorCount: counts.errorCount
        }));

        updateCharacterMetricsMutation.mutateAsync(aggregatedDataForBackend);

        console.log('Screen metrics saved:', data);
      } catch (error) {
        throw new Error(`Failed to update screen metrics: ${error}`);
      }
    }

    const currentIndex = lesson.screens.findIndex((s) => s.order === currentScreen.order);

    if (isEndOfInputText && currentIndex < lesson.screens.length - 1) {
      const nextScreen = lesson.screens[currentIndex + 1];
      setCurrentScreenOrder(nextScreen.order);
    } else if (isEndOfInputText && currentIndex === lesson.screens.length - 1) {
      const updatedLessonMetrics = updateTotalLessonMetrics();

      if (!updatedLessonMetrics) {
        throw new Error('Failed to calculate updated lesson metrics.');
      }

      setLessonComplete(true);

      try {
        const data = saveLessonProgressMutation.mutateAsync({
          lessonId: updatedLessonMetrics.lessonId,
          currentScreenOrder: currentScreen.order,
          isCompleted: true,
          metrics: {
            rawWPM: updatedLessonMetrics.totalRawWPM,
            adjustedWPM: updatedLessonMetrics.totalAdjustedWPM,
            accuracy: updatedLessonMetrics.totalAccuracy,
            backspaces: updatedLessonMetrics.totalBackspaces,
            errors: updatedLessonMetrics.totalErrors,
            timeTaken: updatedLessonMetrics.totalTimeTaken,
            typedCharacters: updatedLessonMetrics.totalTypedCharacters,
            correctCharacters: updatedLessonMetrics.totalCorrectCharacters
          }
        });
        console.log('Lesson progress saved:', data);
      } catch (error) {
        console.error(`Failed to save lesson progress: ${error}`);
      }

      navigate(`/lesson/${lesson.id}/results`);
    }
  }, [
    lesson,
    currentScreen,
    addScreenMetricsToLesson,
    isEndOfInputText,
    saveScreenMetricMutation,
    screenCharacterMetrics,
    updateCharacterMetricsMutation,
    setCurrentScreenOrder,
    updateTotalLessonMetrics,
    setLessonComplete,
    navigate,
    saveLessonProgressMutation
  ]);

  useEffect(() => {
    if (isEndOfInputText) updateCalculatedScreenMetrics();
  }, [isEndOfInputText, updateCalculatedScreenMetrics]);

  useEffect(() => {
    if (lesson && currentScreenOrder === null && lesson.screens.length > 0) {
      setCurrentScreenOrder(lesson.screens[0].order);
    }
  }, [lesson, currentScreenOrder, setCurrentScreenOrder]);

  return { lesson, currentScreen, handleScreenComplete };
};
