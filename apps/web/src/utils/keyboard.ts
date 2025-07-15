import { keyLabels } from '@web/components/Keyboard/keyboardLabels';

export const findKeyCodeByChar = (char: string) => {
  return Object.keys(keyLabels).find((key) =>
    keyLabels[key].some((label) => label?.toLowerCase() === char.toLowerCase())
  );
};

export const findCharByKeyCode = (keyCode: string, index?: number): string => {
  if (index !== undefined && keyLabels[keyCode] && keyLabels[keyCode][index] !== undefined) {
    return keyLabels[keyCode][index].toLowerCase();
  }

  return keyLabels[keyCode] && keyLabels[keyCode][0].toLowerCase();
};
