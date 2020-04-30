require('dotenv').config();

import {App} from './modules/App';
import {Expandable} from './custom_elements/Expandable';
import {ShiftyHeader} from './custom_elements/ShiftyHeader';
import {UserSettings} from './custom_elements/UserSettings';
import {UserValues} from'./custom_elements/UserValues';
import {VisibilityToggle} from'./custom_elements/VisibilityToggle';

// Import styles for injecting into the DOM.
import '../stylus/interest.styl';

// Define all custom elements.
const map = new Map();
map.set(Expandable, 'app-expandable');
map.set(ShiftyHeader, 'app-header');
map.set(UserSettings, 'user-settings');
map.set(UserValues, 'user-values');
map.set(VisibilityToggle, 'visibility-toggle');
map.forEach((key, value) => customElements.define(key, value));

// Initialize the app.
window.addEventListener('DOMContentLoaded', () => new App().init());

// Register the Service Worker.
if (process.env.NODE_ENV === 'production') {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
    });
  }
}