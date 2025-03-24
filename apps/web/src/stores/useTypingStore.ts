import { create } from "zustand";

import { findKeyCodeByChar } from "@/utils/keyboard";

type TypingState = {
  targetText: string;
  inputText: string;
  currentWordIndex: number;
  nextChar: string | null;
  nextKeyCode: string | null;
  nextCharIndex: number | null;
  setTargetText: (text: string) => void;
  addCharacter: (char: string) => void;
  removeCharacter: () => void;
  reset: () => void;
};

export const useTypingStore = create<TypingState>((set) => ({
  targetText: "",
  inputText: "",
  currentWordIndex: 0,
  nextChar: "",
  nextKeyCode: "",
  nextCharIndex: 0,
  setTargetText: (text) =>
    set({
      targetText: text,
      inputText: "",
      currentWordIndex: 0,
      nextChar: text[0],
      nextKeyCode: findKeyCodeByChar(text[0]),
      nextCharIndex: 0,
    }),

  addCharacter: (char) =>
    set((state) => {
      if (state.nextCharIndex === null || state.nextCharIndex >= state.targetText.length) return state;

      const newInput = state.inputText + char;
      const inputWords = newInput.split(" ");

      let newWordIndex = state.currentWordIndex;
      if (inputWords.length > state.currentWordIndex + 1) {
        newWordIndex += 1;
      }

      const nextCharIndex = newInput.length;
      let nextChar = null;
      let nextKeyCode = null;

      if (nextCharIndex < state.targetText.length) {
        nextChar = state.targetText[nextCharIndex];
        nextKeyCode = findKeyCodeByChar(nextChar);
      } else {
        nextChar = null;
        nextKeyCode = null;
      }

      return {
        inputText: newInput,
        currentWordIndex: newWordIndex,
        nextChar,
        nextKeyCode,
        nextCharIndex,
      };
    }),

  removeCharacter: () =>
    set((state) => {
      if (state.inputText.length === 0) return state;

      const newInput = state.inputText.slice(0, -1);
      const words = newInput.split(" ");
      const newWordIndex = words.length - 1;

      return {
        inputText: newInput,
        currentWordIndex: Math.max(newWordIndex, 0),
        nextChar: state.targetText[newInput.length] || "",
        nextKeyCode: findKeyCodeByChar(state.targetText[newInput.length]),
        nextCharIndex: newInput.length,
      };
    }),

  reset: () => set({ inputText: "", currentWordIndex: 0, nextChar: "", nextCharIndex: 0 }),
}));
