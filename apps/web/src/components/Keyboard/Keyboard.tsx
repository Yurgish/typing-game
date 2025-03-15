import { useKeyboardStore } from "@/store/useKeyboardStore";

import ArrowKeys from "./Arrows";
import Key from "./Key";
import { KeyboardSize, layouts } from "./keyboardLayouts";

const Keyboard = ({ size = "medium" }: { size?: KeyboardSize }) => {
  const rows = layouts[size];

  const pressedKeys = useKeyboardStore((state) => state.pressedKeys);
  const isKeyPressed = (key: string) => pressedKeys.has(key);

  return (
    <div className="flex w-[700px] flex-col gap-1 rounded-lg bg-[#242426] p-2">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1 rounded">
          {row.map((key) => (
            <Key key={key} keyCode={key} isPressed={isKeyPressed(key)} />
          ))}
          {size === "full" && rowIndex === rows.length - 1 && <ArrowKeys />}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
