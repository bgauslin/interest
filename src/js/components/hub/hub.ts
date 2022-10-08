import {LitElement} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {CompoundingValues, DEFAULT_CURRENCY} from '../../modules/Calculator';

/**
 * Web component that sends/receives custom event data to/from custom elements.
 */
@customElement('app-hub')
class Hub extends LitElement {
  @state() currency = DEFAULT_CURRENCY;
  @state() currencyListener: EventListenerObject;
  @state() drawer: HTMLElement;
  @state() table: HTMLElement;
  @state() userValues: CompoundingValues;
  @state() values: HTMLElement;
  @state() valuesListener: EventListenerObject;

  constructor() {
    super();
    this.currencyListener = this.updateCurrency.bind(this);
    this.valuesListener = this.updateValues.bind(this);
  }
  
  connectedCallback() {
    super.connectedCallback();
    this.getElements();
    document.addEventListener('updateCurrency', this.currencyListener);
    document.addEventListener('updateValues', this.valuesListener);
  }

  disconnectedCallback() { 
    super.disconnectedCallback();
    document.removeEventListener('updateCurrency', this.currencyListener);
    document.removeEventListener('updateValues', this.valuesListener);
  }

  private getElements() {
    this.drawer = document.querySelector('app-drawer');
    this.table = document.querySelector('app-table');
    this.values = document.querySelector('app-values');
  }

  private updateCurrency(e: CustomEvent) {
    this.currency = e.detail.currency;
    const updateCurrency = new CustomEvent('updateCurrency', {
      detail: {
        currency: this.currency,
      }
    });
    this.table?.dispatchEvent(updateCurrency);
    this.values?.dispatchEvent(updateCurrency);
    this.saveToStorage();
  }

  private updateValues(e: CustomEvent) {
    this.userValues = e.detail.values;
    const updateValues = new CustomEvent('updateValues', {
      detail: {
        values: this.userValues,
      }
    });
    this.table?.dispatchEvent(updateValues);
    this.saveToStorage();

    // Reveal the drawer when there are valid values.
    this.drawer?.removeAttribute('aria-hidden');
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
}
