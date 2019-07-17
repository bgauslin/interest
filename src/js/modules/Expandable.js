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
    this.expandCollapse_(newValue);
  }

  /** @callback */
  connectedCallback() {
    const target = this.getAttribute(Attribute.TARGET);
    this.targetEl_ = document.getElementById(target);

    if (this.targetEl_) {
      this.innerHTML = '<button></button>';
      this.buttonEl_ = this.querySelector('button');
      this.setInitialState_();
      // this.updateState();
      this.handleEvents_();
    }
  }

  /** @callback */
  disconnectedCallback() {
  }

  /**
   * Listens for button click and toggles expandable state.
   * @private
   */
  handleEvents_() {
    this.addEventListener('click', () => {
      const expanded = (this.getAttribute(Attribute.EXPANDED) === 'true'); // convert string to boolean
      this.setAttribute(Attribute.EXPANDED, !expanded);
    });
  }

  /**
   * Expands or collapses an element.
   * @param {boolean} expanded
   * @private
   */
  expandCollapse_(expanded) {
    if (!this.targetEl_) {
      return;
    }

    let label;
    const elHeight = this.targetEl_.scrollHeight;
    const isExpanded = (expanded === 'true'); // convert string to boolean
    
    // Collapse the target element.
    if (isExpanded) {
      label = 'Hide';
      this.targetEl_.style.height = `${elHeight}px`;
      this.targetEl_.addEventListener('transitionend', () => {
        this.targetEl_.style.height = null;
        this.targetEl_.removeEventListener('transitionend', null, false);
      }, { once: true });
      // this.targetEl_.setAttribute(Attribute.EXPANDED, '');

    // Expand the target element.
    } else {
      label = 'Show';
      window.requestAnimationFrame(() => {
        this.targetEl_.style.height = `${elHeight}px`;
        window.requestAnimationFrame(() => {
          this.targetEl_.style.height = 0;
        });
      });
      // this.targetEl_.removeAttribute(Attribute.EXPANDED);
    }

    localStorage.setItem(Attribute.EXPANDED, expanded);
    this.buttonEl_.textContent = `${label} table`;
  }

  /**
   * TODO: Add a better comment here.
   * @public
   */
  updateState() {
    const threshold = 0;
    const value = 0; // TODO: Update this.
    const isExpanded = (value <= threshold);

    const els = [this, this.targetEl_];
    Array.from(els).forEach((el) => {  
      el.setAttribute(Attribute.HIDDEN, isExpanded);
    });
  }

  /**
   * Sets the initial state of the expandable and its target on page load
   * based on whether state has been saved to localStorage.
   * @private
   */
  setInitialState_() {
    const initialState = localStorage.getItem(Attribute.EXPANDED) || false;
    this.setAttribute(Attribute.EXPANDED, initialState);
  }
}

export { Expandable };
