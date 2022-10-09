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
    const updateCurrency = new CustomEvent('updateCurrency', {
      detail: {
        currency: this.currency,
      }
    });
    this.table.dispatchEvent(updateCurrency);
    this.userValues.dispatchEvent(updateCurrency);
    this.saveToStorage();
  }

  private updateValues(e: CustomEvent) {
    this.values = e.detail.values;
    const updateValues = new CustomEvent('updateValues', {
      detail: {
        values: this.values,
      }
    });
    this.table.dispatchEvent(updateValues);
    this.saveToStorage();
  }

  private saveToStorage() {
    if (this.currency && this.values) {
      const settings = {
        currency: this.currency,
        values: this.values,
      };
      localStorage.setItem('settings', JSON.stringify(settings));
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
