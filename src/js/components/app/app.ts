import {LitElement, css, html} from 'lit';
import {customElement, state, query} from 'lit/decorators.js';
import {CompoundingValues, DEFAULT_CURRENCY} from '../../modules/Calculator';
import shadowStyles from './app.scss';

/**
 * Web component that sends/receives custom event data to/from custom elements.
 */
@customElement('interest-app')
class App extends LitElement {
  @query('interest-table') table: HTMLElement;
  @query('interest-values') userValues: HTMLElement;
  @state() appTitle = 'Compound Interest Calculator';
  @state() currency = DEFAULT_CURRENCY;
  @state() currencyListener: EventListenerObject;
  @state() values: CompoundingValues;
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
    this.dispatchCurrency();
    this.setLocalStorage();
  }

  private dispatchCurrency() {
    const updateCurrency = new CustomEvent('updateCurrency', {
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
    const updateValues = new CustomEvent('updateValues', {
      detail: {
        values: this.values,
      }
    });
    this.table.dispatchEvent(updateValues);
    this.userValues.dispatchEvent(updateValues);
  }

  private setLocalStorage() {
    if (this.currency && this.values) {
      const settings = {
        currency: this.currency,
        values: this.values,
      };
      localStorage.setItem('settings', JSON.stringify(settings));
    }
  }

  private async getLocalStorage() {
    const storage = JSON.parse(localStorage.getItem('settings'));
    if (!storage) {
      return;
    }

    this.currency = storage.currency;
    this.values = storage.values;

    await this.updateComplete;

    if (this.currency) {
      this.dispatchCurrency();
    }
    
    if (this.values) {
      this.dispatchValues();
    }
  }

  render() {
    return html`
      <interest-values>
        <h1>${this.appTitle}</h1>
      </interest-values>
      <interest-drawer aria-hidden="${!this.values}">
        <interest-table></interest-table>
      </interest-drawer>
    `;
  }
}
