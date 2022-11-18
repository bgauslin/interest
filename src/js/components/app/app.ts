import {LitElement, css, html} from 'lit';
import {customElement, state, query} from 'lit/decorators.js';
import {CompoundingValues, DEFAULT_CURRENCY} from '../../modules/Calculator';

import shadowStyles from './app.scss';

/**
 * Web component that sends/receives custom event data to/from custom elements.
 */
@customElement('interest-app')
class App extends LitElement {
  @query('app-currency') currencyWidget: HTMLElement;
  @query('app-table') table: HTMLElement;
  @query('app-values') userValues: HTMLElement;
  @state() appTitle = 'Compound Interest Calculator';
  @state() currency = DEFAULT_CURRENCY;
  @state() currencyEvent = 'updateCurrency';
  @state() currencyListener: EventListenerObject;
  @state() storageItem = 'interest';
  @state() values: CompoundingValues;
  @state() valuesEvent = 'updateValues';
  @state() valuesListener: EventListenerObject;

  static styles = css`${shadowStyles}`;

  constructor() {
    super();
    this.currencyListener = this.updateCurrency.bind(this);
    this.valuesListener = this.updateValues.bind(this);
  }
  
  connectedCallback() {
    super.connectedCallback();
    this.getLocalStorage();
    this.addEventListener(this.currencyEvent, this.currencyListener);
    this.addEventListener(this.valuesEvent, this.valuesListener);
  }

  disconnectedCallback() { 
    super.disconnectedCallback();
    this.removeEventListener(this.currencyEvent, this.currencyListener);
    this.removeEventListener(this.valuesEvent, this.valuesListener);
  }

  private updateCurrency(e: CustomEvent) {
    this.currency = e.detail.currency;
    this.dispatchCurrency();
    this.setLocalStorage();
  }

  private dispatchCurrency() {
    const updateCurrency = new CustomEvent(this.currencyEvent, {
      detail: {
        currency: this.currency,
      }
    });
    this.currencyWidget.dispatchEvent(updateCurrency);
    this.table.dispatchEvent(updateCurrency);
    this.userValues.dispatchEvent(updateCurrency);
  }

  private updateValues(e: CustomEvent) {
    this.values = e.detail.values;
    this.dispatchValues();
    this.setLocalStorage();
  }

  private dispatchValues() {
    const updateValues = new CustomEvent(this.valuesEvent, {
      detail: {
        values: this.values,
      }
    });
    this.table.dispatchEvent(updateValues);
    this.userValues.dispatchEvent(updateValues);
  }

  private setLocalStorage() {
    if (this.values) {
      const settings = {
        currency: this.currency,
        values: this.values,
      };
      localStorage.setItem(this.storageItem, JSON.stringify(settings));
    }
  }

  private async getLocalStorage() {
    const storage = JSON.parse(localStorage.getItem(this.storageItem));
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
      <app-header>
        <header>
          <h1>${this.appTitle}</h1>
          <app-currency></app-currency>
        </header>
      </app-header>

      <app-values></app-values>
      
      <app-drawer aria-hidden="${!this.values}">
        <app-table></app-table>
      </app-drawer>
    `;
  }
}
