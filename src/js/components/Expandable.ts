const EXPANDED_ATTR: string = 'expanded';

class Expandable extends HTMLElement {
  buttonEl_: HTMLElement;
  hasSetup_: boolean;
  label_: string;
  target_: string;
  targetEl_: HTMLElement;

  constructor() {
    super();

    this.hasSetup_ = false;
    this.label_ = this.getAttribute('label');
    this.target_ = this.getAttribute('target');
    this.targetEl_ = document.getElementById(this.target_);

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

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    const direction = (newValue === '') ? 'expand' : 'collapse';
    this.expandCollapse_(direction);
  }

  connectedCallback(): void {
    this.setup_();
  }

  disconnectedCallback(): void {
    this.removeEventListener('click', null);
  }

  /**
   * Adds a button element to the DOM, and sets initial state of the expandable
   * and related elements.
   */
  private setup_(): void {
    this.innerHTML = `<button class="${this.className}__button"></button>`;
    this.buttonEl_ = this.querySelector('button');

    if (localStorage.getItem(EXPANDED_ATTR) === 'true') {
      this.setAttribute(EXPANDED_ATTR, '');
      this.targetEl_.setAttribute(EXPANDED_ATTR, '');
    } else {
      this.targetEl_.style.height = '0';
      this.targetEl_.removeAttribute(EXPANDED_ATTR);
    }

    this.updateLabel_();
    this.hasSetup_ = true;
  }

  /**
   * Expands or collapses the target element.
   */
  private expandCollapse_(action: string): void {
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
          this.targetEl_.style.height = '0';
        });
      });
    }

    this.updateLabel_();
  }

  /**
   * Updates label text based on whether the element is expanded or collapsed.
   */
  private updateLabel_(): void {
    const expanded = this.hasAttribute(EXPANDED_ATTR);
    const prefix = expanded ? 'Hide' : 'Show';
    this.buttonEl_.textContent = `${prefix} ${this.label_}`;
    localStorage.setItem(EXPANDED_ATTR, String(expanded));
  }
}

export { Expandable };
