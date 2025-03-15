import { useEffect, useState } from "react";

import Keyboard from "./components/Keyboard/Keyboard";
import { useKeyboardHandler } from "./hooks/useKeyboardHandler";
import { useKeyboardStore } from "./store/useKeyboardStore";

function App() {
  const lastPressedKey = useKeyboardStore((state) => state.lastPressedKey); // Отримуємо останню клавішу
  const pressedKeys = useKeyboardStore((state) => state.pressedKeys);

  const [text, setText] = useState<string>("");

  useKeyboardHandler();

  useEffect(() => {
    if (lastPressedKey) {
      setText((prev) => prev + lastPressedKey);
    }
  }, [lastPressedKey]);

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "4px" }}>
      <h2>Остання натиснута клавіша:</h2>
      <p>{text || "Немає введеного тексту"}</p>

      <h3>Усі натиснуті клавіші:</h3>
      <p>{Array.from(pressedKeys.keys()).join(", ") || "Немає натиснутих клавіш"}</p>
      <Keyboard size="full" />
    </div>
  );
}

export default App;
