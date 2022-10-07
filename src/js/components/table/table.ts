import {LitElement, css, html} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {Calculator, CompoundingValues, Sums} from '../../modules/Calculator';
import shadowStyles from './table.scss';

/**
 * Custom element that renders a table based on user-provided values.
 */
@customElement('i-table')
class TableWidget extends LitElement {
  @state() calculator: Calculator;
  @state() currency: String = '';
  @state() currencyListener: EventListenerObject;
  @state() tableData: Sums[] = [];
  @state() userValues: CompoundingValues;
  @state() valuesListener: EventListenerObject;

  static styles = css`${shadowStyles}`;

  constructor() {
    super();
    this.calculator = new Calculator();
    this.currencyListener = this.updateCurrency.bind(this);
    this.valuesListener = this.updateValues.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('updateCurrency', this.currencyListener);
    this.addEventListener('updateValues', this.valuesListener);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('updateCurrency', this.currencyListener);
    this.removeEventListener('updateValues', this.valuesListener);
  }

  private updateCurrency(e: CustomEvent) {
    this.currency = e.detail.currency;
    if (this.userValues) {
      this.updateTable();
    }
    console.log('table.updateCurrency', this.currency);
  }

  private updateValues(e: CustomEvent) {
    this.userValues = e.detail.values;
    this.updateTable();
    
    console.log('table.updateValues', this.userValues);
  }

  private updateTable() {
    console.log('table.updateTable')
    this.tableData =
        this.calculator.compound(this.userValues, `${this.currency}`);
  }

  render() {
    return html`
      <table aria-hidden="${this.tableData.length === 0}">
        <thead>
          <tr>
            <th class="year">Year</th>
            <th class="deposits">Deposits</th>
            <th class="interest">Interest</th>
            <th class="balance">Balance</th>
            <th class="growth">Growth</th>
          </tr>
        </thead>
        <tbody>
          ${this.tableData.map((row) => {
            const {balance, deposits, growth, interest, year} = row;
            return html`
              <tr>
                <td class="year">${year}</td>
                <td class="deposits">${deposits}</td>
                <td class="interest">${interest}</td>
                <td class="balance">${balance}</td>
                <td class="growth">${growth}</td>
              </tr>
            `
          })}
        </tbody>
      </table>
      <p class="rotate-screen">
        Rotate screen to view <span>Interest</span> and <span>Growth</span> columns.
      </p>
    `;
  }
}