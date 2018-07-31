// TODO: refactor this as a class and pass in element at instantiation...

/** @const {HTMLElement} Table element. */
const TABLE_EL = document.querySelector('.table__data');

/**
 * @description Displays initial and compounded amounts for each time period.
 * @param {!Array<string>} data - Formatted values.
 */
const createTable = (data) => {
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


export { createTable };
