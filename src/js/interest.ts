require('dotenv').config();

import './custom_elements/app/app';
import './custom_elements/expandable/expandable';
import './custom_elements/shifty_header/shifty_header';
import './custom_elements/user_settings/user_settings';
import './custom_elements/user_values/user_values';
import './custom_elements/visibility_toggle/visibility_toggle';

// Import styles for injecting into the DOM.
import '../stylus/interest.styl';

// Register the Service Worker.
if (process.env.NODE_ENV === 'production') {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
    });
  }
}