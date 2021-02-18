require('dotenv').config();

import './custom_elements/expandable/expandable';
import './custom_elements/settings/settings';
import './custom_elements/tools/tools';
import './custom_elements/user_values/user_values';
import './custom_elements/visibility_toggle/visibility_toggle';

import '../stylus/index.styl';

if (process.env.NODE_ENV === 'production') {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
    });
  }
}