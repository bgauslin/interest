import {LitElement, css, html} from 'lit';
import {customElement, property, query, state} from 'lit/decorators.js';
import {Calculator, CompoundingValues} from '../../modules/calculator';
import {Events, TextInput} from '../../modules/shared';
import shadowStyles from './values.css';


/**
 * Web component that renders input fields and calculates the compound interest
 * total based on user-provided values.
 */
@customElement('interest-values') class Values extends LitElement {
  private calculator: Calculator;
  private fields: TextInput[] = [
    {inputmode: 'numeric', label: 'Principal', name: 'principal', pattern: '[0-9]+', value: ''},
    {inputmode: 'numeric', label: 'Yearly addition', name: 'contribution', pattern: '[0-9]+', value: ''},
    {inputmode: 'decimal', label: 'Interest rate', name: 'rate', pattern: '[0-9]{0,2}[,\.]?[0-9]{1,2}', value: ''},
    {inputmode: 'numeric', label: 'Years to grow', name: 'periods', pattern: '[0-9]+', value: ''},
  ];

  @property() commas: boolean;
  @property() currency: string;
  @property() values: CompoundingValues;

  @query('form') form: HTMLFormElement;

  @state() total: string = '';

  constructor() {
    super();
    this.calculator = new Calculator();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  protected firstUpdated() {
    if (!this.values) return;

    for (const [key, value] of Object.entries(this.values)) {
      const field = this.fields.find(field => field.name === key);
      const value_ = `${value}`;
      field.value = this.commas ? value_.replace('.', ',') : value_;
    }

    this.updateTotal();
  }

  private updateTotal() {
    this.total = this.calculator.total(this.values, this.currency);
  }

  private updateValues() {
    let timer;
    clearTimeout(timer);
    timer = setTimeout(() => this.getValues(), 300);
  }

  private getValues() {
    if (this.form.querySelectorAll(':invalid').length) return;

    const formData = new FormData(this.form);

    const rate_ = `${formData.get('rate')}`;
    const rate = Number(rate_.replace(',', '.'));
    const found = rate_.match(/[,]/g);

    this.commas = found && found.length !== 0;

    this.values = {
      contribution: Number(formData.get('contribution')),
      periods: Number(formData.get('periods')),
      principal: Number(formData.get('principal')),
      rate,
    };

    this.updateTotal();
    this.dispatchValues();
  }

  private dispatchCurrency(event: CustomEvent) {
    this.currency = event.detail.currency;
    this.updateTotal();

    this.dispatchEvent(new CustomEvent(Events.Currency, {
      detail: {
        currency: this.currency,
      },
    }));
  }

  private dispatchValues() {
    this.dispatchEvent(new CustomEvent(Events.Values, {
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
        class="total">
        ${this.total}
      </div>
      <interest-currency
        aria-hidden="${this.total === ''}"
        .currency=${this.currency}
        @currencyUpdated=${this.dispatchCurrency}></interest-currency>
    `;
  }

  // Shadow DOM stylesheet.
  static styles = css`${shadowStyles}`;
}
