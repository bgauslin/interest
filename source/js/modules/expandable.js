/** @enum {string} Elements, classes, attributes for collapsing/expanding. */
const Expandable = {
  ATTR: 'data-collapsed',
  SELECTOR: '.table',
  TOGGLE: '.toggle__button',
}

/** @enum {string}  Names for collapsed/expanded states. */
const State = {
  COLLAPSED: 'collapse',
  EXPANDED: 'expand',
}

/** @const {HTMLElement} Expandable element. */
const EXPANDABLE_EL = document.querySelector(Expandable.SELECTOR);

/** @const {HTMLElement} Toggle for expandable element. */
const TOGGLE_EL = document.querySelector(Expandable.TOGGLE);

/** @const {string} Attribute that hides an element. */
const HIDDEN_ATTR = 'data-hidden';

/** @const {string} Attribute set on the target's source. */
const TARGET_ATTR = 'data-target';

/** @const {string} localStorage item name for expandable element's display. */
const STORAGE_ITEM = 'table';

/**
 * @param {HTMLElement} el: Element that expands / collapses when its toggle
 * is clicked.
 */
const expandCollapse = (el) => {
  const direction = el.hasAttribute(Expandable.ATTR) ? State.EXPANDED : State.COLLAPSED;
  const elHeight = el.scrollHeight;

  if (direction === State.COLLAPSED) {
    requestAnimationFrame(() => {
      el.style.height = `${elHeight}px`;
      requestAnimationFrame(() => {
        el.style.height = 0;
      });
    });

    el.setAttribute(Expandable.ATTR, '');
  }

  if (direction === State.EXPANDED) {
    el.style.height = `${elHeight}px`;

    el.addEventListener('transitionend', () => {
      el.style.height = null;
      el.removeEventListener('transitionend', null, false);
    }, { once: true });

    el.removeAttribute(Expandable.ATTR);
  }

  localStorage.setItem(STORAGE_ITEM, direction);
  setToggleLabel();
  return;
}

/** @description Sets expandable element's state via attribute. */
const setExpandableState = () => {
  const el = EXPANDABLE_EL;
  if (localStorage.getItem(STORAGE_ITEM) !== State.EXPANDED) {
    el.style.height = 0;
    el.setAttribute(Expandable.ATTR, '');
  }
  return;
}

/** @description Sets toggle label based on the target element's state. */
const setToggleLabel = () => {
  const target = EXPANDABLE_EL;
  const toggle = TOGGLE_EL;

  const attr = target.hasAttribute(Expandable.ATTR) ? 'hidden' : 'visible';
  const label = target.hasAttribute(Expandable.ATTR) ? 'Show' : 'Hide';

  toggle.setAttribute(TARGET_ATTR, attr);
  toggle.textContent = `${label} table`;

  return;
}

/** @param {!number} n: Number of calculated periods. */
const toggleButtonState = (n) => {
  const els = [EXPANDABLE_EL, TOGGLE_EL];
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

/** @description Listens for click and toggles expandable element's state. */
TOGGLE_EL.addEventListener('click', () => {
  expandCollapse(EXPANDABLE_EL);
});


export { setExpandableState, setToggleLabel, toggleButtonState };
