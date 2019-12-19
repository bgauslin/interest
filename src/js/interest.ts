require('dotenv').config();

import {App} from './modules/App';
import {Expandable} from './components/Expandable';
import {ShiftyHeader} from './components/ShiftyHeader';
import {UserSettings} from './components/UserSettings';
import {UserValues} from'./components/UserValues';

import '../stylus/interest.styl';

// Define all custom elements.
const map = new Map();
map.set(Expandable, 'my-expandable');
map.set(ShiftyHeader, 'app-header');
map.set(UserSettings, 'user-settings');
map.set(UserValues, 'user-values');
map.forEach((key, value) => customElements.define(key, value));

// Initialize the app.
window.addEventListener('DOMContentLoaded', () => new App().init());

// Register the Service Worker.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}
