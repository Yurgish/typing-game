import { keyLabels } from "@/components/Keyboard/keyboardLabels";

export const findKeyCodeByChar = (char: string) => {
  return Object.keys(keyLabels).find((key) =>
    keyLabels[key].some((label) => label?.toLowerCase() === char.toLowerCase()),
  );
};
