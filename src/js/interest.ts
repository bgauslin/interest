require('dotenv').config();
import { App } from './modules/App';
import { Tools } from './modules/Tools';

// Stylesheet for Webpack
import '../stylus/interest.styl';

const app = new App('#app');
const tools = new Tools();

/**
 * Updates DOM with all app elements.
 * @listens DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', () => {
  app.init();
  tools.init();
}, { once: true });

/**
 * Updates 'vh' value when window is resized.
 * @listens resize
 */
window.addEventListener('resize', () => {
  tools.viewportHeight();
}, { passive: true });