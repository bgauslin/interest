require('dotenv').config();
import fastclick from 'fastclick';
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
  app.init();
  tools.init();
  fastclick.attach(document.body);
}, { once: true });

/**
 * Updates 'vh' value when window is resized.
 * @listens resize
 */
window.addEventListener('resize', () => {
  tools.viewportHeight();
}, { passive: true });