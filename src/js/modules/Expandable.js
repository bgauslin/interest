/** @enum {string} */
const Attribute = {
  COLLAPSED: 'collapsed',
  EXPANDED: 'expanded',
  HIDDEN: 'hidden',
  TARGET: 'target',
}

/** @class */
class Expandable extends HTMLElement {
  constructor() {
    super();

    /** @private {!string} */
    // this.storage_ = config.storage;

    /** @private {?Element} */
    this.targetEl_ = null;
  }

  static get observedAttributes() {
    return [Attribute.COLLAPSED, Attribute.EXPANDED];
  }

  /** @callback */
  attributeChangedCallback(name) {
    console.log(name);
  }

  /** @callback */
  connectedCallback() {
    const target = this.getAttribute(Attribute.TARGET);
    this.targetEl_ = document.getElementById(target);

    if (this.targetEl_) {
      console.log('this.targetEl_', this.targetEl_);
      this.innerHTML = '<button></button>';

      // this.setStateOnLoad_();
      // this.setLabel_();
      // this.setState();

      // Listen for click and toggle expandable element's state.
      // this.addEventListener('click', () => {
      //   this.expandCollapse_();
      // });
    }
    this.removeAttribute(Attribute.TARGET);
  }

  /** @callback */
  disconnectedCallback() {
  }

  /**
   * Expands or collapses an element.
   * @private
   */
  expandCollapse_(direction) {
    let label;
    const elHeight = this.targetEl_.scrollHeight;

    if (direction === Attribute.COLLAPSED) {
      label = 'Show';
      window.requestAnimationFrame(() => {
        this.targetEl_.style.height = `${elHeight}px`;
        window.requestAnimationFrame(() => {
          this.targetEl_.style.height = 0;
        });
      });
      // this.targetEl_.removeAttribute(Attribute.EXPANDED);
    }

    if (direction === EXPANDED) {
      label = 'Hide';

      this.targetEl_.style.height = `${elHeight}px`;
      this.targetEl_.addEventListener('transitionend', () => {
        this.targetEl_.style.height = null;
        this.targetEl_.removeEventListener('transitionend', null, false);
      }, { once: true });
      // this.targetEl_.setAttribute(Attribute.EXPANDED, '');
    }

    localStorage.setItem(this.storage_, direction);
    this.textContent = `${label} table`;
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
    if (localStorage.getItem(this.storage_) === Attribute.EXPANDED) {
      this.setAttribute(Attribute.EXPANDED, '');
    } else {
      this.removeAttribute(Attribute.EXPANDED);
      this.targetEl_.style.height = 0;
    }
  }
}

export { Expandable };
