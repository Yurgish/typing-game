import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { useScreenLinkStore } from "@/stores/useScreenLinkStore";
import { useTypingStore } from "@/stores/useTypingStore";
import { trpc } from "@/utils/trpc";
import { LearningMode } from "@/utils/types";

import { useTypingHandler } from "./useTypingHandler";

export const useLessonsScreensHandler = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { setTargetText, setTargetKeyCode, isEndOfInputText } = useTypingStore();
  const { currentLink } = useScreenLinkStore();

  useTypingHandler();

  const { data: lesson } = useQuery(
    trpc.lesson.getById.queryOptions(lessonId!, {
      enabled: !!lessonId,
    }),
  );

  const { data: lessons } = useQuery(trpc.lesson.getAll.queryOptions());

  const navigate = useNavigate();

  const initialScreenIndex = lesson ? lesson.screens.findIndex((s) => s.order === currentLink?.screenId) : 0;

  const [currentScreenIndex, setCurrentScreenIndex] = useState<number>(
    initialScreenIndex >= 0 ? initialScreenIndex : 0,
  );

  const isFirstRender = useRef(true);

  useEffect(() => {
    const updateScreenData = () => {
      if (!lesson) return;
      const screen = lesson.screens[currentScreenIndex];

      if (screen.type === LearningMode.LETTER_SEQUENCE || screen.type === LearningMode.DEFAULT) {
        setTargetText(screen.content.sequence || screen.content.text || "");
      } else if (screen.type === LearningMode.KEY_INTRODUCTION) {
        setTargetKeyCode(screen.content.keyCode || "");
      }
    };

    if (isFirstRender.current) {
      isFirstRender.current = false;
      updateScreenData();
    } else {
      const timeout = setTimeout(() => {
        updateScreenData();
      }, 400);

      return () => clearTimeout(timeout);
    }
  }, [lesson, currentScreenIndex, setTargetText, setTargetKeyCode]);

  const handleScreenComplete = () => {
    if (isEndOfInputText && lesson?.screens && currentScreenIndex < lesson.screens.length - 1) {
      setCurrentScreenIndex((prev) => prev + 1);
    } else {
      if (!lessons) {
        return; // Remake later
      }

      const currentLessonIndex = lessons.findIndex((l) => l.id === lessonId);
      const nextLesson = lessons[currentLessonIndex + 1];
      setCurrentScreenIndex(0);

      if (nextLesson) {
        navigate(`/lesson/${nextLesson.id}`);
      } else {
        navigate("/lessons");
      }
    }
  };

  return { lesson, currentScreenIndex, handleScreenComplete, currentLink };
};
