import { Calculations } from './calculations';

/** @const {string} */
const HIDDEN_ATTR = 'data-hidden';

/** @const {string} */
const INVALID_SELECTOR = ':invalid';

/**
 * @const {Array} UserInputs - HTML input elements.
 * @const {Object} UserInputs[]
 * @const {string} UserInputs[].label
 * @const {string} UserInputs[].name
 * @const {number} UserInputs[].max
 * @const {string} UserInputs[].pattern
 * @const {string} UserInputs[].type
 * @const {?boolean} UserInputs[].required
 */
const UserInputs = [
  {
    label: 'Principal',
    name: 'principal',
    max: 999999,
    pattern: '[0-9]+',
    type: 'number',
  },
  {
    label: 'Yearly addition',
    name: 'contribution',
    max: 999999,
    pattern: '[0-9]+',
    type: 'number',
  },
  {
    label: 'Interest rate',
    name: 'rate',
    max: '99',
    pattern: '[0-9]{0,2}[\\.]?[0-9]{1,2}',
    type: 'text',
  },
  {
    label: 'Compounds per period',
    name: 'compounds',
    max: 12,
    pattern: '[0-9]{1,2}',
    type: 'number',
  },
  {
    label: 'Years to grow',
    name: 'periods',
    min: 1,
    max: 100,
    pattern: '[0-9]+',
    type: 'number',
    required: true,
  }
];

/** @class */
class UserValues {
  /**
   * @param {!Object} config
   * @param {!string} config.currencyAttr
   * @param {!string} config.list
   * @param {!number} config.periods
   * @param {!string} config.storage
   * @param {!string} config.total
   */
  constructor(config) {
    /** @const {string} */
    this.currencyAttr = config.currencyAttr;

    /** @const {number} */
    this.periods = config.periods;

    /** @const {string} */
    this.storage = config.storage;

    /** @const {Element} */
    this.listEl = document.querySelector(config.list);

    /** @const {Element} */
    this.totalEl = document.querySelector(config.total);

    /** @instance */
    this.calculations = new Calculations({
      currencyAttr: 'data-currency',
      table: '.table',
      tableData: '.table__data',
    });
  }

  /**
   * Renders input fields for user-provided data, populates them if data exists,
   * and adds an observer and listener for user-provided changes.
   * @public
   */
  init() {
    this.createInputs_();
    const values = localStorage.getItem(this.storage);
    if (values) {
      this.populateInputs_(values);
      this.updateTotal();
    }
    this.calculations.tableCaption();
    this.updateOnChange_(this.currencyAttr);
  }

  /**
   * Creates and attaches input fields for user-provided values.
   * @private
   */
  createInputs_() {
    let html = '';

    UserInputs.forEach((el) => {
      const min = (el.min) ? `min="${el.min}"` : '';
      const max = (el.max) ? `max="${el.max}"` : '';
      const pattern = (el.pattern) ? `pattern="${el.pattern}"` : '';
      const required = (el.required) ? 'required' : '';

      const input = `
        <li id="${el.name}" class="values__item">
          <label for="${el.name}" class="values__label">${el.label}</label>
          <input class="values__input"
                 type="${el.type}"
                 name="${el.name}"
                 ${min}
                 ${max}
                 ${pattern}
                 ${required}
                 aria-label="${el.label}">
        </li>
      `;
      html += input;
    });

    this.listEl.innerHTML = html;
  }

  /**
   * Populates input fields with user-provided values.
   * @param {!string} data - User values from localStorage, converted from a string to an array.
   * @private
   */
  populateInputs_(data) {
    const values = data.split(',');

    for (let i = 0; i < values.length; i++) {
      const input = this.listEl.querySelectorAll('li')[i].querySelector('input');
      input.value = values[i];
    }
  }

  /**
   * Sets 'total' element's state via attribute on input change.
   * @private
   */
  setTotalState_() {
    const periodsEl = document.querySelector(this.periods);

    if (periodsEl.value <= 0) {
      this.totalEl.setAttribute(HIDDEN_ATTR, '');
    } else {
      this.totalEl.removeAttribute(HIDDEN_ATTR);
    }
  }

  /**
   * Watches an element's attributes for changes and updates
   * the total's value and/or state.
   * @param {!string} selector - CSS selector of element to observe.
   * @private 
   */
  updateOnChange_(selector) {
    const target = document.querySelector(selector);
    const config = {
      attributes: true,
    };
    const self = this;

    const observer = new MutationObserver((mutation) => {
      self.updateTotal();
    });

    observer.observe(target, config);
  }

  /**
   * Updates DOM element with total value after compounding.
   * @public
   */
  updateTotal() {
    let values = [];

    UserInputs.forEach((el) => {
      const el_ = document.querySelector(`[name=${el.name}]`);
      const value = Number(el_.value);
      values.push(value);
    });

    if (document.querySelectorAll(INVALID_SELECTOR).length === 0) {
      localStorage.setItem(this.storage, values);
      this.totalEl.textContent = this.calculations.compound(...values);
    }

    this.setTotalState_();
  }
}

export { UserValues };