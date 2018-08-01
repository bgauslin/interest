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
   * @param {Object{myConfig}} config
   * myConfig: {
   *   storage: storage,
   *   target: string,
   *   toggle: string,
   *   total: string,
   *   trigger: string,
   * }
   */
  constructor(config) {
    this.storage = config.storage;
    this.targetEl = document.querySelector(config.target);
    this.toggleEl = document.querySelector(config.toggle);
    this.totalEl = document.querySelector(config.total);
    this.trigger = config.trigger;
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
    if (localStorage.getItem(this.storage) !== EXPANDED) {
      this.targetEl.style.height = 0;
      this.targetEl.removeAttribute(EXPANDED_ATTR);
    }
  }

  /** @description Sets element states via attributes on change. */
  setState() {
    const trigger = document.querySelector(this.trigger);
    const value = trigger.value;
    const els = [this.targetEl, this.toggleEl, this.totalEl];
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

  /** @description Observes an attribute and calls a method when it changes. */
  updateOnChange(selector) {
    const target = document.querySelector(selector);
    const config = {
      attributes: true,
    };
    const self = this;

    const observer = new MutationObserver((mutation) => {
      self.setState();
    });

    observer.observe(target, config);
  }

  /** @description Initializes the elements' states. */
  init() {
    this.setStateOnLoad();
    this.setToggleLabel();
    this.setState();
    this.updateOnChange(this.trigger);

    /** @description Listens for click and toggles expandable element's state. */
    this.toggleEl.addEventListener('click', () => {
      this.expandCollapse();
    });
  }
}


export { Expandable };
