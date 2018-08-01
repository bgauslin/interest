import { Expandable } from './modules/expandable';
import { Settings } from './modules/settings';
import { UserValues } from'./modules/userValues';
import { Utilities } from './modules/utilities';

/** @instance  */
const settings = new Settings({
  mask: '.mask',
  menu: '.menu__content',
  toggle: '.settings__toggle',
});

/** @instance */
const userValues = new UserValues({
  list: '.values__list',
  total: '.values__total'
});

/** @instance */
const utilities = new Utilities({
  domain: 'gauslin.com',
  id: 'UA-626192-11',
});

/** @instance */
const expandable = new Expandable({
  target: '.table',
  toggle: '.toggle__button',
  trigger: '[name="periods"]',
});

/** @description Waits until the DOM is ready to initialize app. */
document.addEventListener('DOMContentLoaded', () => {
  settings.init();
  userValues.init();
  expandable.init();
  utilities.init();
});
