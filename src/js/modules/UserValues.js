import { Calculations } from './Calculations';

/** @const {string} */
const HIDDEN_ATTR = 'hidden';

/** @const {string} */
const LOCAL_STORAGE = 'values';

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
class UserValues extends HTMLElement {
  constructor() {
    super();

    /** @private {?Element} */
    this.currencyEl_ = null;

    /** @private {?Element} */
    this.listEl_ = null;

    /** @private {?Element} */
    this.totalEl_ = null;

    this.addEventListener('keyup', () => {
      this.updateTotal_();
    });

    this.observer_ = new MutationObserver(() => {
      this.updateTotal_();
    });
  }

  /** @callback */
  connectedCallback() {
    this.setupDom_();
    this.setValues_();
    this.setVisibility_();
    this.currencyEl_ = document.querySelector('[currency]');
    this.observer_.observe(this.currencyEl_, { attributes: true });
  }

  /** @callback */
  disconnectedCallback() {
    this.observer_.disconnect();
  }

  /**
   * Inserts HTML elements into the DOM.
   * @private
   */
  setupDom_() {
    this.innerHTML = `
      <ul class="values__list"></ul>
      <div class="values__total"></div>
    `;
  }

  /**
   * TODO: Add comment here...
   * @private
   */
  setValues_() {
    this.listEl_ = this.querySelector('.values__list');
    this.totalEl_ = this.querySelector('.values__total');

    if (this.listEl_ && this.totalEl_) {

      this.calculations = new Calculations({
        currencyAttr: 'currency',
        table: '.table',
        tableData: '.table__data',
      });

      this.createInputs_();
      const values = localStorage.getItem(LOCAL_STORAGE);

      if (values) {
        this.populateInputs_(values);
        this.updateTotal_();
      }
    }
  }

  /**
   * Creates and attaches input fields for user-provided values.
   * @private
   */
  createInputs_() {
    let html = '';

    UserInputs.forEach((el, index) => {
      const min = (el.min) ? `min="${el.min}"` : '';
      const max = (el.max) ? `max="${el.max}"` : '';
      const pattern = (el.pattern) ? `pattern="${el.pattern}"` : '';
      const required = (el.required) ? 'required' : '';
      const autofocus = (index === 0) ? 'autofocus' : '';

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
                 ${autofocus}
                 aria-label="${el.label}">
        </li>
      `;
      html += input;
    });

    this.listEl_.innerHTML = html;
  }

  /**
   * Populates input fields with user-provided values.
   * @param {!string} data - User values from localStorage, converted from
   *     a string to an array.
   * @private
   */
  populateInputs_(data) {
    const values = data.split(',');

    for (let i = 0; i < values.length; i++) {
      const input = this.listEl_.querySelectorAll('li')[i].querySelector('input');
      input.value = values[i];
    }
  }

  /**
   * TODO: When there are no values (i.e. of initial page load), expandable
   * and table should have 'hidden' attributes set on them.
   * Toggles visibility of elements when all user-provided values are valid.
   * @private
   */
  setVisibility_() {
    const periodsEl = this.querySelector('[name=periods]');

    if (periodsEl.value <= 0) {
      this.totalEl_.setAttribute(HIDDEN_ATTR, '');
    } else {
      this.totalEl_.removeAttribute(HIDDEN_ATTR);
    }
  }

  /**
   * Updates DOM element with total value after compounding.
   * @private
   */
  updateTotal_() {
    let values = [];

    UserInputs.forEach((el) => {
      const el_ = this.querySelector(`[name=${el.name}]`);
      const value = Number(el_.value);
      values.push(value);
    });

    if (this.querySelectorAll(':invalid').length === 0) {
      this.totalEl_.textContent = this.calculations.compound(...values);
      localStorage.setItem(LOCAL_STORAGE, values);
    }

    this.setVisibility_();
  }
}

export { UserValues };
