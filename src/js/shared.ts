export const Currencies = [
  {id: 'usd', locale: 'en-US', symbol: '$', label: 'Dollars'},
  {id: 'eur', locale: 'en-GB', symbol: '€', label: 'Euros'},
  {id: 'gbp', locale: 'en-GB', symbol: '£', label: 'Pounds'},
  {id: 'cny', locale: 'zh-CN', symbol: '¥', label: 'Yen'},
  {id: 'inr', locale: 'en-IN', symbol: '₹', label: 'Rupees'},
];

export const DEFAULT_CURRENCY = Currencies[0].id;

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
