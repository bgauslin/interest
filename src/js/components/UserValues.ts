import { Calculator } from '../modules/Calculator';

interface InputAttributes {
  label: string,
  name: string,
  max: number,
  min?: number,
  pattern: string,
  type: string,
  required?: boolean,
}

const EMPTY_ATTR: string = 'empty';

const LOCAL_STORAGE: string = 'values';

const UserInputs: InputAttributes[] = [
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
    max: 99,
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

// CSS classnames for DOM elements.
enum CssClass {
  LIST = 'values__list',
  TABLE = 'table',
  TABLE_DATA = 'table__data',
  TOTAL = 'values__total',
};

// CSS selectors for DOM elements.
enum Selector {
  CURRENCY = '[currency]',
  PERIODS = '[name=periods]',
};

class UserValues extends HTMLElement {
  calculator_: any;
  currencyEl_: HTMLElement;
  listEl_: HTMLElement;
  observer_: MutationObserver;
  periodsEl_: HTMLInputElement;
  sums_: Array<number>;
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

    /** @listens keyup */
    this.addEventListener('keyup', () => this.updateTotal_());
  }

  connectedCallback(): void {
    this.setup_();
    this.setVisibility_();
    this.observer_.observe(this.currencyEl_, { attributes: true });
  }

  disconnectedCallback(): void {
    this.observer_.disconnect();
    this.removeEventListener('keyup', null);
  }

  /**
   * Creates DOM elements and populates them if there are stored user values.
   */
  private setup_(): void {
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
    const values = this.userValues_.split(',');
    UserInputs.forEach((field, index) => {
      const inputEl = this.querySelector(`[name=${field.name}]`) as HTMLInputElement;
      inputEl.value = values[index];
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
    const values = UserInputs.map(field => {
      const inputEL = this.querySelector(`[name=${field.name}]`) as HTMLInputElement;
      return parseInt(inputEL.value);
    });

    if (this.querySelectorAll(':invalid').length === 0) {
      // Calculate all sums from user data and render it all in a table.
      this.sums_ = this.calculator_.compound(...values);
      this.renderTable_();

      // Destructure last item in 'sums' array and display 'balance' from it.
      const lastSum = this.sums_[this.sums_.length - 1];
      // TODO: Fix TS warning:
      const [year, deposits, interest, balance, growth] = lastSum;
      this.totalEl_.textContent = String(balance);

      // Save user values to localStorage.
      localStorage.setItem(LOCAL_STORAGE, String(values));
    }

    this.setVisibility_();
  }

  /**
   * Renders initial and compounded amounts for each period.
   */
  private renderTable_(): void {
    let tableHtml: string = `
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
