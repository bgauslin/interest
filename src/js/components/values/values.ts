import {LitElement, css, html} from 'lit';
import {customElement, query, state} from 'lit/decorators.js';
import {Calculator, CompoundingValues, DEFAULT_CURRENCY} from '../../modules/Calculator';
import {AppEvents, STORAGE_ITEM} from '../../modules/shared';

import shadowStyles from './values.scss';

/**
 * Custom element that renders input fields and calculates compound interest
 * total based on user-provided values.
 */
@customElement('app-values')
class Values extends LitElement {
  private calculator = new Calculator();
  private currencyListener: EventListenerObject;

  @query('form') form: HTMLFormElement;

  @state() currency = DEFAULT_CURRENCY;
  @state() fields = [
    {inputmode: 'numeric', label: 'Principal', name: 'principal', pattern: '[0-9]+', value: ''},
    {inputmode: 'numeric', label: 'Yearly addition', name: 'contribution', pattern: '[0-9]+', value: ''},
    {inputmode: 'decimal', label: 'Interest rate', name: 'rate', pattern: '[0-9]{0,2}[\\.]?[0-9]{1,2}', value: ''},
    {inputmode: 'numeric', label: 'Years to grow', name: 'periods', pattern: '[0-9]+', value: ''},
  ];
  @state() total = '';
  @state() values: CompoundingValues;

  static styles = css`${shadowStyles}`;

  constructor() {
    super();
    this.currencyListener = this.updateCurrency.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener(AppEvents.CURRENCY, this.currencyListener);
    this.getLocalStorage();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener(AppEvents.CURRENCY, this.currencyListener);
  }

  private updateCurrency(event: CustomEvent) {
    this.currency = event.detail.currency;
    this.updateTotal();
  }

  private updateTotal() {
    this.total = this.calculator.total(this.values, this.currency);
  }

  private updateValues() {
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

    this.updateTotal();
    this.sendCurrency();
    this.sendValues();
  }

  private getLocalStorage() {
    const storage = JSON.parse(localStorage.getItem(STORAGE_ITEM));
    if (!storage) {
      return;
    }

    if (storage.values) {
      this.values = storage.values;
      for (const [key, value] of Object.entries(this.values)) {
        const field = this.fields.find(field => field.name == key);
        field.value = `${value}`;
      }
      this.sendValues();
    }

    if (storage.currency) {
      this.currency = storage.currency;
      this.sendCurrency();
      this.updateTotal();
    }
  }

  private sendCurrency() {
    this.dispatchEvent(new CustomEvent(AppEvents.CURRENCY, {
      bubbles: true,
      composed: true,
      detail: {
        currency: this.currency,
      },
    }));
  }

  private sendValues() {
    this.dispatchEvent(new CustomEvent(AppEvents.VALUES, {
      bubbles: true,
      composed: true,
      detail: {
        values: this.values,
      },
    }));
  }

  protected render() {
    return html`
      <h1>Compound Interest</h1>

      <form @change="${this.updateValues}">
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
                  .value="${value}">
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
