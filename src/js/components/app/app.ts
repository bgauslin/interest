import {LitElement, css, html} from 'lit';
import {customElement, query, state} from 'lit/decorators.js';
import {CompoundingValues, DEFAULT_CURRENCY} from '../../modules/Calculator';
import {AppEvents} from '../../modules/shared';

import shadowStyles from './app.scss';

const APP_TITLE = 'Compound Interest Calculator';
const STORAGE_ITEM = 'interest';

/**
 * Web component that sends/receives custom event data to/from custom elements.
 */
@customElement('interest-app')
class App extends LitElement {
  private currencyListener: EventListenerObject;
  private valuesListener: EventListenerObject;

  @query('app-table') table: HTMLElement;
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
    this.table.dispatchEvent(updateCurrency);
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
    this.table.dispatchEvent(updateValues);
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
      <h1>${APP_TITLE}</h1>
      <app-values></app-values>
      <app-drawer aria-hidden="${!this.values}">
        <app-table></app-table>
      </app-drawer>
    `;
  }
}
