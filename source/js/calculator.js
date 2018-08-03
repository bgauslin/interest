import { Expandable } from './modules/expandable';
import { Settings } from './modules/settings';
import { UserValues } from'./modules/userValues';
import { Utilities } from './modules/utilities';
import { registerServiceWorker } from './modules/registerServiceWorker';

/** @instance */
const expandable = new Expandable({
  storage: 'table',
  target: '.table',
  toggle: '.toggle__button',
  trigger: '[name="periods"]',
});

/** @instance  */
const settings = new Settings({
  mask: '.mask',
  menu: '.menu__content',
  toggle: '.settings__toggle',
});

/** @instance */
const userValues = new UserValues({
  list: '.values__list',
  periods: '[name="periods"]',
  storage: 'values',
  total: '.values__total',
  currencyAttr: '[data-currency]',
});

/** @instance */
const utilities = new Utilities({
  analyticsSettings: {
    domain: 'gauslin.com',
    id: 'UA-626192-11',
  },
});

/** @description Waits until the DOM is ready to initialize app. */
document.addEventListener('DOMContentLoaded', () => {
  settings.init();
  userValues.init();
  expandable.init();
  utilities.init();
  registerServiceWorker();
});

/** @description Toggles component states on user input. */
document.addEventListener('keyup', () => {
  expandable.setState();
  userValues.updateTotal();
});
