import { compound } from './calculations';

/**
 * @type {Array{Object{label: string, name: string, max: number, pattern: string, type: string}}}
 * HTML input elements.
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

/** @const {string} localStorage item containing user-provided input values. */
const STORAGE_ITEM_VALUES = 'values';

/** @class */
class UserValues {
  /**
   * @param {Object{list: string, total: string}} selectors: Element selectors.
   */
  constructor(selectors) {
    this.listEl = document.querySelector(selectors.list);
    this.totalEl = document.querySelector(selectors.total);
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

  /** @description Updates DOM element with the total value after compounding. */
  updateTotal() {
    let values = [];

    USER_INPUTS.forEach((el) => {
      const el_ = document.querySelector(`[name=${el.name}]`);
      const value = Number(el_.value);
      values.push(value);
    });

    if (document.querySelectorAll(':invalid').length === 0) {
      localStorage.setItem(STORAGE_ITEM_VALUES, values);
      this.totalEl.textContent = compound(...values);
    }
  }

  /** @description ... */
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

  /** @description ... */
  init() {
    this.createInputs();

    const values = localStorage.getItem(STORAGE_ITEM_VALUES);
    if (values) {
      this.populateInputs(values);
      this.updateTotal();
    }

    this.updateOnChange('[data-currency]');

    // Update DOM when user changes input values.
    document.addEventListener('keyup', () => {
      this.updateTotal();
    });
  }
}


export { UserValues };
