import { Calculator } from './Calculator';

/** @const {string} */
const EMPTY_ATTR = 'empty';

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

/**
 * CSS selectors for DOM elements outside of this element.
 * @enum {string}
 */
const Selector = {
  CURRENCY: '[currency]',
  TABLE: '.table',
  TABLE_DATA: '.table__data',
};

/**
 * CSS selectors for elements created by this custom element.
 * @enum {string}
 */
const CssClass = {
  LIST: 'values__list',
  TOTAL: 'values__total',
};

/** @class */
class UserValues extends HTMLElement {
  constructor() {
    super();

    /** @private {?Element} */
    this.listEl_ = null;

    /** @private {?Element} */
    this.totalEl_ = null;

    /** @private {?Element} */
    this.currencyEl_ = document.querySelector(Selector.CURRENCY);

    /** @private {!Element} */
    this.tableEl_ = document.querySelector(Selector.TABLE);

    /** @private {!Element} */
    this.tableDataEl_ = document.querySelector(Selector.TABLE_DATA);

    /** @private {!Array} */
    this.sums_ = [];

    /** @private {instance} */
    this.calculator_ = new Calculator('currency');

    /** @private {MutationObserver} */
    this.observer_ = new MutationObserver(() => {
      this.updateTotal_();
    });

    /** @listens keyup */
    this.addEventListener('keyup', () => {
      this.updateTotal_();
    });
  }

  /** @callback */
  connectedCallback() {
    this.setupDom_();
    this.setVisibility_();

    // Observe the global 'currency' attribute for updating data formatting.
    this.observer_.observe(this.currencyEl_, { attributes: true });
  }

  /** @callback */
  disconnectedCallback() {
    this.observer_.disconnect();
  }

  /**
   * Creates DOM elements and populates them if there are stored user values.
   * @private
   */
  setupDom_() {
    this.innerHTML = `
      <ul class="${CssClass.LIST}"></ul>
      <div class="${CssClass.TOTAL}"></div>
    `;
    this.listEl_ = this.querySelector(`.${CssClass.LIST}`);
    this.totalEl_ = this.querySelector(`.${CssClass.TOTAL}`);

    this.createInputs_();

    const storedUserValues = localStorage.getItem(LOCAL_STORAGE);
    if (storedUserValues) {
      this.populateInputs_(storedUserValues);
      this.updateTotal_();
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
   * @param {!string} userValues - User values from localStorage
   * @private
   */
  populateInputs_(userValues) {
    const data = userValues.split(','); // Convert string to array
    for (let i = 0; i < data.length; i++) {
      const input = this.listEl_.querySelectorAll('li')[i].querySelector('input');
      input.value = data[i];
    }
  }

  /**
   * Toggles visibility of the 'total' element based on user-provided values.
   * @private
   */
  setVisibility_() {
    // TODO: Add element to the constructor.
    const periodsEl = this.querySelector('[name=periods]');

    if (periodsEl.value <= 0) {
      this.totalEl_.setAttribute(EMPTY_ATTR, '');
    } else {
      this.totalEl_.removeAttribute(EMPTY_ATTR);
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
      // Calculate all sums from user data and render it all in a table.
      this.sums_ = this.calculator_.compound(...values);
      this.renderTable_();

      // Destructure last item in 'sums' array and display 'balance' from it.
      const [year, deposits, interest, balance, growth] = this.sums_[this.sums_.length - 1];
      this.totalEl_.textContent = balance;

      // Save user values to localStorage.
      localStorage.setItem(LOCAL_STORAGE, values);
    }

    this.setVisibility_();
  }

  /**
   * Renders initial and compounded amounts for each time period.
   * @private
   */
  renderTable_() {
    let tableHtml = `
      <tr>
        <th class="year">Year</th>
        <th class="deposits">Deposits</th>
        <th class="interest">Interest</th>
        <th class="balance">Balance</th>
        <th class="growth">Growth</th>
      </tr>
    `;

    this.sums_.forEach((item) => {
      const [year, deposits, interest, balance, growth] = item;
      tableHtml += `
        <tr>
          <td class="year">${year}</td>
          <td class="deposits">${deposits}</td>
          <td class="interest">${interest}</td>
          <td class="balance">${balance}</td>
          <td class="growth">${growth}</td>
        </tr>
      `;
    });

    this.tableDataEl_.innerHTML = tableHtml;
  }
}

export { UserValues };
