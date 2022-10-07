import {LitElement, css, html} from 'lit';
import {customElement, property, query, state} from 'lit/decorators.js';
import shadowStyles from './settings.scss';

/**
 * Web component that renders theme swatches for a user to choose from.
 */
@customElement('i-settings')
class Settings extends LitElement {
  @property() currencies = [
    {id: 'usd', symbol: '$', label: 'Dollars'},
    {id: 'eur', symbol: '€', label: 'Euros'},
    {id: 'gbp', symbol: '£', label: 'Pounds'},
    {id: 'yen', symbol: '¥', label: 'Yen'},
    {id: 'inr', symbol: '₹', label: 'Rupees'},
  ];
  @query('button') button: HTMLButtonElement;
  @query('form') form: HTMLFormElement;
  @state() clickListener: EventListenerObject;
  @state() currency = '';
  @state() open: Boolean = false;

  static styles = css`${shadowStyles}`;

  constructor() {
    super();
    this.clickListener = this.handleClick.bind(this);
    this.addEventListener('keyup', this.handleKey); 
  }
  
  connectedCallback() {
    super.connectedCallback();
    this.getSavedCurrency();
  }

  disconnectedCallback() { 
    super.disconnectedCallback();
    this.removeEventListener('keyup', this.handleKey);
    document.removeEventListener('click', this.clickListener);
  }

  private getSavedCurrency() {
    const storage = JSON.parse(localStorage.getItem('settings'));
    this.currency = storage ? storage.currency : this.currencies[0].id;
  }

  private toggleOpen() {
    if (!this.open) {
      this.openMenu();
    } else {
      this.closeMenu();
    }
  }

  private openMenu() {
    this.open = true;
    window.requestAnimationFrame(() => {
      document.addEventListener('click', this.clickListener);
    });
  }

  private closeMenu() {
    this.open = false;
    document.removeEventListener('click', this.clickListener);
  }

  private handleClick(event: Event) {
    if (this.open && event.target !== this) {
      this.closeMenu();
    }
  }

  private handleKey(event: KeyboardEvent) {
    if (this.open && event.code === 'Escape') {
      this.closeMenu();
    }
  }

  private updateCurrency() {
    const formData = new FormData(this.form);
    this.currency = formData.get('currency').toString();
    this.dispatchEvent(new CustomEvent('updateCurrency', {
      bubbles: true,
      detail: {
        currency: this.currency,
      }
    }));
  }

  render() {
    return html`
      ${this.renderButton()}
      ${this.renderMenu()}
    `;
  }

  private renderButton() {
    const buttonLabel = 'Update theme';
    const currentCurrency = this.currencies.find(currency => currency.id === this.currency);
    return html`
      <button
        aria-controls="menu"
        aria-expanded="${this.open}"
        aria-haspopup="true"
        aria-label="${buttonLabel}"
        id="button"
        title="${buttonLabel}"
        @click="${this.toggleOpen}">
        <span aria-hidden="true">${currentCurrency.symbol}</span>
      </button>
    `;
  }

  private renderMenu() {
    return html`
      <form id="menu" aria-hidden="${!this.open}"
        @change="${this.updateCurrency}">
        <ul role="menu" aria-labelledby="button">
        ${this.currencies.map((currency) => {
          const {id, label, symbol} = currency;
          return html`
            <li role="menuitem">
              <input type="radio" name="currency" value="${id}"
                  aria-label="${label}" ?checked="${id === this.currency}">
              <span>${symbol}</span>
            </li>`
        })}
        </ul>
      </form>
    `;
  }
}
