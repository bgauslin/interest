import {LitElement, css, html} from 'lit';
import {customElement, query, state} from 'lit/decorators.js';
import {Currencies, DEFAULT_CURRENCY} from '../../modules/Calculator';

import shadowStyles from './currency.scss';

/**
 * Web component that renders currencies for a user to choose from.
 */
@customElement('interest-currency')
class Currency extends LitElement {
  @query('button') button: HTMLButtonElement;
  @query('form :checked') checked: HTMLInputElement;
  @query('form') form: HTMLFormElement;

  @state() clickListener: EventListenerObject;
  @state() closeMenuKeys: String[] = ['Escape', 'Space'];
  @state() currency = DEFAULT_CURRENCY;
  @state() currencyEvent = 'updateCurrency';
  @state() currencyListener: EventListenerObject;
  @state() open: Boolean = false;

  static styles = css`${shadowStyles}`;

  constructor() {
    super();
    this.clickListener = this.handleClick.bind(this);
    this.currencyListener = this.updateCurrency.bind(this);
  }
  
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener(this.currencyEvent, this.currencyListener);
  }

  disconnectedCallback() { 
    super.disconnectedCallback();
    this.removeEventListener('keyup', this.handleKey);
    this.removeEventListener(this.currencyEvent, this.currencyListener);
    document.removeEventListener('click', this.clickListener);
  }

  private toggleMenu() {
    if (this.open) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  private openMenu() {
    this.open = true;
    this.checked?.focus();
    this.addEventListener('keyup', this.handleKey);
    window.requestAnimationFrame(() => {
      document.addEventListener('click', this.clickListener);
    });
  }

  private closeMenu() {
    this.open = false;
    this.removeEventListener('keyup', this.handleKey);
    document.removeEventListener('click', this.clickListener);
  }

  private handleClick(event: Event) {
    const path = event.composedPath();
    if (this.open && !path.includes(this)) {
      this.closeMenu();
    }
  }

  private handleKey(event: KeyboardEvent) {
    if (this.open && this.closeMenuKeys.includes(event.code)) {
      this.closeMenu();
    }
  }

  private updateCurrency(e: CustomEvent) {
    this.currency = e.detail.currency;
  }

  private getCurrency() {
    const formData = new FormData(this.form);
    this.currency = formData.get('currency').toString();
    this.dispatchEvent(new CustomEvent(this.currencyEvent, {
      bubbles: true,
      composed: true,
      detail: {
        currency: this.currency,
      },
    }));
  }

  render() {
    return html`
      ${this.renderButton()}
      ${this.renderMenu()}
    `;
  }

  private renderButton() {
    const current = Currencies.find(currency => currency.id === this.currency);
    const label = 'Change currency';
    return html`
      <button
        aria-controls="menu"
        aria-expanded="${this.open}"
        aria-haspopup="true"
        aria-label="${label}"
        id="button"
        title="${label}"
        type="button"
        @click="${this.toggleMenu}">
        <span aria-hidden="true">${current.symbol}</span>
      </button>
    `;
  }

  private renderMenu() {
    return html`
      <form
        aria-hidden="${!this.open}"
        id="menu" 
        @change="${this.getCurrency}">
        <ul
          aria-labelledby="button"
          role="menu">
        ${Currencies.map((currency) => {
          const {id, label, symbol} = currency;
          return html`
            <li role="menuitem">
              <input
                aria-label="${label}"
                ?checked="${id === this.currency}"
                name="currency"
                role="menuitem"
                type="radio"
                value="${id}">
              <span aria-hidden="true">${symbol}</span>
            </li>`
        })}
        </ul>
      </form>
    `;
  }
}
