import {LitElement, css, html} from 'lit';
import {customElement, query, state} from 'lit/decorators.js';
import {Calculator, CompoundingValues, DEFAULT_CURRENCY} from '../../modules/Calculator';
import {AppEvents} from '../../modules/CustomEvents';

import shadowStyles from './values.scss';

interface InputAttributes {
  inputmode: string,
  label: string,
  name: string,
  pattern: string,
  value: string,
}

/**
 * Custom element that renders input fields and calculates compound interest
 * total based on user-provided values.
 */
@customElement('app-values')
class Values extends LitElement {
  @query('form') form: HTMLFormElement;

  @state() calculator: Calculator;
  @state() currency = DEFAULT_CURRENCY;
  @state() currencyListener: EventListenerObject;
  @state() total = '';
  @state() values: CompoundingValues;
  @state() valuesListener: EventListenerObject;

  // TODO: Refactor (?)
  @state() fields: InputAttributes[] = [
    {inputmode: 'numeric', label: 'Principal', name: 'principal', pattern: '[0-9]+', value: ''},
    {inputmode: 'numeric', label: 'Yearly addition', name: 'contribution', pattern: '[0-9]+', value: ''},
    {inputmode: 'decimal', label: 'Interest rate', name: 'rate', pattern: '[0-9]{0,2}[\\.]?[0-9]{1,2}', value: ''},
    {inputmode: 'numeric', label: 'Years to grow', name: 'periods', pattern: '[0-9]+', value: ''},
  ];

  static styles = css`${shadowStyles}`;

  constructor() {
    super();
    this.calculator = new Calculator();
    this.currencyListener = this.updateCurrency.bind(this);
    this.valuesListener = this.updateValues.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener(AppEvents.CURRENCY, this.currencyListener);
    this.addEventListener(AppEvents.VALUES, this.valuesListener);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener(AppEvents.CURRENCY, this.currencyListener);
    this.removeEventListener(AppEvents.VALUES, this.valuesListener);
  }

  private updateCurrency(e: CustomEvent) {
    this.currency = e.detail.currency;
    this.updateTotal();
  }

  private updateValues(e: CustomEvent) {
    this.values = e.detail.values;
    for (const [name, value] of Object.entries(this.values)) {
      const field = this.fields.find(input => input.name === name);
      field.value = value;
    }
    this.updateTotal();
  }

  private updateTotal() {
    if (this.values) {
      this.total = this.calculator.total(this.values, this.currency);
    }
  }

  private getValues() {
    if (this.form.querySelectorAll(':invalid').length) {
      return;
    }

    const formData = new FormData(this.form);
    this.values = {
      contribution: Number(formData.get('contribution')),
      periods: Number(formData.get('periods')),
      principal: Number(formData.get('principal')),
      rate: Number(formData.get('rate')),
    };

    this.dispatchValues();
    this.updateTotal();
  }

  private dispatchValues() {
    if (!this.values) {
      return;
    }

    this.dispatchEvent(new CustomEvent(AppEvents.VALUES, {
      bubbles: true,
      composed: true,
      detail: {
        values: this.values,
      },
    }));
  }

  render() {
    return html`
      <form @change="${this.getValues}">
        <ul role="list">
          ${this.fields.map((field) => {
            const {inputmode, label, name, pattern, value} = field;
            return html`
              <li class="${name}">
                <label for="${name}">${label}</label>
                <input
                  id="${name}"
                  inputmode="${inputmode}"
                  name="${name}"
                  pattern="${pattern}"
                  required
                  type="text"
                  value="${value}">
              </li>
            `;
          })}
        </ul>
      </form>

      <div
        aria-hidden="${this.total === ''}"
        class="total"
        tabindex="-1">
        ${this.total}
      </div>

      <app-currency
        aria-hidden="${this.total === ''}"
        currency="${this.currency}"></app-currency>
    `;
  }
}
