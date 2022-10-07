import {LitElement, css, html} from 'lit';
import {customElement, property, query, state} from 'lit/decorators.js';
import shadowStyles from './settings.scss';

/**
 * Web component that renders theme swatches for a user to choose from.
 */
@customElement('settings-widget')
class Settings extends LitElement {
  @property({type: String}) currencies = [
    {id: 'usd', symbol: '$', label: 'Dollars'},
    {id: 'eur', symbol: '€', label: 'Euros'},
    {id: 'gbp', symbol: '£', label: 'Pounds'},
    {id: 'yen', symbol: '¥', label: 'Yen'},
    {id: 'inr', symbol: '₹', label: 'Rupees'},
  ];
  @query('button') button: HTMLButtonElement;
  @query('form') form: HTMLFormElement;
  @state() currency: String = '';
  @state() open: Boolean = false;

  private clickListener: EventListenerObject;

  static styles = css`${shadowStyles}`;

  constructor() {
    super();
    this.clickListener = this.handleClick.bind(this);
    this.addEventListener('keyup', this.handleKey);
  }
  
  connectedCallback() {
    super.connectedCallback();
    this.currency = localStorage.getItem('currency') || this.currencies[0].id;
  }

  disconnectedCallback() { 
    super.disconnectedCallback();
    document.removeEventListener('click', this.clickListener);
    this.removeEventListener('keyup', this.handleKey);
  }

  private updateCurrency() {
    const formData = new FormData(this.form);
    this.currency = formData.get('currency').toString();

    // Set a custom property for use elsewhere.
    document.documentElement.style.setProperty(
        '--currency', `${this.currency}`);

    // Dispatch currency for rendering elsewhere.
    this.dispatchEvent(new CustomEvent('updateCurrency', {
      bubbles: true,
      detail: {
        currency: this.currency,
      }
    }));
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

  render() {
    return html`
      ${this.renderButton()}
      ${this.renderMenu()}
    `;
  }

  private renderButton() {
    const buttonLabel = 'Update theme';
    return html`
      <button
        aria-controls="menu"
        aria-expanded="${this.open}"
        aria-haspopup="true"
        aria-label="${buttonLabel}"
        id="button"
        title="${buttonLabel}"
        @click="${this.toggleOpen}">
        ${this.renderDefaultIcon()}
      </button>
    `;
  }

  private renderDefaultIcon() {
    return html`
      <svg aria-hidden="true" viewbox="0 0 24 24">
        <circle cx="4" cy="12" r="2.5"/>
        <circle cx="12" cy="12" r="2.5"/>
        <circle cx="20" cy="12" r="2.5"/>
      </svg>
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
