import { Shortcut } from "@/store/useKeyboardStore";

export const globalShortcuts: Shortcut[] = [
  {
    keys: ["z", "x"],
    action: () => console.log("Глобальне: Збереження!"),
  },
];
