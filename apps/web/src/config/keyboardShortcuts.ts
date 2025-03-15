import { Shortcut } from "@/store/useKeyboardStore";

export const globalShortcuts: Shortcut[] = [
  {
    keyCodes: ["ControlLeft", "KeyZ", "ControlRight"],
    action: () => console.log("Глобальне: Збереження!"),
  },
];
