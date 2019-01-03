/**
 * @type {Object} Currency information for display and formatting.
 */
const CURRENCIES = {
  label: 'Currency',
  name: 'currency',
  options: [
    {
      isoSymbol: 'USD',
      label: '$',
      value: 'usd',
    },
    {
      isoSymbol: 'EUR',
      label: '€',
      value: 'eur',
    },
    {
      isoSymbol: 'GBP',
      label: '£',
      value: 'gbp',
    },
    {
      isoSymbol: 'YEN',
      label: '¥',
      value: 'yen',
    },
    {
      isoSymbol: 'INR',
      label: '₹',
      value: 'inr',
    },
  ],
};

/** @enum {Array} */
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

/** @enum {Object} Color theme options. */
const THEMES = {
  label: 'Theme',
  name: 'theme',
  options: [
    {
      label: 'Light',
      value: 'light',
    },
    {
      label: 'Sepia',
      value: 'sepia',
    },
    {
      label: 'Dark',
      value: 'dark',
    },
  ],
};

/** @const {string} */
const CHECKED_ATTR = 'checked';

/** @const {string} */
const INACTIVE_ATTR = 'inactive';

/** @class */
class Settings {
  /**
   * @param {!Object} config
   * @param {!string} config.mask
   * @param {!string} config.menu
   * @param {!string} config.toggle
   */
  constructor(config) {
    this.mask = document.querySelector(config.mask);
    this.menu = document.querySelector(config.menu);
    this.toggle = document.querySelector(config.toggle);
  }

  /**
   * @description Creates settings fields and populates them with user
   * preferences or defaults.
   */
  init () {
    // Attach settings elements to DOM and set defaults for first run.
    let html = '';
    SETTINGS.forEach((setting) => {
      const { name, fallback } = setting;
      html += `<div class="menu__group" data-setting="${name}"></div>`;
      this.setOption(name, fallback);
    });
    this.menu.innerHTML = html;

    // Populate settings elements.
    this.makeOptions(THEMES, THEMES.name);
    this.makeOptions(CURRENCIES, CURRENCIES.name);

    // Set up element listeners.
    this.initToggle();
  }

  /**
   * @description Sets an attribute on the body element and saves it to
   * localStorage.
   * @param {!string} name - The attribute to set on the body element.
   * @param {!string} value - The value of the body attribute.
   */
  changeOption(name, value) {
    document.body.setAttribute(`data-${name}`, value);
    localStorage.setItem(name, value);
  }

  /**
   * @description Hides overlay mask.
   */
  disableMask() {
    this.mask.setAttribute(INACTIVE_ATTR, '');
  }

  /**
   * @description Shows overlay mask and adds a click listener.
   */
  enableMask() {
    this.mask.removeAttribute(INACTIVE_ATTR);
    this.mask.addEventListener('click', () => {
      this.toggle.checked = false;
      this.disableMask();
    }, { once: true });
  }

  /**
   * @description Initializes menu toggle and overlay mask.
   */
  initToggle() {
    this.toggle.addEventListener('click', () => {
      if (this.mask.hasAttribute(INACTIVE_ATTR)) {
        this.enableMask();
      } else {
        this.disableMask();
      }
    });
  }

  /**
   * @description Creates settings options and attaches them to the DOM.
   * @param {!Object} data - All options data.
   * @param {!string} data.label
   * @param {!string} data.name
   * @param {!string} data.options
   * @param {!string} selector - Element that options are attached to.
   */
  makeOptions(data, selector) {
    const target = document.querySelector(`[data-setting="${selector}"]`);
    const { label, name, options } = data;
    let html = '';
    html += `<ul class="menu__list">`;
    options.forEach((option) => {
      const item = `
        <li class="item" data-type="${name}">
          <label class="item__label">
            <input class="option" type="radio" name="${name}" value="${option.value}">
            <span class="option__label" data-option="${option.value}">${option.label}</span>
          </label>
        </li>
      `;
      html += item;
    });
    html += `</ul>`;
    target.innerHTML = html;

    this.updateOptions(name);
  }

  /**
   * @description Adds an attribute with a value, and saves it to localStorage.
   * @param {!string} name - Name of the localStorage item and attribute to set.
   * @param {?string=} fallback - Default value if none is stored yet.
   */
  setOption(name, fallback='') {
    const stored = localStorage.getItem(name);
    const value = (stored) ? stored : fallback.toLowerCase();
    document.body.setAttribute(`data-${name}`, value);
    localStorage.setItem(name, value);
  }

  /**
   * @description Sets current option and adds listeners to each option.
   * @param {!string} option - Attribute to set on the body element; also the
   * name of the input.
   */
  updateOptions(option) {
    const currentAttr = document.body.getAttribute(`data-${option}`);

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

export { Settings };