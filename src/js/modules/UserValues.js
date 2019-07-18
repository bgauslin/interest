import { Calculations } from './Calculations';

/** @const {string} */
const CURRENCY_ATTR = 'currency';

/** @const {string} */
const HIDDEN_ATTR = 'hidden';

/** @const {string} */
const INVALID_SELECTOR = ':invalid';

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
    this.listEl_ = null;

    /** @private {?Element} */
    this.totalEl_ = null;
  }

  /**
   * Renders input fields for user-provided data, populates them if data
   * exists, and adds an observer and listener for user-provided changes.
   * @public
   */
  connectedCallback() {
    this.setupDom_();
    this.setupValues_();
    this.handleEvents_();
  }

  /**
   * @private
   */
  setupDom_() {
    this.innerHTML = `
      <ul class="values__list"></ul>
      <div class="values__total"></div>
    `;
  }

  /**
   * @private
   */
  setupValues_() {
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

      this.updateOnChange_(CURRENCY_ATTR);
    }
  }

  /**
   * @private
   */
  handleEvents_() {
    this.addEventListener('keyup', () => {
      this.updateTotal_();
    });
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
   * Sets 'total' element's state via attribute on input change.
   * @private
   */
  setTotalState_() {
    const periodsEl = document.querySelector('[name=periods]');

    if (periodsEl.value <= 0) {
      this.totalEl_.setAttribute(HIDDEN_ATTR, '');
    } else {
      this.totalEl_.removeAttribute(HIDDEN_ATTR);
    }
  }

  /**
   * Watches an element's attributes for changes and updates the total's
   * value and/or state.
   * @param {!string} attr - CSS selector of element to observe.
   * @private 
   */
  updateOnChange_(attr) {
    const target = document.querySelector(`[${attr}]`);
    const config = {
      attributes: true,
    };
    const self = this;

    const observer = new MutationObserver((mutation) => {
      self.updateTotal_();
    });

    observer.observe(target, config);
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

    // TODO: Dispatch a custom event that expandable listens for:
    // expandable.setState();

    if (this.querySelectorAll(INVALID_SELECTOR).length === 0) {
      localStorage.setItem(LOCAL_STORAGE, values);
      this.totalEl_.textContent = this.calculations.compound(...values);
    }

    this.setTotalState_();
  }
}

export { UserValues };
