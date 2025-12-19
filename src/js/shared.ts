export const Currencies = new Map([
  ['USD', ['$', 'Dollar', 'en-US']],
  ['EUR', ['€', 'Euro', 'es-ES']],
  ['GBP', ['£', 'Pound', 'en-GB']],
  ['JPY', ['¥', 'Yen', 'ja-JP']],
  ['KRW', ['₩', 'Won', 'ko-KR']],
  ['INR', ['₹', 'Rupee', 'en-IN']],
  ['TRY', ['₺', 'Lira', 'tr-TR']],
  ['RUB', ['₽', 'Ruble', 'ru-RU']],
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
