import {LitElement, css, html} from 'lit';
import {customElement, state, query} from 'lit/decorators.js';
import {CompoundingValues, DEFAULT_CURRENCY} from '../../modules/Calculator';
import shadowStyles from './app.scss';

/**
 * Web component that sends/receives custom event data to/from custom elements.
 */
@customElement('interest-app')
class App extends LitElement {
  @query('interest-drawer') drawer: HTMLElement;
  @query('interest-table') table: HTMLElement;
  @query('interest-values') values: HTMLElement;
  @state() appTitle = 'Compound Interest Calculator';
  @state() currency = DEFAULT_CURRENCY;
  @state() currencyListener: EventListenerObject;
  @state() userValues: CompoundingValues;
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
    this.values.dispatchEvent(updateCurrency);
    this.saveToStorage();
  }

  private updateValues(e: CustomEvent) {
    this.userValues = e.detail.values;
    const updateValues = new CustomEvent('updateValues', {
      detail: {
        values: this.userValues,
      }
    });
    this.table.dispatchEvent(updateValues);
    this.saveToStorage();
  }

  private saveToStorage() {
    if (this.currency && this.userValues) {
      const settings = {
        currency: this.currency,
        values: this.userValues,
      };
      localStorage.setItem('settings', JSON.stringify(settings));
    }
  }

  render() {
    return html`
      <interest-values>
        <h1>${this.appTitle}</h1>
      </interest-values>
      <interest-drawer aria-hidden="${!this.userValues}">
        <interest-table></interest-table>
      </interest-drawer>
    `;
  }
}
