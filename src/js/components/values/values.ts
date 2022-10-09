import {LitElement, css, html} from 'lit';
import {customElement, property, query, state} from 'lit/decorators.js';
import {Calculator, CompoundingValues, DEFAULT_CURRENCY} from '../../modules/Calculator';
import shadowStyles from './values.scss';

interface InputAttributes {
  inputmode: string,
  label: string,
  name: string,
  pattern: string,
}

/**
 * Custom element that renders input fields and calculates compound interest
 * total based on user-provided values.
 */
@customElement('interest-values')
class Values extends LitElement {
  @property() userInputs: InputAttributes[] = [
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
  @query('form') form: HTMLFormElement;
  @state() calculator: Calculator;
  @state() currency = DEFAULT_CURRENCY;
  @state() currencyListener: EventListenerObject;
  @state() total = '';
  @state() values: CompoundingValues;
  @state() valuesListener: EventListenerObject;

  static styles = css`${shadowStyles}`;

  constructor() {
    super();
    this.calculator = new Calculator();
    this.currencyListener = this.updateCurrency.bind(this);
    this.valuesListener = this.updateValues.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('updateCurrency', this.currencyListener);
    this.addEventListener('updateValues', this.valuesListener);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('updateCurrency', this.currencyListener);
    this.removeEventListener('updateValues', this.valuesListener);
  }

  private updateCurrency(e: CustomEvent) {
    this.currency = e.detail.currency;
    this.updateTotal();
  }

  private updateValues(e: CustomEvent) {
    this.values = e.detail.values;
    this.updateTotal();

    // TODO: Figure out how to do this in the template.
    for (const [name, value] of Object.entries(this.values)) {
      const input =
          this.form.querySelector<HTMLInputElement>(`[name="${name}"]`);
      input.value = value;
    }
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

    this.dispatchEvent(new CustomEvent('updateValues', {
      detail: {
        values: this.values,
      },
      bubbles: true,
      composed: true,
    }));
  }

  render() {
    return html`
      <slot></slot>
      <form @change="${this.getValues}">
        <ul>
          ${this.userInputs.map((item, index) => {
            const {inputmode, label, name, pattern} = item;
            return html`
              <li class="${name}">
                <label for="${name}">${label}</label>
                <input
                  type="text"
                  id="${name}"
                  name="${name}"
                  inputmode="${inputmode}"
                  pattern="${pattern}"
                  autofocus="${index === 0}"
                  required>
              </li>
            `
          })}
        </ul>
      </form>
      <div aria-hidden="${this.total === ''}" class="total">
        <interest-currency></interest-currency>
        <span class="amount">${this.total}</span>
      </div>
    `;
  }
}
