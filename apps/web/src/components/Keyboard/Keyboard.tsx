import { motion } from "framer-motion";

import { useKeyboardStore } from "@/store/useKeyboardStore";

import ArrowKeys from "./Arrows";
import { keyLabels } from "./keyboardLabels";
import { KeyboardSize, layouts } from "./keyboardLayouts";
import { specialKeyStyles } from "./specialKeyStyles";

const Keyboard = ({ size = "medium" }: { size?: KeyboardSize }) => {
  const rows = layouts[size];
  const pressedKeys = useKeyboardStore((state) => state.pressedKeys);
  const isKeyPressed = (key: string) => pressedKeys.has(key);

  return (
    <div className="flex w-[700px] flex-col gap-1 rounded-lg p-2">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1 rounded">
          {row.map((key) => {
            const labels = keyLabels[key] || [key];
            const keyClass = `flex flex-col items-center justify-center rounded text-white shadow text-base
              ${isKeyPressed(key) ? "bg-gray-500" : "bg-gray-700"}
              ${specialKeyStyles[key] || "w-10 h-10"}`;

            return (
              <motion.button
                key={key}
                className={keyClass}
                animate={{ scale: isKeyPressed(key) ? 0.95 : 1 }}
                transition={{ duration: 0.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {labels.length > 1 ? (
                  <div className="flex flex-col items-center">
                    <span className="text-sm leading-none">{labels[1]}</span>
                    <span className="text-base leading-none">{labels[0]}</span>
                  </div>
                ) : (
                  labels[0]
                )}
              </motion.button>
            );
          })}
          {size === "full" && rowIndex === rows.length - 1 && <ArrowKeys />}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
