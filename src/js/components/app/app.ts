import {LitElement, css, html, nothing} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {Calculator, CompoundingValues, DEFAULT_CURRENCY, Sums} from '../../modules/calculator';
import {Events, STORAGE_ITEM} from '../../modules/shared';
import shadowStyles from './app.css';


/**
 * Web component that sends/receives custom event data to/from custom elements.
 */
@customElement('interest-app') class App extends LitElement {
  private calculator: Calculator;
  
  @state() commas: boolean = false;
  @state() currency: string = DEFAULT_CURRENCY;
  @state() drawer: boolean = false;
  @state() touchTarget: HTMLElement;
  @state() values: CompoundingValues;

  constructor() {
    super();
    this.calculator = new Calculator();
  }
  
  connectedCallback() {
    super.connectedCallback();
    this.getLocalStorage();
    this.addEventListener(Events.TouchEnd, this.handleTouchEnd, {passive: true});
    this.addEventListener(Events.TouchStart, this.handleTouchStart, {passive: true});
  }

  disconnectedCallback() { 
    super.disconnectedCallback();
    this.removeEventListener(Events.TouchEnd, this.handleTouchEnd);
    this.removeEventListener(Events.TouchStart, this.handleTouchStart);
  }

  private updateCurrency(event: CustomEvent) {
    this.currency = event.detail.currency;
    this.setLocalStorage();
  }

  private updateDrawer(event: CustomEvent) {
    this.drawer = event.detail.drawer;
    this.setLocalStorage();
  }

  private updateValues(event: CustomEvent) {
    const {commas, values} = event.detail;
    this.commas = commas;
    this.values = values;
    this.setLocalStorage();
  }

  private getLocalStorage() {
    const storage = JSON.parse(localStorage.getItem(STORAGE_ITEM));
    if (!storage) return;

    const {commas, currency, drawer, values} = storage;

    this.commas = commas;
    this.currency = currency;  
    this.drawer = drawer;
    this.values = values;
  }

  private setLocalStorage() {
    if (!this.values) return;

    localStorage.setItem(STORAGE_ITEM, JSON.stringify({
      commas: this.commas,
      currency: this.currency,
      drawer: this.drawer,
      values: this.values,
    }));
  }

  private handleTouchStart(event: TouchEvent) {
    this.touchTarget = <HTMLElement>event.composedPath()[0];
    if (this.touchTarget.tagName === 'BUTTON') {
      this.touchTarget.classList.add('touch');
    }
  }

  private handleTouchEnd() {
    this.touchTarget.classList.remove('touch');
  }

  protected render() {
    const tableData: Sums[] = this.values ?
        this.calculator.compound(this.values, this.currency) : [];

    return html`
      <interest-values
        .commas=${this.commas}
        .currency=${this.currency} 
        .values=${this.values}
        @currencyUpdated=${this.updateCurrency}
        @valuesUpdated=${this.updateValues}></interest-values>

      <interest-drawer
        aria-hidden="${!this.values}"
        .open=${this.drawer}
        @drawerUpdated=${this.updateDrawer}>
        <span slot="open">Hide table</span>
        <span slot="closed">Show table</span>
        ${tableData.length > 0 ? html`
        <div
          class="table"
          slot="content">
          <table>
            <thead>
              <tr>
                <th class="year">Year</th>
                <th class="deposits">Deposits</th>
                <th class="interest" data-optional>Interest</th>
                <th class="growth" data-optional>Growth</th>
                <th class="balance">Balance</th>
              </tr>
            </thead>
            <tbody>
              ${tableData.map((row) => {
                const {balance, deposits, growth, interest, year} = row;
                return html`
                  <tr>
                    <td class="year">${year}</td>
                    <td class="deposits">${deposits}</td>
                    <td class="interest" data-optional>${interest}</td>
                    <td class="growth" data-optional>${growth}</td>
                    <td class="balance">${balance}</td>
                  </tr>
                `;
              })}
            </tbody>
          </table>
        </div>
        <p
          class="footnote"
          slot="footnote">
          Rotate screen to view <span>Interest</span> and <span>Growth</span> columns.
        </p>` : nothing}
      </interest-drawer>
    `;
  }

  // Shadow DOM stylesheet.
  static styles = css`${shadowStyles}`;
}
