import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';

import { useScreenLinkStore } from '@/stores/useScreenLinkStore';
import { useTypingMetricsStore } from '@/stores/useTypingMetricsStore';
import { useTypingStore } from '@/stores/useTypingStore';
import { trpc } from '@/utils/trpc';
import { LearningMode } from '@/utils/types';

import { useTypingHandler } from './useTypingHandler';

export const useLessonsScreensHandler = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  useTypingHandler();

  const { isEndOfInputText, setTargetText, setTargetKeyCode, reset: resetTypingInput } = useTypingStore();

  const {
    currentLessonMetrics,
    startScreenTimer,
    startLessonTimer,
    resetScreenMetrics,
    resetLessonMetrics,
    updateTotalLessonMetrics,
    setCurrentScreenTargetTextLength,
    updateCalculatedScreenMetrics,
    addScreenMetricsToLesson
  } = useTypingMetricsStore();

  const { currentLink, setCurrentLink } = useScreenLinkStore();

  const { data: lesson } = useQuery(
    trpc.lesson.getById.queryOptions(lessonId!, {
      enabled: !!lessonId
    })
  );

  const { data: lessons } = useQuery(trpc.lesson.getAll.queryOptions());

  const isFirstLessonRender = useRef(true);

  const currentScreen = lesson?.screens.find((s) => s.order === currentLink?.screenId);

  useEffect(() => {
    if (lessonId && isFirstLessonRender.current) {
      resetLessonMetrics(lessonId);
      startLessonTimer();
      isFirstLessonRender.current = false;
    }
    return () => {
      isFirstLessonRender.current = true;
    };
  }, [lessonId, resetLessonMetrics, startLessonTimer]);

  useEffect(() => {
    if (!currentScreen) return;

    resetTypingInput();
    resetScreenMetrics();
    startScreenTimer();

    const targetTextContent = currentScreen.content.sequence || currentScreen.content.text || '';

    setCurrentScreenTargetTextLength(targetTextContent.length);
  }, [currentScreen, resetTypingInput, resetScreenMetrics, startScreenTimer, setCurrentScreenTargetTextLength]);

  useEffect(() => {
    if (!currentScreen) return;

    const updateScreenData = () => {
      let targetTextContent = '';

      if (currentScreen.type === LearningMode.LETTER_SEQUENCE || currentScreen.type === LearningMode.DEFAULT) {
        targetTextContent = currentScreen.content.sequence || currentScreen.content.text || '';
        setTargetText(targetTextContent);
      } else if (currentScreen.type === LearningMode.KEY_INTRODUCTION) {
        targetTextContent = currentScreen.content.keyCode || '';
        setTargetKeyCode(targetTextContent);
      }
    };

    updateScreenData();
  }, [currentScreen, setTargetKeyCode, setTargetText]);

  const handleScreenComplete = useCallback(() => {
    if (!lesson || !currentLink || !currentScreen) return;

    updateCalculatedScreenMetrics();
    addScreenMetricsToLesson();

    const totalLessonTargetTextLength = lesson.screens.reduce((sum, s) => {
      if (s.type === LearningMode.LETTER_SEQUENCE || s.type === LearningMode.DEFAULT) {
        return sum + (s.content.sequence?.length || s.content.text?.length || 0);
      } else if (s.type === LearningMode.KEY_INTRODUCTION) {
        return sum + (s.content.keyCode?.length || 0);
      }
      return sum;
    }, 0);

    const currentIndex = lesson.screens.findIndex((s) => s.order === currentLink.screenId);

    if (isEndOfInputText && currentIndex < lesson.screens.length - 1) {
      const nextScreen = lesson.screens[currentIndex + 1];

      setCurrentLink({ lessonId: lesson.id, screenId: nextScreen.order });
    } else if (isEndOfInputText && currentIndex === lesson.screens.length - 1) {
      if (!lessons || !currentLessonMetrics) return;
      updateTotalLessonMetrics(totalLessonTargetTextLength);

      const currentLessonIndex = lessons.findIndex((l) => l.id === lessonId);
      const nextLesson = lessons[currentLessonIndex + 1];

      if (nextLesson) {
        setCurrentLink({ lessonId: nextLesson.id, screenId: 1 });
        navigate(`/lesson/${nextLesson.id}`);
      } else {
        navigate('/lessons');
      }
    }
  }, [
    lesson,
    currentLink,
    currentScreen,
    updateCalculatedScreenMetrics,
    addScreenMetricsToLesson,
    isEndOfInputText,
    setCurrentLink,
    lessons,
    currentLessonMetrics,
    updateTotalLessonMetrics,
    lessonId,
    navigate
  ]);

  useEffect(() => {
    if (lesson && !currentLink && lesson.screens.length > 0) {
      setCurrentLink({
        lessonId: lesson.id,
        screenId: lesson.screens[0].order
      });
    }
  }, [lesson, currentLink, setCurrentLink]);

  return { lesson, currentScreen, handleScreenComplete, currentLink };
};
