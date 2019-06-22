/** @const {string} */
const COLLAPSED = 'collapse';

/** @const {string} */
const EXPANDED = 'expand';

/** @const {string} */
const EXPANDED_ATTR = 'expanded';

/** @const {string} */
const HIDDEN_ATTR = 'hidden';

/** @const {string} */
const TARGET_ATTR = 'target';

/** @class */
class Expandable {
  /**
   * @param {!Object} config
   */
  constructor(config) {
    /** @const {!string} */
    this.source = config.source;

    /** @const {!string} */
    this.storage = config.storage;

    /** @const {!string} */
    this.target = config.target;

    /** @const {!string} */
    this.toggle = config.toggle;

    /** @const {?Element} */
    this.targetEl = null;

    /** @const {?Element} */
    this.toggleEl = null;
  }

  /**
   * Initializes all elements' states.
   * @public
   */
  init() {
    this.targetEl = document.querySelector(this.target);
    this.toggleEl = document.querySelector(this.toggle);

    if (this.targetEl && this.toggleEl) {
      this.setStateOnLoad_();
      this.setToggleLabel_();
      this.setState();

      // Listen for click and toggle expandable element's state.
      this.toggleEl.addEventListener('click', () => {
        this.expandCollapse_();
      });
    }
  }

  /**
   * Expands or collapses an element.
   * @private
   */
  expandCollapse_() {
    const direction = this.targetEl.hasAttribute(EXPANDED_ATTR) ? COLLAPSED : EXPANDED;
    const elHeight = this.targetEl.scrollHeight;

    if (direction === COLLAPSED) {
      window.requestAnimationFrame(() => {
        this.targetEl.style.height = `${elHeight}px`;
        window.requestAnimationFrame(() => {
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
    this.setToggleLabel_();
  }

  /**
   * Sets elements' states via attributes on change.
   * @public
   */
  setState() {
    const sourceEl = document.querySelector(this.source);
    const value = sourceEl.value;
    const els = [this.targetEl, this.toggleEl];
    const threshold = 0;

    Array.from(els).forEach((el) => {
      if (value <= threshold) {
        el.setAttribute(HIDDEN_ATTR, '');
      } else {
        el.removeAttribute(HIDDEN_ATTR);
      }
    });
  }

  /**
   * Sets elements' states via attributes on initial page load.
   * @private
   */
  setStateOnLoad_() {
    if (localStorage.getItem(this.storage) === EXPANDED) {
      this.targetEl.setAttribute(EXPANDED_ATTR, '');
    } else {
      this.targetEl.removeAttribute(EXPANDED_ATTR);
      this.targetEl.style.height = 0;
    }
  }

  /**
   * Sets toggle label based on the target element's state.
   * @private
   */
  setToggleLabel_() {
    const attr = this.targetEl.hasAttribute(EXPANDED_ATTR) ? 'visible' : 'hidden';
    const label = this.targetEl.hasAttribute(EXPANDED_ATTR) ? 'Hide' : 'Show';

    this.toggleEl.setAttribute(TARGET_ATTR, attr);
    this.toggleEl.textContent = `${label} table`;
  }
}

export { Expandable };
