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
  /**
   * @param {Object{target: string, toggle: string, trigger: string}} selectors: Element selectors.
   */
  constructor(selectors) {
    this.targetEl = document.querySelector(selectors.target);
    this.toggleEl = document.querySelector(selectors.toggle);
    this.trigger = selectors.trigger;
  }

  /** @description ... */
  expandCollapse() {
    const direction = this.targetEl.hasAttribute(EXPANDED_ATTR) ? EXPANDED : COLLAPSED;
    const elHeight = this.targetEl.scrollHeight;

    if (direction === COLLAPSED) {
      requestAnimationFrame(() => {
        this.targetEl.style.height = `${elHeight}px`;
        requestAnimationFrame(() => {
          this.targetEl.style.height = 0;
        });
      });

      this.targetEl.setAttribute(EXPANDED_ATTR, '');
    }

    if (direction === EXPANDED) {
      this.targetEl.style.height = `${elHeight}px`;

      this.targetEl.addEventListener('transitionend', () => {
        this.targetEl.style.height = null;
        this.targetEl.removeEventListener('transitionend', null, false);
      }, { once: true });

      this.targetEl.removeAttribute(EXPANDED_ATTR);
    }

    localStorage.setItem(STORAGE_ITEM, direction);
    this.setToggleLabel();
  }

  /** @description Sets expandable element's state via attribute. */
  setExpandableState() {
    if (localStorage.getItem(STORAGE_ITEM) !== EXPANDED) {
      this.targetEl.style.height = 0;
      this.targetEl.setAttribute(EXPANDED_ATTR, '');
    }
  }

  /** @description Sets toggle label based on the target element's state. */
  setToggleLabel() {
    const attr = this.targetEl.hasAttribute(EXPANDED_ATTR) ? 'hidden' : 'visible';
    const label = this.targetEl.hasAttribute(EXPANDED_ATTR) ? 'Show' : 'Hide';

    this.toggleEl.setAttribute(TARGET_ATTR, attr);
    this.toggleEl.textContent = `${label} table`;
  }

  /** @param {!number} n: Number of calculated periods. */
  toggleButtonState() {
    const trigger = document.querySelector(this.trigger);
    const value = trigger.value;
    const els = [this.targetEl, this.toggleEl];
    const threshold = 0;

    els.forEach((el) => {
      if (value <= threshold) {
        el.setAttribute(HIDDEN_ATTR, '');
      } else {
        el.removeAttribute(HIDDEN_ATTR);
      }
    });
  }

  /** @description ... */
  updateOnChange(selector) {
    const target = document.querySelector(selector);
    const config = {
      attributes: true,
    };
    const self = this;

    const observer = new MutationObserver((mutation) => {
      self.toggleButtonState();
    });

    observer.observe(target, config);
  }

  /** @description ... */
  init() {
    this.setExpandableState();
    this.setToggleLabel();
    this.toggleButtonState();
    this.updateOnChange(this.trigger);

    /** @description Listens for click and toggles expandable element's state. */
    this.toggleEl.addEventListener('click', () => {
      this.expandCollapse();
    });
  }
}


export { Expandable };
