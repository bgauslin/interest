/**
 * @type {Object} Currency information for display and formatting.
 */
const CURRENCIES = {
  label: 'Currency',
  name: 'currency',
  options: [
    {
      isoSymbol: 'USD',
      label: '$',
      value: 'usd',
    },
    {
      isoSymbol: 'EUR',
      label: '€',
      value: 'eur',
    },
    {
      isoSymbol: 'GBP',
      label: '£',
      value: 'gbp',
    },
    {
      isoSymbol: 'YEN',
      label: '¥',
      value: 'yen',
    },
    {
      isoSymbol: 'INR',
      label: '₹',
      value: 'inr',
    },
    // {
    //   isoSymbol: 'WON',
    //   label: '₩',
    //   value: 'won',
    // },
  ],
};

export { CURRENCIES };
