require('dotenv').config();
import fastclick from 'fastclick';
import { App } from './modules/App';
import { Tools } from './modules/Tools';
import { UserValues } from'./modules/UserValues';
// import { registerServiceWorker } from './modules/registerServiceWorker';
import '../stylus/interest.styl';

/** @instance  */
const app = new App('app');

/** @instance */
const tools = new Tools();

/** @instance */
const userValues = new UserValues({
  currencyAttr: '[currency]',
  list: '.values__list',
  periods: '[name="periods"]',
  storage: 'values',
  total: '.values__total',
});

/**
 * Updates DOM in preparation for app initialization.
 * @listens DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', () => {
  app.init();
  tools.init();
}, { once: true });

/**
 * Initializes the app when the DOM is ready.
 * @listens 
 */
document.addEventListener('ready', () => {
  userValues.init();
  fastclick.attach(document.body);
  // registerServiceWorker();
}, { once: true });

/**
 * Toggles component states on user input.
 * @listens keyup
 */
document.addEventListener('keyup', () => {
  // expandable.setState();
  userValues.updateTotal();
});

/**
 * Updates 'vh' value when window is resized.
 * @listens resize
 */
window.addEventListener('resize', () => {
  utilities.viewportHeight();
}, { passive: true });