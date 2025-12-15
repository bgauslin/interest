import {LitElement, PropertyValues, css, html} from 'lit';
import {customElement, property, query, state} from 'lit/decorators.js';
import {Currencies, Events} from './shared';
import shadowStyles from './shadow-styles/currency.css';


/**
 * Lit web component that displays currencies for a user to choose from.
 */
@customElement('interest-currency') class Currency extends LitElement {
  private clickHandler: EventListenerObject;
  private keyHandler: EventListenerObject;

  @property({reflect: true}) currency: string;

  @query(':checked') checked: HTMLInputElement;
  @query('dialog') dialog: HTMLDialogElement;

  @state() closing: boolean = false;
  @state() open: boolean = false;

  constructor() {
    super();
    this.clickHandler = this.handleClick.bind(this);
    this.keyHandler = this.handleKey.bind(this);
  }
  
  connectedCallback() {
    super.connectedCallback();
    document.addEventListener(Events.Click, this.clickHandler);
    document.addEventListener(Events.KeyUp, this.keyHandler);
  }

  disconnectedCallback() { 
    super.disconnectedCallback();
    document.removeEventListener(Events.Click, this.clickHandler);
    document.removeEventListener(Events.KeyUp, this.keyHandler);
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
      this.dialog.show();
      this.checked.focus();
    } else {
      this.closing = true;
      this.dialog.addEventListener(Events.TransitionEnd, () => {
        this.dialog.close();
        this.closing = false;
      }, {once: true});
    }
  }

  protected updated(changed: PropertyValues<this>) {
    for (const [key, value] of changed.entries()) {
      if (key !== 'currency') return;

      if (value) {
        this.dispatchEvent(new CustomEvent(Events.Currency, {
          detail: {
            currency: this.currency,
          },
        }));
      }
    }
  }

  protected render() {
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
        @click=${this.toggleMenu}>
        ${symbol}
      </button>

      <dialog
        id="menu"
        ?data-closing=${this.closing}>        
        <ul>
        ${Currencies.map((currency) => {
          const {id, label, symbol} = currency;
          return html`
            <li>
              <label
                ?data-checked=${id === this.currency}>
                <input
                  aria-label="${label}"
                  name="currency"
                  tabindex="${this.open ? '0' : '-1'}"
                  type="radio"
                  value="${id}"
                  ?checked=${id === this.currency}
                  @click=${() => this.currency = id}>
                <span class="symbol">${symbol}</span>
                <span class="label">${label}</span>
              </label>
            </li>
          `;
        })}
        </ul>
      </dialog>
    `;
  }

  // Shadow DOM stylesheet.
  static styles = css`${shadowStyles}`;
}
