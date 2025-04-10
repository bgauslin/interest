export const STORAGE_ITEM = 'interest';

export enum AppEvents {
  CURRENCY = 'currencyUpdated',
  DRAWER = 'drawerUpdated',
  VALUES = 'valuesUpdated',
}

export interface TextInput {
  inputmode: string,
  label: string,
  name: string,
  pattern: string,
  value: string,
}
