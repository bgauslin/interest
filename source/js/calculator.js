import { STORAGE_ITEM_VALUES, updateTotal } from './modules/calculations';
import { setCollapsibleState, setToggleLabel, toggleButtonState } from './modules/collapsible';
// import { googleAdSense } from './modules/googleAdSense'
import { googleAnalytics } from './modules/googleAnalytics'
import { createInputs, inputValues, populateInputs } from'./modules/inputs';
import Settings from './modules/settings';
import { hasJs, noTouch } from './modules/utilities';


/** @enum {string} Google Analytics settings. */
const AnalyticsConfig = {
  domain: 'gauslin.com',
  id: 'UA-626192-11',
}

/**
 * @description Initializes the app.
 */
const init = () => {
  // Set body attributes and make settings menu.
  hasJs();
  noTouch();

  const settings = new Settings();
  settings.scaffold();

  // Create main UI.
  createInputs();
  setCollapsibleState();
  setToggleLabel();

  // Update UI based on previous visit.
  const values = localStorage.getItem(STORAGE_ITEM_VALUES);
  if (values) {
    populateInputs(values);
    updateTotal(inputValues());
  } else {
    toggleButtonState(0);
  }

  // Third-party scripts.
  googleAnalytics(AnalyticsConfig);
  // googleAdSense();
}

/**
 * @description Waits until the DOM is ready.
 */
document.addEventListener('DOMContentLoaded', () => {
  init();
});

/**
 * @description Updates DOM when user changes input values.
 */
document.addEventListener('keyup', () => {
  updateTotal(inputValues());
});
