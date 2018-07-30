import { CURRENCIES } from './currency';
import { updateTotal } from'./inputs';
import { MODES, THEMES } from './theming';


/** @enum {Object} TODO: ... */
const Selectors = {
  CURRENCY: '[setting=currency]',
  MASK: '.mask',
  MENU: '.menu__content',
  THEME: '[setting=theme]',
  TOGGLE: '.settings__toggle',
};

/** @enum {Array} TODO: ... */
const SETTINGS = [
  {
    name: 'theme',
    fallback: 'light',
  },
  {
    name: 'currency',
    fallback: 'usd',
  },
];

/** @const {string} */
const CHECKED_ATTR = 'checked';

/** @const {string} */
const INACTIVE_ATTR = 'inactive';

/** @const {HTMLElement} */
const MASK_EL = document.querySelector(Selectors.MASK);

/** @const {HTMLElement} */
const MENU_EL = document.querySelector(Selectors.MENU);

/** @const {HTMLElement} */
const TOGGLE_EL = document.querySelector(Selectors.TOGGLE);

/** @class */
export default class {
  /**
   * @description Sets an attribute on the body element and saves it to
   * localStorage.
   * @param {!string} name: The attribute to set on the body element.
   * @param {!string} value: The value of the body attribute.
   */
  changeOption(name, value) {
    document.body.setAttribute(name, value);
    localStorage.setItem(name, value);
    updateTotal();
    return;
  }

  /** @description Hides overlay mask. */
  disableMask() {
    MASK_EL.setAttribute(INACTIVE_ATTR, '');
    return;
  }

  /** @description Shows overlay mask and adds a click listener. */
  enableMask() {
    MASK_EL.removeAttribute(INACTIVE_ATTR);
    MASK_EL.addEventListener('click', () => {
      TOGGLE_EL.checked = false;
      this.disableMask();
    }, { once: true });

    return;
  }

  /** @description Initializes menu toggle and overlay mask. */
  initToggle() {
    TOGGLE_EL.addEventListener('click', () => {
      if (MASK_EL.hasAttribute(INACTIVE_ATTR)) {
        this.enableMask();
      } else {
        this.disableMask();
      }
      return;
    });
  }

  /**
   * @description Creates settings options and attaches them to the DOM.
   * @param {!Object} data: Object containing the options data.
   * @param {!string} selector: Element that options are attached to.
   */
  makeOptions(data, selector) {
    const target = document.querySelector(selector);
    const { label, name, options } = data;
    let html = '';

    html += `
      <h4 class="menu__heading">${label}</h4>
      <ul class="menu__list">
    `;

    options.forEach((option) => {
      const item = `
        <li class="item" type="${name}">
          <label class="item__label">
            <input class="option" type="radio" name="${name}" value="${option.value}">
            <span class="option__label" option="${option.value}">${option.label}</span>
          </label>
        </li>
      `;

      html += item;
    });

    html += `</ul>`;
    target.innerHTML = html;
    this.updateOptions(name);

    return;
  }

  /**
   * @description Creates settings fields and populates them with user
   * preferences and/or defaults.
   */
  scaffold () {
    let html = '';

    // Attaches settings elements to DOM and creates defaults for first run.
    SETTINGS.forEach((setting) => {
      const { name, fallback } = setting;
      html += `<div class="menu__group" setting="${name}"></div>`;
      this.setOption(name, fallback);
    });

    MENU_EL.innerHTML = html;

    // Populate settings elements.
    this.makeOptions(THEMES, Selectors.THEME);
    this.makeOptions(CURRENCIES, Selectors.CURRENCY);

    // Set up element listeners.
    this.initToggle();

    return;
  };

  /**
   * @description Adds an attribute with a value, and saves it to localStorage.
   * @param {!string} name: Name of the localStorage item and attribute to set.
   * @param {?string=} fallback: Default value if none is stored yet.
   */
  setOption(name, fallback='') {
    let value;

    const stored = localStorage.getItem(name);
    if (stored) {
      value = stored; // Use previously stored value.
    } else {
      value = fallback.toLowerCase(); // Set value to fallback.
    }

    document.body.setAttribute(name, value);
    localStorage.setItem(name, value);

    return;
  }

  /**
   * @description Sets current option and adds listeners to each option.
   * @param {!string} option: Attribute to set on the body element; also the
   * name of the input.
   */
  updateOptions(option) {
    const currentAttr = document.body.getAttribute(option);

    [...document.querySelectorAll(`[name=${option}]`)].forEach((input) => {
      if (currentAttr == input.value) {
        input.setAttribute(CHECKED_ATTR, '');
      }
      input.addEventListener('click', () => {
        this.changeOption(option, input.value);
      });
    });
  }
}
