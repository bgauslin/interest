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
const map = new Map();
map.set(Expandable, 'my-expandable');
map.set(UserSettings, 'user-settings');
map.set(UserValues, 'user-values');
map.forEach((key, value) => customElements.define(key, value));

/** 
 * Create class instances and initialize them.
 */ 
const app = new App('#app');
const tools = new Tools();

app.init();
tools.init();

/**
 * Update 'vh' value when window is resized.
 */
window.addEventListener('resize', () => {
  tools.viewportHeight();
}, { passive: true });