/** @const {string} */
const COLLAPSED = 'collapse';

/** @const {string} */
const EXPANDED = 'expand';

/** @const {string} */
const EXPANDED_ATTR = 'data-expanded';

/** @const {string} */
const HIDDEN_ATTR = 'data-hidden';

/** @const {string} */
const TARGET_ATTR = 'data-target';

/** @class */
class Expandable {
  /**
   * @param {Object{config}} config
   * config: {
   *   storage: string,
   *   target: string,
   *   toggle: string,
   *   trigger: string,
   * }
   */
  constructor(config) {
    this.storage = config.storage;
    this.targetEl = document.querySelector(config.target);
    this.toggleEl = document.querySelector(config.toggle);
    this.trigger = config.trigger; // TODO: rename 'trigger'
  }

  /** @description Expands / collapses an element. */
  expandCollapse() {
    const direction = this.targetEl.hasAttribute(EXPANDED_ATTR) ? COLLAPSED : EXPANDED;
    const elHeight = this.targetEl.scrollHeight;

    if (direction === COLLAPSED) {
      requestAnimationFrame(() => {
        this.targetEl.style.height = `${elHeight}px`;
        requestAnimationFrame(() => {
          this.targetEl.style.height = 0;
        });
      });
      this.targetEl.removeAttribute(EXPANDED_ATTR);
    }

    if (direction === EXPANDED) {
      this.targetEl.style.height = `${elHeight}px`;

      this.targetEl.addEventListener('transitionend', () => {
        this.targetEl.style.height = null;
        this.targetEl.removeEventListener('transitionend', null, false);
      }, { once: true });

      this.targetEl.setAttribute(EXPANDED_ATTR, '');
    }

    localStorage.setItem(this.storage, direction);
    this.setToggleLabel();
  }

  /** @description Sets element states via attributes on initial load. */
  setStateOnLoad() {
    if (localStorage.getItem(this.storage) === EXPANDED) {
      this.targetEl.setAttribute(EXPANDED_ATTR, '');
    } else {
      this.targetEl.removeAttribute(EXPANDED_ATTR);
      this.targetEl.style.height = 0;
    }
  }

  /** @description Sets element states via attributes on change. */
  setState() {
    const trigger = document.querySelector(this.trigger); // TODO: rename 'trigger'
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

  /** @description Sets toggle label based on the target element's state. */
  setToggleLabel() {
    const attr = this.targetEl.hasAttribute(EXPANDED_ATTR) ? 'visible' : 'hidden';
    const label = this.targetEl.hasAttribute(EXPANDED_ATTR) ? 'Hide' : 'Show';

    this.toggleEl.setAttribute(TARGET_ATTR, attr);
    this.toggleEl.textContent = `${label} table`;
  }

  /** @description Initializes the elements' states. */
  init() {
    this.setStateOnLoad();
    this.setToggleLabel();
    this.setState();

    /** @description Listens for click and toggles expandable element's state. */
    this.toggleEl.addEventListener('click', () => {
      this.expandCollapse();
    });
  }
}


export { Expandable };
