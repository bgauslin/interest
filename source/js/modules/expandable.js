/** @const {string} */
const COLLAPSED = 'collapse';

/** @const {string} */
const EXPANDED = 'expand';

/** @const {string} */
const EXPANDED_ATTR = 'data-collapsed'; // TODO: rename to 'expanded'; update accordingly

/** @const {string} Attribute that hides an element. */
const HIDDEN_ATTR = 'data-hidden';

/** @const {string} Attribute set on the target's source. */
const TARGET_ATTR = 'data-target';

/** @const {string} localStorage item name for expandable element's display. */
const STORAGE_ITEM = 'table';

/** @class */
class Expandable {

  constructor(target, toggle) {
    this.target = document.querySelector(target);
    this.toggle = document.querySelector(toggle);
  }

  expandCollapse() {
    const direction = this.target.hasAttribute(EXPANDED_ATTR) ? EXPANDED : COLLAPSED;
    const elHeight = this.target.scrollHeight;

    if (direction === COLLAPSED) {
      requestAnimationFrame(() => {
        this.target.style.height = `${elHeight}px`;
        requestAnimationFrame(() => {
          this.target.style.height = 0;
        });
      });

      this.target.setAttribute(EXPANDED_ATTR, '');
    }

    if (direction === EXPANDED) {
      this.target.style.height = `${elHeight}px`;

      this.target.addEventListener('transitionend', () => {
        this.target.style.height = null;
        this.target.removeEventListener('transitionend', null, false);
      }, { once: true });

      this.target.removeAttribute(EXPANDED_ATTR);
    }

    localStorage.setItem(STORAGE_ITEM, direction);
    this.setToggleLabel();
    return;
  }

  /** @description Sets expandable element's state via attribute. */
  setExpandableState() {
    const el = this.target;
    if (localStorage.getItem(STORAGE_ITEM) !== EXPANDED) {
      el.style.height = 0;
      el.setAttribute(EXPANDED_ATTR, '');
    }
  }

  /** @description Sets toggle label based on the target element's state. */
  setToggleLabel() {
    const attr = this.target.hasAttribute(EXPANDED_ATTR) ? 'hidden' : 'visible';
    const label = this.target.hasAttribute(EXPANDED_ATTR) ? 'Show' : 'Hide';

    this.toggle.setAttribute(TARGET_ATTR, attr);
    this.toggle.textContent = `${label} table`;
  }

  /** @param {!number} n: Number of calculated periods. */
  toggleButtonState(n) {
    console.log('toggleButtonState called');

    const els = [this.target, this.toggle];
    const threshold = 0;

    els.forEach((el) => {
      if (n <= threshold) {
        el.setAttribute(HIDDEN_ATTR, '');
      } else {
        el.removeAttribute(HIDDEN_ATTR);
      }
    });
  }

  init() {
    this.setExpandableState();
    this.setToggleLabel();

    /** @description Listens for click and toggles expandable element's state. */
    this.toggle.addEventListener('click', () => {
      this.expandCollapse();
    });
  }
}


export { Expandable };
