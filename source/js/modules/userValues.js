import { setExpandableState, setToggleLabel, toggleButtonState } from './expandable';
import { compound } from './calculations';


/**
 * @type {Array} HTML input elements.
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
   * @param {string} list: Element selector...
   * @param {string} total: Element selector...
   */
  constructor(list, total) {
    this.listEl = document.querySelector(list);
    this.totalEl = document.querySelector(total);
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

  updateOnCurrencyChange() {
    // TODO: add a mutation observer that calls updateTotal() when a body
    // attribute has changed.

    // https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
    // https://stackoverflow.com/questions/4561845/firing-event-on-dom-attribute-change/4561975
  }

  init() {
    this.createInputs();
    setExpandableState(); // TODO: handle this differently
    setToggleLabel(); // TODO: handle this differently

    const values = localStorage.getItem(STORAGE_ITEM_VALUES);
    if (values) {
      this.populateInputs(values);
      this.updateTotal();
    } else {
      toggleButtonState(0); // TODO: handle this differently
    }
  }
}


export { UserValues };
