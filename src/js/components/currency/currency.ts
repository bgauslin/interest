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
    if (this.open && !path.includes(this.form)) {
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
        <svg viewbox="0 0 1000 1000">
          <path d="M441.8,339.9c4.9-52.8,23.6-101.5,52.5-142.8C470.8,90.2,375.4,10,261.7,10C130.3,10,23.4,116.9,23.4,248.3c0,114.3,81,210.1,188.6,233C266.2,407.5,347.8,355.4,441.8,339.9z M166.4,305c0-8.7,6.7-15.4,15.3-15.4h48.9v-11.4l-6.7-11.4h-42.2c-8.7,0-15.3-6.7-15.3-15.4s6.7-15.4,15.3-15.4h24l-52-85.5c-2.8-4.7-5.5-10.6-5.5-16.2c0-21.7,20.1-28.8,33.9-28.8c16.6,0,24,13,26.8,18.5l52.8,100.5l52.8-100.5c2.8-5.5,10.3-18.5,26.8-18.5c13.8,0,33.9,7.1,33.9,28.8c0,5.5-2.8,11.4-5.5,16.1l-52,85.5h24c8.7,0,15.3,6.7,15.3,15.4s-6.7,15.4-15.3,15.4h-42.1l-6.7,11.4v11.4h48.9c8.7,0,15.3,6.7,15.3,15.4c0,8.7-6.7,15.4-15.3,15.4h-48.9v39c0,18.9-11.4,31.5-31.1,31.5c-19.7,0-31.1-12.6-31.1-31.5v-39h-48.9C173,320.4,166.4,313.7,166.4,305z"/>
          <path d="M738.3,129.1c-120.3,0-219.8,89.7-235.8,205.7c45.5,0.3,88.8,9.3,128.8,25.2c2.6-6.1,8.1-9.9,16.6-9.9h8.3c-8.3-11.8-11.8-26.8-11.8-42.2c0-48.8,43.3-83.1,98.9-83.1c69,0,102.5,37,102.5,67.8c0,17.7-12.2,27.6-29.6,27.6c-34.7,0-13.4-48.1-66.6-48.1c-23.2,0-45.3,13.8-45.3,39.4c0,13.4,6.7,26.8,13,38.6h43c16.1,0,24.4,5.9,24.4,18.9c0,13-8.3,18.9-24.4,18.9H729c1.2,3.2,2,5.9,2,9.5c0,6.4-1.6,12.7-4,18.8c12.9,10.6,24.8,22.4,36.1,34.8c10.9,2.2,20.7,4.8,32.2,4.8c6.7,0,22.9-4.3,29.1-4.3c14.6,0,22.9,11,22.9,25.2c0,22.2-19.9,31.9-40.4,33.2c13.6,22.8,24.9,47.1,33.3,72.8c80.5-38.3,136.5-120.2,136.5-215.1C976.6,236,869.7,129.1,738.3,129.1z"/>
          <path d="M515.8,720.5V818c29.5-2,60.6-15.7,60.6-48.2C576.3,736.3,542.3,726.4,515.8,720.5z"/>
          <path d="M431,603.8c0,24.7,18.2,38.9,55.2,46.3v-88.2C452.7,563,431,582.6,431,603.8z"/>
          <path d="M500,394.3c-164.2,0-297.9,133.6-297.9,297.9C202.1,856.4,335.7,990,500,990s297.9-133.6,297.9-297.9C797.9,527.9,664.2,394.3,500,394.3z M515.8,868.3v30.5c0,8.4-6.5,16.7-14.8,16.7c-8.4,0-14.8-8.3-14.8-16.7v-30.5c-83.2-2-124.6-51.7-124.6-90.7c0-19.6,11.8-31,30.5-31c55.2,0,12.3,68,94.1,71.4V715.1c-72.9-13.3-117.2-45.3-117.2-100c0-67,55.6-101.4,117.2-103.4v-26.2c0-8.4,6.4-16.8,14.8-16.8c8.4,0,14.8,8.4,14.8,16.8v26.2c38.3,1,117.1,25.1,117.1,73.4c0,19.2-14.3,30.5-31,30.5c-32,0-31.6-52.6-86.1-53.7v93.6c65,13.8,122.6,33,122.6,108.9C638.4,830.4,589.1,863.9,515.8,868.3z"/>
        </svg>
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
