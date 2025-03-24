import { create } from "zustand";

import { keyLabels } from "@/components/Keyboard/keyboardLabels";

const findKeyCodeByChar = (char: string) => {
  return Object.keys(keyLabels).find((key) =>
    keyLabels[key].some((label) => label?.toLowerCase() === char.toLowerCase()),
  );
};
type TypingState = {
  targetText: string;
  inputText: string;
  currentWordIndex: number;
  nextChar: string;
  nextKeyCode: string;
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
  setTargetText: (text) =>
    set({
      targetText: text,
      inputText: "",
      currentWordIndex: 0,
      nextChar: text[0],
      nextKeyCode: findKeyCodeByChar(text[0]),
    }),

  addCharacter: (char) =>
    set((state) => {
      const newInput = state.inputText + char;
      const inputWords = newInput.split(" ");

      let newWordIndex = state.currentWordIndex;
      if (inputWords.length > state.currentWordIndex + 1) {
        newWordIndex += 1;
      }

      return {
        inputText: newInput,
        currentWordIndex: newWordIndex,
        nextChar: state.targetText[newInput.length] || "",
        nextKeyCode: findKeyCodeByChar(state.targetText[newInput.length]),
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
      };
    }),

  reset: () => set({ inputText: "", currentWordIndex: 0, nextChar: "" }),
}));
