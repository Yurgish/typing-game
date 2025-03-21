import { Button } from "@repo/ui/components/ui/button";
import { useEffect, useState } from "react";

import Keyboard from "./components/Keyboard/Keyboard";
import { ThemeToggle } from "./components/ThemeToggle";
import { useKeyboardHandler } from "./hooks/useKeyboardHandler";
import { useKeyboardStore } from "./stores/useKeyboardStore";
import { useApplyTheme } from "./stores/useThemeStore";

function App() {
  const lastPressedKey = useKeyboardStore((state) => state.lastPressedKey); // Отримуємо останню клавішу
  const pressedKeys = useKeyboardStore((state) => state.pressedKeys);

  useApplyTheme();

  const [text, setText] = useState<string>("");

  useKeyboardHandler();

  useEffect(() => {
    if (lastPressedKey) {
      setText((prev) => prev + lastPressedKey);
    }
  }, [lastPressedKey]);

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "4px" }} className="bg-grad">
      <h2>Остання натиснута клавіша:</h2>
      <p>{text || "Немає введеного тексту"}</p>
      <h3>Усі натиснуті клавіші:</h3>
      <Button size="sm">Click me!</Button>
      <ThemeToggle />
      <p>{Array.from(pressedKeys.keys()).join(", ") || "Немає натиснутих клавіш"}</p>
      <Keyboard size="small" />
    </div>
  );
}

export default App;
