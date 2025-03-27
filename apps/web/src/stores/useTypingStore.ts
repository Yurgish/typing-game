import { create } from "zustand";

import { findCharByKeyCode, findKeyCodeByChar } from "@/utils/keyboard";

type TypingState = {
  targetText: string;
  inputText: string;
  currentWordIndex: number;
  nextChar: string | null;
  nextKeyCode: string | null;
  nextCharIndex: number | null;
  isEndOfInputText: boolean;
  setTargetKeyCode: (keyCode: string) => void;
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
  isEndOfInputText: false,
  setTargetText: (text) =>
    set({
      targetText: text,
      inputText: "",
      currentWordIndex: 0,
      nextChar: text[0],
      nextKeyCode: findKeyCodeByChar(text[0]),
      nextCharIndex: 0,
      isEndOfInputText: false,
    }),

  setTargetKeyCode: (keyCode) =>
    set({
      targetText: findCharByKeyCode(keyCode, 0),
      inputText: "",
      currentWordIndex: 0,
      nextChar: findCharByKeyCode(keyCode, 0),
      nextKeyCode: keyCode,
      nextCharIndex: 0,
      isEndOfInputText: false,
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
        isEndOfInputText: nextCharIndex >= state.targetText.length,
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
        isEndOfInputText: newInput.length >= state.targetText.length,
      };
    }),

  reset: () => set({ inputText: "", currentWordIndex: 0, nextChar: "", nextCharIndex: 0, isEndOfInputText: false }),
}));
