export const Currencies = new Map([
  ['USD', ['$', 'Dollars', 'en-US']],
  ['EUR', ['€', 'Euros', 'es-ES']],
  ['GBP', ['£', 'Pounds', 'en-GB']],
  ['JPY', ['¥', 'Yen', 'ja-JP']],
  ['INR', ['₹', 'Rupees', 'en-IN']],
]);

export const DEFAULT_CURRENCY = 'USD';

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
  ValuesCleared = 'valuesCleared',
}

export interface CompoundingValues {
  contribution: number,
  periods: number,
  principal: number,
  rate: number,
}

export interface Sums {
  balance: string,
  deposits: string,
  growth: string,
  interest: string,
  year: string,
}
