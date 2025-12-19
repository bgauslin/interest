import {LitElement, html, nothing} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {Calculator} from './calculator';
import {DEFAULT_CURRENCY, STORAGE_ITEM, CompoundingValues, Sums} from './shared';


/**
 * Lit custom element that calculates compound interest based on user-provided
 * values.
 */
@customElement('interest-app') class App extends LitElement {
  private calculator: Calculator;
  
  @state() commas: boolean = false;
  @state() currency: string = DEFAULT_CURRENCY;
  @state() drawer: boolean = false;
  @state() total: string = '';
  @state() values: CompoundingValues;

  constructor() {
    super();
    this.calculator = new Calculator();
  }
  
  connectedCallback() {
    super.connectedCallback();
    this.getLocalStorage();
  }

  disconnectedCallback() { 
    super.disconnectedCallback();
  }

  protected createRenderRoot() {
    return this;
  }

  private updateCurrency(event: CustomEvent) {
    this.currency = event.detail.currency;
    this.updateTotal();
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
    this.updateTotal();
    this.setLocalStorage();
  }

  private updateTotal() {
    this.total = this.calculator.total(this.values, this.currency);
  }

  private clearValues() {
    this.values = null;
    this.total = '';
    localStorage.removeItem(STORAGE_ITEM);
  }

  private getLocalStorage() {
    const storage = JSON.parse(localStorage.getItem(STORAGE_ITEM));
    if (!storage) return;

    const {commas, currency, drawer, values} = storage;

    this.commas = commas;
    this.currency = currency;  
    this.drawer = drawer;
    this.values = values;

    this.updateTotal();
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

  protected render() {
    const tableData: Sums[] = this.values ?
        this.calculator.compound(this.values, this.currency) : [];

    return html`
      <div class="container">
        <h1>Compound Interest</h1>

        <interest-values
          .commas=${this.commas}
          .values=${this.values}
          @valuesUpdated=${this.updateValues}
          @valuesCleared=${this.clearValues}></interest-values>

        <interest-currency
          aria-hidden="${this.total === ''}"
          .currency=${this.currency}
          @currencyUpdated=${this.updateCurrency}></interest-currency>

        <div
          aria-hidden="${this.total === ''}"
          class="total"
          tabindex="-1">${this.total}</div>
      </div>

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
      <interest-touch></interest-touch>
    `;
  }
}
