import {LitElement, css, html} from 'lit';
import {customElement, query, state} from 'lit/decorators.js';
import {Calculator, CompoundingValues, DEFAULT_CURRENCY, Sums} from '../../modules/Calculator';
import {AppEvents} from '../../modules/shared';

import shadowStyles from './app.scss';

const STORAGE_ITEM = 'interest';

/**
 * Web component that sends/receives custom event data to/from custom elements.
 */
@customElement('interest-app')
class App extends LitElement {
  private calculator= new Calculator();
  private currencyListener: EventListenerObject;
  private valuesListener: EventListenerObject;

  @query('app-values') userValues: HTMLElement;
  
  @state() currency = DEFAULT_CURRENCY;
  @state() values: CompoundingValues;

  static styles = css`${shadowStyles}`;

  constructor() {
    super();
    this.currencyListener = this.updateCurrency.bind(this);
    this.valuesListener = this.updateValues.bind(this);
  }
  
  connectedCallback() {
    super.connectedCallback();
    this.getLocalStorage();
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
    this.dispatchCurrency();
    this.setLocalStorage();
  }

  private dispatchCurrency() {
    const updateCurrency = new CustomEvent(AppEvents.CURRENCY, {
      detail: {
        currency: this.currency,
      }
    });
    this.userValues.dispatchEvent(updateCurrency);
  }

  private updateValues(e: CustomEvent) {
    this.values = e.detail.values;
    this.dispatchValues();
    this.setLocalStorage();
  }

  private dispatchValues() {
    const updateValues = new CustomEvent(AppEvents.VALUES, {
      detail: {
        values: this.values,
      }
    });
    this.userValues.dispatchEvent(updateValues);
  }

  private setLocalStorage() {
    if (this.values) {
      const settings = {
        currency: this.currency,
        values: this.values,
      };
      localStorage.setItem(STORAGE_ITEM, JSON.stringify(settings));
    }
  }

  private async getLocalStorage() {
    const storage = JSON.parse(localStorage.getItem(STORAGE_ITEM));
    if (!storage) {
      return;
    }

    this.currency = storage.currency;
    this.values = storage.values;

    await this.updateComplete;
    this.dispatchCurrency();
    if (this.values) {
      this.dispatchValues();
    }
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
