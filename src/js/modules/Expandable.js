/** @enum {string} */
const Attribute = {
  EXPANDED: 'expanded',
  HIDDEN: 'hidden',
  TARGET: 'target',
}

/** @class */
class Expandable extends HTMLElement {
  constructor() {
    super();

    /** @private {?Element} */
    this.buttonEl_ = null;

    /** @private {?Element} */
    this.targetEl_ = null;
  }

  static get observedAttributes() {
    return [Attribute.EXPANDED];
  }

  /** @callback */
  attributeChangedCallback(name, oldValue, newValue) {
    this.expandCollapse_();
  }

  /** @callback */
  connectedCallback() {
    const target = this.getAttribute(Attribute.TARGET);
    this.targetEl_ = document.getElementById(target);

    if (this.targetEl_) {
      this.innerHTML = '<button></button>';
      this.buttonEl_ = this.querySelector('button');

      this.initialState_();
      this.handleEvents_();
    }
  }

  /**
   * Sets the initial state of the expandable and its target on page load
   * based on whether state has been saved to localStorage.
   * @private
   */
  initialState_() {
    this.targetEl_.style.height = 0;
    if (localStorage.getItem(Attribute.EXPANDED) === 'true') {
      this.setAttribute(Attribute.EXPANDED, '');
    }
    this.updateLabel_();
  }

  /**
   * TODO: Hide expandable when there are fewer than a certain number of
   * table rows relative to available screen real estate.
   * @public
   */
  // updateState() {
  //   const threshold = 0;
  //   const value = 0; // TODO: Update this.
  //   const isExpanded = (value <= threshold);

  //   const els = [this, this.targetEl_];
  //   Array.from(els).forEach((el) => {  
  //     el.setAttribute(Attribute.HIDDEN, isExpanded);
  //   });
  // }

  /**
   * Expands or collapses an element.
   * @private
   */
  expandCollapse_() {
    if (!this.targetEl_) {
      return;
    }

    const elHeight = this.targetEl_.scrollHeight;

    if (this.hasAttribute(Attribute.EXPANDED)) {
      this.targetEl_.style.height = `${elHeight}px`;
      this.targetEl_.addEventListener('transitionend', () => {
        this.targetEl_.style.height = null;
        this.targetEl_.removeEventListener('transitionend', null, false);
      }, { once: true });
      this.targetEl_.setAttribute(Attribute.EXPANDED, '');
    } else {
      window.requestAnimationFrame(() => {
        this.targetEl_.style.height = `${elHeight}px`;
        window.requestAnimationFrame(() => {
          this.targetEl_.style.height = 0;
        });
      });
      this.targetEl_.removeAttribute(Attribute.EXPANDED);
    }

    this.updateLabel_();
  }

  /**
   * Updates label text based on whether the element is expanded.
   * @private
   */
  updateLabel_() {
    const expanded = this.hasAttribute(Attribute.EXPANDED);
    const label = expanded ? 'Hide' : 'Show';
    localStorage.setItem(Attribute.EXPANDED, expanded);
    this.buttonEl_.textContent = `${label} table`;
  }

  /**
   * Listens for button click and toggles expandable state.
   * @private
   */
  handleEvents_() {
    this.addEventListener('click', () => {
      if (this.hasAttribute(Attribute.EXPANDED)) {
        this.removeAttribute(Attribute.EXPANDED);
      } else {
        this.setAttribute(Attribute.EXPANDED, '');
      }
    });
  }
}

export { Expandable };
