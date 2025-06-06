import { useCallback, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';

import { useCurrentLessonStore } from '@/stores/useCurrentLessonStore';
import { useTypingMetricsStore } from '@/stores/useTypingMetricsStore';
import { useTypingStore } from '@/stores/useTypingStore';
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

  const {
    currentScreenOrder,
    setCurrentLessonId,
    setCurrentScreenOrder,
    setLessonComplete,
    getCurrentLesson,
    getCurrentScreen,
    getNextLesson
  } = useCurrentLessonStore();

  const isFirstRender = useRef(true);

  const lesson = getCurrentLesson();
  const currentScreen = getCurrentScreen();

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
  }, [lessonId, resetLessonMetrics, startLessonTimer, setCurrentLessonId]);

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
    addScreenMetricsToLesson();

    const totalTargetLength = lesson.screens.reduce((sum, s) => {
      if (s.type === LearningMode.KEY_INTRODUCTION) {
        return sum + (s.content.keyCode?.length || 0);
      } else {
        return sum + (s.content.sequence?.length || s.content.text?.length || 0);
      }
    }, 0); // redo chatGpt made some shit idk

    const currentIndex = lesson.screens.findIndex((s) => s.order === currentScreen.order);

    if (isEndOfInputText && currentIndex < lesson.screens.length - 1) {
      const nextScreen = lesson.screens[currentIndex + 1];
      setCurrentScreenOrder(nextScreen.order);
    } else if (isEndOfInputText && currentIndex === lesson.screens.length - 1) {
      updateTotalLessonMetrics(totalTargetLength);
      setLessonComplete(true);

      const nextLesson = getNextLesson();

      if (nextLesson) {
        setCurrentLessonId(nextLesson.id);
        setCurrentScreenOrder(1);
        navigate(`/lesson/${nextLesson.id}`);
      } else {
        navigate('/lessons');
      }
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
    getNextLesson,
    setCurrentLessonId,
    navigate
  ]);

  useEffect(() => {
    if (lesson && currentScreenOrder === null && lesson.screens.length > 0) {
      setCurrentScreenOrder(lesson.screens[0].order);
    }
  }, [lesson, currentScreenOrder, setCurrentScreenOrder]);

  return { lesson, currentScreen, handleScreenComplete };
};
