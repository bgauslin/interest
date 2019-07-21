/** @const {string} */
const CURRENCY_ATTR = 'currency';

/** @const {string} */
const EUROS = 'eur';

/** @const {string} */
const RUPEES = 'inr';

/** @const {number} */
const EURO_FORMAT_THRESHOLD = 50000;

/** @class */
class Calculator {
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
   * @return {Array} Sums based on user-provided values.
   * @public
   */
  compound(principal, contribution, rate, compounds, periods) {
    const pmt = contribution;
    let p = principal;
    let c = pmt;
    let principalCompounded;
    let contributionCompounded;
    const sums = [];

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

    return sums;
  }

  /**
   * Formats an amount based on type of currency. 
   * @param {!number} amount - Unformatted value.
   * @return {string} Formatted amount. e.g. 12345.67123 => 12,345.67
   * @private
   */
  formatCurrency_(amount) {
    const currency = document.body.getAttribute(CURRENCY_ATTR);
    let thousands = ',';
    let decimals = '.';

    if (currency === RUPEES) {
      return this.formatRupees_(amount);
    }

    if (currency === EUROS) {
      thousands = (amount > EURO_FORMAT_THRESHOLD) ? ',' : '.';
      decimals = (amount > EURO_FORMAT_THRESHOLD) ? '.' : ',';
    }

    return amount.toFixed(2).replace('.', decimals).replace(
      new RegExp('\\d(?=(\\d{3})+\\D)', 'g'), '$&' + thousands);
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
}

export { Calculator };
