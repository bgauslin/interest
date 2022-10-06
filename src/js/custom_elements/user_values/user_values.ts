import {Calculator, CompoundingValues, Sums} from '../../modules/Calculator';

interface InputAttributes {
  inputmode: string,
  label: string,
  name: string,
  pattern: string,
}

const EMPTY_ATTR = 'empty';
const FOR_ATTR = 'for';
const STORAGE_ITEM = 'values';

const UserInputs: InputAttributes[] = [
  {
    inputmode: 'numeric',
    label: 'Principal',
    name: 'principal',
    pattern: '[0-9]+',
  },
  {
    inputmode: 'numeric',
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
    inputmode: 'numeric',
    label: 'Years to grow',
    name: 'periods',
    pattern: '[0-9]+',
  }
];

/**
 * Custom element that renders input fields and calculates compound interest
 * based on user-provided values.
 */
@customElement('user-values')
class UserValues extends HTMLElement {

  @query('.total') total: HTMLElement;
  @query('[name=periods]') periods: HTMLInputElement;
  @query('[currency]') currency: HTMLElement;

  private table: HTMLElement;

  private calculator: Calculator;
  private observer: MutationObserver;
  private sums: Sums[];
  private userValues: string;

  constructor() {
    super();
    this.calculator = new Calculator();
    this.observer = new MutationObserver(() => this.updateTotal());
    this.addEventListener('keyup', this.updateTotal);
  }

  connectedCallback() {
    this.observer.observe(this.currency, {attributes: true});

    this.table = document.getElementById(this.getAttribute(FOR_ATTR));
    this.removeAttribute(FOR_ATTR);

    this.userValues = localStorage.getItem(STORAGE_ITEM);
    if (this.userValues) {
      this.populateInputs();
      this.updateTotal();
    }
    this.setVisibility();
  }

  disconnectedCallback() {
    this.observer.disconnect();
    this.removeEventListener('keyup', this.updateTotal);
  }

  /**
   * Converts stored user-provided values to an array, then populates each input
   * element with its corresponding user value.
   */
  private populateInputs() {
    const values = JSON.parse(this.userValues);
    for (const field of UserInputs) {
      const input = this.querySelector(`[name=${field.name}]`) as HTMLInputElement;
      input.value = values[field.name];
    }
  }

  /**
   * Toggles visibility of the 'total' element if there's at least one period
   * of calculated compounding values.
   */
  private setVisibility() {
    if (!this.periods.value || parseInt(this.periods.value) <= 0) {
      this.total.setAttribute(EMPTY_ATTR, '');
    } else {
      this.total.removeAttribute(EMPTY_ATTR);
    }
  }

  /**
   * Updates 'total value' DOM element after calculating all compounding values.
   */
  private updateTotal() {
    const values = {};
    for (const field of UserInputs) {
      const input = this.querySelector(`[name=${field.name}]`) as HTMLInputElement;
      if (input.value) {
        values[field.name] = Number(input.value);
      }
    }

    if (this.querySelectorAll(':invalid').length === 0) {
      // Calculate all sums from user data and render it all in the table.
      this.sums = this.calculator.compound(<CompoundingValues>values);
      // TODO: render({table: this.sums});

      // Get last item in sums array to display final balance.
      const lastSum = this.sums[this.sums.length - 1];
      this.total.textContent = lastSum.balance;

      // Save user values to localStorage.
      localStorage.setItem(STORAGE_ITEM, JSON.stringify(values));
    }

    this.setVisibility();
  }

  private renderTable() {
    return html`
      <thead>
        <tr>
          <th class="year">Year</th>
          <th class="deposits">Deposits</th>
          <th class="interest">Interest</th>
          <th class="balance">Balance</th>
          <th class="growth">Growth</th>
        </tr>
      </thead>
      <tbody>
      ${this.table.map((row) => {
        const {balance, deposits, growth, interest, year} = row;
        return html`
          <tr>
            <td class="year">${year}</td>
            <td class="deposits">${deposits}</td>
            <td class="interest">${interest}</td>
            <td class="balance">${balance}</td>
            <td class="growth">${growth}</td>
          </tr>
        `
      })}
      </tbody>
    `;
  }
}