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
 * CSS selectors for elements created by this custom element.
 * @enum {string}
 */
const CssClass = {
  LIST: 'values__list',
  TABLE: 'table',
  TABLE_DATA: 'table__data',
  TOTAL: 'values__total',
};

/**
 * CSS selectors for DOM elements.
 * @enum {string}
 */
const Selector = {
  CURRENCY: '[currency]',
  PERIODS: '[name=periods]',
};

/** @class */
class UserValues extends HTMLElement {
  constructor() {
    super();

    /** @private {?Element} */
    this.listEl_ = null;

    /** @private {?Element} */
    this.periodsEl_ = null;

    /** @private {?Element} */
    this.totalEl_ = null;

    /** @private {?Element} */
    this.currencyEl_ = document.querySelector(Selector.CURRENCY);

    /** @private {!Element} */
    this.tableEl_ = document.querySelector(`.${CssClass.TABLE}`);

    /** @private {!Element} */
    this.tableDataEl_ = document.querySelector(`.${CssClass.TABLE_DATA}`);

    /** @private {!Array} */
    this.sums_ = [];

    /** @private {instance} */
    this.calculator_ = new Calculator();

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
    let listHtml = '';
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
      listHtml += input;
    });

    this.innerHTML = `
      <ul class="${CssClass.LIST}">
        ${listHtml}
      </ul>
      <div class="${CssClass.TOTAL}"></div>
    `;

    this.listEl_ = this.querySelector(`.${CssClass.LIST}`);
    this.totalEl_ = this.querySelector(`.${CssClass.TOTAL}`);
    this.periodsEl_ = this.querySelector(Selector.PERIODS);

    const storedUserValues = localStorage.getItem(LOCAL_STORAGE);
    if (storedUserValues) {
      this.populateInputs_(storedUserValues);
      this.updateTotal_();
    }
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
   * Toggles visibility of the 'total' element if there's at least one period
   * of calculated compounding values.
   * @private
   */
  setVisibility_() {
    if (this.periodsEl_.value <= 0) {
      this.totalEl_.setAttribute(EMPTY_ATTR, '');
    } else {
      this.totalEl_.removeAttribute(EMPTY_ATTR);
    }
  }

  /**
   * Updates 'total value' DOM element after calculating all compounding values.
   * @private
   */
  updateTotal_() {
    const values = UserInputs.map(el => {
      return parseInt(this.querySelector(`[name=${el.name}]`).value);
    });

    if (this.querySelectorAll(':invalid').length === 0) {
      // Calculate all sums from user data and render it all in a table.
      this.sums_ = this.calculator_.compound(...values);
      this.renderTable_();

      // Destructure last item in 'sums' array and display 'balance' from it.
      const lastSum = this.sums_[this.sums_.length - 1];
      const [year, deposits, interest, balance, growth] = lastSum;
      this.totalEl_.textContent = balance;

      // Save user values to localStorage.
      localStorage.setItem(LOCAL_STORAGE, values);
    }

    this.setVisibility_();
  }

  /**
   * Renders initial and compounded amounts for each period.
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
