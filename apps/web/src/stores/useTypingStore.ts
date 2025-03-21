import { create } from "zustand";

type TypingState = {
  targetText: string;
  inputText: string;
  currentWordIndex: number;
  setTargetText: (text: string) => void;
  addCharacter: (char: string) => void;
  removeCharacter: () => void;
  reset: () => void;
};

export const useTypingStore = create<TypingState>((set) => ({
  targetText: "",
  inputText: "",
  currentWordIndex: 0,

  setTargetText: (text) => set({ targetText: text, inputText: "", currentWordIndex: 0 }),

  addCharacter: (char) =>
    set((state) => {
      if (state.inputText.length === 0) {
        return { inputText: char };
      }

      const newInput = state.inputText + char;
      const words = state.targetText.split(" ");
      const inputWords = state.inputText.split(" ");

      if (char === " " && inputWords[state.currentWordIndex].length >= words[state.currentWordIndex].length) {
        return { inputText: newInput, currentWordIndex: state.currentWordIndex + 1 };
      } else if (char !== " ") {
        return {
          inputText: newInput,
        };
      }
      return {};
    }),

  removeCharacter: () =>
    set((state) => {
      if (state.inputText.endsWith(" ")) {
        return {
          inputText: state.inputText.slice(0, -1),
          currentWordIndex: Math.max(state.currentWordIndex - 1, 0),
        };
      }
      return {
        inputText: state.inputText.slice(0, -1),
      };
    }),

  reset: () => set({ inputText: "", currentWordIndex: 0 }),
}));
