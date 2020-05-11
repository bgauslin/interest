const ARIA_EXPANDED_ATTR: string = 'aria-expanded';
const EXPANDED_ATTR: string = 'expanded';
const LABEL_ATTR: string = 'label';
const TARGET_ATTR: string = 'target';

/**
 * Custom element that expands/collapses a target element when its source
 * element is clicked.
 */
class Expandable extends HTMLElement {
  private button_: HTMLElement;
  private hasSetup_: boolean;
  private label_: string;
  private target_: HTMLElement;

  constructor() {
    super();
    this.hasSetup_ = false;
    this.addEventListener('click', this.toggleExpanded_);
  }

  static get observedAttributes(): string[] {
    return [EXPANDED_ATTR];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    const direction = (newValue === '') ? 'expand' : 'collapse';
    this.expandCollapse_(direction);
  }

  connectedCallback(): void {
    this.label_ = this.getAttribute(LABEL_ATTR);
    this.target_ = document.getElementById(this.getAttribute(TARGET_ATTR));
    [LABEL_ATTR, TARGET_ATTR].forEach((attr) => this.removeAttribute(attr));
    this.setup_();
  }

  disconnectedCallback(): void {
    this.removeEventListener('click', this.toggleExpanded_);
  }

  /**
   * Adds a button element to the DOM, and sets initial state of the expandable
   * and related elements.
   */
  private setup_(): void {
    const buttonId = `${this.className}-button`;
    const html = `\
      <button class="${this.className}__button" id="${buttonId}"></button>\
    `;
    this.innerHTML = html.replace(/\s\s/g, '');
    this.button_ = this.querySelector('button');

    if (localStorage.getItem(EXPANDED_ATTR) === 'true') {
      this.setAttribute(EXPANDED_ATTR, '');
      this.target_.setAttribute(EXPANDED_ATTR, '');
    } else {
      this.target_.style.height = '0';
      this.target_.removeAttribute(EXPANDED_ATTR);
    }

    this.button_.setAttribute(ARIA_EXPANDED_ATTR,
        String(this.hasAttribute(EXPANDED_ATTR)));
    this.button_.setAttribute('aria-controls', this.target_.id);
    this.target_.setAttribute('aria-controlledby', buttonId);

    this.updateLabel_();
    this.hasSetup_ = true;
  }

  /**
   * Toggles attribute which triggers the attributeChanged callback.
   */
  private toggleExpanded_(): void {
    if (this.hasAttribute(EXPANDED_ATTR)) {
      this.removeAttribute(EXPANDED_ATTR);
    } else {
      this.setAttribute(EXPANDED_ATTR, '');
    }
    this.button_.setAttribute(ARIA_EXPANDED_ATTR,
      String(this.hasAttribute(EXPANDED_ATTR)));
  }

  /**
   * Expands or collapses the target element.
   */
  private expandCollapse_(action: string): void {
    if (!this.hasSetup_) {
      return;
    }

    const elHeight = this.target_.scrollHeight;

    if (action === 'expand') {
      this.target_.setAttribute(EXPANDED_ATTR, '');
      this.target_.style.height = `${elHeight / 16}rem`;
      this.target_.addEventListener('transitionend', () => {
        this.target_.style.height = null;
      }, {once: true});

    } else {
      this.target_.removeAttribute(EXPANDED_ATTR);
      window.requestAnimationFrame(() => {
        this.target_.style.height = `${elHeight / 16}rem`;
        window.requestAnimationFrame(() => {
          this.target_.style.height = '0';
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
    this.button_.textContent = `${prefix} ${this.label_}`;
    localStorage.setItem(EXPANDED_ATTR, String(expanded));
  }
}

export {Expandable};
