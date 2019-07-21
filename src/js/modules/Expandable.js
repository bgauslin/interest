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

    /** @private {boolean} */
    this.hasSetup_ = false;

    /** @private {!string} */
    this.label_ = this.getAttribute('label');

    /** @private {!string} */
    this.target_ = this.getAttribute('target');

    /** @private {?Element} */
    this.targetEl_ = document.getElementById(this.target_);

    // TODO: Refactor this.totalEl_ to:
    // a) not be tied to the element's classname, and
    // b) not be hard-coded in the querySelector.
    /** @private {?Element} */
    this.totalEl_ = document.querySelector('.values__total');

    /** @private {MutationObserver} */
    this.observer_ = new MutationObserver(() => this.setVisibility_());

    /** @listens click */
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
    this.setup_();
  }

  /** @callback */
  disconnectedCallback() {
    this.observer_.disconnect();
    this.removeEventListener('click', null);
  }

  /**
   * Adds a button element to the DOM, and sets initial state of the expandable
   * and related elements.
   * @private
   */
  setup_() {
    this.observer_.observe(this.totalEl_, { attributes: true });

    this.innerHTML = `<button class="${this.className}__button"></button>`;
    this.buttonEl_ = this.querySelector('button');

    if (localStorage.getItem(EXPANDED_ATTR) === 'true') {
      this.setAttribute(EXPANDED_ATTR, '');
      this.targetEl_.setAttribute(EXPANDED_ATTR, '');
    } else {
      this.targetEl_.style.height = 0;
      this.targetEl_.removeAttribute(EXPANDED_ATTR);
    }

    this.setVisibility_();
    this.updateLabel_();

    this.hasSetup_ = true;
  }

  /**
   * If the total is empty, expandable should be hidden since there's no
   * target to expand/collapse.
   * @private
   */
  setVisibility_() {
    if (this.totalEl_.hasAttribute('empty')) {
      this.setAttribute(HIDDEN_ATTR, '');
      this.targetEl_.setAttribute(HIDDEN_ATTR, '');
    } else {
      this.removeAttribute(HIDDEN_ATTR);
      this.targetEl_.removeAttribute(HIDDEN_ATTR);
    }
  }

  /**
   * Expands or collapses the target element.
   * @param {!string} action - Either 'expand' or 'collapse'.
   * @private
   */
  expandCollapse_(action) {
    if (!this.hasSetup_) {
      return;
    }

    const elHeight = this.targetEl_.scrollHeight;

    if (action === 'expand') {
      this.targetEl_.setAttribute(EXPANDED_ATTR, '');

      this.targetEl_.style.height = `${elHeight}px`;
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
   * Updates label text based on whether the element is expanded or collapsed.
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
