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
  @query('form :checked') checked: HTMLInputElement;
  @query('dialog') dialog: HTMLDialogElement;
  @query('form') form: HTMLFormElement;

  @state() clickListener: EventListenerObject;
  @state() closeMenuKeys: String[] = ['Escape', 'Space'];
  @state() closing: Boolean = false;
  @state() currency = DEFAULT_CURRENCY;
  @state() currencyEvent = 'updateCurrency';
  @state() currencyListener: EventListenerObject;
  @state() flip: Boolean = false;
  @state() keyListener: EventListenerObject;
  @state() open: Boolean = false;

  static styles = css`${shadowStyles}`;

  constructor() {
    super();
    this.currencyListener = this.updateCurrency.bind(this);
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
    const viewportHeight = window.innerHeight;
    const {height, y} = this.form.getBoundingClientRect();
    this.flip = (y + height > viewportHeight);
    this.dialog.show();
    this.checked.focus();
  }

  private closeMenu() {
    this.closing = true;
    this.dialog.addEventListener('transitionend', () => {
      this.dialog.close();
      this.closing = false;
      this.flip = false;
    }, {once: true});
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

  private updateCurrency(e: CustomEvent) {
    this.currency = e.detail.currency;
  }

  render() {
    return html`
      ${this.renderButton()}
      ${this.renderMenu()}
    `;
  }

  private renderButton() {
    const label = 'Change currency';
    return html`
      <button
        aria-controls="menu"
        aria-expanded="${this.open}"
        aria-haspopup="true"
        type="button"
        @click="${this.toggleMenu}">${label}</button>
    `;
  }

  private renderMenu() {
    return html`
      <dialog
        ?data-closing="${this.closing}"
        ?data-flip="${this.flip}"
        id="menu">
        <form @change="${this.getCurrency}">
          <ul>
          ${Currencies.map((currency) => {
            const {example, id, label, symbol} = currency;
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
