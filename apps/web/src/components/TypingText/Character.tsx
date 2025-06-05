import { memo, useCallback } from 'react';

import Caret from './Caret';

interface CharacterProps {
  char: string;
  typedChar: string;
  className?: string;
  isCurrent: boolean;
}

const Character = memo(({ char, typedChar, isCurrent, className = '' }: CharacterProps) => {
  const isSpace = char === ' ';
  const getCharacterClassName = useCallback(() => {
    if (isSpace) {
      return '';
    }
    if (typedChar) {
      return typedChar === char ? 'text-correct' : 'text-error';
    } else {
      return 'text-foreground';
    }
  }, [char, isSpace, typedChar]);

  return (
    <span className={`relative ${className}`}>
      <span className={` ${getCharacterClassName()}`}>{isSpace ? '\u00A0' : char}</span>
      {isCurrent && <Caret />}
    </span>
  );
});

export default Character;
