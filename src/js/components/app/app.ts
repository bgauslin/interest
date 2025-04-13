import {LitElement, css, html} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {Calculator, CompoundingValues, Sums} from '../../modules/Calculator';
import {AppEvents, STORAGE_ITEM} from '../../modules/shared';

import shadowStyles from './app.scss';

/**
 * Web component that sends/receives custom event data to/from custom elements.
 */
@customElement('interest-app')
class App extends LitElement {
  private calculator: Calculator;
  private currencyListener: EventListenerObject;
  private drawerListener: EventListenerObject;
  private valuesListener: EventListenerObject;
  
  @state() commas: boolean = false;
  @state() currency: string;
  @state() drawer: boolean = false;
  @state() target: HTMLElement;
  @state() values: CompoundingValues;

  static styles = css`${shadowStyles}`;

  constructor() {
    super();
    this.calculator = new Calculator();
    this.currencyListener = this.updateCurrency.bind(this);
    this.drawerListener = this.updateDrawer.bind(this);
    this.valuesListener = this.updateValues.bind(this);
  }
  
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener(AppEvents.CURRENCY, this.currencyListener);
    this.addEventListener(AppEvents.DRAWER, this.drawerListener);
    this.addEventListener(AppEvents.VALUES, this.valuesListener);
    this.addEventListener('touchstart', this.handleTouchstart, {passive: true});
    this.addEventListener('touchend', this.handleTouchend, {passive: true});
  }

  disconnectedCallback() { 
    super.disconnectedCallback();
    this.removeEventListener(AppEvents.CURRENCY, this.currencyListener);
    this.removeEventListener(AppEvents.DRAWER, this.drawerListener);
    this.removeEventListener(AppEvents.VALUES, this.valuesListener);
    this.removeEventListener('touchstart', this.handleTouchstart);
    this.removeEventListener('touchend', this.handleTouchend);
  }

  private async updateCurrency(event: CustomEvent) {
    await this.updateComplete;
    this.currency = event.detail.currency;
    this.setLocalStorage();
  }

  private async updateDrawer(event: CustomEvent) {
    await this.updateComplete;
    this.drawer = event.detail.drawer;
    this.setLocalStorage();
  }

  private async updateValues(event: CustomEvent) {
    await this.updateComplete;
    this.commas = event.detail.commas;
    this.values = event.detail.values;
    this.setLocalStorage();
  }

  private setLocalStorage() {
    if (!this.currency || !this.values) {
      return;
    }

    localStorage.setItem(STORAGE_ITEM, JSON.stringify({
      commas: this.commas,
      currency: this.currency,
      drawer: this.drawer,
      values: this.values,
    }));
  }

  private handleTouchstart(event: TouchEvent) {
    this.target = <HTMLElement>event.composedPath()[0];
    if (this.target.tagName === 'BUTTON') {
      this.target.classList.add('touch');
    }
  }

  private handleTouchend() {
    this.target.classList.remove('touch');
  }

  protected render() {
    return html`
      <app-values></app-values>
      <app-drawer aria-hidden="${!this.values}">
        ${this.renderTable()}
      </app-drawer>
    `;
  }

  private renderTable() {
    if (!this.values || !this.currency) return;

    const tableData: Sums[] =  this.calculator.compound(this.values, this.currency);

    return html`
      <div class="table">
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
      <p class="footnote">
        Rotate screen to view <span>Interest</span> and <span>Growth</span> columns.
      </p>
    `;
  }
}
