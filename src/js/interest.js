require('dotenv').config();
import fastclick from 'fastclick';
import { Expandable } from './modules/Expandable';
import { UserValues } from'./modules/UserValues';
import { Templates } from './modules/Templates';
import { Utilities } from './modules/Utilities';
// import { registerServiceWorker } from './modules/registerServiceWorker';
import '../stylus/interest.styl';

/** @instance */
const expandable = new Expandable({
  source: '[name="periods"]',
  storage: 'table',
  target: '.table',
  toggle: '.toggle__button',
});

/** @instance  */
const templates = new Templates('app');

/** @instance */
const userValues = new UserValues({
  currencyAttr: '[currency]',
  list: '.values__list',
  periods: '[name="periods"]',
  storage: 'values',
  total: '.values__total',
});

/** @instance */
const utilities = new Utilities();

/**
 * Updates DOM in preparation for app initialization.
 * @listens DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', () => {
  fastclick.attach(document.body);
  utilities.init();
  templates.init();
}, { once: true });

/**
 * Initializes the app when the DOM is ready.
 * @listens 
 */
document.addEventListener('ready', () => {
  userValues.init();
  expandable.init();
  // registerServiceWorker();
}, { once: true });

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