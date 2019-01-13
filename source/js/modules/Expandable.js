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
   * @param {!Object} config
   * @param {!string} config.source
   * @param {!string} config.storage
   * @param {!string} config.target
   * @param {!string} config.toggle
   */
  constructor(config) {
    /** @const {string} */
    this.source = config.source;

    /** @const {string} */
    this.storage = config.storage;

    /** @const {Element} */
    this.targetEl = document.querySelector(config.target);

    /** @const {Element} */
    this.toggleEl = document.querySelector(config.toggle);
  }

  /**
   * Initializes all elements' states.
   * @public
   */
  init() {
    this.setStateOnLoad_();
    this.setToggleLabel_();
    this.setState();

    // Listen for click and toggle expandable element's state.
    this.toggleEl.addEventListener('click', () => {
      this.expandCollapse_();
    });
  }

  /**
   * Expands or collapses an element.
   * @private
   */
  expandCollapse_() {
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
    this.setToggleLabel_();
  }

  /**
   * Sets elements' states via attributes on change.
   * @public
   */
  setState() {
    const sourceEl = document.querySelector(this.source);
    const value = sourceEl.value;
    const els = [ this.targetEl, this.toggleEl ];
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
