/** @const {string} */
const CHECKED_ATTR = 'checked';

/** @const {string} */
const INACTIVE_ATTR = 'inactive';

/**
 * @const {Object} Currencies - Currency information for display and formatting.
 * @const {string} Currencies.label
 * @const {string} Currencies.name
 * @const {Array} Currencies.options
 * @const {Object} Currencies.options[]
 * @const {string} Currencies.options[].isoSymbol
 * @const {string} Currencies.options[].label
 * @const {string} Currencies.options[].value
 */
const Currencies = {
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

/**
 * @const {Array} UserSettings
 * @const {Object} UserSettings[]
 * @const {string} UserSettings[].name
 * @const {string} UserSettings[].fallback
 * */
const UserSettings = [
  {
    name: 'theme',
    fallback: 'light',
  },
  {
    name: 'currency',
    fallback: 'usd',
  },
];

/**
 * @const {Object} Themes - Color theme options.
 * @const {string} Themes.label
 * @const {string} Themes.name
 * @const {Array} Themes.options
 * @const {Object} Themes.options[]
 * @const {string} Themes.options[].label
 * @const {string} Themes.options[].value
 */
const Themes = {
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

/** @class */
class Settings {
  /**
   * @param {!Object} config
   * @param {!string} config.mask
   * @param {!string} config.menu
   * @param {!string} config.toggle
   */
  constructor(config) {
    /** @const {Element} */
    this.mask = document.querySelector(config.mask);

    /** @const {Element} */
    this.menu = document.querySelector(config.menu);

    /** @const {Element} */
    this.toggle = document.querySelector(config.toggle);
  }

  /**
   * Creates settings fields and populates them with user preferences or defaults.
   * @public
   */
  init() {
    // Attach settings elements to DOM and set defaults for first run.
    let html = '';
    UserSettings.forEach((setting) => {
      const { name, fallback } = setting;
      html += `<div class="menu__group" data-setting="${name}"></div>`;
      this.setOption_(name, fallback);
    });
    this.menu.innerHTML = html;

    // Populate settings elements.
    this.makeOptions_(Themes, Themes.name);
    this.makeOptions_(Currencies, Currencies.name);

    // Set up element listeners.
    this.initToggle_();
  }

  /**
   * Sets an attribute on the body element and saves it to localStorage.
   * @param {!string} name - The attribute to set on the body element.
   * @param {!string} value - The value of the body attribute.
   * @private
   */
  changeOption_(name, value) {
    document.body.setAttribute(`data-${name}`, value);
    localStorage.setItem(name, value);
  }

  /**
   * Hides overlay mask.
   * @private
   */
  disableMask_() {
    this.mask.setAttribute(INACTIVE_ATTR, '');
  }

  /**
   * Shows overlay mask and adds a one-time click listener.
   * @private
   */
  enableMask_() {
    this.mask.removeAttribute(INACTIVE_ATTR);
    this.mask.addEventListener('click', () => {
      this.toggle.checked = false;
      this.disableMask_();
    }, { once: true });
  }

  /**
   * Initializes menu toggle and overlay mask.
   * @private
   */
  initToggle_() {
    this.toggle.addEventListener('click', () => {
      if (this.mask.hasAttribute(INACTIVE_ATTR)) {
        this.enableMask_();
      } else {
        this.disableMask_();
      }
    });
  }

  /**
   * Creates all 'settings' options and attaches them to the DOM.
   * @param {!Object} data - All options data.
   * @param {!string} data.label
   * @param {!string} data.name
   * @param {!string} data.options
   * @param {!string} selector - Element that options are attached to.
   * @private
   */
  makeOptions_(data, selector) {
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

    this.updateOptions_(name);
  }

  /**
   * Adds an attribute with a value and saves it to localStorage.
   * @param {!string} name - Name of the localStorage item and attribute to set.
   * @param {?string=} fallback - Default value if none is stored yet.
   * @private
   */
  setOption_(name, fallback = '') {
    const stored = localStorage.getItem(name);
    const value = (stored) ? stored : fallback.toLowerCase();
    document.body.setAttribute(`data-${name}`, value);
    localStorage.setItem(name, value);
  }

  /**
   * Sets current option and adds a listener to each option.
   * @param {!string} option - Attribute to set on the body element, which is also the 'name' of the input.
   * @private
   */
  updateOptions_(option) {
    const currentAttr = document.body.getAttribute(`data-${option}`);

    [...document.querySelectorAll(`[name=${option}]`)].forEach((input) => {
      if (currentAttr == input.value) {
        input.setAttribute(CHECKED_ATTR, '');
      }
      input.addEventListener('click', () => {
        this.changeOption_(option, input.value);
      });
    });
  }
}

export { Settings };