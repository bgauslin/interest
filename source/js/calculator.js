import { setExpandableState, setToggleLabel, toggleButtonState } from './modules/expandable';
import { Settings } from './modules/settings';
import { STORAGE_VALUES, UserValues } from'./modules/userValues';
import { googleAnalytics, hasJs, noTouch } from './modules/utilities';


/** @enum {string} Google Analytics settings. */
const AnalyticsConfig = {
  domain: 'gauslin.com',
  id: 'UA-626192-11',
}

/** @const {class} */
const settings = new Settings();

/** @const {class} */
const userValues = new UserValues();


/** @description Initializes the app. */
const init = () => {
  // Set body attributes and make settings menu.
  hasJs();
  noTouch();
  settings.scaffold();

  // Create primary UI.
  userValues.createInputs();
  setExpandableState();
  setToggleLabel();

  // Update UI based on previous visit.
  const values = localStorage.getItem(STORAGE_VALUES);
  if (values) {
    userValues.populateInputs(values);
    userValues.updateTotal();
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
  userValues.updateTotal();
});
