import { useKeyboardStore } from '@web/stores/useKeyboardStore';

import Key from './Key';
import { arrowsLabels } from './keyboardLabels';

const ArrowKeys = () => {
  const pressedKeys = useKeyboardStore((state) => state.pressedKeys);
  const isKeyPressed = (key: string) => pressedKeys.has(key);

  return (
    <div className="flex flex-col items-center">
      {Object.entries(arrowsLabels).map(([key, label], index) =>
        index === 0 ? (
          <Key keyCode={key} isPressed={isKeyPressed(key)} key={key} customLabels={[label]} />
        ) : index === 1 ? (
          <div key="arrow-row" className="flex gap-1">
            {Object.entries(arrowsLabels)
              .slice(1)
              .map(([key, label]) => (
                <Key keyCode={key} isPressed={isKeyPressed(key)} key={key} customLabels={[label]} />
              ))}
          </div>
        ) : null
      )}
    </div>
  );
};

export default ArrowKeys;
