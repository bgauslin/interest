import { Calculations } from './calculations';

/** @instance */
const calculations = new Calculations({
  currencyAttr: 'data-currency',
  table: '.table',
  tableData: '.table__data',
});

/** @const {string} */
const HIDDEN_ATTR = 'data-hidden';

/**
 * @type {Array{userInputs}} HTML input elements.
 * userInputs {
 *   label: string,
 *   name: string,
 *   max: number,
 *   pattern: string,
 *   type: string,
 * }
 */
const USER_INPUTS = [
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

/** @const {string} */
const INVALID_ATTR = ':invalid';

/** @class */
class UserValues {
  /**
   * @param {Object{userValues}} config
   * userValues {
   *   currencyAttr: string,
   *   list: string,
   *   storage: string,
   *   total: string,
   * }
   */
  constructor(config) {
    this.currencyAttr = config.currencyAttr;
    this.periods = config.periods;
    this.storage = config.storage;
    this.listEl = document.querySelector(config.list);
    this.totalEl = document.querySelector(config.total);
  }

  /** @description Creates and attaches input fields for user-provided values. */
  createInputs() {
    let html = '';

    USER_INPUTS.forEach((el) => {
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
                 ${required}>
        </li>
      `;
      html += input;
    });

    this.listEl.innerHTML = html;
  }

  /**
   * Populates input fields with user-provided values.
   * @param {!string} data: User values from localStorage, converted from a
   * string to an array.
   */
  populateInputs(data) {
    const values = data.split(',');

    for (let i = 0; i < values.length; i++) {
      const input = this.listEl.querySelectorAll('li')[i].querySelector('input');
      input.value = values[i];
    }
  }

  /** @description Sets 'total' element's state via attribute on input change. */
  setTotalState() {
    const periodsEl = document.querySelector(this.periods);

    if (periodsEl.value <= 0) {
      this.totalEl.setAttribute(HIDDEN_ATTR, '');
    } else {
      this.totalEl.removeAttribute(HIDDEN_ATTR);
    }
  }

  /** @description Updates DOM element with the total value after compounding. */
  updateTotal() {
    let values = [];

    USER_INPUTS.forEach((el) => {
      const el_ = document.querySelector(`[name=${el.name}]`);
      const value = Number(el_.value);
      values.push(value);
    });

    if (document.querySelectorAll(INVALID_ATTR).length === 0) {
      localStorage.setItem(this.storage, values);
      this.totalEl.textContent = calculations.compound(...values);
    }

    this.setTotalState();
  }

  /**
   * @description Watches an element's attributes for changes and updates
   * the total's value and/or state.
   */
  updateOnChange(selector) {
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
   * @description Renders user-provided input fields, populates them if data
   * exists, and adds an observer and listener for user-provided changes.
   */
  init() {
    this.createInputs();
    const values = localStorage.getItem(this.storage);
    if (values) {
      this.populateInputs(values);
      this.updateTotal();
    }
    calculations.tableCaption();
    this.updateOnChange(this.currencyAttr);
  }
}


export { UserValues };
