/** @const {string} */
const EXPANDED_ATTR = 'expanded';

/** @const {string} */
const HIDDEN_ATTR = 'hidden';

/** @class */
class Expandable extends HTMLElement {
  constructor() {
    super();

    /** @private {?string} */
    this.baseClass_ = this.className;

    /** @private {?Element} */
    this.buttonEl_ = null;

    /** @private {!string} */
    this.label_ = this.getAttribute('label');

    /** @private {!string} */
    this.target_ = this.getAttribute('target');

    /** @private {?Element} */
    this.targetEl_ = null;

    /** @private {?Element} */
    this.totalEl_ = null;

    /** @private {MutationObserver} */
    this.observer_ = new MutationObserver(() => {
      this.setVisibility_();
    });

    /** @listens click */
    this.addEventListener('click', () => {
      // Toggle expanded attribute.
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
    this.innerHTML = `<button class="${this.baseClass_}__button"></button>`;

    this.buttonEl_ = this.querySelector('button');
    this.targetEl_ = document.getElementById(this.target_);
    this.totalEl_ = document.querySelector('.values__total');

    this.initialState_();

    this.observer_.observe(this.totalEl_, { attributes: true });
  }

  /** @callback */
  disconnectedCallback() {
    this.observer_.disconnect();
  }

  /**
   * Sets the initial state of the expandable and its target on page load
   * based on whether state has been saved to localStorage.
   * @private
   */
  initialState_() {
    // TODO: If expanded is saved and true, and there are also values, don't
    // animate the target on initial page load. Just display it at is native
    // height.
    this.targetEl_.style.height = 0;
    if (localStorage.getItem(EXPANDED_ATTR) === 'true') {
      this.setAttribute(EXPANDED_ATTR, '');
    }
    this.updateLabel_();
    this.setVisibility_();
  }

  /**
   * If the total is empty, this element should be hidden since there's no
   * target to expand/collapse.
   * @private
   */
  setVisibility_() {
    if (this.totalEl_.hasAttribute('empty')) {
      this.setAttribute(HIDDEN_ATTR, '');
    } else {
      this.removeAttribute(HIDDEN_ATTR);
    }
  }

  /**
   * Expands or collapses the target element.
   * @param {!string} action Either 'expand' or 'collapse'
   * @private
   */
  expandCollapse_(action) {
    if (!this.targetEl_) return;
    
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

    this.updateLabel_();
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
