require('dotenv').config();

import { App } from './modules/App';
import { Expandable } from './components/Expandable';
import { UserSettings } from './components/UserSettings';
import { UserValues } from'./components/UserValues';
import '../stylus/interest.styl';

// Define all custom elements.
const map = new Map();
map.set(Expandable, 'my-expandable');
map.set(UserSettings, 'user-settings');
map.set(UserValues, 'user-values');
map.forEach((key, value) => customElements.define(key, value));

// Create app instance and initialize it.
const app = new App('#app');
app.init();
