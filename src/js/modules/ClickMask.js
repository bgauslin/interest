/** @const {string} */
const ACTIVE_ATTR = 'active';

/** @const {string} */
const CLASSNAME = 'click-mask';

/** @const {string} */
const OPEN_ATTR = 'open';

/** @class */
class ClickMask extends HTMLElement {
  constructor() {
    super();

    // Add a classname for styling.
    this.classList.add(CLASSNAME);

    /** @const {!string} */
    this.target_ = this.getAttribute('target');

    /** @const {?Element} */
    this.targetEl_ = null;

    /** @const {MutationObserver} */
    this.observer_ = new MutationObserver(() => {
      this.updateState_();
    });
  }

  connectedCallback() {
    this.targetEl_ = document.getElementById(this.target_);
    this.observer_.observe(this.targetEl_, { attributes: true });
  }

  disconnectedCallback() {
    this.observer_.disconnect();
  }

  updateState_() {
    if (this.targetEl_.hasAttribute(OPEN_ATTR)) {
      this.setAttribute(ACTIVE_ATTR, '');

      window.requestAnimationFrame(() => {
        this.addEventListener('click', () => {
          this.removeAttribute(ACTIVE_ATTR);
          this.targetEl_.removeAttribute(OPEN_ATTR);
        }, { once: true });
      });

    } else {
      this.removeAttribute(ACTIVE_ATTR);
    }
  }
}

export { ClickMask };
