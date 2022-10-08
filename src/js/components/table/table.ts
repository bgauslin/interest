import {LitElement, css, html} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {Calculator, CompoundingValues, DEFAULT_CURRENCY, Sums} from '../../modules/Calculator';
import shadowStyles from './table.scss';

/**
 * Custom element that renders a table based on user-provided values.
 */
@customElement('app-table')
class TableWidget extends LitElement {
  @state() calculator: Calculator;
  @state() currency = DEFAULT_CURRENCY;
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
  }

  private updateValues(e: CustomEvent) {
    this.userValues = e.detail.values;
    this.updateTable();
  }

  private updateTable() {
    this.tableData =
        this.calculator.compound(this.userValues, this.currency);
  }

  render() {
    return html`
      <div class="table" aria-hidden="${this.tableData.length === 0}">
        <table>
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
      </div>
      <p class="rotate-screen">
        Rotate screen to view <span>Interest</span> and <span>Growth</span> columns.
      </p>
    `;
  }
}