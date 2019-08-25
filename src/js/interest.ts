require('dotenv').config();
import { App } from './modules/App';
import { Expandable } from './components/Expandable';
import { Tools } from './modules/Tools';
import { UserSettings } from './components/UserSettings';
import { UserValues } from'./components/UserValues';
import '../stylus/interest.styl'; // Stylesheet for Webpack

/** 
 * Define all custom elements.
 */
customElements.define('my-expandable', Expandable);
customElements.define('user-settings', UserSettings);
customElements.define('user-values', UserValues);

/** 
 * Create class instances.
 */ 
const app = new App('#app');
const tools = new Tools();

/**
 * Initialize app when DOM is loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
  app.init();
  tools.init();
}, { once: true });

/**
 * Update 'vh' value when window is resized.
 */
window.addEventListener('resize', () => {
  tools.viewportHeight();
}, { passive: true });