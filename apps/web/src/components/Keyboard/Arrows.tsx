import { motion } from "framer-motion";

import { useKeyboardStore } from "@/store/useKeyboardStore";

import { arrowsLabels } from "./keyboardLabels";
import { specialKeyStyles } from "./specialKeyStyles";

const ArrowKeys = () => {
  const pressedKeys = useKeyboardStore((state) => state.pressedKeys);
  const isKeyPressed = (key: string) => pressedKeys.has(key);

  return (
    <div className="flex flex-col items-center">
      {Object.entries(arrowsLabels).map(([key, label], index) =>
        index === 0 ? (
          <motion.button
            key={key}
            className={`border-b-[1px] border-b-black leading-0.5 text-white ${specialKeyStyles[key]} ${
              isKeyPressed(key) ? "bg-gray-500" : "bg-gray-700"
            }`}
          >
            {label}
          </motion.button>
        ) : index === 1 ? (
          <div key="arrow-row" className="flex gap-1">
            {Object.entries(arrowsLabels)
              .slice(1)
              .map(([key, label]) => (
                <motion.button
                  key={key}
                  className={`leading-0.5 text-white ${specialKeyStyles[key]} ${isKeyPressed(key) ? "bg-gray-500" : "bg-gray-700"}`}
                >
                  {label}
                </motion.button>
              ))}
          </div>
        ) : null,
      )}
    </div>
  );
};

export default ArrowKeys;
