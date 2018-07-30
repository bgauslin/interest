import { setCollapsibleState, setToggleLabel, toggleButtonState } from './modules/collapsible';
import { googleAnalytics } from './modules/googleAnalytics'
import Settings from './modules/settings';
import { STORAGE_VALUES, createInputs, populateInputs, updateTotal } from'./modules/userValues';
import { hasJs, noTouch } from './modules/utilities';


/** @enum {string} Google Analytics settings. */
const AnalyticsConfig = {
  domain: 'gauslin.com',
  id: 'UA-626192-11',
}

/** @const {Object} */
const settings = new Settings();

/** @description Initializes the app. */
const init = () => {
  // Set body attributes and make settings menu.
  hasJs();
  noTouch();
  settings.scaffold();

  // Create primary UI.
  createInputs();
  setCollapsibleState();
  setToggleLabel();

  // Update UI based on previous visit.
  const values = localStorage.getItem(STORAGE_VALUES);
  if (values) {
    populateInputs(values);
    updateTotal();
  } else {
    toggleButtonState(0);
  }

  // Load third-party scripts.
  googleAnalytics(AnalyticsConfig);
}

/** @description Waits until the DOM is ready to initialize app. */
document.addEventListener('DOMContentLoaded', () => {
  init();
});

/** @description Updates DOM when user changes input values. */
document.addEventListener('keyup', () => {
  updateTotal();
});
