// App stylesheet (required in JS entry file for Webpack).
import '../styles/index';

// Web components.
import './components/drawer/drawer';
import './components/settings/settings';
import './components/table/table';
import './components/user-values/user-values';

// TODO: Move the following to a class or web component.
// Simple event hub for sending/receiving custom event data.
import {DEFAULT_CURRENCY} from './modules/Calculator';

const drawerWidget = document.querySelector('app-drawer');
const tableWidget = document.querySelector('app-table');
const valuesWidget = document.querySelector('app-values');
let currency = DEFAULT_CURRENCY;
let values = {};

function saveToStorage() {
  if (currency && values) {
    const settings = {
      currency,
      values,
    };
    localStorage.setItem('settings', JSON.stringify(settings));
  }
}

function updateCurrency(e: CustomEvent) {
  currency = e.detail.currency;
  const updateCurrency =
      new CustomEvent('updateCurrency', {detail: {currency}});
  tableWidget.dispatchEvent(updateCurrency);
  valuesWidget.dispatchEvent(updateCurrency);
  saveToStorage();
}

function updateValues(e: CustomEvent) {
  values = e.detail.values;
  const updateValues = new CustomEvent('updateValues', {detail: {values}});
  tableWidget.dispatchEvent(updateValues);
  saveToStorage();

  drawerWidget.removeAttribute('aria-hidden');
}

document.addEventListener('updateCurrency', updateCurrency);
document.addEventListener('updateValues', updateValues);
