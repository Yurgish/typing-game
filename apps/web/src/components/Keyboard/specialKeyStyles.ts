export const specialKeyStyles: Record<string, string> = {
  ...Object.fromEntries(
    [
      'ShiftLeft',
      'ShiftRight',
      'ControlLeft',
      'ControlRight',
      'AltLeft',
      'AltRight',
      'CapsLock',
      'Tab',
      'Backslash',
      'Backspace',
      'MetaLeft'
    ].map((key) => [key, 'flex-1 h-8'])
  ),
  Space: 'w-[270px] h-8',
  Enter: 'flex-[1_1_auto] h-8',
  ...Object.fromEntries(Array.from({ length: 12 }, (_, i) => [`F${i + 1}`, 'h-6 flex-1'])),
  Escape: 'h-6 flex-1',
  ArrowUp: 'h-4 w-8 rounded-t',
  ArrowLeft: 'h-4 w-8 rounded',
  ArrowDown: 'h-4 w-8 rounded-b',
  ArrowRight: 'h-4 w-8 rounded'
};
