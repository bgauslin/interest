import {LitElement, css, html} from 'lit';
import {customElement, property, query, state} from 'lit/decorators.js';
import {live} from 'lit/directives/live.js';
import {CompoundingValues, Events} from './shared';


/**
 * Lit custom element that displays input fields for a user to fill out in
 * order to calculate compound interest.
 */
@customElement('interest-values') class Values extends LitElement {
  @property() commas: boolean;
  @property() currency: string;
  @property() values: CompoundingValues;

  @query('form') form: HTMLFormElement;

  @state() contribution: number;
  @state() periods: number;
  @state() principal: number;
  @state() rate: number;

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  protected createRenderRoot() {
    return this;
  }

  protected willUpdate() {
    if (this.values) {
      const {contribution, principal, periods, rate} = this.values;
      this.contribution = contribution;
      this.principal = principal;
      this.periods = periods;
      this.rate = rate;
    } else {
      this.contribution = null;
      this.principal = null;
      this.periods = null;
      this.rate = null;
    }
  }

  private clearValues() {
    this.dispatchEvent(new CustomEvent(Events.ValuesCleared));
  }

  private getValues() {
    let timer;
    clearTimeout(timer);
    timer = setTimeout(() => this.updateValues(), 300);
  }

  private updateValues() {
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

    this.dispatchEvent(new CustomEvent(Events.Values, {
      detail: {
        commas: this.commas,
        values: this.values,
      },
    }));
  }

  protected render() {
    return html`
      <form @input="${this.getValues}">
        <ul role="list">
          <li>
            <label for="principal">Principal</label>
            <input
              id="principal"
              inputmode="numeric"
              name="principal"
              pattern="[0-9]+"
              type="text"
              .value="${live(this.principal)}"
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
              .value="${live(this.contribution)}"
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
              .value="${live(this.rate)}"
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
              .value="${live(this.periods)}"
              required>
          </li>
        </ul>
        <button
          aria-hidden="${!this.values}"
          type="reset"
          @click=${this.clearValues}>Clear</button>
      </form>
    `;
  }
}
