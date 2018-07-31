import { setExpandableState, setToggleLabel, toggleButtonState } from './modules/expandable';
import { Settings } from './modules/settings';
import { STORAGE_ITEM_VALUES, UserValues } from'./modules/userValues';
import { Utilities } from './modules/utilities';


/** @instance  */
const settings = new Settings();

/** @instance */
const userValues = new UserValues('.values__list', '.values__total');

/** @instance */
const utilities = new Utilities({
  domain: 'gauslin.com',
  id: 'UA-626192-11',
});

/** @description Initializes the app. */
const init = () => {
  utilities.init(); // Set body attributes and start GA.
  settings.scaffold(); // Make settings menu.

  // Create primary UI.
  userValues.createInputs();
  setExpandableState();
  setToggleLabel();

  // Update UI based on previous visit.
  const values = localStorage.getItem(STORAGE_ITEM_VALUES);
  if (values) {
    userValues.populateInputs(values);
    userValues.updateTotal();
  } else {
    toggleButtonState(0);
  }
}

/** @description Waits until the DOM is ready to initialize app. */
document.addEventListener('DOMContentLoaded', () => {
  init();
});

/** @description Updates DOM when user changes input values. */
document.addEventListener('keyup', () => {
  userValues.updateTotal();
});
