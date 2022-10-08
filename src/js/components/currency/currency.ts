import {LitElement, css, html} from 'lit';
import {customElement, query, state} from 'lit/decorators.js';
import {Currencies, DEFAULT_CURRENCY} from '../../modules/Calculator';
import shadowStyles from './currency.scss';

/**
 * Web component that renders currencies for a user to choose from.
 */
@customElement('app-currency')
class Currency extends LitElement {
  @query('button') button: HTMLButtonElement;
  @query('form') form: HTMLFormElement;
  // @state() clickListener: EventListenerObject;
  @state() currency = DEFAULT_CURRENCY;
  @state() open: Boolean = false;
  @state() closeMenuKeys: String[] = ['Escape', 'Space'];

  static styles = css`${shadowStyles}`;

  constructor() {
    super();
    // this.clickListener = this.handleClick.bind(this);
  }
  
  connectedCallback() {
    super.connectedCallback();
    this.getSavedCurrency();
  }

  disconnectedCallback() { 
    super.disconnectedCallback();
    this.removeEventListener('keyup', this.handleKey);
    // document.removeEventListener('click', this.clickListener);
  }

  private getSavedCurrency() {
    const storage = JSON.parse(localStorage.getItem('settings'));
    if (storage && storage.currency) {
      this.currency = storage.currency;
    }
  }

  private toggleMenu() {
    if (!this.open) {
      this.openMenu();
    } else {
      this.closeMenu();
    }
  }

  private openMenu() {
    this.open = true;
    window.requestAnimationFrame(() => {
      const checked = this.form.querySelector<HTMLInputElement>(':checked');
      checked?.focus();
      this.addEventListener('keyup', this.handleKey);
      // document.addEventListener('click', this.clickListener);
    });
  }

  private closeMenu() {
    this.open = false;
    // document.removeEventListener('click', this.clickListener);
    this.removeEventListener('keyup', this.handleKey);
  }

  // private handleClick(event: Event) {
  //   if (this.open && event.target !== this) {
  //     this.closeMenu();
  //   }
  // }

  private handleKey(event: KeyboardEvent) {
    if (this.open && this.closeMenuKeys.includes(event.code)) {
      this.closeMenu();
    }
  }

  private updateCurrency() {
    const formData = new FormData(this.form);
    this.currency = formData.get('currency').toString();
    this.dispatchEvent(new CustomEvent('updateCurrency', {
      detail: {
        currency: this.currency,
      },
      bubbles: true,
      composed: true,
    }));
  }

  render() {
    return html`
      ${this.renderButton()}
      ${this.renderMenu()}
    `;
  }

  private renderButton() {
    const buttonLabel = 'Change currency';
    const currentCurrency =
        Currencies.find(currency => currency.id === this.currency);
    return html`
      <button
        aria-controls="menu"
        aria-expanded="${this.open}"
        aria-haspopup="true"
        aria-label="${buttonLabel}"
        id="button"
        title="${buttonLabel}"
        type="button"
        @click="${this.toggleMenu}">
        <span aria-hidden="true">${currentCurrency.symbol}</span>
      </button>
    `;
  }

  private renderMenu() {
    return html`
      <form id="menu" aria-hidden="${!this.open}"
        @change="${this.updateCurrency}">
        <ul role="menu" aria-labelledby="button">
        ${Currencies.map((currency) => {
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
