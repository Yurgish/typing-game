import { Shortcut } from "@/stores/useKeyboardStore";

export const globalShortcuts: Shortcut[] = [
  {
    keyCodes: ["ControlLeft", "KeyZ", "ControlRight"],
    action: () => console.log("Глобальне: Збереження!"),
  },
];
