/** @const {string} */
const EXPANDED_ATTR = 'expanded';

/** @const {string} */
const HIDDEN_ATTR = 'hidden';

/** @class */
class Expandable extends HTMLElement {
  constructor() {
    super();

    /** @private {?Element} */
    this.buttonEl_ = null;

    /** @private {!string} */
    this.label_ = this.getAttribute('label');

    /** @private {!string} */
    this.target_ = this.getAttribute('target');

    /** @private {?Element} */
    this.targetEl_ = null;

    // Toggle expanded attribute on click.
    this.addEventListener('click', () => {
      if (this.hasAttribute(EXPANDED_ATTR)) {
        this.removeAttribute(EXPANDED_ATTR);
      } else {
        this.setAttribute(EXPANDED_ATTR, '');
      }
    });
  }

  static get observedAttributes() {
    return [EXPANDED_ATTR];
  }

  /** @callback */
  attributeChangedCallback(name, oldValue, newValue) {
    const direction = (newValue === '') ? 'expand' : 'collapse';
    this.expandCollapse_(direction);
  }

  /** @callback */
  connectedCallback() {
    this.targetEl_ = document.getElementById(this.target_);
    if (this.targetEl_) {
      this.innerHTML = '<button></button>';
      this.buttonEl_ = this.querySelector('button');
      this.initialState_();
    }
  }

  /**
   * Sets the initial state of the expandable and its target on page load
   * based on whether state has been saved to localStorage.
   * @private
   */
  initialState_() {
    this.targetEl_.style.height = 0;
    if (localStorage.getItem(EXPANDED_ATTR) === 'true') {
      this.setAttribute(EXPANDED_ATTR, '');
    }
    this.updateLabel_();

    // TODO: Hide expandable when there are fewer than a certain number of
    // table rows relative to available screen real estate.
    // this.setAttribute(HIDDEN_ATTR, '');
  }

  /**
   * Expands or collapses an element.
   * @param {!string} action Either 'expand' or 'collapse'
   * @private
   */
  expandCollapse_(action) {
    if (!this.targetEl_) return;

    this.updateLabel_();

    const elHeight = this.targetEl_.scrollHeight;

    if (action === 'expand') {
      this.targetEl_.style.height = `${elHeight}px`;
      this.targetEl_.setAttribute(EXPANDED_ATTR, '');
      this.targetEl_.addEventListener('transitionend', () => {
        this.targetEl_.style.height = null;
        this.targetEl_.removeEventListener('transitionend', null, false);
      }, { once: true });
    } else {
      this.targetEl_.removeAttribute(EXPANDED_ATTR);
      window.requestAnimationFrame(() => {
        this.targetEl_.style.height = `${elHeight}px`;
        window.requestAnimationFrame(() => {
          this.targetEl_.style.height = 0;
        });
      });
    }
  }

  /**
   * Updates label text based on whether the element is expanded.
   * @private
   */
  updateLabel_() {
    const expanded = this.hasAttribute(EXPANDED_ATTR);
    const prefix = expanded ? 'Hide' : 'Show';
    this.buttonEl_.textContent = `${prefix} ${this.label_}`;
    localStorage.setItem(EXPANDED_ATTR, expanded);
  }
}

export { Expandable };
