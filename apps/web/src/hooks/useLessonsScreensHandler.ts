import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';

import { useCurrentLessonStore } from '@/stores/useCurrentLessonStore';
import { useTypingMetricsStore } from '@/stores/useTypingMetricsStore';
import { useTypingStore } from '@/stores/useTypingStore';
import { trpc } from '@/utils/trpc';
import { Screen } from '@/utils/types';
import { LearningMode } from '@/utils/types';

import { useTypingHandler } from './useTypingHandler';

export const useLessonsScreensHandler = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();

  useTypingHandler();

  const { isEndOfInputText, setTargetText, setTargetKeyCode, reset: resetTypingInput } = useTypingStore();

  const startScreenTimer = useTypingMetricsStore((s) => s.startScreenTimer);
  const startLessonTimer = useTypingMetricsStore((s) => s.startLessonTimer);
  const resetScreenMetrics = useTypingMetricsStore((s) => s.resetScreenMetrics);
  const resetLessonMetrics = useTypingMetricsStore((s) => s.resetLessonMetrics);
  const updateTotalLessonMetrics = useTypingMetricsStore((s) => s.updateTotalLessonMetrics);
  const setCurrentScreenTargetTextLength = useTypingMetricsStore((s) => s.setCurrentScreenTargetTextLength);
  const updateCalculatedScreenMetrics = useTypingMetricsStore((s) => s.updateCalculatedScreenMetrics);
  const addScreenMetricsToLesson = useTypingMetricsStore((s) => s.addScreenMetricsToLesson);

  const { currentScreenOrder, setCurrentLessonId, setCurrentScreenOrder, setLessonComplete } = useCurrentLessonStore();

  const isFirstRender = useRef(true);

  const { data: lesson } = useQuery({
    ...trpc.lesson.getById.queryOptions(lessonId || ''),
    enabled: !!lessonId,
    staleTime: 1000 * 60 * 10
  });

  const currentScreen: Screen | undefined = lesson?.screens.find((s) => s.order === currentScreenOrder);

  useEffect(() => {
    if (lessonId && isFirstRender.current) {
      resetLessonMetrics(lessonId);
      startLessonTimer();
      setCurrentLessonId(lessonId);
      isFirstRender.current = false;
    }
    return () => {
      isFirstRender.current = true;
    };
  }, [lessonId, resetLessonMetrics, startLessonTimer, setCurrentLessonId, setCurrentScreenOrder]);

  useEffect(() => {
    if (!currentScreen) return;

    resetTypingInput();
    resetScreenMetrics();
    startScreenTimer(); // Remake later, make it start screen when key typed for the first time

    const targetTextContent = currentScreen.content.sequence || currentScreen.content.text || '';

    setCurrentScreenTargetTextLength(targetTextContent.length);
  }, [currentScreen, resetTypingInput, resetScreenMetrics, startScreenTimer, setCurrentScreenTargetTextLength]);

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

  const handleScreenComplete = useCallback(() => {
    if (!lesson || !currentScreen) return;

    updateCalculatedScreenMetrics();
    addScreenMetricsToLesson(currentScreen.order, currentScreen.type);

    const currentIndex = lesson.screens.findIndex((s) => s.order === currentScreen.order);

    if (isEndOfInputText && currentIndex < lesson.screens.length - 1) {
      const nextScreen = lesson.screens[currentIndex + 1];
      setCurrentScreenOrder(nextScreen.order);
    } else if (isEndOfInputText && currentIndex === lesson.screens.length - 1) {
      updateTotalLessonMetrics();
      setLessonComplete(true);

      navigate(`/lesson/${lesson.id}/results`);
    }
  }, [
    lesson,
    currentScreen,
    updateCalculatedScreenMetrics,
    addScreenMetricsToLesson,
    isEndOfInputText,
    setCurrentScreenOrder,
    updateTotalLessonMetrics,
    setLessonComplete,
    navigate
  ]);

  useEffect(() => {
    if (lesson && currentScreenOrder === null && lesson.screens.length > 0) {
      setCurrentScreenOrder(lesson.screens[0].order);
    }
  }, [lesson, currentScreenOrder, setCurrentScreenOrder]);

  return { lesson, currentScreen, handleScreenComplete };
};
