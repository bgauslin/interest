/** @const {HTMLElement} Table element. */
const TABLE_EL = document.querySelector('.table__data');

/** @const {string} */
const CURRENCY_ATTR = 'data-currency'

/** @const {number} */
const EURO_FORMAT_THRESHOLD = 50000;

/**
 * @param {!number} amount: Initial value.
 * @param {!number} rate: Interest rate.
 * @returns New value with interest applied to initial value.
 */
const amountWithInterest = (amount, rate) => amount * (rate / 100 + 1);

/**
 * @param {number} principal: Principal amount.
 * @param {number} contribution: Contribution amount per period.
 * @param {number} rate: Interest rate.
 * @param {number} compounds: Compounding period. (e.g. yearly or monthly)
 * @param {number} periods: Number of times to compound. (e.g. 10 years).
 * @returns Formatted compounded total based on user-provided values.
 */
const compound = (principal, contribution, rate, compounds, periods) => {
  const pmt = contribution;
  let p = principal;
  let c = pmt;
  let principalCompounded;
  let contributionCompounded;
  let sums = [];

  for (let i = 1; i <= periods; i++) {
    principalCompounded = amountWithInterest(p, rate);
    contributionCompounded = amountWithInterest(c, rate);
    p = principalCompounded;
    c = pmt + contributionCompounded;

    const deposits = principal + (contribution * i);
    const balance = principalCompounded + contributionCompounded;
    const interest = balance - deposits;

    let growth = ((balance / deposits - 1) * 100).toFixed(1);
    if (growth === 'NaN') growth = 'N/A';

    sums.push([i, formatCurrency(deposits), formatCurrency(interest), formatCurrency(balance), growth]);
  }

  table(sums);

  const [year, deposits, interest, balance, growth] = sums[sums.length - 1];

  return balance;
}

/**
 * @param {!number} amount: Unformatted value.
 * @returns String with currency formatting. e.g. 12345.67123 => 12,345.67
 */
const formatCurrency = (amount) => {
  const currentCurrency = document.body.getAttribute(CURRENCY_ATTR);

  if (currentCurrency === 'inr') {
    return formatRupee(amount);
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
const formatRupee = (rupees) => {
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
const table = (data) => {
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

  TABLE_EL.innerHTML = html;

  return;
}


export { compound };
