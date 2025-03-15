import { motion } from "framer-motion";
import React from "react";

import { keyLabels } from "./keyboardLabels";
import { specialKeyStyles } from "./specialKeyStyles";

const Key = React.memo(
  ({ keyCode, isPressed, customLabels }: { keyCode: string; isPressed: boolean; customLabels?: string[] }) => {
    const labels = customLabels ? customLabels : keyLabels[keyCode] || [keyCode];
    const keyClass = `flex flex-col items-center justify-center rounded text-white shadow text-base
      ${isPressed ? "bg-gray-500" : "bg-gray-700"}
      ${specialKeyStyles[keyCode] || "w-10 h-10"}`;

    return (
      <motion.button
        key={keyCode}
        className={keyClass}
        animate={{ scale: isPressed ? 0.95 : 1 }}
        transition={{ duration: 0.1 }}
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
  },
);

export default Key;
