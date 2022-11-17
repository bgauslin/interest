export interface CompoundingValues {
  contribution: number,
  periods: number,
  principal: number,
  rate: number,
}

export interface Sums {
  balance: string,
  deposits: string,
  growth: string,
  interest: string,
  year: string,
}

export const Currencies = [
  {id: 'usd', locale: 'en-US', symbol: '$', label: 'Dollars'},
  {id: 'eur', locale: 'de-DE', symbol: '€', label: 'Euros'},
  {id: 'gbp', locale: 'en-GB', symbol: '£', label: 'Pounds'},
  {id: 'jpy', locale: 'ja-JP', symbol: '¥', label: 'Yen'},
  {id: 'inr', locale: 'en-IN', symbol: '₹', label: 'Rupees'},
];

export const DEFAULT_CURRENCY = Currencies[0].id;

/**
 * Formulas for calculating compound interest and formatting currency.
 */
export class Calculator {
  /**
   * Calculates compound interest and returns an array of all calculated values.
   */
  public compound(values: CompoundingValues, currency: string): Sums[] {
    const {contribution, principal, periods, rate} = values;
    const {locale} = Currencies.find(selected => selected.id === currency);
    const format = {
      currency: currency.toUpperCase(),
      style: 'currency',
    };

    const pmt = contribution;
    let p: number = principal;
    let c: number = pmt;
    let principalCompounded: number;
    let contributionCompounded: number;

    const sums = [];
    for (let i = 1; i <= periods; i++) {
      principalCompounded = this.amountWithInterest(p, rate);
      contributionCompounded = this.amountWithInterest(c, rate);
      p = principalCompounded;
      c = pmt + contributionCompounded;

      const deposits = principal + (contribution * i);
      const balance = principalCompounded + contributionCompounded;
      const interest = balance - deposits;

      let growth: number|string = (balance / deposits - 1) * 100;
      if (growth === 0) {
        growth = 'N/A';
      } else { 
        growth = `${new Intl.NumberFormat('en-US', {
          maximumFractionDigits: 1,
          minimumFractionDigits: 1,
        }).format(growth)}%`;
      }

      sums.push({
        balance: new Intl.NumberFormat(locale, format).format(balance),
        deposits: new Intl.NumberFormat(locale, format).format(deposits),
        growth,
        interest: new Intl.NumberFormat(locale, format).format(interest),
        year: String(i),
      });
    }

    return sums;
  }

  /**
   * Returns the total amount based on provided compounding values. 
   */
  public total(values: CompoundingValues, currency: string): string {
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
}
