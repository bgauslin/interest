export const STORAGE_ITEM = 'interest';

export enum Events {
  Click = 'click',
  Currency = 'currencyUpdated',
  Drawer = 'drawerUpdated',
  KeyUp = 'keyup',
  TouchEnd = 'touchend',
  TouchStart = 'touchstart',
  TransitionEnd = 'transitionend',
  Values = 'valuesUpdated',
}

export interface TextInput {
  inputmode: string,
  label: string,
  name: string,
  pattern: string,
  value: string,
}
