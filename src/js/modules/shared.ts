export const STORAGE_ITEM = 'interest';

export enum Events {
  Click = 'click',
  Currency = 'currencyUpdated',
  Drawer = 'drawerUpdated',
  Keydown = 'keydown',
  Touchend = 'touchend',
  Touchstart = 'touchstart',
  Values = 'valuesUpdated',
}

export interface TextInput {
  inputmode: string,
  label: string,
  name: string,
  pattern: string,
  value: string,
}
