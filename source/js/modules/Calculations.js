/** @const {string} */
const CURRENCY_RUPEES = 'inr';

/** @const {number} */
const EURO_FORMAT_THRESHOLD = 50000;

/** @class */
class Calculations {
  /**
   * @param {!Object} config
   * @param {!string} config.table
   * @param {!string} config.tableData
   * @param {!string} config.currencyAttr
   */
  constructor(config) {
    /** @const {Element} */
    this.tableEl = document.querySelector(config.table);

    /** @const {Element} */
    this.tableDataEl = document.querySelector(config.tableData);

    /** @const {string} */
    this.currencyAttr = config.currencyAttr;
  }

  /**
   * Calculates a value with interest applied to initial value.
   * @param {!number} amount - Initial value.
   * @param {!number} rate - Interest rate.
   * @return {number}
   * @private
   */
  amountWithInterest_(amount, rate) {
    return amount * (rate / 100 + 1);
  }

  /**
   * Calculates compound interest, renders calculated values,
   * and returns the balance.
   * @param {!number} principal - Principal amount.
   * @param {!number} contribution - Contribution amount per period.
   * @param {!number} rate - Interest rate.
   * @param {!number} compounds - Compounding period. (e.g. yearly or monthly)
   * @param {!number} periods - Number of times to compound. (e.g. 10 years).
   * @return {number} Balance based on user-provided values.
   * @public
   */
  compound(principal, contribution, rate, compounds, periods) {
    const pmt = contribution;
    let p = principal;
    let c = pmt;
    let principalCompounded;
    let contributionCompounded;
    let sums = [];

    for (let i = 1; i <= periods; i++) {
      principalCompounded = this.amountWithInterest_(p, rate);
      contributionCompounded = this.amountWithInterest_(c, rate);
      p = principalCompounded;
      c = pmt + contributionCompounded;

      const deposits = principal + (contribution * i);
      const balance = principalCompounded + contributionCompounded;
      const interest = balance - deposits;

      let growth = ((balance / deposits - 1) * 100).toFixed(1);
      if (growth === 'NaN') growth = 'N/A';

      sums.push([i, this.formatCurrency_(deposits), this.formatCurrency_(interest), this.formatCurrency_(balance), growth]);
    }

    // Pass the 'sums' array to a method and render it as a table.
    this.renderTable_(sums);

    // Destructure 'sums' array and return 'balance' from it.
    const [year, deposits, interest, balance, growth] = sums[sums.length - 1];

    return balance;
  }

  /**
   * Formats an amount based on type of currency. 
   * @param {!number} amount - Unformatted value.
   * @return {string} Formatted amount. e.g. 12345.67123 => 12,345.67
   * @private
   */
  formatCurrency_(amount) {
    const currentCurrency = document.body.getAttribute(this.currencyAttr);

    if (currentCurrency === CURRENCY_RUPEES) {
      return this.formatRupees_(amount);
    }

    const pattern = '\\d(?=(\\d{3})+\\D)';
    let thousands, decimals;

    switch (currentCurrency) {
      case 'eur':
        thousands = (amount > EURO_FORMAT_THRESHOLD) ? ',' : '.';
        decimals = (amount > EURO_FORMAT_THRESHOLD) ? '.' : ',';
        break;
      default:
        thousands = ',';
        decimals = '.';
        break;
    }

    return amount.toFixed(2).replace('.', decimals).replace(new RegExp(pattern, 'g'), '$&' + thousands);
  };

  /**
   * Formats currency for rupees (which is weird, so they get their
   * own special method).
   * @param {!number} rupees - Currency amount.
   * @return {string} Amount in '##,##,###.##' format.
   * @private
   */
  formatRupees_(rupees) {
    const string = rupees.toFixed(2).toString().split('.');
    const amount = string[0];
    const decimal = string[1];
    const lastThree = amount.length - 3;
    const thousands = amount.substring(0, lastThree);
    const thousandsFormatted = thousands.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    let hundreds = amount.substring(lastThree);
    if (thousands) hundreds = `,${hundreds}`;

    return `${thousandsFormatted}${hundreds}.${decimal}`;
  }

  /**
   * Renders initial and compounded amounts for each time period.
   * @param {!Array} data - Calculated values.
   * @param {!number} data[].year
   * @param {!number} data[].deposits
   * @param {!number} data[].interest
   * @param {!number} data[].balance
   * @param {!number} data[].growth
   * @private
   */
  renderTable_(data) {
    let html = `
      <tr>
        <th class="year">Year</th>
        <th class="deposits">Deposits</th>
        <th class="interest">Interest</th>
        <th class="balance">Balance</th>
        <th class="growth">Growth</th>
      </tr>
    `;

    data.forEach((item) => {
      const [year, deposits, interest, balance, growth] = item;
      html += `
        <tr>
          <td class="year">${year}</td>
          <td class="deposits">${deposits}</td>
          <td class="interest">${interest}</td>
          <td class="balance">${balance}</td>
          <td class="growth">${growth}</td>
        </tr>
      `;
    });

    this.tableDataEl.innerHTML = html;
  }

  /**
   * Creates a caption element and renders it after the table.
   * @public
   */
  tableCaption() {
    const caption = document.createElement('p');
    caption.classList.add('rotate-screen');
    caption.innerHTML = 'Rotate screen to view <span>Interest</span> and <span>Growth</span> columns.';
    this.tableEl.appendChild(caption);
  }
}

export { Calculations };
