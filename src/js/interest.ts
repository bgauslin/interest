require('dotenv').config();
import { App } from './modules/App';
import { Tools } from './modules/Tools';
import '../stylus/interest.styl'; // Stylesheet for Webpack

const app = new App('#app');
const tools = new Tools();

/**
 * Initializes app when DOM is loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
  app.init();
  tools.init();
}, { once: true });

/**
 * Updates 'vh' value when window is resized.
 */
window.addEventListener('resize', () => {
  tools.viewportHeight();
}, { passive: true });