import { cn } from "@repo/ui/lib/utils";
import { motion } from "framer-motion";
import React from "react";

import { arrowsLabels, keyLabels } from "./keyboardLabels";
import { specialKeyStyles } from "./specialKeyStyles";

interface KeyProps {
  keyCode: string;
  isPressed: boolean;
  customLabels?: string[];
  isNextKey?: boolean;
}

const Key: React.FC<KeyProps> = React.memo(({ keyCode, isPressed, customLabels, isNextKey }) => {
  const labels = customLabels ?? keyLabels[keyCode] ?? [keyCode];

  const keyClass = cn(
    "relative flex flex-col items-center justify-center shadow-(--key-shadow) text-xs",
    !Object.keys(arrowsLabels).includes(keyCode) && "rounded",
    isPressed ? "bg-muted" : "bg-background",
    specialKeyStyles[keyCode] ?? "w-8 h-8",
    isNextKey ? "bg-keyboard-key-next text-background" : "text-foreground",
  );

  return (
    <motion.div
      key={keyCode}
      data-key={keyCode}
      className={keyClass}
      animate={{ scale: isPressed ? 0.95 : 1 }}
      transition={{ duration: 0.1 }}
    >
      {labels.length > 1 ? (
        <div className="flex flex-col items-center">
          <span className="leading-none">{labels[1]}</span>
          <span className="leading-none">{labels[0]}</span>
        </div>
      ) : (
        labels[0]
      )}
      {(keyCode === "KeyF" || keyCode === "KeyJ") && (
        <div className="absolute right-0 bottom-1 left-0 flex items-center justify-center">
          <span className={`h-0.5 w-2 rounded ${isNextKey ? "bg-background" : "bg-foreground"}`}></span>
        </div>
      )}
    </motion.div>
  );
});

export default Key;
