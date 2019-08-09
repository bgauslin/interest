const CURRENCY_ATTR: string = 'currency';
const EURO_FORMAT_THRESHOLD: number = 50000;
const EUROS: string = 'eur';
const RUPEES: string = 'inr';

class Calculator {
  /**
   * Calculates a value with interest applied to initial value.
   */
  private amountWithInterest_(amount: number, rate: number): number {
    return amount * (rate / 100 + 1);
  }

  // TODO: remove 'compounds' parameter
  /**
   * Calculates compound interest and returns an array of all calculated values.
   */
  public compound(principal: number, contribution: number, rate: number, compounds: number, periods: number): Array<number> {
    const pmt = contribution;
    let p = principal;
    let c = pmt;
    let principalCompounded: number;
    let contributionCompounded: number;
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
   * Formats an amount based on currency type: 12345.67123 => 12,345.67.
   */
  private formatCurrency_(amount: number): string {
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
   * own special method), and returns amount in '##,##,###.##' format.
   */
  private formatRupees_(rupees: number): string {
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
