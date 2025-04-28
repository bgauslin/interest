import {LitElement, css, html} from 'lit';
import {customElement, query, state} from 'lit/decorators.js';
import {Calculator, CompoundingValues, DEFAULT_CURRENCY} from '../../modules/Calculator';
import {AppEvents, STORAGE_ITEM, TextInput} from '../../modules/shared';

import shadowStyles from './values.scss';

/**
 * Web component that renders input fields and calculates the compound interest
 * total based on user-provided values.
 */
@customElement('interest-values')
class Values extends LitElement {
  private calculator: Calculator;
  private currencyListener: EventListenerObject;

  @query('form') form: HTMLFormElement;
  @state() commas: boolean = false;
  @state() currency: string = DEFAULT_CURRENCY;
  @state() fields: TextInput[] = [
    {inputmode: 'numeric', label: 'Principal', name: 'principal', pattern: '[0-9]+', value: ''},
    {inputmode: 'numeric', label: 'Yearly addition', name: 'contribution', pattern: '[0-9]+', value: ''},
    {inputmode: 'decimal', label: 'Interest rate', name: 'rate', pattern: '[0-9]{0,2}[,\.]?[0-9]{1,2}', value: ''},
    {inputmode: 'numeric', label: 'Years to grow', name: 'periods', pattern: '[0-9]+', value: ''},
  ];
  @state() total: string = '';
  @state() values: CompoundingValues;

  static styles = css`${shadowStyles}`;

  constructor() {
    super();
    this.calculator = new Calculator();
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
    if (this.form.querySelectorAll(':invalid').length) return;

    const formData = new FormData(this.form);

    const rate_ = `${formData.get('rate')}`;
    const found = rate_.match(/[,]/g);
    this.commas = found && found.length !== 0;
    const rate = Number(rate_.replace(',', '.'));

    this.values = {
      contribution: Number(formData.get('contribution')),
      periods: Number(formData.get('periods')),
      principal: Number(formData.get('principal')),
      rate,
    };

    this.updateTotal();
    this.sendCurrency();
    this.sendValues();
  }

  private getLocalStorage() {
    const storage = JSON.parse(localStorage.getItem(STORAGE_ITEM));
    if (!storage) return;

    if (storage.commas) {
      this.commas = storage.commas;
    }

    if (storage.values) {
      this.values = storage.values;
      for (const [key, value] of Object.entries(this.values)) {
        const field = this.fields.find(field => field.name === key);
        const value_ = `${value}`;
        field.value = this.commas ? value_.replace('.', ',') : value_;
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
        commas: this.commas,
        values: this.values,
      },
    }));
  }

  protected render() {
    const items = this.fields.map((field) => {
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
    });

    return html`
      <h1>Compound Interest</h1>
      <form @input="${this.updateValues}">
        <ul role="list">
          ${items}
        </ul>
      </form>
      <div
        aria-hidden="${this.total === ''}"
        class="total">${this.total}</div>
      <interest-currency
        aria-hidden="${this.total === ''}"
        currency="${this.currency}"></interest-currency>
    `;
  }
}
