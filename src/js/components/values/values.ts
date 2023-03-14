import {LitElement, css, html} from 'lit';
import {customElement, query, state} from 'lit/decorators.js';
import {Calculator, CompoundingValues, DEFAULT_CURRENCY} from '../../modules/Calculator';
import {AppEvents} from '../../modules/shared';

import shadowStyles from './values.scss';

interface InputAttributes {
  inputmode: string,
  label: string,
  name: string,
  pattern: string,
  value: string,
}

const STORAGE_ITEM = 'interest';

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
  @state() fields: InputAttributes[] = [
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

  private async getLocalStorage() {
    const storage = JSON.parse(localStorage.getItem(STORAGE_ITEM));
    
    console.log('values.storage', storage);

    if (!storage) {
      return;
    }

    const {currency, values} = storage;
    this.currency = currency;
    this.values = values;

    this.requestUpdate();
    await this.updateComplete;

    if (this.values) {
      this.dispatchValues();
    }    
  }

  private setLocalStorage() {
    console.log('values.setLocalStorage()');

    if (this.values) {
      const settings = {
        currency: this.currency,
        values: this.values,
      };
      localStorage.setItem(STORAGE_ITEM, JSON.stringify(settings));
    }
  }

  private updateCurrency(e: CustomEvent) {
    console.log('values.updateCurrency()');

    this.currency = e.detail.currency;
    this.updateTotal();
  }

  private updateTotal() {
    console.log('values.updateTotal()');

    if (this.values) {
      this.total = this.calculator.total(this.values, this.currency);
    }
  }

  private getValues() {
    console.log('values.getValues()');

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
    this.dispatchValues();
    this.setLocalStorage();
  }

  private dispatchValues() {
    console.log('values.dispatchValues()');
    
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
