/** @const {string} */
const ACTIVE_ATTR = 'active';

/** @const {string} */
const OPEN_ATTR = 'open';

/** @class */
class ClickMask extends HTMLElement {
  constructor() {
    super();

    /** @const {!string} */
    this.target_ = this.getAttribute('target');

    /** @const {!Element} */
    this.targetEl_ = document.getElementById(this.target_);

    /** @const {MutationObserver} */
    this.observer_ = new MutationObserver(() => this.updateState_());
  }

  /** @callback */
  connectedCallback() {
    this.observer_.observe(this.targetEl_, { attributes: true });
  }

  /** @callback */
  disconnectedCallback() {
    this.observer_.disconnect();
  }

  /**
   * Toggles active state on the element based on its target's state. If the
   * element is active, clicking on it will make it inactive and change its
   * target's state.
   * @private
   */
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
