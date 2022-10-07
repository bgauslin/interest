import {LitElement, css, html} from 'lit';
import {customElement, property, query, state} from 'lit/decorators.js';
import {Calculator, CompoundingValues} from '../../modules/Calculator';
import shadowStyles from './user-values.scss';

interface InputAttributes {
  inputmode: string,
  label: string,
  name: string,
  pattern: string,
}

/**
 * Custom element that renders input fields and calculates compound interest
 * based on user-provided values.
 */
@customElement('user-values')
class UserValues extends LitElement {
  @property({type: String}) currency = 'usd';
  @property({type: String}) total = '';
  @property({type: String}) userInputs: InputAttributes[] = [
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
  @property({type: String}) userValues: CompoundingValues;
  @query('form') form: HTMLFormElement;
  @state() calculator: Calculator;
  @state() currencyListener: EventListenerObject;

  static styles = css`${shadowStyles}`;

  constructor() {
    super();
    this.calculator = new Calculator();
    this.currencyListener = this.updateCurrency.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.populateInputs();
    document.addEventListener('updateCurrency', this.currencyListener);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('updateCurrency', this.currencyListener);
  }

  private updateCurrency(e: CustomEvent) {
    this.currency = e.detail.currency;
    console.log('userValues.updateCurrency()', this.currency);
  }

  private populateInputs() {
    const storage = localStorage.getItem('values');
    this.userValues = JSON.parse(storage);

    // TODO: this.form isn't ready yet.
    // if (this.userValues) {
    //   for (const [name, value] of Object.entries(this.userValues)) {
    //     console.log(`${name}: ${value}`);
    //     const input = this.form.querySelector<HTMLInputElement>(`[name="${name}"]`);
    //     input.value = value;
    //   }
    // }
  }

  /** Gets all user-provided values, then dispatches and saves them. */
  private getFormValues() {
    if (this.form.querySelectorAll(':invalid').length) {
      return;
    }
    
    // Get the form values.
    const formData = new FormData(this.form);
    const values: CompoundingValues = {
      contribution: Number(formData.get('contribution')),
      periods: Number(formData.get('periods')),
      principal: Number(formData.get('principal')),
      rate: Number(formData.get('rate')),
    };

    // Update the total.
    this.total = this.calculator.total(values, this.currency);

    // Dispatch values for rendering elsewhere.
    this.dispatchEvent(new CustomEvent('updateValues', {
      bubbles: true,
      detail: {values},
    }));

    // Save values for populating form on later visits.
    localStorage.setItem('values', JSON.stringify(values));
  }

  render() {
    return html`
      <form @change="${this.getFormValues}">
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
        <div class="total" currency="${this.currency}">
          ${this.total}
        </div>
      </form>
    `;
  }
}
