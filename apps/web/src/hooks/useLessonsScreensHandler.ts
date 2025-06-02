import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";

import { useScreenLinkStore } from "@/stores/useScreenLinkStore";
import { useTypingStore } from "@/stores/useTypingStore";
import { trpc } from "@/utils/trpc";
import { LearningMode } from "@/utils/types";

import { useTypingHandler } from "./useTypingHandler";

export const useLessonsScreensHandler = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { setTargetText, setTargetKeyCode, isEndOfInputText } = useTypingStore();
  const { currentLink, setCurrentLink } = useScreenLinkStore();

  const { data: lesson } = useQuery(
    trpc.lesson.getById.queryOptions(lessonId!, {
      enabled: !!lessonId,
    }),
  );

  const { data: lessons } = useQuery(trpc.lesson.getAll.queryOptions());
  const navigate = useNavigate();

  useTypingHandler();

  const isFirstRender = useRef(true);

  const currentScreen = lesson?.screens.find((s) => s.order === currentLink?.screenId);

  useEffect(() => {
    if (!currentScreen) return;

    const updateScreenData = () => {
      if (currentScreen.type === LearningMode.LETTER_SEQUENCE || currentScreen.type === LearningMode.DEFAULT) {
        setTargetText(currentScreen.content.sequence || currentScreen.content.text || "");
      } else if (currentScreen.type === LearningMode.KEY_INTRODUCTION) {
        setTargetKeyCode(currentScreen.content.keyCode || "");
      }
    };

    if (isFirstRender.current) {
      isFirstRender.current = false;
      updateScreenData();
    } else {
      const timeout = setTimeout(updateScreenData, 400);
      return () => clearTimeout(timeout);
    }
  }, [currentScreen, setTargetText, setTargetKeyCode, setCurrentLink]);

  const handleScreenComplete = () => {
    if (!lesson || !currentLink) return;

    const currentIndex = lesson.screens.findIndex((s) => s.order === currentLink.screenId);

    if (isEndOfInputText && currentIndex < lesson.screens.length - 1) {
      const nextScreen = lesson.screens[currentIndex + 1];
      setCurrentLink({ lessonId: lesson.id, screenId: nextScreen.order });
    } else {
      if (!lessons) return;

      const currentLessonIndex = lessons.findIndex((l) => l.id === lessonId);
      const nextLesson = lessons[currentLessonIndex + 1];

      if (nextLesson) {
        setCurrentLink({ lessonId: nextLesson.id, screenId: 1 });
        navigate(`/lesson/${nextLesson.id}`);
      } else {
        navigate("/lessons");
      }
    }
  };

  useEffect(() => {
    if (lesson && !currentLink && lesson.screens.length > 0) {
      setCurrentLink({ lessonId: lesson.id, screenId: lesson.screens[0].order });
    }
  }, [lesson, currentLink, setCurrentLink]);

  return { lesson, currentScreen, handleScreenComplete, currentLink };
};
