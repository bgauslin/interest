/** @const {string} */
const CURRENCY_RUPEES = 'inr';

/** @const {number} */
const EURO_FORMAT_THRESHOLD = 50000;

/** @class ... */
class Calculations {
  /**
   * @param {Object{config}} config
   * config {
   *  tableEl: string,
   *  currencyAttr: string,
   * }
   */
  constructor(config) {
    this.tableEl = document.querySelector(config.table);
    this.tableDataEl = document.querySelector(config.tableData);
    this.currencyAttr = config.currencyAttr;
  }

  /**
   * @param {!number} amount: Initial value.
   * @param {!number} rate: Interest rate.
   * @returns New value with interest applied to initial value.
   */
  amountWithInterest(amount, rate) {
    return amount * (rate / 100 + 1);
  }

  /**
   * @param {number} principal: Principal amount.
   * @param {number} contribution: Contribution amount per period.
   * @param {number} rate: Interest rate.
   * @param {number} compounds: Compounding period. (e.g. yearly or monthly)
   * @param {number} periods: Number of times to compound. (e.g. 10 years).
   * @returns Formatted compounded total based on user-provided values.
   */
  compound(principal, contribution, rate, compounds, periods) {
    const pmt = contribution;
    let p = principal;
    let c = pmt;
    let principalCompounded;
    let contributionCompounded;
    let sums = [];

    for (let i = 1; i <= periods; i++) {
      principalCompounded = this.amountWithInterest(p, rate);
      contributionCompounded = this.amountWithInterest(c, rate);
      p = principalCompounded;
      c = pmt + contributionCompounded;

      const deposits = principal + (contribution * i);
      const balance = principalCompounded + contributionCompounded;
      const interest = balance - deposits;

      let growth = ((balance / deposits - 1) * 100).toFixed(1);
      if (growth === 'NaN') growth = 'N/A';

      sums.push([i, this.formatCurrency(deposits), this.formatCurrency(interest), this.formatCurrency(balance), growth]);
    }

    // Pass the 'sums' array to a method and render it as a table.
    this.renderTable(sums);

    const [year, deposits, interest, balance, growth] = sums[sums.length - 1];

    return balance;
  }

  /**
   * @param {!number} amount: Unformatted value.
   * @returns String with currency formatting. e.g. 12345.67123 => 12,345.67
   */
  formatCurrency(amount) {
    const currentCurrency = document.body.getAttribute(this.currencyAttr);

    if (currentCurrency === CURRENCY_RUPEES) {
      return this.formatRupee(amount);
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
   * @description Rupee formatting is weird, so it gets its own special function.
   * @param {!number} rupees: Currency amount.
   * @returns Amount in '##,##,###.##' format.
   */
  formatRupee(rupees) {
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
   * @description Displays initial and compounded amounts for each time period.
   * @param {!Array<string>} data - Formatted values.
   */
  renderTable(data) {
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
   * @description Displays a caption after the table.
   */
  tableCaption() {
    const caption = document.createElement('p');
    caption.classList.add('rotate-screen');
    caption.innerHTML = 'Rotate screen to view <span>Interest</span> and <span>Growth</span> columns.';
    this.tableEl.appendChild(caption);
  }
}


export { Calculations };
