import {LitElement, PropertyValues, css, html} from 'lit';
import {customElement, property, query, state} from 'lit/decorators.js';
import {Currencies, DEFAULT_CURRENCY} from '../../modules/calculator';
import {Events} from '../../modules/shared';
import shadowStyles from './currency.css';


/**
 * Web component that renders currencies for a user to choose from.
 */
@customElement('interest-currency')
class Currency extends LitElement {
  private clickHandler: EventListenerObject;
  private keyHandler: EventListenerObject;

  @property({reflect: true}) currency = DEFAULT_CURRENCY;
  @query(':checked') checked: HTMLInputElement;
  @query('dialog') dialog: HTMLDialogElement;
  @state() closing: boolean = false;
  @state() open: boolean = false;

  static styles = css`${shadowStyles}`;

  constructor() {
    super();
    this.clickHandler = this.handleClick.bind(this);
    this.keyHandler = this.handleKey.bind(this);
  }
  
  connectedCallback() {
    super.connectedCallback();
    document.addEventListener(Events.Click, this.clickHandler);
    document.addEventListener(Events.Keydown, this.keyHandler);
  }

  disconnectedCallback() { 
    super.disconnectedCallback();
    document.removeEventListener(Events.Click, this.clickHandler);
    document.removeEventListener(Events.Keydown, this.keyHandler);
  }

  private handleClick(event: Event) {
    if (this.open && !event.composedPath().includes(this)) {
      this.toggleMenu();
    }
  }

  private handleKey(event: KeyboardEvent) {
    if (event.code === 'Escape') {
      event.preventDefault();
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

  protected updated(changed: PropertyValues<this>) {
    for (const [key, value] of changed.entries()) {
      if (key !== 'currency') {
        return;
      }

      if (value) {
        this.dispatchEvent(new CustomEvent(Events.Currency, {
          bubbles: true,
          composed: true,
          detail: {
            currency: this.currency,
          },
        }));
      }
    }
  }

  protected render() {
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
        @click="${this.toggleMenu}">${symbol}</button>
    `;
  }

  private renderMenu() {
    return html`
      <dialog
        ?data-closing="${this.closing}"
        id="menu">        
        <ul>
        ${Currencies.map((currency) => {
          const {id, label, symbol} = currency;
          return html`
            <li>
              <label ?data-checked="${id === this.currency}">
                <input
                  aria-label="${label}"
                  ?checked="${id === this.currency}"
                  name="currency"
                  tabindex="${this.open ? '0' : '-1'}"
                  type="radio"
                  value="${id}"
                  @click="${() => this.currency = id}">
                <span class="symbol">${symbol}</span>
                <span>${label}</span>
              </label>
            </li>
          `;
        })}
        </ul>
      </dialog>
    `;
  }
}
