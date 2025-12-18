import {CompoundingValues, Currencies, Sums} from'./shared';


/**
 * Formulas for calculating compound interest and formatting currency.
 */
export class Calculator {
  /**
   * Calculates compound interest and returns an array of all calculated values.
   */
  public compound(values: CompoundingValues, currency: string): Sums[] {
    const {contribution, periods, principal, rate} = values;
    const {locale} = Currencies.find(selected => selected.id === currency);
    const pmt = contribution;
    let p: number = principal;
    let c: number = pmt;
    let principalCompounded: number;
    let contributionCompounded: number;

    const sums: Sums[] = [];
    for (let index = 1; index <= periods; index++) {
      principalCompounded = this.amountWithInterest(p, rate);
      contributionCompounded = this.amountWithInterest(c, rate);
      p = principalCompounded;
      c = pmt + contributionCompounded;

      const deposits = principal + (contribution * index);
      const balance = principalCompounded + contributionCompounded;
      const interest = balance - deposits;

      let growth: number|string = (balance / deposits - 1) * 100;
      if (growth === 0) {
        growth = 'N/A';
      } else { 
        growth = `${new Intl.NumberFormat(locale, {
          maximumFractionDigits: 1,
          minimumFractionDigits: 1,
        }).format(growth)}%`;
      }

      const formatted = (amount: number) => {
        return new Intl.NumberFormat(locale, {
          currency: currency.toUpperCase(),
          maximumFractionDigits: 0,
          style: 'currency',
        }).format(amount);
      }

      sums.push({
        balance: formatted(balance),
        deposits: formatted(deposits),
        growth,
        interest: formatted(interest),
        year: String(index),
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
