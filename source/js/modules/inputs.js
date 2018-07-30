import { compound } from './calculations';


/**
 * @type {Array} HTML input elements.
 */
const USER_INPUTS = [
  {
    label: 'Principal',
    name: 'principal',
    max: 999999,
    pattern: '[0-9]+',
    type: 'number',
  },
  {
    label: 'Yearly addition',
    name: 'contribution',
    max: 999999,
    pattern: '[0-9]+',
    type: 'number',
  },
  {
    label: 'Interest rate',
    name: 'rate',
    max: '99',
    pattern: '[0-9]{0,2}[\\.]?[0-9]{1,2}',
    type: 'text',
  },
  {
    label: 'Compounds per period',
    name: 'compounds',
    max: 12,
    pattern: '[0-9]{1,2}',
    type: 'number',
  },
  {
    label: 'Years to grow',
    name: 'periods',
    min: 1,
    max: 100,
    pattern: '[0-9]+',
    type: 'number',
    required: true,
  }
];

/** @const {HTMLElement} Element for attaching input fields to */
const INPUTS_EL = document.querySelector('.values__list');

/** @const {HTMLElement} */
const TOTAL_EL = document.querySelector('.values__total');

/** @const {string} localStorage item containing user-provided input values. */
const STORAGE_VALUES = 'values';

/** @description Creates and attaches input fields for user-provided values. */
const createInputs = () => {
  let html = '';

  USER_INPUTS.forEach((el) => {
    const min = (el.min) ? `min="${el.min}"` : '';
    const max = (el.max) ? `max="${el.max}"` : '';
    const pattern = (el.pattern) ? `pattern="${el.pattern}"` : '';
    const required = (el.required) ? 'required' : '';

    const input = `
      <li id="${el.name}" class="values__item">
        <label for="${el.name}" class="values__label">${el.label}</label>
        <input class="values__input"
               type="${el.type}"
               name="${el.name}"
               ${min}
               ${max}
               ${pattern}
               ${required}>
      </li>
    `;
    html += input;
  });

  INPUTS_EL.innerHTML = html;

  return;
}

/**
 * Populates input fields with user-provided values.
 * @param {!string} data: User values from localStorage, converted from a
 * string to an array.
 */
const populateInputs = (data) => {
  const values = data.split(',');

  for (let i = 0; i < values.length; i++) {
    const input = INPUTS_EL.querySelectorAll('li')[i].querySelector('input');
    input.value = values[i];
  }

  return;
}

/** @description Updates DOM element with the total value after compounding. */
const updateTotal = () => {
  let values = [];

  USER_INPUTS.forEach((el) => {
    const el_ = document.querySelector(`[name=${el.name}]`);
    const value = Number(el_.value);
    values.push(value);
  });

  if (document.querySelectorAll(':invalid').length === 0) {
    localStorage.setItem(STORAGE_VALUES, values);
    TOTAL_EL.textContent = compound(...values);
  }

  return;
}


export { createInputs, populateInputs, updateTotal };
