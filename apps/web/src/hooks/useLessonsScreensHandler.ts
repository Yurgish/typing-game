import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";

import { LearningModes, lessons } from "@/pages/Lessons";
import { useScreenLinkStore } from "@/stores/useScreenLinkStore";
import { useTypingStore } from "@/stores/useTypingStore";

import { useTypingHandler } from "./useTypingHandler";

export const useLessonsScreensHandler = () => {
  const { lessonId } = useParams();
  const { setTargetText, setTargetKeyCode, isEndOfInputText } = useTypingStore();
  const { currentLink } = useScreenLinkStore();
  useTypingHandler();

  const lesson = lessons.find((l) => l.id === lessonId);

  const initialScreenIndex = lesson ? lesson.screens.findIndex((s) => s.id === currentLink?.screenId) : 0;

  const [currentScreenIndex, setCurrentScreenIndex] = useState<number>(
    initialScreenIndex >= 0 ? initialScreenIndex : 0,
  );

  const isFirstRender = useRef(true);

  useEffect(() => {
    const updateScreenData = () => {
      if (!lesson) return;
      const screen = lesson.screens[currentScreenIndex];

      if (screen.type === LearningModes.LETTER_SEQUENCE || screen.type === LearningModes.DEFAULT) {
        setTargetText(screen.content.sequence || screen.content.text || "");
      } else if (screen.type === LearningModes.KEY_INTRODUCTION) {
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
    }
  };

  return { lesson, currentScreenIndex, handleScreenComplete };
};
