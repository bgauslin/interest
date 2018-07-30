/** @enum {string} Elements, classes, attributes for collapsing/expanding. */
const Collapsible = {
  ATTR: 'data-collapsed',
  SELECTOR: '.table',
  TOGGLE: '.toggle__button',
}

/** @enum {string}  Names for collapsed/expanded states. */
const State = {
  COLLAPSED: 'collapse',
  EXPANDED: 'expand',
}

/** @const {HTMLElement} Collapsible element. */
const COLLAPSIBLE_EL = document.querySelector(Collapsible.SELECTOR);

/** @const {HTMLElement} Toggle for collapsible element. */
const TOGGLE_EL = document.querySelector(Collapsible.TOGGLE);

/** @const {string} Attribute that hides an element. */
const HIDDEN_ATTR = 'data-hidden';

/** @const {string} Attribute set on the target's source. */
const TARGET_ATTR = 'data-target';

/** @const {string} localStorage item name for collapsible display. */
const STORAGE_ITEM = 'table';

/**
 * @param {HTMLElement} el: Element that expands and collapses when a
 * toggle is clicked.
 */
const expandCollapse = (el) => {
  const direction = el.hasAttribute(Collapsible.ATTR) ? State.EXPANDED : State.COLLAPSED;
  const elHeight = el.scrollHeight;

  if (direction === State.COLLAPSED) {
    requestAnimationFrame(() => {
      el.style.height = `${elHeight}px`;
      requestAnimationFrame(() => {
        el.style.height = 0;
      });
    });

    el.setAttribute(Collapsible.ATTR, '');
  }

  if (direction === State.EXPANDED) {
    el.style.height = `${elHeight}px`;

    el.addEventListener('transitionend', () => {
      el.style.height = null;
      el.removeEventListener('transitionend', null, false);
    }, { once: true });

    el.removeAttribute(Collapsible.ATTR);
  }

  localStorage.setItem(STORAGE_ITEM, direction);
  setToggleLabel();
  return;
}

/**
 * @description Sets collapsible element's state via an attribute.
 */
const setCollapsibleState = () => {
  const el = COLLAPSIBLE_EL;
  if (localStorage.getItem(STORAGE_ITEM) !== State.EXPANDED) {
    el.style.height = 0;
    el.setAttribute(Collapsible.ATTR, '');
  }
  return;
}

/**
 * @description Sets the collapsible toggle label based on the state of its
 * target element.
 */
const setToggleLabel = () => {
  const target = COLLAPSIBLE_EL;
  const toggle = TOGGLE_EL;

  const attr = target.hasAttribute(Collapsible.ATTR) ? 'hidden' : 'visible';
  const label = target.hasAttribute(Collapsible.ATTR) ? 'Show' : 'Hide';

  toggle.setAttribute(TARGET_ATTR, attr);
  toggle.textContent = `${label} table`;

  return;
}

/**
 * @param {!number} n: Number of calculated periods.
 */
const toggleButtonState = (n) => {
  const els = [COLLAPSIBLE_EL, TOGGLE_EL];
  const threshold = 0;

  els.forEach((el) => {
    if (n <= threshold) {
      el.setAttribute(HIDDEN_ATTR, '');
    } else {
      el.removeAttribute(HIDDEN_ATTR);
    }
  });
  return;
}

/**
 * @description Listens for button click and toggles collapsible element's
 * state.
 */
TOGGLE_EL.addEventListener('click', () => {
  expandCollapse(COLLAPSIBLE_EL);
});


export { setCollapsibleState, setToggleLabel, toggleButtonState };
