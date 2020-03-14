import {Calculator, CompoundingValues, Sums} from '../modules/Calculator';

interface InputAttributes {
  inputmode: string,
  label: string,
  name: string,
  pattern: string,
}

const EMPTY_ATTR: string = 'empty';
const LOCAL_STORAGE: string = 'values';

const UserInputs: InputAttributes[] = [
  {
    inputmode: 'number',
    label: 'Principal',
    name: 'principal',
    pattern: '[0-9]+',
  },
  {
    inputmode: 'number',
    label: 'Yearly addition',
    name: 'contribution',
    pattern: '[0-9]+',
  },
  {
    inputmode: 'decimal',
    label: 'Interest rate',
    name: 'rate',
    pattern: '[0-9]{0,2}[\\.]?[0-9]{1,2}',
  },
  {
    inputmode: 'number',
    label: 'Years to grow',
    name: 'periods',
    pattern: '[0-9]+',
  }
];

// CSS classnames for DOM elements.
enum CssClass {
  LIST = 'values__list',
  TABLE = 'table',
  TABLE_DATA = 'table__data',
  TOTAL = 'values__total',
}

// CSS selectors for DOM elements.
enum Selector {
  CURRENCY = '[currency]',
  PERIODS = '[name=periods]',
}

class UserValues extends HTMLElement {
  calculator_: Calculator;
  currencyEl_: HTMLElement;
  listEl_: HTMLElement;
  observer_: MutationObserver;
  periodsEl_: HTMLInputElement;
  sums_: Sums[];
  tableDataEl_: HTMLElement;
  tableEl_: HTMLElement;
  totalEl_: HTMLElement;
  userValues_: string;

  constructor() {
    super();
    this.calculator_ = new Calculator();
    this.currencyEl_ = document.querySelector(Selector.CURRENCY);
    this.observer_ = new MutationObserver(() => this.updateTotal_());
    this.tableDataEl_ = document.querySelector(`.${CssClass.TABLE_DATA}`);
    this.tableEl_ = document.querySelector(`.${CssClass.TABLE}`);
    this.userValues_ = localStorage.getItem(LOCAL_STORAGE);
    this.addEventListener('keyup', this.updateTotal_);
  }

  connectedCallback(): void {
    this.setup_();
    this.setVisibility_();
    this.observer_.observe(this.currencyEl_, { attributes: true });
  }

  disconnectedCallback(): void {
    this.observer_.disconnect();
    this.removeEventListener('keyup', this.updateTotal_);
  }

  /**
   * Creates DOM elements and populates them if there are stored user values.
   */
  private setup_(): void {
    let listHtml = '';
    UserInputs.forEach((el, index) => {
      const autofocus = (index === 0) ? 'autofocus' : '';
      let {inputmode, label, name, pattern} = el;
      pattern = pattern ? `pattern="${pattern}"` : '';
      const input = `\
        <li id="${name}" class="values__item">\
          <label for="${name}" class="values__label">${label}</label>\
          <input class="values__input" type="text" name="${name}" inputmode="${inputmode}" ${pattern} aria-label="${label}" required ${autofocus}>\
        </li>\
      `;
      listHtml += input;
    });

    const html = `\
      <ul class="${CssClass.LIST}">\
        ${listHtml}\
      </ul>\
      <div class="${CssClass.TOTAL}"></div>\
    `;

    this.innerHTML = html.replace(/\s\s/g, '');

    this.listEl_ = this.querySelector(`.${CssClass.LIST}`);
    this.totalEl_ = this.querySelector(`.${CssClass.TOTAL}`);
    this.periodsEl_ = this.querySelector(Selector.PERIODS);

    if (this.userValues_) {
      this.populateInputs_();
      this.updateTotal_();
    }
  }

  /**
   * Converts stored user-provided values to an array, then populates each input
   * element with its corresponding user value.
   */
  private populateInputs_(): void {
    const values = JSON.parse(this.userValues_);
    UserInputs.forEach((field) => {
      const inputEl = <HTMLInputElement>this.querySelector(`[name=${field.name}]`);
      inputEl.value = values[field.name];
    });
  }

  /**
   * Toggles visibility of the 'total' element if there's at least one period
   * of calculated compounding values.
   */
  private setVisibility_(): void {
    if (!this.periodsEl_.value || parseInt(this.periodsEl_.value) <= 0) {
      this.totalEl_.setAttribute(EMPTY_ATTR, '');
    } else {
      this.totalEl_.removeAttribute(EMPTY_ATTR);
    }
  }

  /**
   * Updates 'total value' DOM element after calculating all compounding values.
   */
  private updateTotal_(): void {
    const values = {};
    UserInputs.forEach((field) => {
      const el = <HTMLInputElement>this.querySelector(`[name=${field.name}]`);
      if (el.value) {
        values[field.name] = Number(el.value);
      }
    });

    if (this.querySelectorAll(':invalid').length === 0) {
      // Calculate all sums from user data and render it all in a table.
      this.sums_ = this.calculator_.compound(<CompoundingValues>values);
      this.renderTable_();

      // Get last item in sums array to display final balance.
      const lastSum = this.sums_[this.sums_.length - 1];
      this.totalEl_.textContent = lastSum.balance;

      // Save user values to localStorage.
      localStorage.setItem(LOCAL_STORAGE, JSON.stringify(values));
    }

    this.setVisibility_();
  }

  /**
   * Renders initial and compounded amounts for each period.
   */
  private renderTable_(): void {
    let tableHtml: string = `\
      <tr>\
        <th class="year">Year</th>\
        <th class="deposits">Deposits</th>\
        <th class="interest">Interest</th>\
        <th class="balance">Balance</th>\
        <th class="growth">Growth</th>\
      </tr>\
    `;

    this.sums_.forEach((item: Sums) => {
      const {year, deposits, interest, balance, growth} = item;
      tableHtml += `\
        <tr>\
          <td class="year">${year}</td>\
          <td class="deposits">${deposits}</td>\
          <td class="interest">${interest}</td>\
          <td class="balance">${balance}</td>\
          <td class="growth">${growth}</td>\
        </tr>\
      `;
    });

    this.tableDataEl_.innerHTML = tableHtml.replace(/\s\s/g, '');
  }
}

export {UserValues};
