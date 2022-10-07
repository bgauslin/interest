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
const valuesWidget = document.querySelector('i-values');
let currency = 'usd';
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
  const updateCurrency = new CustomEvent('updateCurrency', {
    detail: {
      currency,
    }
  });
  tableWidget.dispatchEvent(updateCurrency);
  valuesWidget.dispatchEvent(updateCurrency);
  saveToStorage();
}

function updateValues(e: CustomEvent) {
  values = e.detail.values;
  const updateValues = new CustomEvent('updateValues', {
    detail: {
      values: values,
    }
  });
  tableWidget.dispatchEvent(updateValues);
  saveToStorage();

  drawerWidget.removeAttribute('aria-hidden');
}

document.addEventListener('updateCurrency', updateCurrency);
document.addEventListener('updateValues', updateValues);
