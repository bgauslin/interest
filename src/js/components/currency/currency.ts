import {LitElement, css, html} from 'lit';
import {customElement, property, query, state} from 'lit/decorators.js';
import {Currencies, DEFAULT_CURRENCY} from '../../modules/Calculator';
import {AppEvents} from '../../modules/shared';

import shadowStyles from './currency.scss';

/**
 * Web component that renders currencies for a user to choose from.
 */
@customElement('app-currency')
class Currency extends LitElement {
  private clickListener: EventListenerObject;
  private keyListener: EventListenerObject;

  @property({reflect: true}) currency = DEFAULT_CURRENCY;

  @query('form :checked') checked: HTMLInputElement;
  @query('dialog') dialog: HTMLDialogElement;
  @query('form') form: HTMLFormElement;

  @state() closing: Boolean = false;
  @state() open: Boolean = false;

  static styles = css`${shadowStyles}`;

  constructor() {
    super();
    this.clickListener = this.handleClick.bind(this);
    this.keyListener = this.handleKey.bind(this);
  }
  
  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this.clickListener);
    document.addEventListener('keydown', this.keyListener);
  }

  disconnectedCallback() { 
    super.disconnectedCallback();
    document.removeEventListener('click', this.clickListener);
    document.removeEventListener('keydown', this.keyListener);
  }

  private handleClick(e: Event) {
    if (this.open && !e.composedPath().includes(this)) {
      this.toggleMenu();
    }
  }

  private handleKey(e: KeyboardEvent) {
    if (e.code === 'Escape') {
      e.preventDefault();
      this.toggleMenu();
    }
  }

  private toggleMenu() {
    this.open = !this.open;
    if (this.open) {
      this.openMenu();
    } else {
      this.closeMenu();
    }
  }

  private openMenu() {
    this.dialog.show();
    this.checked.focus();
  }

  private closeMenu() {
    this.closing = true;
    this.dialog.addEventListener('transitionend', () => {
      this.dialog.close();
      this.closing = false;
    }, {once: true});
  }

  private updateCurrency() {
    const formData = new FormData(this.form);
    this.currency = formData.get('currency').toString();

    this.dispatchEvent(new CustomEvent(AppEvents.CURRENCY, {
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
    const label = 'Change currency';
    const currency = Currencies.find(c => c.id === this.currency);
    const symbol = currency.symbol;
    return html`
      <button
        aria-controls="menu"
        aria-expanded="${this.open}"
        aria-haspopup="true"
        aria-label="${label}"
        title="${label}"
        type="button"
        @click="${this.toggleMenu}">
          ${symbol}
        </button>
    `;
  }

  private renderMenu() {
    return html`
      <dialog
        ?data-closing="${this.closing}"
        id="menu">
        <form @change="${this.updateCurrency}">
          <ul>
          ${Currencies.map((currency) => {
            const {id, label, locale, symbol} = currency;
            const example = new Intl.NumberFormat(locale, {
              currency: id.toUpperCase(),
              style: 'currency',
            }).format(1234567.89);

            return html`
              <li>
                <label ?data-checked="${id === this.currency}">
                  <input
                    aria-label="${label}"
                    ?checked="${id === this.currency}"
                    name="currency"
                    tabindex="${this.open ? '0' : '-1'}"
                    type="radio"
                    value="${id}">
                  <span class="symbol">${symbol}</span>
                  <span class="example">${example}</span>
                </label>
              </li>`
          })}
          </ul>
        </form>
      </dialog>
    `;
  }
}
