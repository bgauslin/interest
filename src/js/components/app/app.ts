import {LitElement, css, html} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {Calculator, CompoundingValues, Sums} from '../../modules/Calculator';
import {AppEvents} from '../../modules/shared';

import shadowStyles from './app.scss';

/**
 * Web component that sends/receives custom event data to/from custom elements.
 */
@customElement('interest-app')
class App extends LitElement {
  private calculator = new Calculator();
  private currencyListener: EventListenerObject;
  private valuesListener: EventListenerObject;
  
  @state() currency: string;
  @state() values: CompoundingValues;

  static styles = css`${shadowStyles}`;

  constructor() {
    super();
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
  }

  private updateValues(e: CustomEvent) {
    this.values = e.detail.values;
  }

  render() {
    return html`
      <app-values></app-values>
      <app-drawer aria-hidden="${!this.values}">
        ${this.renderTable()}
      </app-drawer>
    `;
  }

  renderTable() {
    if (!this.values || !this.currency) {
      return;
    }

    const tableData: Sums[] =
        this.calculator.compound(this.values, this.currency);

    return html`
      <div class="table">
        <table>
          <thead>
            <tr>
              <th class="year">Year</th>
              <th class="deposits">Deposits</th>
              <th class="interest" data-optional>Interest</th>
              <th class="balance">Balance</th>
              <th class="growth" data-optional>Growth</th>
            </tr>
          </thead>
          <tbody>
            ${tableData.map((row) => {
              const {balance, deposits, growth, interest, year} = row;
              return html`
                <tr>
                  <td class="year">${year}</td>
                  <td class="deposits">${deposits}</td>
                  <td class="interest" data-optional>${interest}</td>
                  <td class="balance">${balance}</td>
                  <td class="growth" data-optional>${growth}</td>
                </tr>
              `
            })}
          </tbody>
        </table>
      </div>
      <p class="footnote">
        Rotate screen to view <span>Interest</span> and <span>Growth</span> columns.
      </p>
    `;
  }
}
