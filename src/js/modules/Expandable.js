/** @const {string} */
const COLLAPSED = 'collapse';

/** @const {string} */
const EXPANDED = 'expand';

/** @enum {string} */
const Attribute = {
  EXPANDED: 'expanded',
  HIDDEN: 'hidden',
  TARGET: 'target',
}

/** @class */
class Expandable {
  /**
   * @param {!Object} config
   */
  constructor(config) {
    /** @private {!string} */
    this.source_ = config.source;

    /** @private {!string} */
    this.storage_ = config.storage;

    /** @private {!string} */
    this.target_ = config.target;

    /** @private {!string} */
    this.toggle_ = config.toggle;

    /** @private {?Element} */
    this.targetEl_ = null;

    /** @private {?Element} */
    this.toggleEl_ = null;
  }

  /**
   * Initializes all elements' states.
   * @public
   */
  init() {
    this.targetEl_ = document.querySelector(this.target_);
    this.toggleEl_ = document.querySelector(this.toggle_);

    if (this.targetEl_ && this.toggleEl_) {
      this.setStateOnLoad_();
      this.setToggleLabel_();
      this.setState();

      // Listen for click and toggle expandable element's state.
      this.toggleEl_.addEventListener('click', () => {
        this.expandCollapse_();
      });
    }
  }

  /**
   * Expands or collapses an element.
   * @private
   */
  expandCollapse_() {
    const direction = this.targetEl_.hasAttribute(Attribute.EXPANDED) ? COLLAPSED : EXPANDED;
    const elHeight = this.targetEl_.scrollHeight;

    if (direction === COLLAPSED) {
      window.requestAnimationFrame(() => {
        this.targetEl_.style.height = `${elHeight}px`;
        window.requestAnimationFrame(() => {
          this.targetEl_.style.height = 0;
        });
      });
      this.targetEl_.removeAttribute(Attribute.EXPANDED);
    }

    if (direction === EXPANDED) {
      this.targetEl_.style.height = `${elHeight}px`;

      this.targetEl_.addEventListener('transitionend', () => {
        this.targetEl_.style.height = null;
        this.targetEl_.removeEventListener('transitionend', null, false);
      }, { once: true });

      this.targetEl_.setAttribute(Attribute.EXPANDED, '');
    }

    localStorage.setItem(this.storage_, direction);
    this.setToggleLabel_();
  }

  /**
   * Sets elements' states via attributes on change.
   * @public
   */
  setState() {
    const sourceEl = document.querySelector(this.source_);
    const value = sourceEl.value;
    const els = [this.targetEl_, this.toggleEl_];
    const threshold = 0;

    Array.from(els).forEach((el) => {
      if (value <= threshold) {
        el.setAttribute(Attribute.HIDDEN, '');
      } else {
        el.removeAttribute(Attribute.HIDDEN);
      }
    });
  }

  /**
   * Sets elements' states via attributes on initial page load.
   * @private
   */
  setStateOnLoad_() {
    if (localStorage.getItem(this.storage_) === EXPANDED) {
      this.targetEl_.setAttribute(Attribute.EXPANDED, '');
    } else {
      this.targetEl_.removeAttribute(Attribute.EXPANDED);
      this.targetEl_.style.height = 0;
    }
  }

  /**
   * Sets toggle label based on the target element's state.
   * @private
   */
  setToggleLabel_() {
    const attr = this.targetEl_.hasAttribute(Attribute.EXPANDED) ? 'visible' : 'hidden';
    const label = this.targetEl_.hasAttribute(Attribute.EXPANDED) ? 'Hide' : 'Show';

    this.toggleEl_.setAttribute(Attribute.TARGET, attr);
    this.toggleEl_.textContent = `${label} table`;
  }
}

export { Expandable };
