import {Calculator, CompoundingValues, Sums} from '../modules/Calculator';

interface InputAttributes {
  inputmode: string,
  label: string,
  name: string,
  pattern: string,
}

const EMPTY_ATTR: string = 'empty';
const LOCAL_STORAGE: string = 'values';
const TARGET_ATTR: string = 'target';

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
export class UserValues extends HTMLElement {
  private calculator: Calculator;
  private currencyEl: HTMLElement;
  private observer: MutationObserver;
  private periodsEl: HTMLInputElement;
  private sums: Sums[];
  private tableEl: HTMLElement;
  private tableTemplate: any;
  private totalEl: HTMLElement;
  private userValues: string;

  constructor() {
    super();
    this.calculator = new Calculator();
    this.observer = new MutationObserver(() => this.updateTotal());
    this.addEventListener('keyup', this.updateTotal);
  }

  connectedCallback() {
    this.currencyEl = document.querySelector('[currency]');
    this.tableEl = document.querySelector(this.getAttribute(TARGET_ATTR));
    this.removeAttribute(TARGET_ATTR);

    this.userValues = localStorage.getItem(LOCAL_STORAGE);
    this.observer.observe(this.currencyEl, {attributes: true});

    this.tableTemplate = require('../templates/table.pug');

    this.setup();
    this.setVisibility();
  }

  disconnectedCallback() {
    this.observer.disconnect();
    this.removeEventListener('keyup', this.updateTotal);
  }

  /**
   * Creates DOM elements and populates them if there are stored user values.
   */
  private setup() {
    const valuesTemplate = require('../templates/values.pug');
    this.innerHTML = valuesTemplate({list: UserInputs});

    this.totalEl = this.querySelector('.values__total');
    this.periodsEl = this.querySelector('[name=periods]');

    if (this.userValues) {
      this.populateInputs();
      this.updateTotal();
    }
  }

  /**
   * Converts stored user-provided values to an array, then populates each input
   * element with its corresponding user value.
   */
  private populateInputs() {
    const values = JSON.parse(this.userValues);
    UserInputs.forEach((field) => {
      const inputEl =
          this.querySelector(`[name=${field.name}]`) as HTMLInputElement;
      inputEl.value = values[field.name];
    });
  }

  /**
   * Toggles visibility of the 'total' element if there's at least one period
   * of calculated compounding values.
   */
  private setVisibility() {
    if (!this.periodsEl.value || parseInt(this.periodsEl.value) <= 0) {
      this.totalEl.setAttribute(EMPTY_ATTR, '');
    } else {
      this.totalEl.removeAttribute(EMPTY_ATTR);
    }
  }

  /**
   * Updates 'total value' DOM element after calculating all compounding values.
   */
  private updateTotal() {
    const values = {};
    UserInputs.forEach((field) => {
      const el = this.querySelector(`[name=${field.name}]`) as HTMLInputElement;
      if (el.value) {
        values[field.name] = Number(el.value);
      }
    });

    if (this.querySelectorAll(':invalid').length === 0) {
      // Calculate all sums from user data and render it all in the table.
      this.sums = this.calculator.compound(<CompoundingValues>values);
      this.tableEl.innerHTML = this.tableTemplate({table: this.sums});

      // Get last item in sums array to display final balance.
      const lastSum = this.sums[this.sums.length - 1];
      this.totalEl.textContent = lastSum.balance;

      // Save user values to localStorage.
      localStorage.setItem(LOCAL_STORAGE, JSON.stringify(values));
    }

    this.setVisibility();
  }
}
