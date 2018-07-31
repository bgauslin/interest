import { Settings } from './modules/settings';
import { UserValues } from'./modules/userValues';
import { Utilities } from './modules/utilities';

/** @instance  */
const settings = new Settings('.mask', '.menu__content', '.settings__toggle');

/** @instance */
const userValues = new UserValues('.values__list', '.values__total');

/** @instance */
const utilities = new Utilities({
  domain: 'gauslin.com',
  id: 'UA-626192-11',
});

/** @description Waits until the DOM is ready to initialize app. */
document.addEventListener('DOMContentLoaded', () => {
  settings.init();
  userValues.init();
  utilities.init();
});

/** @description Updates DOM when user changes input values. */
document.addEventListener('keyup', () => {
  userValues.updateTotal();
});
