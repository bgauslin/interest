// App stylesheet (required in JS entry file for Webpack).
import '../styles/index';

// Web components.
import './components/expandable/expandable';
import './components/settings/settings';
import './components/table/table';
import './components/user-values/user-values';

// Simple event hub for sending/receiving custom event data.
const drawerWidget = document.querySelector('i-drawer');
const tableWidget = document.querySelector('i-table');
const userValuesWidget = document.querySelector('i-values');
let currency = '';
let userValues = {};

function saveToStorage() {
  const settings = {
    values: userValues,
    currency: currency, 
  };
  localStorage.setItem('settings', JSON.stringify(settings));
}

function updateCurrency(e: CustomEvent) {
  currency = e.detail.currency;
  const updateCurrency = new CustomEvent('updateCurrency', {
    detail: {
      currency,
    }
  });
  tableWidget.dispatchEvent(updateCurrency);
  userValuesWidget.dispatchEvent(updateCurrency);
  saveToStorage();
}

function updateValues(e: CustomEvent) {
  userValues = e.detail.values;
  const updateValues = new CustomEvent('updateValues', {
    detail: {
      values: userValues,
    }
  });
  tableWidget.dispatchEvent(updateValues);
  saveToStorage();

  drawerWidget.removeAttribute('aria-hidden');
}

document.addEventListener('updateCurrency', updateCurrency);
document.addEventListener('updateValues', updateValues);
