import {LitElement, css, html} from 'lit';
import {customElement, property, query, state} from 'lit/decorators.js';
import {Calculator} from './calculator';
import {CompoundingValues, Events} from './shared';
import shadowStyles from './shadow-styles/values.css';


/**
 * Lit web component that displays input fields for a user to fill out in
 * order to calculate compound interest.
 */
@customElement('interest-values') class Values extends LitElement {
  private calculator: Calculator;
    
  @property() commas: boolean;
  @property() currency: string;
  @property() values: CompoundingValues;

  @query('form') form: HTMLFormElement;

  @state() contribution: number;
  @state() periods: number;
  @state() principal: number;
  @state() rate: number;
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

    const {contribution, principal, periods, rate} = this.values;

    this.contribution = contribution;
    this.principal = principal;
    this.periods = periods;
    this.rate = rate;

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
    return html`
      <h1>Compound Interest</h1>
      <form @input="${this.updateValues}">
        <ul role="list">
          <li>
            <label for="principal">Principal</label>
            <input
              id="principal"
              inputmode="numeric"
              name="principal"
              pattern="[0-9]+"
              type="text"
              value="${this.principal}"
              required>
          </li>
          <li>
            <label for="contribution">Yearly addition</label>
            <input
              id="contribution"
              inputmode="numeric"
              name="contribution"
              pattern="[0-9]+"
              type="text"
              value="${this.contribution}"
              required>
          </li>
          <li>
            <label for="rate">Interest rate</label>
            <input 
              id="rate"
              inputmode="decimal"
              name="rate"
              pattern="[0-9]{0,2}[,.]?[0-9]{1,2}"
              type="text"
              value="${this.rate}"
              required>
          </li>
          <li>
            <label for="periods">Years to grow</label>
            <input 
              id="periods"
              inputmode="numeric"
              name="periods"
              pattern="[0-9]+"
              type="text"
              value="${this.periods}"
              required>
          </li>
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
