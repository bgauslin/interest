const ARIA_EXPANDED_ATTR = 'aria-expanded';
const ARIA_HIDDEN_ATTR = 'aria-hidden';
const FOR_ATTR = 'for';
const LABEL_ATTR = 'label';
const STORAGE_ITEM = 'expanded';

/**
 * Custom element that expands/collapses a target element when its source
 * element is clicked.
 */
export class Expandable extends HTMLElement {
  private hasSetup: boolean;
  private label: string;
  private target: HTMLElement;

  constructor() {
    super();
    this.hasSetup = false;
    this.addEventListener('click', this.toggleExpanded);
  }

  static get observedAttributes(): string[] {
    return [ARIA_EXPANDED_ATTR];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    const direction = (newValue === 'true') ? 'expand' : 'collapse';
    this.expandCollapse(direction);
  }

  connectedCallback() {
    this.setup();
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.toggleExpanded);
  }

  /**
   * Adds a button element to the DOM, and sets initial state of the expandable
   * and related elements.
   */
  private setup() {
    this.label = this.getAttribute(LABEL_ATTR);
    this.target = document.getElementById(this.getAttribute(FOR_ATTR));
    
    if (!this.label || !this.target) {
      return;
    }

    this.setAttribute('role', 'button');
    this.setAttribute('aria-controls', this.target.id);

    if (localStorage.getItem(STORAGE_ITEM) === 'true') {
      this.setAttribute(ARIA_EXPANDED_ATTR, 'true');
      this.target.setAttribute(ARIA_HIDDEN_ATTR, 'false');
    } else {
      this.target.style.height = '0';
      this.target.setAttribute(ARIA_HIDDEN_ATTR, 'true');
    }

    this.updateLabel();
    for (const attribute of [FOR_ATTR, LABEL_ATTR]) {
      this.removeAttribute(attribute);
    }

    this.hasSetup = true;
  }

  /**
   * Toggles attribute which triggers the attributeChanged callback.
   */
  private toggleExpanded() {
    const expanded = this.getAttribute(ARIA_EXPANDED_ATTR) === 'true';
    this.setAttribute(ARIA_EXPANDED_ATTR, `${!expanded}`);
  }

  /**
   * Expands or collapses the target element.
   */
  private expandCollapse(action: string) {
    if (!this.hasSetup) {
      return;
    }

    const elHeight = this.target.scrollHeight;

    if (action === 'expand') {
      this.target.setAttribute(ARIA_HIDDEN_ATTR, 'false');
      this.target.style.height = `${elHeight / 16}rem`;
      this.target.addEventListener('transitionend', () => {
        this.target.style.height = null;
      }, {once: true});
    } else {
      this.target.setAttribute(ARIA_HIDDEN_ATTR, 'true');
      window.requestAnimationFrame(() => {
        this.target.style.height = `${elHeight / 16}rem`;
        window.requestAnimationFrame(() => {
          this.target.style.height = '0';
        });
      });
    }

    this.updateLabel();
  }

  /**
   * Updates label text based on whether the element is expanded or collapsed.
   */
  private updateLabel() {
    const expanded = this.getAttribute(ARIA_EXPANDED_ATTR) === 'true';
    const prefix = expanded ? 'Hide' : 'Show';
    this.textContent = `${prefix} ${this.label}`;
    localStorage.setItem(STORAGE_ITEM, String(expanded));
  }
}

customElements.define('expand-able', Expandable);
