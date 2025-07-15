import { Shortcut } from '@web/stores/useKeyboardStore';

export const globalShortcuts: Shortcut[] = [
  {
    keyCodes: ['ControlLeft', 'KeyZ', 'ControlRight'],
    action: () => console.log('Глобальне: Збереження!')
  }
];
