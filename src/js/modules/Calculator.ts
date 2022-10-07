interface CompoundingValues {
  contribution: number,
  periods: number,
  principal: number,
  rate: number,
}

interface Sums {
  balance: string,
  deposits: string,
  growth: string,
  interest: string,
  year: string,
}

/**
 * Formulas for calculating compound interest and formatting currency.
 */
class Calculator {
  /**
   * Calculates compound interest and returns an array of all calculated values.
   */
  public compound(values: CompoundingValues, currency: string = 'usd'): Sums[] {
    const {contribution, principal, periods, rate} = values;
    const sums = [];

    const pmt = contribution;
    let p: number = principal;
    let c: number = pmt;
    let principalCompounded: number;
    let contributionCompounded: number;

    for (let i = 1; i <= periods; i++) {
      principalCompounded = this.amountWithInterest(p, rate);
      contributionCompounded = this.amountWithInterest(c, rate);
      p = principalCompounded;
      c = pmt + contributionCompounded;

      const deposits = principal + (contribution * i);
      const balance = principalCompounded + contributionCompounded;
      const interest = balance - deposits;

      let growth: string = ((balance / deposits - 1) * 100).toFixed(1);
      if (growth === 'NaN') {
        growth = 'N/A'
      };

      sums.push({
        balance: this.formatCurrency(balance, currency),
        deposits: this.formatCurrency(deposits, currency),
        growth,
        interest: this.formatCurrency(interest, currency),
        year: String(i),
      });
    }

    return sums;
  }

  /**
   * Returns the total amount based on provided compounding values. 
   */
  public total(values: CompoundingValues, currency: string = 'usd'): string {
    const sums = this.compound(values, currency);
    const lastSum = sums[sums.length - 1];
    return lastSum.balance;
  }

  /**
   * Calculates a value with interest applied to initial value.
   */
  private amountWithInterest(amount: number, rate: number): number {
    return amount * (rate / 100 + 1);
  }

  /**
   * Formats an amount based on currency type: 12345.67123 => 12,345.67.
   */
  private formatCurrency(amount: number, currency: string): string {
    let thousands = ',';
    let decimals = '.';

    if (currency === 'inr') {
      return this.formatRupees(amount);
    }

    if (currency === 'eur') {
      const threshold = 50000;
      thousands = (amount > threshold) ? ',' : '.';
      decimals = (amount > threshold) ? '.' : ',';
    }

    return amount.toFixed(2).replace('.', decimals).replace(
      new RegExp('\\d(?=(\\d{3})+\\D)', 'g'), '$&' + thousands);
  };

  /**
   * Formats currency for rupees (which has its own formatting, so it get its
   * own method), and returns amount in '##,##,###.##' format.
   */
  private formatRupees(rupees: number): string {
    const string = rupees.toFixed(2).toString().split('.');
    const amount = string[0];
    const decimal = string[1];
    const lastThree = amount.length - 3;
    const thousands = amount.substring(0, lastThree);
    const thousandsFormatted = thousands.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    let hundreds = amount.substring(lastThree);
    if (thousands) {
      hundreds = `,${hundreds}`;
    }

    return `${thousandsFormatted}${hundreds}.${decimal}`;
  }
}

export {Calculator, CompoundingValues, Sums};
