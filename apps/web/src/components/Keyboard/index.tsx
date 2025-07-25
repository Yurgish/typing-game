import { useKeyboardStore } from '@web/stores/useKeyboardStore';
import { useTypingStore } from '@web/stores/useTypingStore';
import { useMemo } from 'react';

import ArrowKeys from './Arrows';
import Key from './Key';
import { KeyboardSize, layouts } from './keyboardLayouts';

const Keyboard = ({ size = 'medium' }: { size?: KeyboardSize }) => {
  const rows = useMemo(() => layouts[size], [size]);

  const isKeyPressed = useKeyboardStore((s) => s.isKeyPressed);
  const nextKeyCode = useTypingStore((s) => s.nextKeyCode);

  return (
    <div className="bg-sidebar-border flex h-full w-[600px] flex-col gap-1 rounded-lg p-2">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1 rounded">
          {row.map((key) => (
            <Key key={key} keyCode={key} isPressed={isKeyPressed(key)} isNextKey={nextKeyCode === key} />
          ))}
          {size === 'full' && rowIndex === rows.length - 1 && <ArrowKeys />}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
