require('dotenv').config();
import { App } from './modules/App';
import { Tools } from './modules/Tools';
// import { registerServiceWorker } from './modules/registerServiceWorker';
import '../stylus/interest.styl';

/** @instance  */
const app = new App('app');

/** @instance */
const tools = new Tools();

/**
 * Updates DOM with all app elements.
 * @listens DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', () => {
<<<<<<< HEAD
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
  fastclick.attach(document.body);
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
=======
  app.init();
  tools.init();
}, { once: true });

/**
>>>>>>> custom_elements
 * Updates 'vh' value when window is resized.
 * @listens resize
 */
window.addEventListener('resize', () => {
  tools.viewportHeight();
}, { passive: true });