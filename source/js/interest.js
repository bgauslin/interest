import { Expandable } from './modules/Expandable';
import { Settings } from './modules/Settings';
import { UserValues } from'./modules/UserValues';
import { Utilities } from './modules/Utilities';
// import { registerServiceWorker } from './modules/registerServiceWorker';

/** @instance */
const expandable = new Expandable({
  source: '[name="periods"]',
  storage: 'table',
  target: '.table',
  toggle: '.toggle__button',
});

/** @instance  */
const settings = new Settings({
  mask: '.mask',
  menu: '.menu__content',
  toggle: '.settings__toggle',
});

/** @instance */
const userValues = new UserValues({
  currencyAttr: '[data-currency]',
  list: '.values__list',
  periods: '[name="periods"]',
  storage: 'values',
  total: '.values__total',
});

/** @instance */
const utilities = new Utilities({
  analyticsSettings: {
    domain: 'interest.gauslin.com',
    id: 'UA-626192-19',
  },
});

/**
 * Initialize app when DOM is ready.
 * @listens DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', () => {
  settings.init();
  userValues.init();
  expandable.init();
  utilities.init();
  // registerServiceWorker();
});

/**
 * Toggles component states on user input.
 * @listens keyup
 */
document.addEventListener('keyup', () => {
  expandable.setState();
  userValues.updateTotal();
});

/**
 * Updates 'vh' value when window is resized.
 * @listens resize
 */
window.addEventListener('resize', () => {
  utilities.viewportHeight();
}, { passive: true });