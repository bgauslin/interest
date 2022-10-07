import {LitElement, css, html} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {Calculator, Sums} from '../../modules/Calculator';
import shadowStyles from './table.scss';

/**
 * Custom element that renders a table based on user-provided values.
 */
@customElement('table-widget')
class TableWidget extends LitElement {
  @state() calculator: Calculator;
  @state() currency: String = '';
  @state() currencyListener: EventListenerObject;
  @state() tableData: Sums[] = [];
  @state() valuesListener: EventListenerObject;

  static styles = css`${shadowStyles}`;

  constructor() {
    super();
    this.calculator = new Calculator();
    this.currencyListener = this.updateCurrency.bind(this);
    this.valuesListener = this.updateTableData.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('updateCurrency', this.currencyListener);
    document.addEventListener('updateValues', this.valuesListener);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('updateCurrency', this.currencyListener);
    document.removeEventListener('updateValues', this.valuesListener);
  }

  private updateCurrency(e: CustomEvent) {
    this.currency = e.detail.currency;
  }

  private updateTableData(e: CustomEvent) {
    this.tableData =
        this.calculator.compound(e.detail.values, `${this.currency}`);
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